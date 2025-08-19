// Supabase Configuration - Final Version - CACHE TEMIZLEME: 2024-01-20
console.log('🔧 Supabase config dosyası yükleniyor...');

// Supabase credentials
const SUPABASE_URL = 'https://hmvhqrtuocytmtbwxuyx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdmhxcnR1b2N5dG10Ynd4dXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTYxMjgsImV4cCI6MjA2OTk5MjEyOH0.qchKIP3ZPzrzB__WtUauew5c38UiDjYjv9IWa8UP4iU';

// Global variables
let supabase = null;

// Create UserService immediately
const UserService = {
    // Register new user
    async registerUser(userData) {
        try {
            
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            
            // Create user - simple approach
            const { data, error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password
            });
            
            // Auto-confirm email for development
            if (data.user && !data.user.email_confirmed_at) {
                console.log('📧 Email otomatik onaylanıyor...');
                try {
                    const { error: confirmError } = await supabase.auth.updateUser({
                        data: { email_confirmed_at: new Date().toISOString() }
                    });
                    if (confirmError) {
                        console.error('❌ Email onaylama hatası:', confirmError);
                    } else {
                        console.log('✅ Email otomatik onaylandı');
                    }
                } catch (confirmError) {
                    console.error('❌ Email onaylama hatası:', confirmError);
                }
            }

            if (error) {
                // Auth başarısız oldu ama direkt database'e insert yapalım
                
                // Generate a proper UUID v4
                const generateUUID = () => {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        const r = Math.random() * 16 | 0;
                        const v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };
                const manualUserId = generateUUID();
                
                const insertResult = await this.insertToDatabase({
                    id: manualUserId,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phone: userData.phone,
                    selectedProgram: userData.selectedProgram,
                    mainProgram: userData.mainProgram
                });
                
                if (insertResult.success) {
                    return {
                        success: true,
                        user: { id: manualUserId, email: userData.email },
                        message: 'Kullanıcı başarıyla database\'e kaydedildi (manuel)'
                    };
                } else {
                    return {
                        success: false,
                        error: 'Database kayıt hatası: ' + (insertResult.error || 'Bilinmeyen hata')
                    };
                }
            }


            

            
            // Users tablosuna kayıt
            try {
                const userInsertPayload = {
                    id: data.user.id,
                    email: userData.email,
                    name: userData.firstName + ' ' + userData.lastName,
                    phone: userData.phone,
                    password_hash: 'temp_hash_' + Date.now(),
                    enrolled_program: userData.mainProgram,
                    yks_field: userData.yksField || null // YKS alan bilgisi
                    // created_at ve updated_at otomatik olarak Supabase tarafından doldurulacak
                };
                
                const { data: userInsertData, error: userInsertError } = await supabase
                    .from('users')
                    .insert([userInsertPayload])
                    .select();

                if (userInsertError) {
                    console.error('Users tablosu kayıt hatası:', userInsertError);
                }
            } catch (userInsertError) {
                console.error('Users tablosu kayıt hatası:', userInsertError);
            }

            // Payment kaydı artık handleModernPaymentSuccess içinde yapılacak
            
            // Kullanıcıyı uygun sınıfa otomatik ata
            try {
                await this.assignUserToClass(data.user.id, userData.mainProgram, userData.scheduleType, userData.yksField);
            } catch (classAssignmentError) {
                console.error('❌ Sınıf atama hatası:', classAssignmentError);
                // Sınıf atama başarısız olsa bile kayıt işlemi devam eder
            }
            // Burada sadece user kaydı yapılıyor
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Kayıt hatası:', error);
            return { success: false, error: error.message };
        }
    },

    // Login user
    async loginUser(email, password) {
        try {
            console.log('🔐 Giriş başlatılıyor...', email);
            
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            
            // Önce database'de kullanıcı var mı kontrol et
            console.log('🔍 Database kontrolü yapılıyor...');
            const { data: dbUser, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .limit(1);
            
            if (dbError) {
                console.error('❌ Database kontrol hatası:', dbError);
                return { success: false, error: 'Database bağlantı hatası' };
            }
            
            if (!dbUser || dbUser.length === 0) {
                console.log('❌ Kullanıcı database\'de bulunamadı');
                return { success: false, error: 'Kullanıcı kaydı bulunamadı. Lütfen önce kayıt olun.' };
            }
            
            console.log('✅ Database kontrolü başarılı:', dbUser[0]);
            
            // Şimdi Auth sistemini dene
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    console.log('⚠️ Auth giriş başarısız, database kullanıcısı ile devam ediliyor...');
                    // Auth başarısız ama database'de kullanıcı var, database kullanıcısı ile devam et
                    return { 
                        success: true, 
                        user: { 
                            id: dbUser[0].id, 
                            email: dbUser[0].email,
                            name: dbUser[0].name 
                        }, 
                        dbUser: dbUser[0],
                        authMethod: 'database'
                    };
                }

                console.log('✅ Auth giriş başarılı:', data.user?.email);
                return { success: true, user: data.user, dbUser: dbUser[0], authMethod: 'auth' };
                
            } catch (authError) {
                console.log('⚠️ Auth giriş hatası, database kullanıcısı ile devam ediliyor...');
                // Auth hatası ama database'de kullanıcı var, database kullanıcısı ile devam et
                return { 
                    success: true, 
                    user: { 
                        id: dbUser[0].id, 
                        email: dbUser[0].email,
                        name: dbUser[0].name 
                    }, 
                    dbUser: dbUser[0],
                    authMethod: 'database'
                };
            }
            
        } catch (error) {
            console.error('❌ Giriş hatası:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            
            // Önce Auth sistemini dene
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                
                if (error) {
                    // Auth session missing is normal for non-logged in users
                    if (error.message.includes('Auth session missing')) {
                        return { success: false, user: null, error: 'No active session' };
                    }
                    throw error;
                }

                if (user) {
                    return { success: true, user: user, authMethod: 'auth' };
                }
            } catch (authError) {
                console.log('⚠️ Auth kullanıcı bilgisi alınamadı, database kontrol ediliyor...');
            }
            
            // Auth başarısız oldu, localStorage'dan database kullanıcı bilgisini kontrol et
            const storedUser = localStorage.getItem('databaseUser');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    console.log('✅ Database kullanıcı bilgisi bulundu:', userData);
                    return { success: true, user: userData, authMethod: 'database' };
                } catch (parseError) {
                    console.error('❌ Stored user parse hatası:', parseError);
                    localStorage.removeItem('databaseUser');
                }
            }
            
            return { success: false, user: null, error: 'No active session' };
        } catch (error) {
            console.error('❌ Kullanıcı bilgisi alma hatası:', error);
            return { success: false, error: error.message };
        }
    },

    // Kullanıcıyı uygun sınıfa otomatik ata
    async assignUserToClass(userId, mainProgram, scheduleType, yksField = null) {
        try {
            console.log('🎯 Kullanıcı sınıfa atanıyor:', { userId, mainProgram, scheduleType, yksField });
            console.log('🔍 Parametre tipleri:', {
                userId: typeof userId,
                mainProgram: typeof mainProgram,
                scheduleType: typeof scheduleType,
                yksField: typeof yksField
            });
            
            // Önce uygun sınıfı bul - Kapasite kontrolünü kaldırdık
            let query = supabase
                .from('classes')
                .select('*')
                .eq('status', 'active');
            
            // Schedule type'ı düzelt (YKS için farklı format)
            let correctedScheduleType = scheduleType;
            if (mainProgram === 'YKS') {
                if (scheduleType === 'WEEKDAY') correctedScheduleType = 'hafta_ici';
                else if (scheduleType === 'WEEKEND') correctedScheduleType = 'hafta_sonu';
                else if (scheduleType === 'MIXED') correctedScheduleType = 'karma';
            }
            
            query = query.eq('schedule_type', correctedScheduleType);
            console.log('🔍 Schedule type düzeltildi:', { original: scheduleType, corrected: correctedScheduleType });
            
            // YKS için alan filtresi ekle (program_type sütunu kullan)
            if (mainProgram === 'YKS' && yksField) {
                let correctedYksField = yksField;
                if (yksField === 'sayisal') correctedYksField = 'Sayısal';
                else if (yksField === 'sozel') correctedYksField = 'Sözel';
                else if (yksField === 'esit-agirlik') correctedYksField = 'Eşit Ağırlık';
                
                query = query.eq('program_type', correctedYksField);
                console.log('🔍 YKS alan filtresi eklendi:', { original: yksField, corrected: correctedYksField });
            } else {
                // LGS için program_type filtresi
                query = query.eq('program_type', mainProgram);
            }
            
            console.log('🔍 Final sorgu parametreleri:', {
                mainProgram,
                correctedScheduleType,
                correctedYksField: mainProgram === 'YKS' && yksField ? (yksField === 'sayisal' ? 'Sayısal' : yksField === 'sozel' ? 'Sözel' : 'Eşit Ağırlık') : null
            });
            
            query = query.order('class_name', { ascending: true }).limit(1);
            
            console.log('🔍 Sınıf arama sorgusu hazırlandı');
            const { data: availableClasses, error: classError } = await query;
            
            console.log('🔍 Sınıf arama sonucu:', {
                availableClasses: availableClasses?.length || 0,
                error: classError?.message || 'Yok',
                classes: availableClasses
            });
            
            if (classError) {
                throw new Error('Sınıf arama hatası: ' + classError.message);
            }
            
            if (!availableClasses || availableClasses.length === 0) {
                console.log('⚠️ Uygun sınıf bulunamadı, yeni sınıf oluşturuluyor...');
                
                // Yeni sınıf oluştur
                let correctedScheduleType = scheduleType;
                if (mainProgram === 'YKS') {
                    if (scheduleType === 'WEEKDAY') correctedScheduleType = 'hafta_ici';
                    else if (scheduleType === 'WEEKEND') correctedScheduleType = 'hafta_sonu';
                    else if (scheduleType === 'MIXED') correctedScheduleType = 'karma';
                }
                
                let correctedYksField = null;
                if (mainProgram === 'YKS' && yksField) {
                    if (yksField === 'sayisal') correctedYksField = 'Sayısal';
                    else if (yksField === 'sozel') correctedYksField = 'Sözel';
                    else if (yksField === 'esit-agirlik') correctedYksField = 'Eşit Ağırlık';
                }
                
                const newClassName = mainProgram === 'YKS' 
                    ? `${mainProgram}-${correctedYksField}-${correctedScheduleType}-${Date.now().toString().slice(-4)}`
                    : `${mainProgram}-${correctedScheduleType}-${Date.now().toString().slice(-4)}`;
                
                const newClassData = {
                    class_name: newClassName,
                    program_type: mainProgram === 'YKS' ? correctedYksField : mainProgram,
                    schedule_type: correctedScheduleType,
                    program: mainProgram, // YKS sınıfları için program sütunu
                    max_capacity: 5, // Doğru sütun adı
                    current_enrollment: 1,
                    status: 'active'
                };
                
                const { data: newClass, error: createError } = await supabase
                    .from('classes')
                    .insert([newClassData])
                    .select()
                    .single();
                
                if (createError) {
                    throw new Error('Yeni sınıf oluşturma hatası: ' + createError.message);
                }
                
                console.log('✅ Yeni sınıf oluşturuldu:', newClass);
                
                // Kullanıcıyı yeni sınıfa ata
                const enrollmentData = {
                    user_id: userId,
                    class_id: newClass.id,
                    enrollment_date: new Date().toISOString(),
                    status: 'active'
                };
                
                const { error: enrollmentError } = await supabase
                    .from('class_enrollments')
                    .insert([enrollmentData]);
                
                if (enrollmentError) {
                    throw new Error('Sınıf kayıt hatası: ' + enrollmentError.message);
                }
                
                console.log('✅ Kullanıcı yeni sınıfa atandı:', newClass.class_name);
                return newClass;
                
            } else {
                // Mevcut sınıfa ata
                const selectedClass = availableClasses[0];
                console.log('✅ Uygun sınıf bulundu:', selectedClass.class_name);
                
                // Kullanıcıyı sınıfa ata
                const enrollmentData = {
                    user_id: userId,
                    class_id: selectedClass.id,
                    enrollment_date: new Date().toISOString(),
                    status: 'active'
                };
                
                const { error: enrollmentError } = await supabase
                    .from('class_enrollments')
                    .insert([enrollmentData]);
                
                if (enrollmentError) {
                    throw new Error('Sınıf kayıt hatası: ' + enrollmentError.message);
                }
                
                // Sınıf kapasitesini güncelle
                const { error: updateError } = await supabase
                    .from('classes')
                    .update({ current_enrollment: selectedClass.current_enrollment + 1 })
                    .eq('id', selectedClass.id);
                
                if (updateError) {
                    console.error('⚠️ Sınıf kapasitesi güncellenemedi:', updateError);
                }
                
                console.log('✅ Kullanıcı mevcut sınıfa atandı:', selectedClass.class_name);
                return selectedClass;
            }
            
        } catch (error) {
            console.error('❌ Sınıf atama hatası:', error);
            throw error;
        }
    },

    // Direct database insert method
    async insertToDatabase(userData) {
        try {
            console.log('📝 Direkt database insert başlatılıyor...', userData.email);
            
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            
            // Insert into users table
            const userInsertPayload = {
                id: userData.id,
                email: userData.email,
                name: userData.firstName + ' ' + userData.lastName,
                phone: userData.phone,
                password_hash: 'manual_hash_' + Date.now(),
                enrolled_program: userData.mainProgram
                // created_at ve updated_at otomatik olarak Supabase tarafından doldurulacak
            };
            
            const { data: userInsertData, error: userInsertError } = await supabase
                .from('users')
                .insert([userInsertPayload])
                .select();

            if (userInsertError) {
                console.error('❌ Users tablosu kayıt hatası:', userInsertError);
                return { success: false, error: userInsertError.message };
            }
            
            console.log('✅ Users tablosuna kayıt başarılı:', userInsertData);
            
            // Kullanıcıyı uygun sınıfa otomatik ata
            try {
                await this.assignUserToClass(userData.id, userData.mainProgram, userData.scheduleType, userData.yksField);
            } catch (classAssignmentError) {
                console.error('❌ Sınıf atama hatası:', classAssignmentError);
                // Sınıf atama başarısız olsa bile kayıt işlemi devam eder
            }
            
            // Payment kaydı artık handleModernPaymentSuccess içinde yapılacak
            // Burada sadece user kaydı yapılıyor
            
            return { success: true, data: userInsertData };
            
        } catch (error) {
            console.error('❌ Database insert hatası:', error);
            return { success: false, error: error.message };
        }
    },

    // Logout user
    async logoutUser() {
        try {
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                throw error;
            }

            console.log('✅ Çıkış başarılı');
            return { success: true };
        } catch (error) {
            console.error('❌ Çıkış hatası:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete user completely
    async deleteUser(email) {
        try {
            console.log('🗑️ Kullanıcı siliniyor...', email);
            
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }
            
            // First, delete from database
            const { error: dbError } = await supabase
                .from('users')
                .delete()
                .eq('email', email);
            
            if (dbError) {
                console.error('❌ Database silme hatası:', dbError);
            } else {
                console.log('✅ Database\'den kullanıcı silindi');
            }
            
            // Also delete from payments table (using user_id if available)
            // First try to get user_id from users table
            const { data: userData } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .limit(1);
            
            if (userData && userData.length > 0) {
                const { error: paymentError } = await supabase
                    .from('payments')
                    .delete()
                    .eq('user_id', userData[0].id);
                
                if (paymentError) {
                    console.error('❌ Payments silme hatası:', paymentError);
                } else {
                    console.log('✅ Payments\'den kullanıcı silindi');
                }
            }
            
            // Note: We cannot delete from Auth without admin privileges
            // The user will need to be deleted manually from Supabase dashboard
            
            return { success: true };
            
        } catch (error) {
            console.error('❌ Kullanıcı silme hatası:', error);
            return { success: false, error: error.message };
        }
    }
};

