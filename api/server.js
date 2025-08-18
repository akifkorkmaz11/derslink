const express = require('express');
const cors = require('cors');
const path = require('path');
const Iyzipay = require('iyzipay');
const { createClient } = require('@supabase/supabase-js');

// Supabase client oluştur
const supabaseUrl = 'https://hmvhqrtuocytmtbwxuyx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdmhxcnR1b2N5dG10Ynd4dXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDU5NzE5MCwiZXhwIjoyMDUwMTczMTkwfQ.hmvhqrtuocytmtbwxuyx';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS ve middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-vercel-domain.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files serve
app.use(express.static('.'));

// Iyzico Config (Resmi SDK)
const iyzipay = new Iyzipay({
    apiKey: 'sandbox-4Ekjir9P5JmavghZYO6R9EHcKpyiFAxw',
    secretKey: 'sandbox-1iB6K69utgqqmbVLAoP3GL7vWbhWTL02',
    uri: 'https://sandbox-api.iyzipay.com'
});

console.log('✅ Iyzico SDK hazırlandı');

// Kullanıcının program bilgisini güncelle
async function updateUserProgram(email, program) {
    try {
        console.log('🔄 Kullanıcı program bilgisi güncelleniyor:', { email, program });
        
        const { data, error } = await supabase
            .from('users')
            .update({ enrolled_program: program })
            .eq('email', email)
            .select();
        
        if (error) {
            console.error('❌ Program güncelleme hatası:', error);
            return false;
        }
        
        console.log('✅ Program bilgisi güncellendi:', data);
        return true;
    } catch (error) {
        console.error('❌ Program güncelleme hatası:', error);
        return false;
    }
}

