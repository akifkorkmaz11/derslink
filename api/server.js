const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const Iyzipay = require('iyzipay');

const app = express();

// CORS ve middleware
app.use(cors());
app.use(express.json());

console.log('🔧 API Server başlatılıyor...');
console.log('🔧 Environment variables:');
console.log('  - SUPABASE_URL:', process.env.SUPABASE_URL || 'NOT SET');
console.log('  - SUPABASE_KEY length:', process.env.SUPABASE_KEY?.length || 0);

// Supabase client oluştur (environment variable'lardan)
const supabaseUrl = process.env.SUPABASE_URL || 'https://hmvhqrtuocytmtbwxuyx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdmhxcnR1b2N5dG10Ynd4dXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDU5NzE5MCwiZXhwIjoyMDUwMTczMTkwfQ.hmvhqrtuocytmtbwxuyx';

console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔧 Supabase Key length:', supabaseKey?.length || 0);

const supabase = createClient(supabaseUrl, supabaseKey);

// Iyzico konfigürasyonu - PRODUCTION
const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || 'your_production_api_key_here',
    secretKey: process.env.IYZICO_SECRET_KEY || 'your_production_secret_key_here',
    uri: process.env.IYZICO_URI || 'https://api.iyzipay.com'
});

console.log('🔧 Iyzico API Key length:', process.env.IYZICO_API_KEY?.length || 0);

