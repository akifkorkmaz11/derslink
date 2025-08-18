const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

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
            supabaseKeyLength: process.env.SUPABASE_KEY?.length || 0
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
        
        // Basit query ile başla
        let query = supabase
            .from('users')
            .select('*')
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

// Vercel için export
module.exports = app;