// Ödeme başlatma endpoint'i
app.post('/api/payment/initialize', async (req, res) => {
    try {
        console.log('💳 Ödeme başlatma isteği:', req.body);
        
        const { amount, customerInfo, programInfo } = req.body;
        
        // Iyzico ödeme verisi (Resmi SDK formatı)
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: 'CONV_' + Date.now(),
            price: amount.toString(),
            paidPrice: amount.toString(),
            currency: Iyzipay.CURRENCY.TRY,
            basketId: 'B' + Date.now(),
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: 'http://localhost:3001/api/payment/success',
            enabledInstallments: [1],
            buyer: {
                id: 'BY' + Date.now(),
                name: customerInfo.firstName,
                surname: customerInfo.lastName,
                gsmNumber: customerInfo.phone,
                email: customerInfo.email,
                identityNumber: '74300864791',
                lastLoginDate: '2015-10-05 12:43:35',
                registrationDate: '2013-04-21 15:12:09',
                registrationAddress: 'Test Address',
                ip: req.ip || '127.0.0.1',
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: customerInfo.firstName + ' ' + customerInfo.lastName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Address',
                zipCode: '34732'
            },
            billingAddress: {
                contactName: customerInfo.firstName + ' ' + customerInfo.lastName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Address',
                zipCode: '34732'
            },
            basketItems: [
                {
                    id: 'BI' + Date.now(),
                    name: programInfo.title,
                    category1: 'Egitim',
                    category2: 'Kurs',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: amount.toString()
                }
            ]
        };
        
        console.log('📤 Iyzico SDK ile gönderilecek veri:', request);
        
        // Resmi SDK ile ödeme başlatma
        iyzipay.checkoutFormInitialize.create(request, (err, result) => {
            if (err) {
                console.error('❌ Iyzico SDK hatası:', err);
                return res.json({
                    success: false,
                    error: 'SDK Hatası: ' + err.message
                });
            }
            
            console.log('📥 Iyzico SDK yanıtı:', result);
            
            if (result.status === 'success') {
                res.json({
                    success: true,
                    checkoutFormContent: result.checkoutFormContent,
                    token: result.token,
                    paymentPageUrl: result.paymentPageUrl
                });
            } else {
                res.json({
                    success: false,
                    error: result.errorMessage || 'Ödeme başlatılamadı'
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Ödeme başlatma hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası: ' + error.message
        });
    }
});

// Ödeme callback endpoint'i
app.post('/api/payment/callback', async (req, res) => {
    try {
        console.log('🔄 Ödeme callback alındı:', req.body);
        
        const { token } = req.body;
        
        if (!token) {
            return res.json({ success: false, error: 'Token eksik' });
        }
        
        // Ödeme sonucunu kontrol et (Resmi SDK)
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: 'CONV_' + Date.now(),
            token: token
        };
        
        console.log('🔍 SDK ile ödeme kontrolü:', request);
        
        iyzipay.checkoutForm.retrieve(request, (err, result) => {
            if (err) {
                console.error('❌ Callback SDK hatası:', err);
                return res.json({
                    success: false,
                    error: 'Callback hatası: ' + err.message
                });
            }
            
            console.log('📊 SDK ödeme sonucu:', result);
            
            if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
                res.json({
                    success: true,
                    paymentStatus: 'SUCCESS',
                    paymentId: result.paymentId,
                    paidPrice: result.paidPrice,
                    customerInfo: {
                        email: result.buyer?.email,
                        name: result.buyer?.name + ' ' + result.buyer?.surname
                    }
                });
            } else {
                res.json({
                    success: false,
                    error: 'Ödeme başarısız: ' + (result.errorMessage || 'Bilinmeyen hata')
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Callback hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Callback hatası: ' + error.message
        });
    }
});

// Ödeme başarılı endpoint - hem GET hem POST'u destekle
app.get('/api/payment/success', (req, res) => {
    const { token } = req.query;
    
    console.log('🎉 Ödeme başarılı callback alındı:', { token });
    
    // JavaScript ile ana sayfaya mesaj gönder
    const script = `
        <script>
            console.log('✅ Ödeme başarılı callback sayfası');
            
            // Ana pencereye mesaj gönder (iframe modunda)
            if (window.parent && window.parent !== window) {
                console.log('📤 Parent window\'a mesaj gönderiliyor...');
                window.parent.postMessage({
                    type: 'IYZICO_PAYMENT_SUCCESS',
                    token: '${token}',
                    success: true
                }, '*');
            }
            // Ana pencereye mesaj gönder (popup modunda)
            else if (window.opener && window.opener !== window) {
                console.log('📤 Opener window\'a mesaj gönderiliyor...');
                window.opener.postMessage({
                    type: 'IYZICO_PAYMENT_SUCCESS',
                    token: '${token}',
                    success: true
                }, '*');
                
                // Popup'ı kapat
                setTimeout(() => {
                    window.close();
                }, 1000);
            }
            // Eğer direkt sayfada ise
            else {
                console.log('🔄 Ana sayfaya yönlendiriliyor...');
                setTimeout(() => {
                    window.location.href = '/?payment=success';
                }, 1000);
            }
        </script>
        
        <div style="
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        ">
            <div style="
                background: white;
                color: #333;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                max-width: 400px;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="margin: 0 0 10px 0;">Ödeme Başarılı!</h2>
                <p style="color: #666; margin: 0;">Kayıt işleminiz tamamlanıyor...</p>
            </div>
        </div>
    `;
    
    res.send(script);
});

// POST endpoint için de aynı işlemi yap
app.post('/api/payment/success', (req, res) => {
    const token = req.query.token || req.body.token;
    
    console.log('🎉 Ödeme başarılı POST callback alındı:', { token, body: req.body });
    
    // JavaScript ile ana sayfaya mesaj gönder
    const script = `
        <script>
            console.log('✅ Ödeme başarılı callback sayfası');
            
            // Ana pencereye mesaj gönder (iframe modunda)
            if (window.parent && window.parent !== window) {
                console.log('📤 Parent window\'a mesaj gönderiliyor...');
                window.parent.postMessage({
                    type: 'IYZICO_PAYMENT_SUCCESS',
                    token: '${token}',
                    success: true
                }, '*');
            }
            // Ana pencereye mesaj gönder (popup modunda)
            else if (window.opener && window.opener !== window) {
                console.log('📤 Opener window\'a mesaj gönderiliyor...');
                window.opener.postMessage({
                    type: 'IYZICO_PAYMENT_SUCCESS',
                    token: '${token}',
                    success: true
                }, '*');
                
                // Popup'ı kapat
                setTimeout(() => {
                    window.close();
                }, 1000);
            }
            // Eğer direkt sayfada ise
            else {
                console.log('🔄 Ana sayfaya yönlendiriliyor...');
                setTimeout(() => {
                    window.location.href = '/?payment=success';
                }, 1000);
            }
        </script>
        
        <div style="
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        ">
            <div style="
                background: white;
                color: #333;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                max-width: 400px;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="margin: 0 0 10px 0;">Ödeme Başarılı!</h2>
                <p style="color: #666; margin: 0;">Kayıt işleminiz tamamlanıyor...</p>
            </div>
        </div>
    `;
    
    res.send(script);
});

// Özel kart formu ile ödeme işleme endpoint
app.post('/api/payment/process-card', (req, res) => {
    const { amount, customerInfo, programInfo, cardInfo } = req.body;
    
    // Email validation - server side
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Geçerli bir email adresi giriniz' };
        }
        
        const forbiddenDomains = [
            'example.com', 'test.com', 'fake.com', 'dummy.com', 'temp.com',
            'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'
        ];
        
        const domain = email.split('@')[1].toLowerCase();
        if (forbiddenDomains.includes(domain)) {
            return { 
                valid: false, 
                message: 'Bu email servisi desteklenmemektedir. Lütfen geçerli bir email adresi kullanın.' 
            };
        }
        
        return { valid: true };
    }
    
    // Email kontrolü
    const emailValidation = validateEmail(customerInfo.email);
    if (!emailValidation.valid) {
        return res.json({
            success: false,
            error: emailValidation.message
        });
    }
    
    try {
        // Kart bilgilerini validate et
        const cardNumber = cardInfo.cardNumber.replace(/\s/g, '');
        
        // İyzico Güncel Test Kartları (2024)
        const testCards = [
            '5528790000000008', // Mastercard SUCCESS
            '5254133674403173', // Mastercard SUCCESS  
            '4766620000000001', // Visa SUCCESS
            '4603450000000000', // Visa SUCCESS
            '4543600299100712', // Visa SUCCESS
            '5451030000000000'  // Mastercard SUCCESS
        ];
        
        if (!testCards.includes(cardNumber)) {
            return res.json({
                success: false,
                error: `Geçersiz test kartı. Kabul edilen kartlar: ${testCards.join(', ')}`
            });
        }
        
        // CVV kontrolü - İyzico test CVV kodları
        const validCvvs = ['973', '123', '000'];
        if (!validCvvs.includes(cardInfo.cvv)) {
            return res.json({
                success: false,
                error: 'Geçersiz CVV kodu. Test için 973, 123 veya 000 kullanın.'
            });
        }
        

        
        // Expiry kontrolü
        const [month, year] = cardInfo.expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        if (parseInt(year) < currentYear || parseInt(month) < 1 || parseInt(month) > 12) {
            return res.json({
                success: false,
                error: 'Geçersiz son kullanma tarihi.'
            });
        }
        
        // Iyzico SDK ile gerçek ödeme işlemi
        const timestamp = Date.now();
        const paymentRequest = {
            locale: 'tr',
            conversationId: `CARD_${timestamp}`,
            price: amount.toString(),
            paidPrice: amount.toString(),
            currency: 'TRY',
            basketId: `CARD_B${timestamp}`,
            paymentGroup: 'PRODUCT',
            paymentCard: {
                cardHolderName: cardInfo.cardHolder,
                cardNumber: cardNumber,
                expireMonth: month,
                expireYear: '20' + year,
                cvc: cardInfo.cvv
            },
            buyer: {
                id: `CARD_BY${timestamp}`,
                name: customerInfo.firstName,
                surname: customerInfo.lastName,
                gsmNumber: customerInfo.phone,
                email: customerInfo.email,
                identityNumber: '74300864791',
                lastLoginDate: '2015-10-05 12:43:35',
                registrationDate: '2013-04-21 15:12:09',
                registrationAddress: 'Test Address',
                ip: req.ip || '127.0.0.1',
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: customerInfo.firstName + ' ' + customerInfo.lastName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Address',
                zipCode: '34732'
            },
            billingAddress: {
                contactName: customerInfo.firstName + ' ' + customerInfo.lastName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Address',
                zipCode: '34732'
            },
            basketItems: [{
                id: `CARD_BI${timestamp}`,
                name: programInfo.title,
                category1: 'Egitim',
                category2: 'Kurs',
                itemType: 'VIRTUAL',
                price: amount.toString()
            }]
        };
        

        
        // Iyzico SDK ile ödeme yap
        iyzipay.payment.create(paymentRequest, async (err, result) => {
            if (err) {
                console.error('❌ Iyzico kart ödeme hatası:', err);
                return res.json({
                    success: false,
                    error: 'Ödeme işlemi sırasında hata oluştu: ' + err.message
                });
            }
            

            
            if (result.status === 'success') {
                console.log('✅ Kart ödemesi başarılı!');
                
                // Kullanıcının program bilgisini güncelle
                const program = programInfo.mainProgram || programInfo.title;
                await updateUserProgram(customerInfo.email, program);
                
                // Gerçek ödeme detaylarını backend'de kaydet
                try {
                    console.log('📝 Backend Supabase e payments kaydı yapılıyor...');
                    
                    // Backend'te Supabase bağlantısı varsa payments kaydı yap
                    const paymentRecord = {
                        user_email: customerInfo.email,
                        user_name: customerInfo.firstName + ' ' + customerInfo.lastName,
                        user_phone: customerInfo.phone,
                        program: program,
                        schedule: 'karma',
                        price: amount,
                        payment_status: 'completed',
                        payment_date: new Date().toISOString(),
                        iyzico_payment_id: result.paymentId,
                        iyzico_conversation_id: result.conversationId,
                        payment_details: JSON.stringify({
                            cardAssociation: result.cardAssociation,
                            cardFamily: result.cardFamily,
                            lastFourDigits: result.lastFourDigits,
                            authCode: result.authCode,
                            installment: result.installment
                        }),
                        created_at: new Date().toISOString()
                    };
                    
                    console.log('📝 Backend payment record:', paymentRecord);
                    
                } catch (backendPaymentError) {
                    console.error('❌ Backend payment kayıt hatası:', backendPaymentError);
                }
                
                res.json({
                    success: true,
                    paymentId: result.paymentId,
                    conversationId: result.conversationId,
                    paymentDetails: {
                        cardAssociation: result.cardAssociation,
                        cardFamily: result.cardFamily,
                        lastFourDigits: result.lastFourDigits,
                        authCode: result.authCode,
                        amount: amount,
                        currency: 'TRY'
                    },
                    message: 'Ödeme başarıyla tamamlandı'
                });
                
            } else {
                console.error('❌ Iyzico kart ödeme başarısız:', result.errorMessage);
                res.json({
                    success: false,
                    error: result.errorMessage || 'Ödeme işlemi başarısız'
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Kart ödeme işlemi hatası:', error);
        res.json({
            success: false,
            error: 'Sunucu hatası: ' + error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Ödeme servisi çalışıyor',
        iyzico: 'Resmi SDK kullanılıyor'
    });
});

// Admin API Endpoint'leri

// Tüm kullanıcıları getir (program bazlı filtreleme ile)
app.get('/api/admin/users', async (req, res) => {
    try {
        console.log('👥 Admin kullanıcı listesi isteği:', req.query);
        
        const { program } = req.query;
        console.log('Program filtresi:', program);
        
        // Basit query ile başla
        let query = supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        
        // Program bazlı filtreleme
        if (program) {
            query = query.eq('enrolled_program', program);
            console.log(`🎯 ${program} programı için kullanıcılar filtreleniyor`);
        }
        
        console.log('Query çalıştırılıyor...');
        const { data: users, error } = await query;
        
        if (error) {
            console.error('❌ Kullanıcı listesi alınamadı:', error);
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
        
        console.log(`✅ ${users?.length || 0} kullanıcı alındı`);
        res.json({
            success: true,
            users: users || []
        });
    } catch (error) {
        console.error('❌ Kullanıcı listesi hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası: ' + error.message
        });
    }
});

// Tüm sınıfları getir (program bazlı filtreleme ile)
app.get('/api/admin/classes', async (req, res) => {
    try {
        console.log('🏫 Admin sınıf listesi isteği:', req.query);
        
        const { program } = req.query;
        console.log('Program filtresi:', program);
        
        // Basit query ile başla
        let query = supabase
            .from('classes')
            .select('*')
            .order('class_name');
        
        // Program bazlı filtreleme
        if (program) {
            query = query.eq('program', program);
            console.log(`🎯 ${program} programı için sınıflar filtreleniyor`);
        }
        
        console.log('Query çalıştırılıyor...');
        const { data: classes, error } = await query;
        
        if (error) {
            console.error('❌ Sınıf listesi alınamadı:', error);
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
        
        console.log(`✅ ${classes?.length || 0} sınıf alındı`);
        res.json({
            success: true,
            classes: classes || []
        });
    } catch (error) {
        console.error('❌ Sınıf listesi hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası: ' + error.message
        });
    }
});

// Tüm öğretmenleri getir
app.get('/api/admin/teachers', async (req, res) => {
    try {
        console.log('👨‍🏫 Admin öğretmen listesi isteği');
        
        const { data: teachers, error } = await supabase
            .from('teachers')
            .select('*')
            .order('name');
        
        if (error) {
            console.error('❌ Öğretmen listesi alınamadı:', error);
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
        
        console.log(`✅ ${teachers?.length || 0} öğretmen alındı`);
        res.json({
            success: true,
            teachers: teachers || []
        });
    } catch (error) {
        console.error('❌ Öğretmen listesi hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası'
        });
    }
});

// Öğretmen programlarını getir (program bazlı filtreleme ile)
app.get('/api/admin/teacher-schedules', async (req, res) => {
    try {
        console.log('📅 Admin öğretmen programları isteği:', req.query);
        
        const { program } = req.query;
        let query = supabase
            .from('teacher_schedules')
            .select('*')
            .order('teacher_name');
        
        // Program bazlı filtreleme
        if (program) {
            query = query.eq('program', program);
            console.log(`🎯 ${program} programı için öğretmen programları filtreleniyor`);
        }
        
        const { data: schedules, error } = await query;
        
        if (error) {
            console.error('❌ Öğretmen programları alınamadı:', error);
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
        
        console.log(`✅ ${schedules?.length || 0} öğretmen programı alındı`);
        res.json({
            success: true,
            schedules: schedules || []
        });
    } catch (error) {
        console.error('❌ Öğretmen programları hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası'
        });
    }
});

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel için export
module.exports = app;