// Test endpoint
app.get('/api/test', (req, res) => {
                res.json({
        message: 'API Server çalışıyor!',
        environment: {
            supabaseUrl: process.env.SUPABASE_URL || 'NOT SET',
            supabaseKeyLength: process.env.SUPABASE_KEY?.length || 0
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'API Health check başarılı',
        environment: {
            supabaseUrl: process.env.SUPABASE_URL || 'NOT SET',
            supabaseKeyLength: process.env.SUPABASE_KEY?.length || 0,
            iyzicoApiKeyLength: process.env.IYZICO_API_KEY?.length || 0,
            iyzicoSecretKeyLength: process.env.IYZICO_SECRET_KEY?.length || 0,
            iyzicoUri: process.env.IYZICO_URI || 'NOT SET'
        }
    });
});

// Admin API Endpoint'leri

// Tüm kullanıcıları getir (program bazlı filtreleme ile)
app.get('/api/admin/users', async (req, res) => {
    try {
        console.log('👥 Admin kullanıcı listesi isteği:', req.query);
        
        const { program } = req.query;
        console.log('Program filtresi:', program);
        
        // Kullanıcıları ve sınıf kayıtlarını birlikte getir
        let query = supabase
            .from('users')
            .select(`
                *,
                class_enrollments (
                    id,
                    class_id,
                    enrollment_date,
                    status,
                    classes (
                        id,
                        class_name,
                        program_type,
                        schedule_type
                    )
                )
            `)
            .order('created_at', { ascending: false });
        
        // Program bazlı filtreleme
        if (program) {
            // Sadece enrolled_program alanına göre filtrele (selected_program sütunu yok)
            query = query.eq('enrolled_program', program);
            console.log(`🎯 ${program} programı için kullanıcılar filtreleniyor (enrolled_program = ${program})`);
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
            .select(`
                *,
                class_schedules (id, day_of_week, start_time, end_time, subject, teacher_name),
                class_enrollments (id, user_id, status, users (name, email))
            `)
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

// Öğretmen programlarını getir (class_schedules + classes üzerinden)
app.get('/api/admin/teacher-schedules', async (req, res) => {
    try {
        console.log('📅 Admin öğretmen programları isteği:', req.query);

        const { program } = req.query;
        let query = supabase
            .from('class_schedules')
            .select(`
                id,
                class_id,
                teacher_name,
                subject,
                day_of_week,
                start_time,
                end_time,
                program,
                classes (
                    class_name,
                    schedule_type
                )
            `)
            .order('teacher_name');

        if (program) {
            query = query.eq('program', program);
            console.log(`🎯 ${program} programı için öğretmen programları filtreleniyor`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('❌ Öğretmen programları alınamadı:', error);
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }

        const schedules = (data || []).map((row) => ({
            id: row.id,
            class_id: row.class_id,
            teacher_name: row.teacher_name,
            subject: row.subject,
            day_of_week: row.day_of_week,
            start_time: row.start_time,
            end_time: row.end_time,
            program: row.program,
            class_name: row.classes?.class_name || 'Bilinmeyen Sınıf',
            schedule_type: row.classes?.schedule_type || 'Bilinmeyen Program'
        }));

        console.log(`✅ ${schedules.length} öğretmen programı alındı`);
                res.json({
                    success: true,
            schedules: schedules
        });
    } catch (error) {
        console.error('❌ Öğretmen programları hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası'
        });
    }
});

// Ödeme işleme endpoint'i
app.post('/api/payment/process-card', async (req, res) => {
    try {
        console.log('💳 Ödeme işlemi başlatılıyor...');
        console.log('📝 Ödeme verileri:', req.body);
        
        const { 
            cardNumber, 
            cardHolder, 
            cardExpiry, 
            cardCvv, 
            amount,
            firstName,
            lastName,
            email,
            phone,
            mainProgram,
            subProgram,
            programTitle,
            yksField
        } = req.body;
        
        // Validasyon
        if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Eksik kart bilgileri'
            });
        }
        
        // Gerçek Iyzico ödeme işlemi
        console.log('✅ Gerçek kart ile ödeme başlatılıyor');
        
        const request = {
            locale: 'tr',
            conversationId: 'conv_' + Date.now(),
            price: amount.toString(),
            paidPrice: amount.toString(),
            currency: 'TRY',
            installment: '1',
            basketId: 'B' + Date.now(),
            paymentChannel: 'WEB',
            paymentGroup: 'PRODUCT',
            callbackUrl: process.env.NODE_ENV === 'production' 
                ? 'https://derslink.vercel.app/api/payment/callback'
                : 'http://localhost:3000/api/payment/callback', // 3D Secure callback
            threeDSRequest: {
                enabled: true
            },
            paymentCard: {
                cardHolderName: cardHolder,
                cardNumber: cardNumber.replace(/\s/g, ''),
                expireMonth: cardExpiry.split('/')[0],
                expireYear: '20' + cardExpiry.split('/')[1],
                cvc: cardCvv,
                registerCard: '0'
            },
            buyer: {
                id: 'BY' + Date.now(),
                name: firstName,
                surname: lastName,
                gsmNumber: phone,
                email: email,
                identityNumber: '74300864791',
                registrationAddress: 'Test Adres',
                ip: req.ip || '127.0.0.1',
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: firstName + ' ' + lastName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Adres',
                zipCode: '34732'
            },
            billingAddress: {
                contactName: firstName + ' ' + lastName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Adres',
                zipCode: '34732'
            },
            basketItems: [
                {
                    id: 'BI' + Date.now(),
                    name: programTitle,
                    category1: mainProgram,
                    category2: subProgram,
                    itemType: 'VIRTUAL',
                    price: amount.toString()
                }
            ]
        };
        
        // Iyzico 3D Secure ödeme işlemi
        iyzipay.threeds.initialize(request, function (err, result) {
            if (err) {
                console.error('❌ Iyzico 3D Secure hatası:', err);
                return res.status(500).json({
                    success: false,
                    error: '3D Secure başlatılamadı: ' + err.message
                });
            }
            
            console.log('✅ Iyzico 3D Secure sonucu:', result);
            
            if (result.status === 'success') {
                // 3D Secure sayfasına yönlendir
                return res.json({
                    success: true,
                    message: '3D Secure başlatıldı',
                    threeDSHtmlContent: result.threeDSHtmlContent,
                    paymentId: result.paymentId,
                    conversationId: result.conversationId
                });
            } else {
                return res.status(400).json({
                    success: false,
                    error: '3D Secure başlatılamadı: ' + (result.errorMessage || 'Bilinmeyen hata')
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Ödeme işlemi hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Ödeme işlemi sırasında hata oluştu'
        });
    }
});

// 3D Secure Callback Endpoint
app.post('/api/payment/callback', async (req, res) => {
    try {
        console.log('🔄 3D Secure callback alındı:', req.body);
        
        const { conversationId, paymentId, status } = req.body;
        
        if (status === 'success') {
            // 3D Secure başarılı, ödemeyi tamamla
            const request = {
                locale: 'tr',
                conversationId: conversationId,
                paymentId: paymentId
            };
            
            iyzipay.payment.retrieve(request, function (err, result) {
                if (err) {
                    console.error('❌ Ödeme tamamlama hatası:', err);
                    return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme tamamlanamadı'));
                }
                
                console.log('✅ Ödeme tamamlandı:', result);
                
                if (result.status === 'success') {
                    return res.redirect('/?payment=success&paymentId=' + paymentId);
                } else {
                    return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme başarısız'));
                }
            });
        } else {
            return res.redirect('/?payment=error&message=' + encodeURIComponent('3D Secure doğrulaması başarısız'));
        }
        
    } catch (error) {
        console.error('❌ Callback hatası:', error);
        res.redirect('/?payment=error&message=' + encodeURIComponent('Sistem hatası'));
    }
});

// GET callback endpoint (bazı bankalar GET ile callback yapabilir)
app.get('/api/payment/callback', async (req, res) => {
    try {
        console.log('🔄 3D Secure GET callback alındı:', req.query);
        
        const { conversationId, paymentId, status } = req.query;
        
        if (status === 'success') {
            // 3D Secure başarılı, ödemeyi tamamla
            const request = {
                locale: 'tr',
                conversationId: conversationId,
                paymentId: paymentId
            };
            
            iyzipay.payment.retrieve(request, function (err, result) {
                if (err) {
                    console.error('❌ Ödeme tamamlama hatası:', err);
                    return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme tamamlanamadı'));
                }
                
                console.log('✅ Ödeme tamamlandı:', result);
                
                if (result.status === 'success') {
                    return res.redirect('/?payment=success&paymentId=' + paymentId);
                } else {
                    return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme başarısız'));
                }
            });
        } else {
            return res.redirect('/?payment=error&message=' + encodeURIComponent('3D Secure doğrulaması başarısız'));
        }
        
    } catch (error) {
        console.error('❌ Callback hatası:', error);
        res.redirect('/?payment=error&message=' + encodeURIComponent('Sistem hatası'));
    }
});

// Vercel için export
module.exports = app;