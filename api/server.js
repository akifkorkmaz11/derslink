const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');

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

// Iyzico konfigürasyonu - Production değerleri
const iyzicoConfig = {
    apiKey: '1kQYscHqEXZTFC5J1y9JsxCNTqk6XG9O',
    secretKey: 'XmmzZpBZMQ4ZbIBBLkoLRFMKKD1CI8vH',
    uri: 'https://api.iyzipay.com'
};

console.log('🔧 Iyzico API Key length:', iyzicoConfig.apiKey.length);
console.log('🔧 Iyzico Secret Key length:', iyzicoConfig.secretKey.length);
console.log('🔧 Iyzico URI:', iyzicoConfig.uri);

// Iyzico direkt API helper fonksiyonları
function generateAuthHeader(apiKey, secretKey, requestBody) {
    const hash = crypto.createHmac('sha1', secretKey).update(requestBody).digest('base64');
    return `IYZWS ${apiKey}:${hash}`;
}

function makeIyzicoRequest(endpoint, data) {
    const requestBody = JSON.stringify(data);
    const authHeader = generateAuthHeader(iyzicoConfig.apiKey, iyzicoConfig.secretKey, requestBody);
    
    console.log('🔧 Iyzico request detayları:');
    console.log('🔧 Endpoint:', `${iyzicoConfig.uri}${endpoint}`);
    console.log('🔧 API Key:', iyzicoConfig.apiKey.substring(0, 8) + '...');
    console.log('🔧 Auth Header:', authHeader.substring(0, 50) + '...');
    console.log('🔧 Request Body length:', requestBody.length);
    console.log('🔧 Raw request body gönderiliyor:', requestBody);
    console.log('🔧 randString in raw body:', requestBody.includes('randString'));
    console.log('🔧 randString value in raw body:', requestBody.includes('"randString"'));
    console.log('🔧 randString exact value:', JSON.parse(requestBody).randString);
    console.log('🔧 randString type in body:', typeof JSON.parse(requestBody).randString);
    console.log('🔧 randString length in body:', JSON.parse(requestBody).randString?.length);
    
    return axios.post(`${iyzicoConfig.uri}${endpoint}`, requestBody, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
            'Accept': 'application/json'
        }
    });
}

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API Server çalışıyor!',
        environment: {
            nodeEnv: process.env.NODE_ENV || 'NOT SET',
            supabaseUrl: process.env.SUPABASE_URL || 'NOT SET',
            supabaseKeyLength: process.env.SUPABASE_KEY?.length || 0,
            iyzicoApiKeyLength: process.env.IYZICO_API_KEY?.length || 0,
            iyzicoSecretKeyLength: process.env.IYZICO_SECRET_KEY?.length || 0,
            iyzicoUri: process.env.IYZICO_URI || 'NOT SET'
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
        console.log('🔧 Environment:', process.env.NODE_ENV);
        console.log('🔧 Iyzico API Key length:', process.env.IYZICO_API_KEY?.length || 0);
        console.log('🔧 Iyzico Secret Key length:', process.env.IYZICO_SECRET_KEY?.length || 0);
        
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
            yksField,
            conversationId
        } = req.body;
        
        // Validasyon
        if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv || !amount) {
            console.log('❌ Validasyon hatası: Eksik kart bilgileri');
            return res.status(400).json({
                success: false,
                error: 'Eksik kart bilgileri'
            });
        }
        
        // Gerçek Iyzico ödeme işlemi
        console.log('✅ Gerçek kart ile ödeme başlatılıyor');
        console.log('🔧 Callback URL:', process.env.NODE_ENV === 'production' 
            ? 'https://www.derslink.net.tr/api/payment/callback'
            : 'http://localhost:3000/api/payment/callback');
        
        // Iyzico formatına uygun alfanumerik string üret
        function generateRandomAlphaNum(length = 8) {
            return Array.from({length}, () => (Math.random() * 36 | 0).toString(36)).join('');
        }
        
        // Frontend'den gelen conversationId'yi kullan veya yeni oluştur
        console.log('🔧 Frontend\'den gelen conversationId:', conversationId);
        console.log('🔧 conversationId type:', typeof conversationId);
        console.log('🔧 conversationId length:', conversationId?.length);
        
        const finalConversationId = conversationId || generateRandomAlphaNum(16);
        
        console.log('🔧 Final conversationId kullanılıyor:', finalConversationId);
        
        // merchantId - Iyzico bunu API key'den otomatik alır
        console.log('🔧 Iyzico production ortamında merchantId API key\'den otomatik alınır');
        
        const request = {
            locale: 'tr',
            conversationId: finalConversationId,
            randString: 'RS' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8), // 🔑 Iyzico 3D Secure için zorunlu (prefix + timestamp + random) - field name randString olarak değiştirildi
            price: amount.toString(),
            paidPrice: amount.toString(),
            currency: 'TRY',
            installment: '1',
            basketId: generateRandomAlphaNum(12),
            paymentChannel: 'WEB',
            paymentGroup: 'PRODUCT',
            callbackUrl: 'https://www.derslink.net.tr/api/payment/callback', // 🔑 Production callback URL - ana domain ile uyumlu
            threeDS: '1',
            paymentSource: 'API',
            merchantOrderId: generateRandomAlphaNum(12),
            posOrderId: generateRandomAlphaNum(12),
            orderId: generateRandomAlphaNum(12),
            paymentCard: {
                cardHolderName: cardHolder,
                cardNumber: cardNumber.replace(/\s/g, ''),
                expireMonth: cardExpiry.split('/')[0],
                expireYear: '20' + cardExpiry.split('/')[1],
                cvc: cardCvv,
                registerCard: '0'
            },
            buyer: {
                id: generateRandomAlphaNum(12),
                name: firstName,
                surname: lastName,
                gsmNumber: phone,
                email: email,
                identityNumber: '11111111111',
                registrationAddress: 'Test Adres',
                ip: req.ip || '127.0.0.1',
                city: 'Istanbul',
                country: 'Turkey'
            },

            billingAddress: {
                contactName: firstName + ' ' + lastName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Adres',
                zipCode: '34000'
            },
            shippingAddress: {
                contactName: firstName + ' ' + lastName,
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Test Adres',
                zipCode: '34000'
            },
            basketItems: [
                {
                    id: generateRandomAlphaNum(12),
                    name: 'Program Ödemesi',
                    category1: 'Eğitim',
                    itemType: 'VIRTUAL',
                    price: amount.toString()
                }
            ]
        };
        
        console.log('📋 Iyzico request hazırlandı:');
        console.log('📋 Request conversationId:', request.conversationId);
        console.log('📋 Request conversationId type:', typeof request.conversationId);
        console.log('📋 Request conversationId length:', request.conversationId?.length);
        console.log('📋 Request object:', JSON.stringify(request, null, 2));
        console.log('📋 Card number (masked):', cardNumber.substring(0, 4) + '****' + cardNumber.substring(cardNumber.length - 4));
        
        console.log('🔧 Tam Iyzico request gönderiliyor:', JSON.stringify(request, null, 2));
        console.log('🔧 Raw request body (JSON.stringify):', JSON.stringify(request));
        console.log('🔧 randString değeri:', request.randString);
        console.log('🔧 randString type:', typeof request.randString);
        console.log('🔧 randString length:', request.randString?.length);
        
        // Zorunlu alanları kontrol et
        console.log('🔧 Zorunlu alan kontrolü:');
        console.log('🔧 - locale:', request.locale);
        console.log('🔧 - currency:', request.currency);
        console.log('🔧 - price:', request.price);
        console.log('🔧 - paidPrice:', request.paidPrice);
        console.log('🔧 - installment:', request.installment);
        console.log('🔧 - paymentChannel:', request.paymentChannel);
        console.log('🔧 - paymentGroup:', request.paymentGroup);
        console.log('🔧 - callbackUrl:', request.callbackUrl);
        console.log('🔧 - randString:', request.randString);
        console.log('🔧 - conversationId:', request.conversationId);
        
        // Direkt API kullan
        console.log('🔧 Iyzico direkt API kullanılıyor');
        console.log('🔧 Endpoint:', '/payment/3dsecure/initialize');
        try {
            // Iyzico'nun doğru endpoint'ini kullan
            const response = await makeIyzicoRequest('/payment/3dsecure/initialize', request);
            console.log('✅ Direkt API response status:', response.status);
            console.log('✅ Direkt API response headers:', response.headers);
            console.log('✅ Direkt API response data:', JSON.stringify(response.data, null, 2));
            handleIyzicoResponse(null, response.data, res);
        } catch (error) {
            console.error('❌ Direkt API hatası:');
            console.error('❌ Error message:', error.message);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error statusText:', error.response?.statusText);
            console.error('❌ Error data:', JSON.stringify(error.response?.data, null, 2));
            console.error('❌ Error headers:', error.response?.headers);
            handleIyzicoResponse(error, null, res);
        }
        
    } catch (error) {
        console.error('❌ Ödeme işlemi hatası:', error);
        console.error('❌ Hata stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Ödeme işlemi sırasında hata oluştu: ' + error.message
        });
    }
});