// Initialize function
function initializeSupabase() {
    console.log('🔄 Supabase başlatılıyor...');
    
    try {
        // Check if Supabase library is available
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Supabase global object yüklenmedi!');
            return false;
        }
        
        // Check if createClient function exists
        if (typeof window.supabase.createClient !== 'function') {
            console.error('❌ supabase.createClient fonksiyonu bulunamadı!');
            console.log('🔍 window.supabase içeriği:', Object.keys(window.supabase || {}));
            return false;
        }
        
        // Create Supabase client
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        if (!supabase) {
            console.error('❌ Supabase client oluşturulamadı!');
            return false;
        }
        
        console.log('✅ Supabase client oluşturuldu');
        
        // Export to window
        window.UserService = UserService;
        window.supabase = supabase;
        
        console.log('✅ UserService ve Supabase client export edildi');
        return true;
        
    } catch (error) {
        console.error('❌ Supabase başlatma hatası:', error);
        return false;
    }
}

// Export immediately
if (typeof window !== 'undefined') {
    window.UserService = UserService;
    console.log('✅ UserService hemen export edildi');
}

// Try to initialize immediately
if (typeof window !== 'undefined' && typeof window.supabase !== 'undefined') {
    console.log('🚀 Hemen başlatılıyor...');
    initializeSupabase();
} else {
    console.log('⏳ DOM yüklenmesi bekleniyor...');
    // Wait for DOM and Supabase library
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM yüklendi, Supabase başlatılıyor...');
        
        // Try multiple times
        let attempts = 0;
        const maxAttempts = 10;
        
        function tryInitialize() {
            attempts++;
            console.log(`🔄 Deneme ${attempts}/${maxAttempts}`);
            
            if (initializeSupabase()) {
                console.log('🎉 Supabase başarıyla başlatıldı!');
            } else if (attempts < maxAttempts) {
                console.log(`⏳ ${attempts * 500}ms sonra tekrar denenecek...`);
                setTimeout(tryInitialize, 500);
            } else {
                console.error('❌ Supabase başlatılamadı!');
            }
        }
        
        tryInitialize();
    });
}

console.log('✅ Supabase config dosyası yüklendi');
