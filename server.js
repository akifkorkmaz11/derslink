const express = require('express');
const cors = require('cors');
const Iyzipay = require('iyzipay');
const { createClient } = require('@supabase/supabase-js');

// Supabase client oluştur
const supabaseUrl = process.env.SUPABASE_URL || 'https://hmvhqrtuocytmtbwxuyx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdmhxcnR1b2N5dG10Ynd4dXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDU5NzE5MCwiZXhwIjoyMDUwMTczMTkwfQ.hmvhqrtuocytmtbwxuyx';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

// CORS ve middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://derslink-dc4fxrsx0-akif-korkmazs-projects.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Iyzico Config (Resmi SDK)
const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || 'sandbox-4Ekjir9P5JmavghZYO6R9EHcKpyiFAxw',
    secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-1iB6K69utgqqmbVLAoP3GL7vWbhWTL02',
    uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com'
});

console.log('✅ Iyzico SDK hazırlandı');

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server çalışıyor!' });
});

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
            callbackUrl: process.env.CALLBACK_URL || 'https://derslink-dc4fxrsx0-akif-korkmazs-projects.vercel.app/api/payment/success',
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
                    id: 'PROGRAM_' + programInfo.program,
                    name: programInfo.program + ' Programı',
                    category1: 'Eğitim',
                    category2: 'Online Kurs',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: amount.toString()
                }
            ]
        };
        
        // Iyzico ödeme başlat
        iyzipay.checkoutFormInitialize.create(request, function (err, result) {
            if (err) {
                console.error('❌ Iyzico ödeme hatası:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Ödeme başlatılamadı',
                    details: err.message 
                });
            }
            
            if (result.status === 'success') {
                console.log('✅ Ödeme başlatıldı:', result.checkoutFormContent);
                
                // Program bilgisini güncelle
                updateUserProgram(customerInfo.email, programInfo.program);
                
                res.json({
                    success: true,
                    checkoutFormContent: result.checkoutFormContent,
                    token: result.token
                });
            } else {
                console.error('❌ Iyzico başarısız:', result.errorMessage);
                res.status(400).json({
                    success: false,
                    error: result.errorMessage
                });
            }
        });
    } catch (error) {
        console.error('❌ Ödeme başlatma hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası'
        });
    }
});

// Ödeme başarı endpoint'i
app.post('/api/payment/success', async (req, res) => {
    try {
        console.log('✅ Ödeme başarı isteği:', req.body);
        
        const { token } = req.body;
        
        // Iyzico ödeme kontrolü
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: 'CONV_' + Date.now(),
            token: token
        };
        
        iyzipay.checkoutForm.retrieve(request, function (err, result) {
            if (err) {
                console.error('❌ Ödeme kontrol hatası:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Ödeme kontrol edilemedi'
                });
            }
            
            if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
                console.log('✅ Ödeme başarılı:', result);
                
                // Burada ödeme kaydı yapılabilir
                res.json({
                    success: true,
                    message: 'Ödeme başarıyla tamamlandı',
                    paymentId: result.paymentId
                });
            } else {
                console.error('❌ Ödeme başarısız:', result.errorMessage);
                res.status(400).json({
                    success: false,
                    error: result.errorMessage || 'Ödeme başarısız'
                });
            }
        });
    } catch (error) {
        console.error('❌ Ödeme başarı hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası'
        });
    }
});

// Vercel için sadece app export et
module.exports = app;

