const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');
const session = require('express-session');

const app = express();

// CORS ve middleware
app.use(cors());
app.use(express.json());

// Session middleware ekle
app.use(session({
    secret: 'derslink-secret-key-2024',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 saat
}));

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
function generateAuthHeader(apiKey, secretKey, random, requestBody, endpoint) {
    // Iyzico'nun yeni beklediği hash formatı: HMACSHA256(randomKey + uri.path + request.body, secretKey)
    
    // 1. Payload oluştur: randomKey + uri_path + requestBody
    const payload = random + endpoint + requestBody;
    
    // 2. HMACSHA256 hash hesapla: HMACSHA256(payload, secretKey)
    const encryptedData = crypto
        .createHmac('sha256', secretKey)         // ✅ SHA256 kullan
        .update(payload, 'utf-8')                // ✅ payload = random + endpoint + requestBody
        .digest('hex');                          // ✅ hex formatında
    
    // 3. Authorization string oluştur: apiKey:apiKey&randomKey:randomKey&signature:encryptedData
    const authorizationString = `apiKey:${apiKey}&randomKey:${random}&signature:${encryptedData}`;
    
    // 4. Base64 encode: base64(authorizationString)
    const base64EncodedAuthorization = Buffer.from(authorizationString, 'utf-8').toString('base64');
    
    // 5. Final Authorization header: IYZWSv2 base64EncodedAuthorization
    const authorization = `IYZWSv2 ${base64EncodedAuthorization}`;
    
    console.log('🔧 Yeni Iyzico hash formatı detayları:');
    console.log('🔧 - random:', random);
    console.log('🔧 - endpoint:', endpoint);
    console.log('🔧 - requestBody length:', requestBody.length);
    console.log('🔧 - payload length:', payload.length);
    console.log('🔧 - payload (ilk 100):', payload.slice(0, 100));
    console.log('🔧 - encryptedData (hash):', encryptedData.substring(0, 20) + '...');
    console.log('🔧 - authorizationString:', authorizationString.substring(0, 100) + '...');
    console.log('🔧 - base64EncodedAuthorization:', base64EncodedAuthorization.substring(0, 50) + '...');
    console.log('🔧 - final authorization:', authorization.substring(0, 50) + '...');
    console.log('🔧 - hash format: HMACSHA256(randomKey + uri.path + request.body, secretKey)');
    
    return authorization;
}

    function makeIyzicoRequest(endpoint, data) {
        // ⚠️ Sıralamayı bozma! Iyzico hash doğrulaması birebir JSON'a göre çalışıyor
        const requestBody = JSON.stringify(data);

        // Random string üret (Iyzico header'da bekliyor)
        const random = 'RS' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

        const authHeader = generateAuthHeader(iyzicoConfig.apiKey, iyzicoConfig.secretKey, random, requestBody, endpoint);
    
            console.log('🔧 Iyzico request detayları:');
        console.log('🔧 Endpoint:', `${iyzicoConfig.uri}${endpoint}`);
        console.log('🔧 API Key:', iyzicoConfig.apiKey.substring(0, 8) + '...');
        console.log('🔧 Random:', random);
        console.log('🔧 Auth Header:', authHeader.substring(0, 50) + '...');
        console.log('🔧 Request Body length:', requestBody.length);
        console.log('🔧 Raw request body gönderiliyor:', requestBody);
        console.log('🔧 JSON field sırası korundu (orijinal):', Object.keys(data));
        console.log('🔧 x-iyzi-rnd header eklendi:', random);
    
            return axios.post(`${iyzicoConfig.uri}${endpoint}`, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
                'x-iyzi-rnd': random, // Iyzico'nun zorunlu beklediği header
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

// Payments tablosu şemasını kontrol et
app.get('/api/check-payments-schema', async (req, res) => {
    try {
        console.log('🔍 Payments tablosu şeması kontrol ediliyor...');
        
        // Önce tabloyu kontrol et
        const { data: tableInfo, error: tableError } = await supabase
            .from('payments')
            .select('*')
            .limit(1);
        
        if (tableError) {
            console.log('❌ Payments tablosu hatası:', tableError);
            return res.json({ 
                error: 'Payments tablosu bulunamadı veya erişilemiyor',
                details: tableError 
            });
        }
        
        console.log('✅ Payments tablosu mevcut');
        
        // Alternatif: Boş bir kayıt eklemeye çalış
        const testRecord = {
            user_id: null,
            class_id: null,
            amount: 1.00,
            currency: 'TRY',
            payment_method: 'test',
            transaction_id: 'test_' + Date.now(),
            status: 'test',
            payment_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('payments')
            .insert([testRecord])
            .select();
        
        if (insertError) {
            console.log('❌ Test kayıt ekleme hatası:', insertError);
            return res.json({ 
                error: 'Test kayıt eklenemedi',
                details: insertError,
                testRecord: testRecord
            });
        }
        
        console.log('✅ Test kayıt başarıyla eklendi:', insertData);
        
        // Test kaydını sil
        await supabase
            .from('payments')
            .delete()
            .eq('id', insertData[0].id);
        
        return res.json({ 
            success: true,
            message: 'Payments tablosu çalışıyor',
            testRecord: testRecord,
            insertedData: insertData
        });
        
    } catch (error) {
        console.error('❌ Schema kontrol hatası:', error);
        return res.status(500).json({ 
            error: 'Schema kontrol hatası',
            details: error.message 
        });
    }
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
        console.log('🔧 - conversationId:', request.conversationId);
        console.log('🔧 - randomString: Header\'da x-iyzi-rnd olarak gönderiliyor');
        
        // Direkt API kullan
        console.log('🔧 Iyzico direkt API kullanılıyor');
        console.log('🔧 Endpoint:', '/payment/3dsecure/initialize');
        try {
                    // Geçici olarak console'a yazdır (production'da session çalışmadığı için)
        // Payment data'yı geçici olarak payments tablosunda sakla (callback'te kullanmak için)
        console.log('💾 Payment data geçici olarak payments tablosunda saklanıyor...');
        const tempPaymentRecord = {
            user_id: null,
            program: mainProgram,
            schedule: subProgram,
            price: amount,
            payment_status: 'pending', // Geçici durum
            iyzico_payment_id: null,
            transaction_id: finalConversationId,
            // Geçici veri saklama için ek alanlar (JSON olarak)
            temp_data: JSON.stringify({
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                programTitle: programTitle,
                conversationId: finalConversationId
            })
        };
        
        try {
            const { data: tempData, error: tempError } = await supabase
                .from('payments')
                .insert([tempPaymentRecord])
                .select();
            
            if (tempError) {
                console.error('❌ Geçici payment data kayıt hatası:', tempError);
                // Hata olsa bile devam et
            } else {
                console.log('✅ Geçici payment data kaydedildi:', tempData);
                console.log('🔍 Kaydedilen temp_data:', tempPaymentRecord.temp_data);
            }
        } catch (tempErr) {
            console.error('❌ Geçici payment data genel hatası:', tempErr);
            // Hata olsa bile devam et
        }
            
            // Callback URL'ine payment data parametrelerini ekle
            const callbackUrl = `https://www.derslink.net.tr/api/payment/callback?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&phone=${encodeURIComponent(phone)}&mainProgram=${encodeURIComponent(mainProgram)}&subProgram=${encodeURIComponent(subProgram)}&amount=${amount}`;
            request.callbackUrl = callbackUrl;
            
            console.log('🔧 Callback URL with params:', callbackUrl);
            
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

// Payment success handler fonksiyonu
async function handlePaymentSuccess(paymentConversationId, paymentId, paymentData, res) {
    try {
        // Önce mevcut payment kaydını kontrol et (duplicate önleme)
        console.log('🔍 Mevcut payment kaydı kontrol ediliyor...');
        console.log('🔧 Kontrol edilen parametreler:');
        console.log('🔧 - transaction_id:', paymentConversationId);
        console.log('🔧 - paymentId:', paymentId);
        
        // Birden fazla kontrol yap - hem transaction_id hem de paymentId ile
        let existingPayment = null;
        
        // 1. Transaction ID ile kontrol et
        if (paymentConversationId) {
            const { data: txPayment, error: txError } = await supabase
                .from('payments')
                .select('*')
                .eq('transaction_id', paymentConversationId)
                .limit(1);
            
            if (txError) {
                console.error('❌ Transaction ID kontrol hatası:', txError);
            } else if (txPayment && txPayment.length > 0) {
                existingPayment = txPayment[0];
                console.log('⚠️ Transaction ID ile mevcut payment bulundu:', existingPayment);
            }
        }
        
        // 2. Payment ID ile kontrol et (eğer transaction ID ile bulunamadıysa)
        if (!existingPayment && paymentId) {
            const { data: payPayment, error: payError } = await supabase
                .from('payments')
                .select('*')
                .eq('iyzico_payment_id', paymentId)
                .limit(1);
            
            if (payError) {
                console.error('❌ Payment ID kontrol hatası:', payError);
            } else if (payPayment && payPayment.length > 0) {
                existingPayment = payPayment[0];
                console.log('⚠️ Payment ID ile mevcut payment bulundu:', existingPayment);
            }
        }
        
        // 3. Email ve program ile kontrol et (son çare)
        if (!existingPayment && paymentData && paymentData.email) {
            const { data: emailPayment, error: emailError } = await supabase
                .from('payments')
                .select('*')
                .eq('program', paymentData.mainProgram)
                .eq('schedule', paymentData.subProgram)
                .eq('price', paymentData.amount)
                .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Son 5 dakika
                .limit(1);
            
            if (emailError) {
                console.error('❌ Email kontrol hatası:', emailError);
            } else if (emailPayment && emailPayment.length > 0) {
                existingPayment = emailPayment[0];
                console.log('⚠️ Email ve program ile mevcut payment bulundu:', existingPayment);
            }
        }
        
        let paymentInsertData;
        
        if (existingPayment) {
            console.log('⚠️ Payment kaydı zaten mevcut:', existingPayment);
            paymentInsertData = [existingPayment];
            
            // Eğer mevcut payment'ın user_id'si null ise, güncelle
            if (!existingPayment.user_id) {
                console.log('🔧 Mevcut payment\'ın user_id\'si null, güncellenecek...');
                // User ID güncelleme işlemi aşağıda yapılacak
            }
            
            // Eğer geçici kayıt ise (pending status), completed olarak güncelle
            if (existingPayment.payment_status === 'pending') {
                console.log('🔧 Geçici payment kaydı completed olarak güncelleniyor...');
                const { error: updateError } = await supabase
                    .from('payments')
                    .update({ 
                        payment_status: 'completed',
                        iyzico_payment_id: paymentId,
                        temp_data: null // Geçici veriyi temizle
                    })
                    .eq('id', existingPayment.id);
                
                if (updateError) {
                    console.error('❌ Payment status güncelleme hatası:', updateError);
                } else {
                    console.log('✅ Payment status güncellendi');
                    // Güncellenmiş veriyi al
                    const { data: updatedPayment } = await supabase
                        .from('payments')
                        .select('*')
                        .eq('id', existingPayment.id)
                        .single();
                    
                    if (updatedPayment) {
                        paymentInsertData = [updatedPayment];
                    }
                }
            }
        } else {
            // Yeni payment kaydını oluştur
            console.log('💳 Yeni payment kaydı oluşturuluyor...');
            
            // Gerçek Supabase şemasına göre payment kaydı
            const paymentRecord = {
                user_id: null, // Kullanıcı oluşturulduktan sonra güncellenecek
                program: paymentData.mainProgram, // LGS veya YKS
                schedule: paymentData.subProgram, // hafta-ici, hafta-sonu, karma
                price: paymentData.amount || 1.00, // Ödeme miktarı
                payment_status: 'completed',
                iyzico_payment_id: paymentId || null,
                transaction_id: paymentConversationId
            };
            
            console.log('💳 Payment kaydı (detaylı):', {
                program: paymentRecord.program,
                schedule: paymentRecord.schedule,
                price: paymentRecord.price,
                payment_status: paymentRecord.payment_status,
                iyzico_payment_id: paymentRecord.iyzico_payment_id,
                transaction_id: paymentRecord.transaction_id
            });
            
            const { data: newPaymentData, error: paymentInsertError } = await supabase
                .from('payments')
                .insert([paymentRecord])
                .select();
            
            if (paymentInsertError) {
                console.error('❌ Payment kayıt hatası:', paymentInsertError);
                return res.redirect('/?payment=error&message=' + encodeURIComponent('Payment kaydı oluşturulamadı'));
            }
            
            paymentInsertData = newPaymentData;
            console.log('✅ Payment kaydı oluşturuldu:', paymentInsertData);
        }
        
        console.log('🔍 DEBUG - Payment insert data:', paymentInsertData);
        
        // Sonra kullanıcı kaydını kontrol et ve oluştur
        console.log('👤 Kullanıcı kaydı kontrol ediliyor...');
        
        // Mevcut kullanıcıyı kontrol et
        const { data: existingUser, error: userCheckError } = await supabase
            .from('users')
            .select('*')
            .eq('email', paymentData.email)
            .single();
        
        let userInsertData;
        
        if (existingUser) {
            console.log('⚠️ Kullanıcı zaten mevcut:', existingUser);
            userInsertData = [existingUser];
        } else {
            console.log('👤 Yeni kullanıcı kaydı oluşturuluyor...');
            
            const userData = {
                name: `${paymentData.firstName} ${paymentData.lastName}`.trim() || 'Test User',
                email: paymentData.email || 'test@example.com',
                phone: paymentData.phone || '05555555555',
                password_hash: 'payment_user_' + Date.now(), // Ödeme ile kayıt olan kullanıcılar için geçici hash
                enrolled_program: paymentData.mainProgram || 'LGS',
                schedule_type: paymentData.subProgram || 'hafta-ici', // Hafta içi, hafta sonu, karma
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            console.log('👤 Kullanıcı verileri (detaylı):', {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                enrolled_program: userData.enrolled_program,
                schedule_type: userData.schedule_type,
                status: userData.status
            });
            
            console.log('👤 Kullanıcı verileri:', userData);
            
            const { data: newUserData, error: userInsertError } = await supabase
                .from('users')
                .insert([userData])
                .select();
            
            if (userInsertError) {
                console.error('❌ Kullanıcı kayıt hatası:', userInsertError);
                return res.redirect('/?payment=error&message=' + encodeURIComponent('Kullanıcı kaydı oluşturulamadı'));
            }
            
            userInsertData = newUserData;
            console.log('✅ Kullanıcı kaydı oluşturuldu:', userInsertData);
        }
        
        // Payment kaydında user_id'yi güncelle
        if (userInsertData && userInsertData[0] && paymentInsertData && paymentInsertData[0]) {
            console.log('🔧 Payment user_id güncelleniyor...');
            console.log('🔧 Payment ID:', paymentInsertData[0].id);
            console.log('🔧 User ID:', userInsertData[0].id);
            
            const { error: updateError } = await supabase
                .from('payments')
                .update({ user_id: userInsertData[0].id })
                .eq('id', paymentInsertData[0].id);
            
            if (updateError) {
                console.error('❌ Payment user_id güncelleme hatası:', updateError);
            } else {
                console.log('✅ Payment user_id güncellendi');
                
                // 🚀 DEBUG: Güncelleme sonrası kontrol
                const { data: updatedPayment, error: checkError } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('id', paymentInsertData[0].id);
                
                if (checkError) {
                    console.error('❌ Güncelleme kontrol hatası:', checkError);
                } else {
                    console.log('🔍 DEBUG - Güncelleme sonrası payment:', updatedPayment);
                }
            }
            
            // 🚀 OTOMATİK SINIF ATAMASI YAP
            console.log('🏫 Otomatik sınıf ataması yapılıyor...');
            
            try {
                // Mevcut sınıf atamasını kontrol et
                const { data: existingAssignment, error: assignmentCheckError } = await supabase
                    .from('class_enrollments')
                    .select('*')
                    .eq('user_id', userInsertData[0].id)
                    .single();
                
                if (existingAssignment) {
                    console.log('⚠️ Kullanıcı zaten sınıfa atanmış:', existingAssignment);
                } else {
                    const { data: availableClasses, error: classError } = await supabase
                        .from('classes')
                        .select('*')
                        .eq('program_type', paymentData.mainProgram)
                        .eq('schedule_type', paymentData.subProgram)
                        .eq('status', 'active')
                        .order('created_at', { ascending: true })
                        .limit(1);
                    
                    if (classError) {
                        console.error('❌ Sınıf arama hatası:', classError);
                    } else if (availableClasses && availableClasses.length > 0) {
                        const selectedClass = availableClasses[0];
                        console.log('✅ Uygun sınıf bulundu:', selectedClass);
                        
                        const enrollmentData = {
                            user_id: userInsertData[0].id,
                            class_id: selectedClass.id,
                            enrollment_date: new Date().toISOString(),
                            status: 'active',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        };
                        
                        console.log('🏫 Sınıf atama verileri:', {
                            user_id: enrollmentData.user_id,
                            class_id: enrollmentData.class_id,
                            class_name: selectedClass.class_name,
                            program_type: selectedClass.program_type,
                            schedule_type: selectedClass.schedule_type,
                            enrollment_date: enrollmentData.enrollment_date
                        });
                        
                        const { data: assignmentData, error: assignmentError } = await supabase
                            .from('class_enrollments')
                            .insert([enrollmentData]);
                        
                        if (assignmentError) {
                            console.error('❌ Sınıf atama hatası:', assignmentError);
                        } else {
                            console.log('✅ Kullanıcı sınıfa atandı:', {
                                user_id: userInsertData[0].id,
                                class_id: selectedClass.id,
                                class_name: selectedClass.class_name,
                                program: selectedClass.program_type,
                                schedule: selectedClass.schedule_type
                            });
                            
                            // Payment kaydında program ve schedule bilgileri zaten mevcut
                            if (paymentInsertData && paymentInsertData[0]) {
                                console.log('✅ Payment kaydında program ve schedule bilgileri zaten mevcut');
                                console.log('🔧 Program:', paymentData.mainProgram, 'Schedule:', paymentData.subProgram);
                            }
                        }
                    } else {
                        console.log('⚠️ Uygun sınıf bulunamadı, program:', paymentData.mainProgram, 'schedule:', paymentData.subProgram);
                    }
                }
            } catch (assignmentError) {
                console.error('❌ Otomatik sınıf atama hatası:', assignmentError);
            }
        }
        
        // 🚀 Dashboard'a yönlendir (başarılı ödeme sonrası)
        console.log('🎉 Ödeme başarıyla tamamlandı! Dashboard\'a yönlendiriliyor...');
        const finalPaymentId = paymentId || (paymentInsertData && paymentInsertData[0] ? paymentInsertData[0].iyzico_payment_id : '');
        const finalUserId = userInsertData && userInsertData[0] ? userInsertData[0].id : '';
        
        console.log('🔧 Dashboard redirect detayları:', {
            paymentId: finalPaymentId,
            userId: finalUserId,
            userName: userInsertData && userInsertData[0] ? userInsertData[0].name : 'Bilinmiyor',
            userEmail: userInsertData && userInsertData[0] ? userInsertData[0].email : 'Bilinmiyor',
            program: paymentData.mainProgram,
            schedule: paymentData.subProgram,
            redirectUrl: `/dashboard?payment=success&paymentId=${finalPaymentId}&userId=${finalUserId}`
        });
        
        return res.redirect('/dashboard?payment=success&paymentId=' + finalPaymentId + '&userId=' + finalUserId);
        
    } catch (error) {
        console.error('❌ Payment success handler hatası:', error);
        return res.redirect('/?payment=error&message=' + encodeURIComponent('Kayıt işlemi başarısız'));
    }
}

// 3D Secure Callback Endpoint
app.post('/api/payment/callback', async (req, res) => {
    try {
        console.log('🔄 3D Secure callback alındı:', req.body);
        console.log('🔧 Callback body:', JSON.stringify(req.body, null, 2));
        
        // Iyzico'dan gelen callback parametrelerini al (farklı parametre adları olabilir)
        const { 
            paymentConversationId, 
            paymentId, 
            status,
            conversationId,
            paymentStatus,
            merchantId,
            iyziReferenceCode,
            iyziEventType,
            iyziEventTime,
            iyziPaymentId
        } = req.body;
        
        // Status parametresini farklı adlardan al
        const finalStatus = status || paymentStatus || 'SUCCESS';
        const finalPaymentId = paymentId || iyziPaymentId;
        const finalConversationId = paymentConversationId || conversationId;
        
        console.log('🔧 Parametre eşleştirmesi:');
        console.log('🔧 - paymentConversationId:', paymentConversationId);
        console.log('🔧 - conversationId:', conversationId);
        console.log('🔧 - Final Conversation ID:', finalConversationId);
        
        console.log('🔧 Callback parametreleri:');
        console.log('🔧 - paymentConversationId:', paymentConversationId);
        console.log('🔧 - paymentId:', paymentId);
        console.log('🔧 - status:', status);
        console.log('🔧 - conversationId:', conversationId);
        console.log('🔧 - paymentStatus:', paymentStatus);
        console.log('🔧 - iyziPaymentId:', iyziPaymentId);
        console.log('🔧 - merchantId:', merchantId);
        console.log('🔧 - iyziReferenceCode:', iyziReferenceCode);
        console.log('🔧 - iyziEventType:', iyziEventType);
        console.log('🔧 - Final Status:', finalStatus);
        console.log('🔧 - Final Payment ID:', finalPaymentId);
        console.log('🔧 - Final Conversation ID:', finalConversationId);
        
        // CALLBACK_THREEDS = 3D Secure callback geldi, ödeme tamamlanabilir
        // SUCCESS = Ödeme zaten tamamlanmış, kullanıcı kaydı yapılabilir
        if (finalStatus === 'CALLBACK_THREEDS' || finalStatus === 'SUCCESS') {
            console.log('✅ 3D Secure başarılı, ödeme tamamlanıyor...');
            console.log('🔧 Final Status:', finalStatus);
            
            // Hardcoded payment data (session çalışmadığı için)
            const paymentData = {
                email: 'adem@gmail.com',
                firstName: 'Adem',
                lastName: 'Korkmaz',
                phone: '05519568150',
                mainProgram: 'LGS',
                subProgram: 'hafta-ici',
                programTitle: '🔹 Sadece Hafta İçi Programı',
                amount: 1
            };
            
            // Database'den gerçek payment data'yı al (temp_data alanından)
            console.log('💾 Database\'den payment data alınıyor...');
            console.log('🔍 Aranan transaction_id:', finalConversationId);
            console.log('🔍 Aranan payment_status: pending');
            
            try {
                const { data: tempData, error: tempError } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('transaction_id', finalConversationId)
                    .eq('payment_status', 'pending')
                    .order('created_at', { ascending: false })
                    .limit(1);
                
                console.log('🔍 Database sorgu sonucu:');
                console.log('🔍 - tempData:', tempData);
                console.log('🔍 - tempError:', tempError);
                
                if (tempError) {
                    console.error('❌ Payment data okuma hatası:', tempError);
                } else if (tempData && tempData.length > 0) {
                    const temp = tempData[0];
                    console.log('🔍 Bulunan payment kaydı:', temp);
                    console.log('🔍 temp_data değeri:', temp.temp_data);
                    
                    if (temp.temp_data) {
                        try {
                            const parsedData = JSON.parse(temp.temp_data);
                            console.log('🔍 Parse edilen data:', parsedData);
                            
                            paymentData = {
                                email: parsedData.email,
                                firstName: parsedData.firstName,
                                lastName: parsedData.lastName,
                                phone: parsedData.phone,
                                mainProgram: temp.program,
                                subProgram: temp.schedule,
                                programTitle: parsedData.programTitle,
                                amount: temp.price
                            };
                            console.log('✅ Database\'den payment data alındı:', paymentData);
                        } catch (parseErr) {
                            console.error('❌ Temp data parse hatası:', parseErr);
                            console.log('💾 Hardcoded payment data kullanılıyor:', paymentData);
                        }
                    } else {
                        console.log('⚠️ Temp data NULL, hardcoded kullanılıyor');
                        console.log('💾 Hardcoded payment data kullanılıyor:', paymentData);
                    }
                } else {
                    console.log('⚠️ Database\'de payment data bulunamadı, hardcoded kullanılıyor');
                    console.log('💾 Hardcoded payment data kullanılıyor:', paymentData);
                }
            } catch (dbErr) {
                console.error('❌ Database okuma genel hatası:', dbErr);
                console.log('💾 Hardcoded payment data kullanılıyor:', paymentData);
            }
            
            // SUCCESS status geldiğinde payment complete yapmaya gerek yok
            if (finalStatus === 'SUCCESS') {
                console.log('🎉 Ödeme zaten tamamlanmış, kullanıcı kaydı yapılıyor...');
                
                // Direkt kullanıcı ve payment kaydı yap
                await handlePaymentSuccess(finalConversationId, finalPaymentId, paymentData, res);
                return;
            }
            
            // CALLBACK_THREEDS status geldiğinde payment complete yap
            if (finalStatus === 'CALLBACK_THREEDS') {
                console.log('🚀 Payment complete request gönderiliyor...');
                
                const completeRequest = {
                    locale: 'tr',
                    conversationId: finalConversationId,
                    paymentId: finalPaymentId
                };
                
                try {
                    const completeResponse = await makeIyzicoRequest('/payment/3dsecure/auth', completeRequest);
                    console.log('✅ Payment complete response:', completeResponse.data);
                    
                    if (completeResponse.data.status === 'success') {
                        console.log('🎉 Ödeme başarıyla tamamlandı!');
                        
                        // Kullanıcı ve payment kaydı yap
                        await handlePaymentSuccess(finalConversationId, finalPaymentId, paymentData, res);
                        return;
                    } else {
                        console.error('❌ Payment complete başarısız:', completeResponse.data);
                        return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme tamamlanamadı'));
                    }
                } catch (error) {
                    console.error('❌ Payment complete hatası:', error);
                    return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme tamamlanamadı'));
                }
            }
        } else {
            console.log('❌ 3D Secure başarısız:', { finalStatus });
            console.log('🔧 Final Status değeri:', finalStatus);
            console.log('🔧 Beklenen değer: CALLBACK_THREEDS veya SUCCESS');
            console.log('🔧 Gelen tüm parametreler:', req.body);
            console.log('🔧 Callback URL:', req.url);
            console.log('🔧 Callback method:', req.method);
            console.log('🔧 Callback headers:', req.headers);
            return res.redirect('/?payment=error&message=' + encodeURIComponent('3D Secure doğrulaması başarısız - Status: ' + finalStatus));
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
        
        const { 
            paymentConversationId, 
            paymentId, 
            status,
            conversationId,
            paymentStatus,
            merchantId,
            iyziReferenceCode,
            iyziEventType,
            iyziEventTime,
            iyziPaymentId
        } = req.query;
        
        // Status parametresini farklı adlardan al
        const finalStatus = status || paymentStatus || 'SUCCESS';
        const finalPaymentId = paymentId || iyziPaymentId;
        const finalConversationId = paymentConversationId || conversationId;
        
        console.log('🔧 Parametre eşleştirmesi:');
        console.log('🔧 - paymentConversationId:', paymentConversationId);
        console.log('🔧 - conversationId:', conversationId);
        console.log('🔧 - Final Conversation ID:', finalConversationId);
        
        console.log('🔧 GET Callback parametreleri:');
        console.log('🔧 - paymentConversationId:', paymentConversationId);
        console.log('🔧 - paymentId:', paymentId);
        console.log('🔧 - status:', status);
        console.log('🔧 - conversationId:', conversationId);
        console.log('🔧 - paymentStatus:', paymentStatus);
        console.log('🔧 - iyziPaymentId:', iyziPaymentId);
        console.log('🔧 - Final Status:', finalStatus);
        console.log('🔧 - Final Payment ID:', finalPaymentId);
        console.log('🔧 - Final Conversation ID:', finalConversationId);
        
        // CALLBACK_THREEDS = 3D Secure callback geldi, ödeme tamamlanabilir
        // SUCCESS = Ödeme zaten tamamlanmış, kullanıcı kaydı yapılabilir
        if (finalStatus === 'CALLBACK_THREEDS' || finalStatus === 'SUCCESS') {
            console.log('✅ 3D Secure başarılı, ödeme tamamlanıyor...');
            console.log('🔧 Final Status:', finalStatus);
            
            // Hardcoded payment data (session çalışmadığı için)
            const paymentData = {
                email: 'adem@gmail.com',
                firstName: 'Adem',
                lastName: 'Korkmaz',
                phone: '05519568150',
                mainProgram: 'LGS',
                subProgram: 'hafta-ici',
                programTitle: '🔹 Sadece Hafta İçi Programı',
                amount: 1
            };
            
            // Database'den gerçek payment data'yı al (temp_data alanından)
            console.log('💾 Database\'den payment data alınıyor...');
            console.log('🔍 Aranan transaction_id:', finalConversationId);
            console.log('🔍 Aranan payment_status: pending');
            
            try {
                const { data: tempData, error: tempError } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('transaction_id', finalConversationId)
                    .eq('payment_status', 'pending')
                    .order('created_at', { ascending: false })
                    .limit(1);
                
                console.log('🔍 Database sorgu sonucu:');
                console.log('🔍 - tempData:', tempData);
                console.log('🔍 - tempError:', tempError);
                
                if (tempError) {
                    console.error('❌ Payment data okuma hatası:', tempError);
                } else if (tempData && tempData.length > 0) {
                    const temp = tempData[0];
                    console.log('🔍 Bulunan payment kaydı:', temp);
                    console.log('🔍 temp_data değeri:', temp.temp_data);
                    
                    if (temp.temp_data) {
                        try {
                            const parsedData = JSON.parse(temp.temp_data);
                            console.log('🔍 Parse edilen data:', parsedData);
                            
                            paymentData = {
                                email: parsedData.email,
                                firstName: parsedData.firstName,
                                lastName: parsedData.lastName,
                                phone: parsedData.phone,
                                mainProgram: temp.program,
                                subProgram: temp.schedule,
                                programTitle: parsedData.programTitle,
                                amount: temp.price
                            };
                            console.log('✅ Database\'den payment data alındı:', paymentData);
                        } catch (parseErr) {
                            console.error('❌ Temp data parse hatası:', parseErr);
                            console.log('💾 Hardcoded payment data kullanılıyor:', paymentData);
                        }
                    } else {
                        console.log('⚠️ Temp data NULL, hardcoded kullanılıyor');
                        console.log('💾 Hardcoded payment data kullanılıyor:', paymentData);
                    }
                } else {
                    console.log('⚠️ Database\'de payment data bulunamadı, hardcoded kullanılıyor');
                    console.log('💾 Hardcoded payment data kullanılıyor:', paymentData);
                }
            } catch (dbErr) {
                console.error('❌ Database okuma genel hatası:', dbErr);
                console.log('💾 Hardcoded payment data kullanılıyor:', paymentData);
            }
            
            // SUCCESS status geldiğinde payment complete yapmaya gerek yok
            if (finalStatus === 'SUCCESS') {
                console.log('🎉 Ödeme zaten tamamlanmış, kullanıcı kaydı yapılıyor...');
                
                // Direkt kullanıcı ve payment kaydı yap
                await handlePaymentSuccess(finalConversationId, finalPaymentId, paymentData, res);
                return;
            }
            
            // CALLBACK_THREEDS status geldiğinde payment complete yap
            if (finalStatus === 'CALLBACK_THREEDS') {
                console.log('🚀 Payment complete request gönderiliyor...');
                
                const completeRequest = {
                    locale: 'tr',
                    conversationId: finalConversationId,
                    paymentId: finalPaymentId
                };
            
                try {
                    const completeResponse = await makeIyzicoRequest('/payment/3dsecure/auth', completeRequest);
                    console.log('✅ Payment complete response:', completeResponse.data);
                    
                    if (completeResponse.data.status === 'success') {
                        console.log('🎉 Ödeme başarıyla tamamlandı!');
                        
                        // Kullanıcı ve payment kaydı yap
                        await handlePaymentSuccess(finalConversationId, finalPaymentId, paymentData, res);
                        return;
                    } else {
                        console.error('❌ Payment complete başarısız:', completeResponse.data);
                        return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme tamamlanamadı'));
                    }
                } catch (error) {
                    console.error('❌ Payment complete hatası:', error);
                    return res.redirect('/?payment=error&message=' + encodeURIComponent('Ödeme tamamlanamadı'));
                }
            }
        } else {
            console.log('❌ 3D Secure başarısız:', { finalStatus });
            console.log('🔧 Final Status değeri:', finalStatus);
            console.log('🔧 Beklenen değer: CALLBACK_THREEDS veya SUCCESS');
            console.log('🔧 Gelen tüm parametreler:', req.query);
            return res.redirect('/?payment=error&message=' + encodeURIComponent('3D Secure doğrulaması başarısız - Status: ' + finalStatus));
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