// Iyzico response handler fonksiyonu
function handleIyzicoResponse(err, result, res) {
    if (err) {
        console.error('❌ Iyzico 3D Secure hatası:');
        console.error('❌ Error object:', err);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error code:', err.code);
        console.error('❌ Error status:', err.status);
        console.error('❌ Error response data:', err.response?.data);
        return res.status(500).json({
            success: false,
            error: '3D Secure başlatılamadı: ' + err.message
        });
    }
    
    console.log('✅ Iyzico 3D Secure sonucu:');
    console.log('✅ Full result object:', JSON.stringify(result, null, 2));
    console.log('📋 Result detayları:', {
        status: result.status,
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        hasThreeDSHtmlContent: !!result.threeDSHtmlContent,
        threeDSHtmlContentLength: result.threeDSHtmlContent?.length || 0
    });
    
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
}

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
            
            try {
                const response = await makeIyzicoRequest('/payment/retrieve', request);
                console.log('✅ Ödeme tamamlandı:', response.data);
                
                if (response.data.status === 'success') {
                    return res.redirect('/?payment=success&paymentId=' + paymentId);
                } else {
                    return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme başarısız'));
                }
            } catch (error) {
                console.error('❌ Ödeme tamamlama hatası:', error);
                return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme tamamlanamadı'));
            }
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
            
            try {
                const response = await makeIyzicoRequest('/payment/retrieve', request);
                console.log('✅ Ödeme tamamlandı:', response.data);
                
                if (response.data.status === 'success') {
                    return res.redirect('/?payment=success&paymentId=' + paymentId);
                } else {
                    return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme başarısız'));
                }
            } catch (error) {
                console.error('❌ Ödeme tamamlama hatası:', error);
                return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme tamamlanamadı'));
            }
        } else {
            return res.redirect('/?payment=error&message=' + encodeURIComponent('3D Secure doğrulaması başarısız'));
        }
        
    } catch (error) {
        console.error('❌ Callback hatası:', error);
        res.redirect('/?payment=error&message=' + encodeURIComponent('Sistem hatası'));
    }
});

// Production debug endpoint - sadece environment variable'ları kontrol etmek için
app.get('/api/production-debug', (req, res) => {
    res.json({
        message: 'Production debug bilgileri',
        environment: process.env.NODE_ENV,
        iyzicoConfig: {
            apiKeySet: !!process.env.IYZICO_API_KEY,
            secretKeySet: !!process.env.IYZICO_SECRET_KEY,
            uriSet: !!process.env.IYZICO_URI
        },
        supabaseConfig: {
            urlSet: !!process.env.SUPABASE_URL,
            keySet: !!process.env.SUPABASE_KEY
        }
    });
});

// Vercel için export
module.exports = app;