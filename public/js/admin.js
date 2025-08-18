// Admin Panel JavaScript
console.log('Admin.js yuklendi');

// Saat formatlaması - saniye kısmını kaldır
function formatTime(timeStr) {
    if (!timeStr) return '00:00';
    
    // Eğer saat:dk:ss formatındaysa sadece saat:dk kısmını al
    if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
    }
    
    return timeStr;
}

// Admin Service Class
class AdminService {
    constructor() {
        this.supabase = window.supabase;
    }

    // Tüm sınıfları getir (program bazlı filtreleme ile)
    async getAllClasses(program = null) {
        try {
            console.log('Sınıflar getiriliyor...', { program });
            
            // API endpoint'ini kullan
            const url = program ? `/api/admin/classes?program=${program}` : '/api/admin/classes';
            const response = await fetch(url);
            const result = await response.json();
            
            if (!result.success) {
                console.error('Sınıflar alınamadı:', result.error);
                return { success: false, error: result.error };
            }
            
            console.log('Sınıflar alındı:', result.classes?.length || 0);
            return { success: true, classes: result.classes || [] };
        } catch (error) {
            console.error('Sınıf listesi hatası:', error);
            return { success: false, error: error.message };
        }
    }

    // Tüm kullanıcıları getir (program bazlı filtreleme ile)
    async getAllUsers(program = null) {
        try {
            console.log('Kullanıcılar getiriliyor...', { program });
            
            // API endpoint'ini kullan
            const url = program ? `/api/admin/users?program=${program}` : '/api/admin/users';
            const response = await fetch(url);
            const result = await response.json();
            
            if (!result.success) {
                console.error('Kullanıcılar alınamadı:', result.error);
                return { success: false, error: result.error };
            }
            
            console.log('Kullanıcılar alındı:', result.users?.length || 0);
            return { success: true, users: result.users || [] };
        } catch (error) {
            console.error('Kullanıcı listesi hatası:', error);
            return { success: false, error: error.message };
        }
    }

    // Tüm öğretmenleri getir
    async getAllTeachers() {
        try {
            console.log('Öğretmenler getiriliyor...');
            
            // API endpoint'ini kullan
            const response = await fetch('/api/admin/teachers');
            const result = await response.json();
            
            if (!result.success) {
                console.error('Öğretmenler alınamadı:', result.error);
                return { success: false, error: result.error };
            }
            
            console.log('Öğretmenler alındı:', result.teachers?.length || 0);
            return { success: true, teachers: result.teachers || [] };
        } catch (error) {
            console.error('Öğretmen listesi hatası:', error);
            return { success: false, error: error.message };
        }
    }

    // Öğretmen programlarını getir (program bazlı filtreleme ile)
    async getTeacherSchedule(program = null) {
        try {
            console.log('Öğretmen programları getiriliyor...', { program });
            
            // API endpoint'ini kullan
            const url = program ? `/api/admin/teacher-schedules?program=${program}` : '/api/admin/teacher-schedules';
            const response = await fetch(url);
            const result = await response.json();
            
            if (!result.success) {
                console.error('Öğretmen programları alınamadı:', result.error);
                return { success: false, error: result.error };
            }
            
            console.log('Öğretmen programları alındı:', result.schedules?.length || 0);
            return { success: true, schedules: result.schedules || [] };
        } catch (error) {
            console.error('Öğretmen programları hatası:', error);
            return { success: false, error: error.message };
        }
    }

    // Sinif detaylarini getir
    async getClassDetails(classId) {
        try {
            console.log('Sinif detaylari getiriliyor:', classId);
            
            const { data, error } = await this.supabase
                .from('classes')
                .select(`
                    *,
                    class_schedules (
                        id,
                        day_of_week,
                        start_time,
                        end_time,
                        subject,
                        teacher_name,
                        status
                    ),
                    class_enrollments (
                        user_id,
                        enrollment_date,
                        status,
                        users (
                            name,
                            email
                        )
                    )
                `)
                .eq('id', classId)
                .single();

            if (error) {
                console.error('Sinif detaylari alinamadi:', error);
                return { success: false, error: error.message };
            }

            console.log('Sinif detaylari alindi:', data);
            return { success: true, class: data };
        } catch (error) {
            console.error('Sinif detaylari hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Ders cakismasi kontrolu
    async checkScheduleConflict(classId, dayOfWeek, startTime, endTime, excludeScheduleId = null) {
        try {
            console.log('Ders cakismasi kontrol ediliyor:', { classId, dayOfWeek, startTime, endTime });
            
            if (!classId || !dayOfWeek || !startTime || !endTime) {
                console.log('Eksik parametreler, cakismakontrol atlaniyor');
                return { success: true, hasConflict: false, conflicts: [] };
            }
            
            // Cakismakontrol: yeni ders baslangici mevcut ders bitisinden once VE yeni ders bitisi mevcut ders baslangicindan sonra
            let query = this.supabase
                .from('class_schedules')
                .select('*')
                .eq('class_id', classId)
                .eq('day_of_week', dayOfWeek)
                .lt('start_time', endTime)
                .gt('end_time', startTime);
            
            if (excludeScheduleId) {
                query = query.neq('id', excludeScheduleId);
            }
            
            const { data, error } = await query;
            
            if (error) {
                console.error('Cakismakontrol hatasi:', error);
                return { success: false, error: error.message };
            }
            
            const hasConflict = data && data.length > 0;
            console.log('Cakismakontrol tamamlandi:', { hasConflict, conflicts: data });
            
            return { 
                success: true, 
                hasConflict, 
                conflicts: data || [] 
            };
        } catch (error) {
            console.error('Cakismakontrol hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Ders saatini guncelle
    async updateClassSchedule(scheduleId, updateData) {
        try {
            console.log('Ders saati guncelleniyor:', { scheduleId, updateData });
            
            // Cakismakontrol
            const conflictCheck = await this.checkScheduleConflict(
                updateData.class_id,
                updateData.day_of_week,
                updateData.start_time,
                updateData.end_time,
                scheduleId
            );
            
            if (!conflictCheck.success) {
                return { success: false, error: conflictCheck.error };
            }
            
            if (conflictCheck.hasConflict) {
                const conflicts = conflictCheck.conflicts.map(c => 
                    `${c.subject} (${formatTime(c.start_time)}-${formatTime(c.end_time)})`
                ).join(', ');
                return { 
                    success: false, 
                    error: `Ders cakismasi tespit edildi: ${conflicts}` 
                };
            }

            const { data, error } = await this.supabase
                .from('class_schedules')
                .update(updateData)
                .eq('id', scheduleId)
                .select();

            if (error) {
                console.error('Ders saati guncelleme hatasi:', error);
                return { success: false, error: error.message };
            }

            console.log('Ders saati guncellendi:', data);
            return { success: true, schedule: data[0] };
        } catch (error) {
            console.error('Ders saati guncelleme hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Yeni ders ekle
    async addClassSchedule(scheduleData) {
        try {
            console.log('Yeni ders ekleniyor:', scheduleData);
            
            // Cakismakontrol
            const conflictCheck = await this.checkScheduleConflict(
                scheduleData.class_id,
                scheduleData.day_of_week,
                scheduleData.start_time,
                scheduleData.end_time
            );
            
            if (!conflictCheck.success) {
                return { success: false, error: conflictCheck.error };
            }
            
            if (conflictCheck.hasConflict) {
                const conflicts = conflictCheck.conflicts.map(c => 
                    `${c.subject} (${formatTime(c.start_time)}-${formatTime(c.end_time)})`
                ).join(', ');
                return { 
                    success: false, 
                    error: `Ders cakismasi tespit edildi: ${conflicts}` 
                };
            }

            const { data, error } = await this.supabase
                .from('class_schedules')
                .insert([scheduleData])
                .select();

            if (error) {
                console.error('Ders ekleme hatasi:', error);
                return { success: false, error: error.message };
            }

            console.log('Yeni ders eklendi:', data);
            return { success: true, schedule: data[0] };
        } catch (error) {
            console.error('Ders ekleme hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Ders sil
    async deleteClassSchedule(scheduleId) {
        try {
            console.log('Ders siliniyor:', scheduleId);

            const { error } = await this.supabase
                .from('class_schedules')
                .delete()
                .eq('id', scheduleId);

            if (error) {
                console.error('Ders silme hatasi:', error);
                return { success: false, error: error.message };
            }

            console.log('Ders silindi');
            return { success: true };
        } catch (error) {
            console.error('Ders silme hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Kullaniciyi sinifa ata
    async assignUserToClass(userId, classId) {
        try {
            console.log('Kullanici sinifa ataniyor:', { userId, classId });

            if (!this.supabase) {
                console.error('Supabase client bulunamadi');
                return { success: false, error: 'Supabase client bulunamadi' };
            }

            // Once mevcut kayitlarini kontrol et
            const { data: existingRecord, error: checkExistingError } = await this.supabase
                .from('class_enrollments')
                .select('*')
                .eq('user_id', userId)
                .eq('class_id', classId);

            if (checkExistingError) {
                console.error('Mevcut kayit kontrol hatasi:', checkExistingError);
                return { success: false, error: checkExistingError.message };
            }
            
            let data;
            let error;
            
            if (existingRecord && existingRecord.length > 0) {
                // Mevcut kaydi aktif yap
                const { data: updateData, error: updateError } = await this.supabase
                    .from('class_enrollments')
                    .update({ 
                        status: 'active',
                        enrollment_date: new Date().toISOString()
                    })
                    .eq('user_id', userId)
                    .eq('class_id', classId)
                    .select();
                
                data = updateData;
                error = updateError;
            } else {
                // Yeni kayit olustur
                const { data: insertData, error: insertError } = await this.supabase
                    .from('class_enrollments')
                    .insert([{
                        user_id: userId,
                        class_id: classId,
                        status: 'active',
                        enrollment_date: new Date().toISOString()
                    }])
                    .select();
                
                data = insertData;
                error = insertError;
            }

            if (error) {
                console.error('Sinif atama hatasi:', error);
                return { success: false, error: error.message };
            }

            // Sinifin current_enrollment sayisini guncelle
            const { error: updateEnrollmentError } = await this.supabase
                .from('classes')
                .update({ 
                    current_enrollment: this.supabase.rpc('update_class_enrollment_count', { class_id: classId })
                })
                .eq('id', classId);

            if (updateEnrollmentError) {
                console.error('Sinif enrollment sayisi guncelleme hatasi:', updateEnrollmentError);
                // Ana islem basarili oldugu icin bu hatayi gormezden gel
            }

            console.log('Kullanici sinifa atandi:', data);
            return { success: true, enrollment: data[0] };
        } catch (error) {
            console.error('Sinif atama hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Kullaniciyi siniftan cikar
    async removeUserFromClass(userId, classId) {
        try {
            console.log('Kullanici siniftan cikariliyor:', { userId, classId });

            const { data, error } = await this.supabase
                .from('class_enrollments')
                .update({ status: 'dropped' })
                .eq('user_id', userId)
                .eq('class_id', classId)
                .eq('status', 'active')
                .select();

            if (error) {
                console.error('Siniftan cikarma hatasi:', error);
                return { success: false, error: error.message };
            }

            // Sinifin current_enrollment sayisini guncelle
            const { error: updateEnrollmentError } = await this.supabase
                .from('classes')
                .update({ 
                    current_enrollment: this.supabase.rpc('update_class_enrollment_count', { class_id: classId })
                })
                .eq('id', classId);

            if (updateEnrollmentError) {
                console.error('Sinif enrollment sayisi guncelleme hatasi:', updateEnrollmentError);
                // Ana islem basarili oldugu icin bu hatayi gormezden gel
            }

            console.log('Kullanici siniftan cikarildi:', data);
            return { success: true, result: data[0] };
        } catch (error) {
            console.error('Siniftan cikarma hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Ogrenciyi sistemden sil
    async deleteUser(userId) {
        try {
            console.log('Ogrenci sistemden siliniyor:', userId);
            
            if (!this.supabase) {
                console.error('Supabase client bulunamadi');
                return { success: false, error: 'Supabase client bulunamadi' };
            }
            
            // Once kullanicinin tum sinif kayitlarini sil
            const { error: enrollmentError } = await this.supabase
                .from('class_enrollments')
                .delete()
                .eq('user_id', userId);
            
            if (enrollmentError) {
                console.error('Sinif kayitlarini silme hatasi:', enrollmentError);
                return { success: false, error: enrollmentError.message };
            }
            
            // Kullanicinin odeme kayitlarini sil
            const { error: paymentError } = await this.supabase
                .from('payments')
                .delete()
                .eq('user_id', userId);
            
            if (paymentError) {
                console.error('Odeme kayitlarini silme hatasi:', paymentError);
                return { success: false, error: paymentError.message };
            }
            
            // Son olarak kullaniciyi sil
            const { error: userError } = await this.supabase
                .from('users')
                .delete()
                .eq('id', userId);
            
            if (userError) {
                console.error('Kullanici silme hatasi:', userError);
                return { success: false, error: userError.message };
            }
            
            console.log('Ogrenci basariliyla sistemden silindi');
            return { success: true };
        } catch (error) {
            console.error('Ogrenci silme hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Ders programı degisikligi olustur
    async createScheduleChange(changeData) {
        try {
            console.log('Ders programı degisikligi olusturuluyor:', changeData);

            const { data, error } = await this.supabase
                .from('schedule_changes')
                .insert([changeData])
                .select();

            if (error) {
                console.error('Program degisikligi hatasi:', error);
                return { success: false, error: error.message };
            }

            console.log('Program degisikligi olusturuldu:', data);
            return { success: true, change: data[0] };
        } catch (error) {
            console.error('Program degisikligi hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Kullanicinin mevcut sinifinin getir
    async getUserClass(userId) {
        try {
            console.log('Kullanicinin sinifi getiriliyor:', userId);

            const { data, error } = await this.supabase
                .from('class_enrollments')
                .select(`
                    *,
                    classes (
                        class_name,
                        schedule_type,
                        max_capacity,
                        current_enrollment
                    )
                `)
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('Kullanici henüz sinifa kayitli degil');
                    return { success: true, class: null };
                }
                console.error('Kullanici sinifi alinamadi:', error);
                return { success: false, error: error.message };
            }

            console.log('Kullanici sinifi:', data);
            return { success: true, class: data };
        } catch (error) {
            console.error('Kullanici sinifi getirme hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Yeni ogretmen ekle
    async addTeacher(teacherData) {
        try {
            console.log('Yeni ogretmen ekleniyor:', teacherData);
            
            // zoom_link sütunu yoksa kaldır
            const insertData = { ...teacherData };
            if (!insertData.zoom_link) {
                delete insertData.zoom_link;
            }
            
            const { data, error } = await this.supabase
                .from('teachers')
                .insert([insertData])
                .select()
                .single();

            if (error) {
                console.error('Ogretmen eklenemedi:', error);
                return { success: false, error: error.message };
            }

            console.log('Ogretmen eklendi:', data);
            return { success: true, teacher: data };
        } catch (error) {
            console.error('Ogretmen ekleme hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Ogretmen guncelle
    async updateTeacher(teacherId, teacherData) {
        try {
            console.log('Ogretmen guncelleniyor:', teacherId, teacherData);
            
            // Once eski ogretmen bilgilerini al
            const { data: oldTeacher, error: fetchError } = await this.supabase
                .from('teachers')
                .select('name')
                .eq('id', teacherId)
                .single();

            if (fetchError) {
                console.error('Eski ogretmen bilgileri alinamadi:', fetchError);
                return { success: false, error: fetchError.message };
            }

            // zoom_link sütunu yoksa kaldır
            const updateData = { ...teacherData };
            if (!updateData.zoom_link) {
                delete updateData.zoom_link;
            }

            // Ogretmeni guncelle
            const { data, error } = await this.supabase
                .from('teachers')
                .update(updateData)
                .eq('id', teacherId)
                .select()
                .single();

            if (error) {
                console.error('Ogretmen guncelleme hatasi:', error);
                return { success: false, error: error.message };
            }

            // Eger ogretmen adı degistiyse, programlarını da guncelle
            if (oldTeacher.name !== teacherData.name) {
                console.log('Ogretmen adı degisti, programlar guncelleniyor...');
                
                const { error: scheduleError } = await this.supabase
                    .from('class_schedules')
                    .update({ teacher_name: teacherData.name })
                    .eq('teacher_name', oldTeacher.name);

                if (scheduleError) {
                    console.error('Ogretmen programları guncelleme hatasi:', scheduleError);
                    return { success: false, error: scheduleError.message };
                }

                console.log('Ogretmen programları guncellendi');
            }

            console.log('Ogretmen guncellendi:', data);
            return { success: true, teacher: data };
        } catch (error) {
            console.error('Ogretmen guncelleme hatasi:', error);
            return { success: false, error: error.message };
        }
    }

    // Ogretmen sil
    async deleteTeacher(teacherId) {
        try {
            console.log('Ogretmen siliniyor:', teacherId);
            
            // Once ogretmenin programlarını sil
            const { error: scheduleError } = await this.supabase
                .from('class_schedules')
                .delete()
                .eq('teacher_id', teacherId);

            if (scheduleError) {
                console.error('Ogretmen programları silinemedi:', scheduleError);
                return { success: false, error: scheduleError.message };
            }

            // Sonra ogretmeni sil
            const { error } = await this.supabase
                .from('teachers')
                .delete()
                .eq('id', teacherId);

            if (error) {
                console.error('Ogretmen silinemedi:', error);
                return { success: false, error: error.message };
            }

            console.log('Ogretmen silindi:', teacherId);
            return { success: true };
        } catch (error) {
            console.error('Ogretmen silme hatasi:', error);
            return { success: false, error: error.message };
        }
    }
}

// Global olarak export et
window.AdminService = AdminService;

// Supabase baglantısını bekle
async function waitForSupabase() {
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
        if (window.supabase) {
            console.log('Supabase client bulundu');
            return true;
        }
        
        console.log(`Supabase bekleniyor... (${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
    }
    
    console.error('Supabase client yüklenemedi');
    return false;
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Admin paneli yükleniyor...');
    
    // Yükleme durumunu göster
    showLoadingState();
    
    try {
        // Supabase'i bekle
        const supabaseReady = await waitForSupabase();
        
        if (!supabaseReady) {
            showNotification('Supabase bağlantısı kurulamadı. Sayfayı yenileyin.', 'error');
            hideLoadingState();
            return;
        }
        
        // Hangi sayfada olduğumuzu kontrol et
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('admin-lgs.html')) {
            // LGS admin paneli
            await loadLGSAdminData();
        } else if (currentPage.includes('admin-yks.html')) {
            // YKS admin paneli - şu an için sadece coming soon
            console.log('YKS admin paneli - geliştirme aşamasında');
            hideLoadingState();
        } else {
            // Ana admin paneli (program seçimi)
            await loadMainAdminData();
        }
        
        hideLoadingState();
    } catch (error) {
        console.error('Admin paneli yükleme hatasi:', error);
        showNotification('Admin paneli yüklenirken hata oluştu', 'error');
        hideLoadingState();
    }
});

// Yükleme durumunu göster
function showLoadingState() {
    const classList = document.getElementById('classList');
    const userList = document.getElementById('userList');
    
    if (classList) {
        classList.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading-spinner"></div><p>Sınıflar yükleniyor...</p></div>';
    }
    
    if (userList) {
        userList.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading-spinner"></div><p>Kullanıcılar yükleniyor...</p></div>';
    }
}

// Yükleme durumunu gizle
function hideLoadingState() {
    // Yükleme durumu zaten loadAdminData tarafından güncelleniyor
}

// Ana admin paneli verilerini yükle (program seçimi)
async function loadMainAdminData() {
    console.log('Ana admin paneli verileri yükleniyor...');
    
    if (typeof window.AdminService === 'undefined') {
        console.error('AdminService bulunamadi');
        showNotification('Admin servisi yüklenemedi', 'error');
        return;
    }

    if (!window.supabase) {
        console.error('Supabase client bulunamadi');
        showNotification('Supabase bağlantısı kurulamadı', 'error');
        return;
    }

    const adminService = new AdminService();
    
    try {
        // Tum kullaniciları al ve program bazlı say
        const usersResult = await adminService.getAllUsers();
        
        if (usersResult.success) {
            const allUsers = usersResult.users;
            const lgsUsers = allUsers.filter(user => user.enrolled_program === 'LGS').length;
            const yksUsers = allUsers.filter(user => user.enrolled_program === 'YKS').length;
            const nullProgramUsers = allUsers.filter(user => !user.enrolled_program || user.enrolled_program === null).length;
            
            console.log('Program bazlı kullanıcı sayıları:', { lgsUsers, yksUsers, nullProgramUsers });
            
            // LGS istatistiklerini güncelle (LGS + NULL program kullanıcıları)
            const lgsStudentsElement = document.getElementById('lgsStudents');
            if (lgsStudentsElement) lgsStudentsElement.textContent = lgsUsers + nullProgramUsers;
            
            // YKS istatistiklerini güncelle
            const yksStudentsElement = document.getElementById('yksStudents');
            if (yksStudentsElement) yksStudentsElement.textContent = yksUsers;
            
            // YKS sınıf ve öğretmen sayılarını yükle
            await loadYKSStats();
            
            // LGS sınıf ve öğretmen sayılarını yükle
            await loadLGSStats();
        }
        
        console.log('Ana admin paneli verileri başarıyla yüklendi');
    } catch (error) {
        console.error('Ana admin paneli veri yükleme hatasi:', error);
        showNotification('Veriler yüklenirken hata oluştu', 'error');
    }
}

// YKS istatistiklerini yükle (ana panel için)
async function loadYKSStats() {
    try {
        console.log('YKS istatistikleri yükleniyor...');
        
        const adminService = new AdminService();
        
        // YKS sınıflarını getir
        const classesResult = await adminService.getAllClasses();
        const yksClasses = classesResult.success ? 
            classesResult.classes.filter(cls => cls.program === 'YKS').length : 0;
        
        // YKS öğretmenlerini getir
        const teachersResult = await adminService.getAllTeachers();
        const yksTeachers = teachersResult.success ? 
            teachersResult.teachers.filter(teacher => 
                teacher.status === 'active' && 
                (teacher.branch?.toLowerCase().includes('tyt') ||
                 teacher.branch?.toLowerCase().includes('ayt') ||
                 teacher.specialties?.toLowerCase().includes('tyt') ||
                 teacher.specialties?.toLowerCase().includes('ayt'))
            ).length : 0;
        
        console.log('YKS istatistikleri:', { yksClasses, yksTeachers });
        
        // Ana paneldeki YKS istatistiklerini güncelle
        const yksClassesElement = document.getElementById('yksClasses');
        const yksTeachersElement = document.getElementById('yksTeachers');
        
        if (yksClassesElement) yksClassesElement.textContent = yksClasses;
        if (yksTeachersElement) yksTeachersElement.textContent = yksTeachers;
        
        console.log('YKS istatistikleri güncellendi');
    } catch (error) {
        console.error('YKS istatistikleri yükleme hatasi:', error);
    }
}

// LGS istatistiklerini yükle (ana panel için)
async function loadLGSStats() {
    try {
        console.log('LGS istatistikleri yükleniyor...');
        
        const adminService = new AdminService();
        
        // LGS sınıflarını getir
        const classesResult = await adminService.getAllClasses();
        const lgsClasses = classesResult.success ? 
            classesResult.classes.filter(cls => cls.program === 'LGS').length : 0;
        
        // LGS öğretmenlerini getir
        const teachersResult = await adminService.getAllTeachers();
        const lgsTeachers = teachersResult.success ? 
            teachersResult.teachers.filter(teacher => 
                teacher.status === 'active' && 
                (teacher.specialties?.toLowerCase().includes('lgs') || 
                 teacher.branch?.toLowerCase().includes('lgs')) &&
                !teacher.branch?.toLowerCase().includes('tyt') &&
                !teacher.branch?.toLowerCase().includes('ayt')
            ).length : 0;
        
        console.log('LGS istatistikleri:', { lgsClasses, lgsTeachers });
        
        // Ana paneldeki LGS istatistiklerini güncelle
        const lgsClassesElement = document.getElementById('lgsClasses');
        const lgsTeachersElement = document.getElementById('lgsTeachers');
        
        if (lgsClassesElement) lgsClassesElement.textContent = lgsClasses;
        if (lgsTeachersElement) lgsTeachersElement.textContent = lgsTeachers;
        
        console.log('LGS istatistikleri güncellendi');
    } catch (error) {
        console.error('LGS istatistikleri yükleme hatasi:', error);
    }
}

// LGS admin paneli verilerini yükle
async function loadLGSAdminData() {
    console.log('LGS admin paneli verileri yükleniyor...');
    
    if (typeof window.AdminService === 'undefined') {
        console.error('AdminService bulunamadi');
        showNotification('Admin servisi yüklenemedi', 'error');
        return;
    }

    if (!window.supabase) {
        console.error('Supabase client bulunamadi');
        showNotification('Supabase bağlantısı kurulamadı', 'error');
        return;
    }

    const adminService = new AdminService();
    
    try {
        // İstatistikleri yükle
        await loadStatistics(adminService);
        
        // Sınıf listesini yükle
        await loadClassList(adminService);
        
        // Öğretmen programlarını yükle
        await loadTeacherSchedules(adminService);
        
        // Öğretmenleri yükle
        await loadTeachers();
        
        // Kullanıcı listesini yükle
        await loadUserList(adminService);
        
        console.log('LGS admin paneli verileri başarıyla yüklendi');
    } catch (error) {
        console.error('LGS admin paneli veri yükleme hatasi:', error);
        showNotification('Veriler yüklenirken hata oluştu', 'error');
    }
}

// Admin verilerini yükle (eski fonksiyon - geriye uyumluluk için)
async function loadAdminData() {
    return await loadLGSAdminData();
}

// İstatistikleri yükle (LGS admin paneli için)
async function loadStatistics(adminService) {
    try {
        console.log('LGS İstatistikler yükleniyor...');
        
        // LGS programı için filtreleme
        const programFilter = 'LGS';
        
        const classesResult = await adminService.getAllClasses(programFilter);
        const usersResult = await adminService.getAllUsers(programFilter);
        
        console.log('LGS Sınıf sonucu:', classesResult);
        console.log('LGS Kullanıcı sonucu:', usersResult);
        
        if (classesResult.success && usersResult.success) {
            // LGS programı için sınıf sayısını hesapla
            const lgsClasses = classesResult.classes.filter(cls => cls.program === 'LGS');
            
            const totalClasses = lgsClasses.length;
            const totalUsers = usersResult.users.length;
            const activeEnrollments = lgsClasses.reduce((total, cls) => {
                return total + (cls.class_enrollments?.filter(e => e.status === 'active').length || 0);
            }, 0);
            
            console.log('LGS Hesaplanan istatistikler:', { totalClasses, totalUsers, activeEnrollments });
            
            // İstatistikleri göster
            const totalClassesElement = document.getElementById('totalClasses');
            const totalUsersElement = document.getElementById('totalUsers');
            const totalEnrollmentsElement = document.getElementById('totalEnrollments');
            
            if (totalClassesElement) totalClassesElement.textContent = totalClasses;
            if (totalUsersElement) totalUsersElement.textContent = totalUsers;
            if (totalEnrollmentsElement) totalEnrollmentsElement.textContent = activeEnrollments;
            
            console.log('LGS İstatistikler yüklendi');
        } else {
            console.error('LGS İstatistik verileri alinamadi:', { classesResult, usersResult });
        }
    } catch (error) {
        console.error('LGS İstatistik yükleme hatasi:', error);
    }
}

// LGS istatistiklerini yükle (ana admin paneli için)
async function loadLGSStatistics(adminService) {
    try {
        console.log('LGS istatistikleri yükleniyor...');
        
        const classesResult = await adminService.getAllClasses();
        const usersResult = await adminService.getAllUsers('LGS'); // Sadece LGS kullanıcıları
        
        if (classesResult.success && usersResult.success) {
            const totalClasses = classesResult.classes.length;
            const lgsUsers = usersResult.users.filter(user => user.enrolled_program === 'LGS').length;
            
            console.log('LGS istatistikleri:', { totalClasses, lgsUsers });
            
            // LGS istatistiklerini göster
            const lgsClassesElement = document.getElementById('lgsClasses');
            const lgsStudentsElement = document.getElementById('lgsStudents');
            
            if (lgsClassesElement) lgsClassesElement.textContent = totalClasses;
            if (lgsStudentsElement) lgsStudentsElement.textContent = lgsUsers;
            
            console.log('LGS istatistikleri yüklendi');
        } else {
            console.error('LGS istatistik verileri alinamadi:', { classesResult, usersResult });
        }
    } catch (error) {
        console.error('LGS istatistik yükleme hatasi:', error);
    }
}

// Sınıf listesini yükle
async function loadClassList(adminService) {
    try {
        console.log('LGS Sınıf listesi yükleniyor...');
        
        // LGS programı için filtreleme
        const programFilter = 'LGS';
        
        const result = await adminService.getAllClasses(programFilter);
        
        console.log('LGS Sınıf sonucu:', result);
        
        if (result.success) {
            const classListContainer = document.getElementById('classList');
            if (classListContainer) {
                classListContainer.innerHTML = '';
                
                if (result.classes && result.classes.length > 0) {
                    result.classes.forEach(cls => {
                        const activeEnrollments = cls.class_enrollments?.filter(e => e.status === 'active').length || 0;
                        const classCard = createClassCard(cls, activeEnrollments);
                        classListContainer.appendChild(classCard);
                    });
                } else {
                    classListContainer.innerHTML = '<p style="text-align: center; color: #6b7280;">LGS programında henüz sınıf bulunmuyor</p>';
                }
            }
            
            console.log('LGS Sınıf listesi yüklendi');
        } else {
            console.error('LGS Sınıf listesi alınamadı:', result.error);
            const classListContainer = document.getElementById('classList');
            if (classListContainer) {
                classListContainer.innerHTML = '<p style="text-align: center; color: #ef4444;">LGS Sınıf listesi yüklenemedi: ' + result.error + '</p>';
            }
        }
    } catch (error) {
        console.error('LGS Sınıf listesi yükleme hatası:', error);
        const classListContainer = document.getElementById('classList');
        if (classListContainer) {
            classListContainer.innerHTML = '<p style="text-align: center; color: #ef4444;">LGS Sınıf listesi yüklenirken hata oluştu</p>';
        }
    }
}

// Kullanıcı listesini yükle
async function loadUserList(adminService) {
    try {
        console.log('LGS Kullanıcı listesi yükleniyor...');
        
        // LGS programı için filtreleme
        const programFilter = 'LGS';
        
        const result = await adminService.getAllUsers(programFilter);
        
        console.log('LGS Kullanıcı sonucu:', result);
        
        if (result.success) {
            const userListContainer = document.getElementById('userList');
            if (userListContainer) {
                userListContainer.innerHTML = '';
                
                if (result.users && result.users.length > 0) {
                    result.users.forEach(user => {
                        const userCard = createUserCard(user);
                        userListContainer.appendChild(userCard);
                    });
                } else {
                    userListContainer.innerHTML = '<p style="text-align: center; color: #6b7280;">LGS programında henüz kullanıcı bulunmuyor</p>';
                }
            }
            
            console.log('LGS Kullanıcı listesi yüklendi');
        } else {
            console.error('LGS Kullanıcı listesi alinamadi:', result.error);
            const userListContainer = document.getElementById('userList');
            if (userListContainer) {
                userListContainer.innerHTML = '<p style="text-align: center; color: #ef4444;">LGS Kullanıcı listesi yüklenemedi: ' + result.error + '</p>';
            }
        }
    } catch (error) {
        console.error('LGS Kullanıcı listesi yükleme hatasi:', error);
        const userListContainer = document.getElementById('userList');
        if (userListContainer) {
            userListContainer.innerHTML = '<p style="text-align: center; color: #ef4444;">LGS Kullanıcı listesi yüklenirken hata oluştu</p>';
        }
    }
}

// Öğretmen programlarını yükle
async function loadTeacherSchedules(adminService) {
    try {
        console.log('LGS Öğretmen programları yükleniyor...');
        
        // LGS programı için filtreleme
        const programFilter = 'LGS';
        
        // Önce tüm öğretmenleri al
        const teachersResult = await adminService.getAllTeachers();
        if (!teachersResult.success) {
            console.error('Öğretmenler alınamadı:', teachersResult.error);
            return;
        }
        
        // Sonra programları al
        const schedulesResult = await adminService.getTeacherSchedule(programFilter);
        
        console.log('LGS programları:', schedulesResult.schedules?.length || 0);
        
        const teacherScheduleGrid = document.getElementById('teacherScheduleGrid');
        if (!teacherScheduleGrid) {
            console.error('teacherScheduleGrid elementi bulunamadi');
            return;
        }
        
        // Aktif öğretmenleri filtrele (LGS öğretmenleri)
        const allActiveTeachers = teachersResult.teachers.filter(teacher => teacher.status === 'active');
        console.log('Tüm aktif öğretmenler:', allActiveTeachers.length);
        
        const activeTeachers = allActiveTeachers.filter(teacher => 
            (teacher.specialties?.toLowerCase().includes('lgs') || 
             teacher.branch?.toLowerCase().includes('lgs')) &&
            !teacher.branch?.toLowerCase().includes('tyt') &&
            !teacher.branch?.toLowerCase().includes('ayt')
        );
        
        console.log('LGS öğretmenleri:', activeTeachers.length);
        console.log('LGS öğretmen listesi:', activeTeachers.map(t => t.name));
        
        // Eğer LGS öğretmeni yoksa, tüm aktif öğretmenleri göster (geçici)
        if (activeTeachers.length === 0) {
            console.log('LGS öğretmeni bulunamadı, tüm aktif öğretmenler gösteriliyor');
            activeTeachers = allActiveTeachers;
        }
        
        if (activeTeachers.length === 0) {
            teacherScheduleGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;">Henüz öğretmen bulunmuyor</div>';
            return;
        }
        
        // Programları öğretmene göre grupla
        const teacherGroups = {};
        if (schedulesResult.success && schedulesResult.schedules.length > 0) {
            schedulesResult.schedules.forEach(schedule => {
                const teacherName = schedule.teacher_name;
                if (!teacherGroups[teacherName]) {
                    teacherGroups[teacherName] = [];
                }
                teacherGroups[teacherName].push(schedule);
            });
        }
        
        console.log('Öğretmen grupları:', Object.keys(teacherGroups));
        console.log('Her öğretmenin program sayısı:', Object.entries(teacherGroups).map(([name, schedules]) => `${name}: ${schedules.length}`));
        
        // Tüm aktif öğretmenler için kart oluştur
        const teacherCards = activeTeachers.map(teacher => {
            const schedules = teacherGroups[teacher.name] || [];
            console.log(`${teacher.name} için program sayısı: ${schedules.length}`);
            return createTeacherCardWithActions(teacher.name, schedules);
        });
        
        teacherScheduleGrid.innerHTML = teacherCards.join('');
        
        console.log('LGS Öğretmen programları yüklendi');
    } catch (error) {
        console.error('LGS Öğretmen programları yükleme hatasi:', error);
        showNotification('LGS Öğretmen programları yüklenirken hata oluştu', 'error');
    }
}

// Öğretmen programını yükle (filtreleme için)
async function loadTeacherSchedule() {
    try {
        const teacherSelect = document.getElementById('teacherSelect');
        const selectedTeacher = teacherSelect ? teacherSelect.value : '';
        
        const adminService = new AdminService();
        
        // Önce tüm öğretmenleri al
        const teachersResult = await adminService.getAllTeachers();
        if (!teachersResult.success) {
            console.error('Öğretmenler alınamadı:', teachersResult.error);
            return;
        }
        
        // Sonra programları al
        const schedulesResult = await adminService.getTeacherSchedule(selectedTeacher);
        
        const teacherScheduleGrid = document.getElementById('teacherScheduleGrid');
        if (!teacherScheduleGrid) {
            console.error('teacherScheduleGrid elementi bulunamadı');
            return;
        }
        
        // Aktif öğretmenleri filtrele
        let activeTeachers = teachersResult.teachers.filter(teacher => teacher.status === 'active');
        
        // Eğer öğretmen seçilmişse sadece o öğretmeni göster
        if (selectedTeacher) {
            activeTeachers = activeTeachers.filter(teacher => teacher.name === selectedTeacher);
        }
        
        if (activeTeachers.length === 0) {
            teacherScheduleGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;">Seçilen öğretmen için program bulunamadı</div>';
            return;
        }
        
        // Programları öğretmene göre grupla
        const teacherGroups = {};
        if (schedulesResult.success && schedulesResult.schedules.length > 0) {
            schedulesResult.schedules.forEach(schedule => {
                const teacherName = schedule.teacher_name;
                if (!teacherGroups[teacherName]) {
                    teacherGroups[teacherName] = [];
                }
                teacherGroups[teacherName].push(schedule);
            });
        }
        
        // Seçilen öğretmenler için kart oluştur
        const teacherCards = activeTeachers.map(teacher => {
            const schedules = teacherGroups[teacher.name] || [];
            return createTeacherCard(teacher.name, schedules);
        });
        
        teacherScheduleGrid.innerHTML = teacherCards.join('');
        
        console.log('Öğretmen programı yüklendi');
    } catch (error) {
        console.error('Öğretmen programı yükleme hatasi:', error);
        showNotification('Öğretmen programı yüklenirken hata oluştu', 'error');
    }
}

// Programları öğretmene göre grupla
function groupSchedulesByTeacher(schedules) {
    const groups = {};
    
    schedules.forEach(schedule => {
        const teacherName = schedule.teacher_name;
        if (!groups[teacherName]) {
            groups[teacherName] = [];
        }
        groups[teacherName].push(schedule);
    });
    
    return groups;
}

// Öğretmen kartı oluştur
function createTeacherCard(teacherName, schedules) {
    // Veritabanından öğretmen bilgilerini al
    const teacher = window.allTeachers?.find(t => t.name === teacherName);
    const teacherInfo = teacher ? { 
        id: teacher.id,
        name: teacher.name,
        subject: teacher.branch,
        branch: teacher.branch,
        specialties: teacher.specialties,
        initial: teacher.initial,
        status: teacher.status
    } : getTeacherInfo(teacherName);
    
    const totalHours = schedules.length; // 1 ders = 1 ders saati (40 dakika)
    
    // Programları günlere göre grupla
    const dayGroups = groupSchedulesByDay(schedules);
    
    const daySchedules = Object.entries(dayGroups).map(([day, daySchedules]) => {
        // Saat formatını düzenle (saniye varsa kaldır)
        const formatTime = (timeStr) => {
            if (!timeStr) return '';
            // Eğer saat:dk:ss formatındaysa sadece saat:dk kısmını al
            return timeStr.split(':').slice(0, 2).join(':');
        };
        
        const classItems = daySchedules.map(schedule => `
            <div class="class-item">
                <div class="class-time">${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}</div>
                <div class="class-info">
                    <div class="class-name">${schedule.classes?.class_name || 'Bilinmeyen Sınıf'}</div>
                    <div class="class-type">${schedule.subject} • ${schedule.classes?.schedule_type || ''}</div>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="day-schedule">
                <div class="day-title">${day}</div>
                ${classItems}
            </div>
        `;
    }).join('');
    
    return `
        <div class="teacher-card">
            <div class="teacher-header" onclick="showTeacherScheduleModal('${teacherName}', ${JSON.stringify(schedules).replace(/"/g, '&quot;')})">
                <div class="teacher-name">${teacherName}</div>
                <div class="teacher-subject">${teacherInfo.subject}</div>
                <div class="teacher-hours">${totalHours} ders saati/hafta</div>
            </div>
            <div class="schedule-content" onclick="showTeacherScheduleModal('${teacherName}', ${JSON.stringify(schedules).replace(/"/g, '&quot;')})">
                ${daySchedules || '<div class="no-classes">Bu öğretmen için henüz program bulunmuyor</div>'}
            </div>
            ${teacher ? `
            <div class="teacher-actions" style="padding: 15px; border-top: 1px solid #e5e7eb;">
                <button class="btn btn-primary" onclick="openEditTeacherModal(${JSON.stringify(teacherInfo).replace(/"/g, '&quot;')})" style="margin-right: 10px;">
                    Düzenle
                </button>
                <button class="btn btn-danger" onclick="openDeleteTeacherModal(${JSON.stringify(teacherInfo).replace(/"/g, '&quot;')})">
                    Sil
                </button>
            </div>
            ` : ''}
        </div>
    `;
}

// Programları günlere göre grupla
function groupSchedulesByDay(schedules) {
    const groups = {};
    
    schedules.forEach(schedule => {
        const day = schedule.day_of_week;
        if (!groups[day]) {
            groups[day] = [];
        }
        groups[day].push(schedule);
    });
    
    return groups;
}

// Öğretmen bilgilerini getir
function getTeacherInfo(teacherName) {
    const teacherMap = {
        'Zeynep Sarı': { subject: 'Matematik' },
        'Yasin Karakaş': { subject: 'Matematik' },
        'Zülküf Memiş': { subject: 'Fen Bilgisi' },
        'Kağan Şahin': { subject: 'Fen Bilgisi' },
        'Serhat Dede': { subject: 'Türkçe' },
        'Ayşegül Karamık': { subject: 'Türkçe' },
        'Menekşe Nur Sucu': { subject: 'T.C. İnkılap Tarihi' },
        'İshak Bilgin': { subject: 'Din Kültürü' },
        'Sevde İrem Gidek': { subject: 'İngilizce' }
    };
    
    return teacherMap[teacherName] || { subject: 'Bilinmeyen' };
}

// Öğretmen programı modal'ını göster
function showTeacherScheduleModal(teacherName, schedules) {
    const teacherInfo = getTeacherInfo(teacherName);
    const totalHours = schedules.length; // 1 ders = 1 ders saati (40 dakika)
    
    // Programları günlere göre grupla
    const dayGroups = groupSchedulesByDay(schedules);
    
    // Günleri sırala
    const dayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const sortedDays = dayOrder.filter(day => dayGroups[day]);
    
    const scheduleTable = sortedDays.map(day => {
        const daySchedules = dayGroups[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
        
        const dayRows = daySchedules.map(schedule => {
            // Saat formatını düzenle (saniye varsa kaldır)
            const formatTime = (timeStr) => {
                if (!timeStr) return '';
                // Eğer saat:dk:ss formatındaysa sadece saat:dk kısmını al
                return timeStr.split(':').slice(0, 2).join(':');
            };
            
            return `
                <tr>
                    <td>${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}</td>
                    <td>${schedule.classes.class_name}</td>
                    <td>${schedule.subject}</td>
                    <td>${schedule.classes.program_type || '-'}</td>
                    <td>${schedule.classes.schedule_type}</td>
                </tr>
            `;
        }).join('');
        
        return `
            <tr class="day-header">
                <td colspan="5" style="background: #f3f4f6; font-weight: bold; text-align: center; padding: 10px;">
                    ${day}
                </td>
            </tr>
            ${dayRows}
        `;
    }).join('');
    
    const modalContent = `
        <div class="modal" id="teacherScheduleModal" style="display: block;">
            <div class="modal-content" style="max-width: 1000px;">
                <div class="modal-header" style="position: relative;">
                    <h2>${teacherName} - ${teacherInfo.subject} Ders Programı</h2>
                    <button class="modal-close" onclick="closeTeacherScheduleModal()" style="position: absolute; right: 20px; top: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div style="margin-bottom: 20px; text-align: center;">
                        <div style="background: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px; display: inline-block;">
                            <strong>Toplam: ${totalHours} ders saati/hafta</strong>
                        </div>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <thead>
                                <tr style="background: #1f2937; color: white;">
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Saat</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Sınıf</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Ders</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Program</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Tür</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${scheduleTable}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Modal'ı body'ye ekle
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

// Öğretmen programı modal'ını kapat
function closeTeacherScheduleModal() {
    const modal = document.getElementById('teacherScheduleModal');
    if (modal) {
        modal.remove();
    }
}

// Sınıf kartı oluştur
function createClassCard(cls, enrollmentCount) {
    const card = document.createElement('div');
    card.className = 'class-card';
    card.innerHTML = `
        <div class="class-header">
            <h3>${cls.class_name}</h3>
            <span class="class-type">${cls.schedule_type}</span>
        </div>
        <div class="class-info">
            <p><strong>Kapasite:</strong> ${enrollmentCount}/${cls.max_capacity}</p>
            <p><strong>Durum:</strong> <span class="status-${cls.status}">${cls.status}</span></p>
            <p><strong>Ders Sayısı:</strong> ${cls.class_schedules?.length || 0} ders</p>
        </div>
        <div class="class-actions">
            <button onclick="viewClassDetails('${cls.id}')" class="btn btn-primary">Ders Programı</button>
            <button onclick="editClassSchedule('${cls.id}')" class="btn btn-secondary">Ders Saatleri</button>
            <button onclick="manageClassStudents('${cls.id}')" class="btn btn-success">Öğrenciler</button>
        </div>
    `;
    return card;
}

// Kullanıcı kartı oluştur
function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    // Veri kontrolü ve güvenlik
    const userName = user.name || 'İsimsiz Kullanıcı';
    const userEmail = user.email || 'E-posta yok';
    const userId = user.id || '';
    
    // Program badge'i oluştur
    let programBadge;
    if (user.enrolled_program) {
        programBadge = `<span class="program-badge ${user.enrolled_program.toLowerCase()}-badge">${user.enrolled_program}</span>`;
    } else if (user.selected_program) {
        // Kullanıcının seçtiği program bilgisi varsa onu göster
        programBadge = `<span class="program-badge ${user.selected_program.toLowerCase()}-badge">${user.selected_program}</span>`;
    } else {
        // Yeni kayıtlar için "Yeni Kayıt" badge'i göster
        programBadge = '<span class="program-badge new-user-badge">Yeni Kayıt</span>';
    }
    
    card.innerHTML = `
        <div class="user-info">
            <div class="user-header">
                <h4>${userName}</h4>
                ${programBadge}
            </div>
            <p>${userEmail}</p>
            <p><strong>Kayıt Tarihi:</strong> ${user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
        </div>
        <div class="user-actions">
            <button onclick="assignToClass('${userId}')" class="btn btn-primary">Sınıf Ata</button>
            <button onclick="viewUserDetails('${userId}')" class="btn btn-secondary">Detaylar</button>
            <button onclick="checkUserClass('${userEmail}')" class="btn btn-success">Sınıf Kontrol</button>
            <button onclick="deleteUser('${userId}', '${userName}')" class="btn btn-danger">Sil</button>
        </div>
    `;
    return card;
}

// Sınıf detaylarını görüntüle
async function viewClassDetails(classId) {
    console.log('Sınıf detayları görüntüleniyor:', classId);
    
    try {
        const adminService = new AdminService();
        const result = await adminService.getClassDetails(classId);
        
        if (result.success) {
            openClassDetailsModal(result.class);
        } else {
            showNotification('Sınıf detayları alınamadı: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Sınıf detayları hatasi:', error);
        showNotification('Sınıf detayları yüklenirken hata oluştu', 'error');
    }
}

// Sınıf ders saatlerini düzenle
async function editClassSchedule(classId) {
    console.log('Sınıf ders saatleri düzenleniyor:', classId);
    
    try {
        const adminService = new AdminService();
        const result = await adminService.getClassDetails(classId);
        
        if (!result.success) {
            showNotification('Sınıf detayları alınamadı', 'error');
            return;
        }
        
        openScheduleEditModal(result.class);
    } catch (error) {
        console.error('Ders programı düzenleme hatasi:', error);
        showNotification('Ders programı düzenleme açılırken hata oluştu', 'error');
    }
}

// Sınıf öğrencilerini yönet
function manageClassStudents(classId) {
    console.log('Sınıf öğrencileri yönetiliyor:', classId);
    openStudentManagementModal(classId);
}

// Öğrenciyi sistemden sil
async function deleteUser(userId, userName) {
    console.log('Öğrenci silme işlemi başlatılıyor:', userId, userName);
    
    // Onay modal'ı göster
    if (!confirm(`${userName} öğrencisini sistemden silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz ve öğrencinin tüm verileri (sınıf kayıtları, ödeme bilgileri) silinecektir.`)) {
        return;
    }
    
    try {
        const adminService = new AdminService();
        const result = await adminService.deleteUser(userId);
        
        if (result.success) {
            showNotification(`${userName} başarıyla sistemden silindi`, 'success');
            
            // Admin panelini yenile
            setTimeout(() => {
                loadAdminData();
            }, 1000);
        } else {
            showNotification('Öğrenci silinirken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Öğrenci silme hatasi:', error);
        showNotification('Öğrenci silinirken hata oluştu', 'error');
    }
}

// Kullanıcıyı sınıfa ata
async function assignToClass(userId) {
    console.log('Kullanıcı sınıfa atanıyor:', userId);
    
    try {
        const adminService = new AdminService();
        const userResult = await adminService.getAllUsers();
        const classResult = await adminService.getAllClasses();
        
        if (!userResult.success || !classResult.success) {
            showNotification('Kullanıcı veya sınıf bilgileri alınamadı', 'error');
            return;
        }
        
        const user = userResult.users.find(u => u.id === userId);
        if (!user) {
            showNotification('Kullanıcı bulunamadı', 'error');
            return;
        }
        
        openClassAssignmentModal(user, classResult.classes);
    } catch (error) {
        console.error('Sınıf atama hatasi:', error);
        showNotification('Sınıf atama açılırken hata oluştu', 'error');
    }
}

// Kullanıcı detaylarını görüntüle
function viewUserDetails(userId) {
    console.log('Kullanıcı detayları görüntüleniyor:', userId);
    openUserDetailsModal(userId);
}

// Bildirim göster
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 5 saniye sonra otomatik kaldır
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Admin panelinden çıkış
function logoutAdmin() {
    if (confirm('Admin panelinden çıkmak istediğinizden emin misiniz?')) {
        window.location.href = '/';
    }
}

// Kullanıcı sınıf bilgilerini kontrol et
async function checkUserClass(email) {
    try {
        console.log('Kullanıcı sınıf bilgileri kontrol ediliyor:', email);
        
        const { data, error } = await window.supabase
            .from('users')
            .select(`
                id,
                name,
                email,
                class_enrollments!inner (
                    enrollment_date,
                    status,
                    classes (
                        class_name,
                        program_type,
                        schedule_type,
                        max_capacity,
                        current_enrollment
                    )
                )
            `)
            .eq('email', email)
            .eq('class_enrollments.status', 'active')
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                console.log('Kullanıcı henüz sinifa kayıtlı değil');
                showNotification(`${email} kullanıcısı henüz sinifa kayıtlı değil`, 'info');
                return;
            }
            console.error('Kullanıcı sınıf bilgisi alınamadı:', error);
            showNotification('Kullanıcı bilgisi alınamadı', 'error');
            return;
        }
        
        console.log('Kullanıcı sınıf bilgileri:', data);
        
        const enrollment = data.class_enrollments[0];
        const classInfo = enrollment.classes;
        
        const message = `
            Kullanıcı: ${data.name} (${data.email})
            Sınıf: ${classInfo.class_name}
            Program Tipi: ${classInfo.schedule_type}
            Kapasite: ${classInfo.current_enrollment}/${classInfo.max_capacity}
            Kayıt Tarihi: ${new Date(enrollment.enrollment_date).toLocaleDateString('tr-TR')}
        `;
        
        showNotification(message, 'success');
        
    } catch (error) {
        console.error('Kullanıcı sınıf kontrolü hatasi:', error);
        showNotification('Kullanıcı kontrolü sırasında hata oluştu', 'error');
    }
}

// Sınıf detayları modalını aç
function openClassDetailsModal(classData) {
    // Modal HTML'ini oluştur
    const modalHTML = `
        <div id="classDetailsModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${classData.class_name} - Ders Programı</h2>
                    <span class="close" onclick="closeClassDetailsModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="class-info-section">
                        <h3>Sınıf Bilgileri</h3>
                        <p><strong>Sınıf Adı:</strong> ${classData.class_name}</p>
                        <p><strong>Program Tipi:</strong> ${classData.program_type}</p>
                        <p><strong>Schedule Tipi:</strong> ${classData.schedule_type}</p>
                        <p><strong>Kapasite:</strong> ${classData.current_enrollment}/${classData.max_capacity}</p>
                        <p><strong>Durum:</strong> ${classData.status}</p>
                    </div>
                    
                    <div class="schedule-section">
                        <h3>Ders Programı (${classData.class_schedules?.length || 0} ders)</h3>
                        <div class="schedule-table">
                            ${generateScheduleTable(classData.class_schedules)}
                        </div>
                    </div>
                    
                    <div class="students-section">
                        <h3>Öğrenciler (${classData.class_enrollments?.filter(e => e.status === 'active').length || 0} öğrenci)</h3>
                        <div class="students-list">
                            ${generateStudentsList(classData.class_enrollments)}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeClassDetailsModal()" class="btn btn-secondary">Kapat</button>
                    <button onclick="editClassSchedule('${classData.id}')" class="btn btn-primary">Ders Saatlerini Düzenle</button>
                </div>
            </div>
        </div>
    `;
    
    // Modal'ı sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Modal'ı göster
    const modal = document.getElementById('classDetailsModal');
    modal.style.display = 'block';
}

// Ders programı tablosunu oluştur
function generateScheduleTable(schedules) {
    if (!schedules || schedules.length === 0) {
        return '<p>Henüz ders programı bulunmuyor.</p>';
    }
    
    // Günlere göre grupla
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const scheduleByDay = {};
    
    days.forEach(day => {
        scheduleByDay[day] = schedules.filter(s => s.day_of_week === day);
    });
    
    let tableHTML = '<table class="schedule-table">';
    tableHTML += '<thead><tr><th>Gün</th><th>Saat</th><th>Ders</th><th>Öğretmen</th><th>Durum</th></tr></thead>';
    tableHTML += '<tbody>';
    
    days.forEach(day => {
        const daySchedules = scheduleByDay[day];
        if (daySchedules && daySchedules.length > 0) {
            daySchedules.forEach((schedule, index) => {
                const rowClass = index === 0 ? 'day-header' : '';
                tableHTML += `
                    <tr class="${rowClass}">
                        ${index === 0 ? `<td rowspan="${daySchedules.length}">${day}</td>` : ''}
                        <td>${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}</td>
                        <td>${schedule.subject}</td>
                        <td>${schedule.teacher_name}</td>
                        <td><span class="status-${schedule.status}">${schedule.status}</span></td>
                    </tr>
                `;
            });
        } else {
            tableHTML += `<tr><td>${day}</td><td colspan="4">Ders yok</td></tr>`;
        }
    });
    
    tableHTML += '</tbody></table>';
    return tableHTML;
}

// Öğrenci listesini oluştur
function generateStudentsList(enrollments) {
    if (!enrollments || enrollments.length === 0) {
        return '<p>Henüz öğrenci bulunmuyor.</p>';
    }
    
    const activeEnrollments = enrollments.filter(e => e.status === 'active');
    
    if (activeEnrollments.length === 0) {
        return '<p>Aktif öğrenci bulunmuyor.</p>';
    }
    
    let listHTML = '<div class="students-grid">';
    activeEnrollments.forEach(enrollment => {
        const user = enrollment.users;
        listHTML += `
            <div class="student-card">
                <h4>${user.name}</h4>
                <p>${user.email}</p>
                <p><strong>Kayıt Tarihi:</strong> ${new Date(enrollment.enrollment_date).toLocaleDateString('tr-TR')}</p>
            </div>
        `;
    });
    listHTML += '</div>';
    
    return listHTML;
}

// Sınıf detayları modalını kapat
function closeClassDetailsModal() {
    const modal = document.getElementById('classDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Modal fonksiyonları (placeholder)
async function openScheduleEditModal(classData) {
    console.log('Ders programı düzenleme modal\'ı açılıyor:', classData);
    
    // Öğretmenleri al
    const adminService = new AdminService();
    const teachersResult = await adminService.getAllTeachers();
    const activeTeachers = teachersResult.success ? teachersResult.teachers.filter(t => t.status === 'active') : [];
    
    // Saat formatını düzenle (saniye varsa kaldır)
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.split(':').slice(0, 2).join(':');
    };
    
    // Günleri sırala
    const dayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const schedules = classData.class_schedules || [];
    
    // Programları günlere göre grupla
    const dayGroups = {};
    dayOrder.forEach(day => {
        dayGroups[day] = schedules.filter(s => s.day_of_week === day);
    });
    
    const scheduleRows = dayOrder.map(day => {
        const daySchedules = dayGroups[day];
        if (!daySchedules || daySchedules.length === 0) {
            return `
                <tr class="day-row">
                    <td class="day-header">${day}</td>
                    <td colspan="5" class="no-classes">Ders yok</td>
                </tr>
            `;
        }
        
        return daySchedules.map((schedule, index) => {
            // Öğretmen seçeneklerini oluştur
            const teacherOptions = activeTeachers.map(teacher => 
                `<option value="${teacher.name}" ${schedule.teacher_name === teacher.name ? 'selected' : ''}>${teacher.name} - ${teacher.branch}</option>`
            ).join('');
            
            return `
                <tr class="schedule-row" data-schedule-id="${schedule.id}">
                    ${index === 0 ? `<td class="day-header" rowspan="${daySchedules.length}">${day}</td>` : ''}
                    <td>
                        <input type="time" class="time-input" value="${formatTime(schedule.start_time)}" 
                               onchange="updateScheduleTime('${schedule.id}', 'start_time', this.value)">
                    </td>
                    <td>
                        <input type="time" class="time-input" value="${formatTime(schedule.end_time)}" 
                               onchange="updateScheduleTime('${schedule.id}', 'end_time', this.value)">
                    </td>
                    <td>
                        <select class="subject-select" onchange="updateScheduleField('${schedule.id}', 'subject', this.value)">
                            <option value="Matematik" ${schedule.subject === 'Matematik' ? 'selected' : ''}>Matematik</option>
                            <option value="Fen Bilgisi" ${schedule.subject === 'Fen Bilgisi' ? 'selected' : ''}>Fen Bilgisi</option>
                            <option value="Türkçe" ${schedule.subject === 'Türkçe' ? 'selected' : ''}>Türkçe</option>
                            <option value="T.C. İnkılap Tarihi" ${schedule.subject === 'T.C. İnkılap Tarihi' ? 'selected' : ''}>T.C. İnkılap Tarihi</option>
                            <option value="Din Kültürü" ${schedule.subject === 'Din Kültürü' ? 'selected' : ''}>Din Kültürü</option>
                            <option value="İngilizce" ${schedule.subject === 'İngilizce' ? 'selected' : ''}>İngilizce</option>
                        </select>
                    </td>
                    <td>
                        <select class="teacher-select" onchange="updateScheduleField('${schedule.id}', 'teacher_name', this.value)">
                            ${teacherOptions}
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteSchedule('${schedule.id}')">Sil</button>
                    </td>
                </tr>
            `;
        }).join('');
    }).join('');
    
    const modalContent = `
        <div class="modal" id="scheduleEditModal" style="display: block;">
            <div class="modal-content" style="max-width: 1200px;">
                <div class="modal-header" style="position: relative;">
                    <h2>${classData.class_name} - Ders Programı Düzenleme</h2>
                    <button class="modal-close" onclick="closeScheduleEditModal()" style="position: absolute; right: 20px; top: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <button class="btn btn-success" onclick="addNewSchedule('${classData.id}')">
                            <i class="fas fa-plus"></i> Yeni Ders Ekle
                        </button>
                    </div>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #1f2937; color: white;">
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Gün</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Başlangıç</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Bitiş</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Ders</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">Öğretmen</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #374151;">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${scheduleRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 20px; text-align: right; border-top: 1px solid #e5e7eb;">
                    <button onclick="closeScheduleEditModal()" class="btn btn-secondary">Kapat</button>
                    <button onclick="saveAllChanges()" class="btn btn-primary">Değişiklikleri Kaydet</button>
                </div>
            </div>
        </div>
    `;
    
    // Modal'ı body'ye ekle
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

async function openStudentManagementModal(classId) {
    console.log('Öğrenci yönetimi modalı açılıyor:', classId);
    
    try {
        const adminService = new AdminService();
        const result = await adminService.getClassDetails(classId);
        
        if (!result.success) {
            showNotification('Sınıf detayları alınamadı', 'error');
            return;
        }
        
        const classData = result.class;
        const enrollments = classData.class_enrollments?.filter(e => e.status === 'active') || [];
        
        // Modal HTML'i oluştur
        const modalHTML = `
            <div class="modal" id="studentManagementModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${classData.class_name} - Öğrenci Yönetimi</h2>
                        <span class="close" onclick="closeStudentManagementModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="class-info-section">
                            <h3>Sınıf Bilgileri</h3>
                            <p><strong>Sınıf Adı:</strong> ${classData.class_name}</p>
                            <p><strong>Program:</strong> ${classData.program_type}</p>
                            <p><strong>Kapasite:</strong> ${enrollments.length}/${classData.max_capacity}</p>
                            <p><strong>Durum:</strong> <span class="status-${classData.status}">${classData.status}</span></p>
                        </div>
                        
                        <div class="students-section">
                            <h3>Kayıtlı Öğrenciler (${enrollments.length})</h3>
                            ${enrollments.length > 0 ? `
                                <div class="students-grid">
                                    ${enrollments.map(enrollment => `
                                        <div class="student-card" data-user-id="${enrollment.user_id}">
                                            <div class="student-header">
                                                <h4>${enrollment.users?.name || 'İsimsiz Öğrenci'}</h4>
                                                <button class="btn btn-danger btn-sm" onclick="removeStudentFromClass('${enrollment.user_id}', '${classData.class_name}')">
                                                    <i class="fas fa-times"></i> Çıkar
                                                </button>
                                            </div>
                                            <div class="student-info">
                                                <p><strong>Email:</strong> ${enrollment.users?.email || 'Email yok'}</p>
                                                <p><strong>Telefon:</strong> ${enrollment.users?.phone || 'Telefon yok'}</p>
                                                <p><strong>Kayıt Tarihi:</strong> ${new Date(enrollment.enrollment_date).toLocaleDateString('tr-TR')}</p>
                                                <p><strong>Program:</strong> 
                                                    <span class="program-badge ${(enrollment.users?.enrolled_program || '').toLowerCase()}-badge">
                                                        ${enrollment.users?.enrolled_program || 'Program Yok'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="no-students">
                                    <p>Bu sınıfta henüz öğrenci bulunmuyor.</p>
                                </div>
                            `}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeStudentManagementModal()">Kapat</button>
                    </div>
                </div>
            </div>
        `;
        
        // Modal'ı sayfaya ekle
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Modal'ı göster
        const modal = document.getElementById('studentManagementModal');
        modal.style.display = 'block';
        
        console.log('Öğrenci yönetimi modalı açıldı');
        
    } catch (error) {
        console.error('Öğrenci yönetimi modalı hatasi:', error);
        showNotification('Öğrenci yönetimi açılırken hata oluştu', 'error');
    }
}

function openClassAssignmentModal(user, classes) {
    console.log('Sınıf atama modal\'ı açılıyor:', user, classes);
    
    // Hangi sayfada olduğumuzu kontrol et ve sınıfları filtrele
    const currentPage = window.location.pathname;
    let programFilter = null;
    
    if (currentPage.includes('admin-lgs.html')) {
        programFilter = 'LGS';
    } else if (currentPage.includes('admin-yks.html')) {
        programFilter = 'YKS';
    }
    
    // Sadece kendi programındaki sınıfları göster
    const filteredClasses = programFilter ? 
        classes.filter(cls => cls.program === programFilter) : 
        classes;
    
    console.log(`Filtrelenmiş sınıflar (${programFilter}):`, filteredClasses);
    
    // Kullanıcının mevcut sınıfını bul
    const currentEnrollment = user.class_enrollments?.find(e => e.status === 'active');
    console.log('Kullanıcının mevcut kayıtları:', user.class_enrollments);
    console.log('Aktif kayıt:', currentEnrollment);
    
    let currentClass = null;
    if (currentEnrollment) {
        currentClass = filteredClasses.find(c => c.id === currentEnrollment.class_id);
        console.log('Mevcut sınıf bulundu:', currentClass);
    }
    
    // Sınıf seçeneklerini oluştur
    const classOptions = filteredClasses.map(cls => {
        const enrollmentCount = cls.class_enrollments?.filter(e => e.status === 'active').length || 0;
        const isCurrentClass = currentClass && currentClass.id === cls.id;
        const isFull = enrollmentCount >= cls.max_capacity;
        
        return `
            <div class="class-option ${isCurrentClass ? 'current-class' : ''} ${isFull ? 'full-class' : ''}" 
                 onclick="${!isFull ? `selectClass('${cls.id}', '${cls.class_name}')` : ''}">
                <div class="class-info">
                    <h4>${cls.class_name}</h4>
                    <p><strong>Program:</strong> ${cls.program_type} - ${cls.schedule_type}</p>
                    <p><strong>Kapasite:</strong> ${enrollmentCount}/${cls.max_capacity}</p>
                    <p><strong>Durum:</strong> ${cls.status}</p>
                </div>
                <div class="class-status">
                    ${isCurrentClass ? '<span class="badge current">Mevcut Sınıf</span>' : ''}
                    ${isFull ? '<span class="badge full">Dolu</span>' : ''}
                    ${!isCurrentClass && !isFull ? '<span class="badge available">Seçilebilir</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    const modalContent = `
        <div class="modal" id="classAssignmentModal" style="display: block;">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header" style="position: relative;">
                    <h2>Öğrenci Sınıf Atama</h2>
                    <button class="modal-close" onclick="closeClassAssignmentModal()" style="position: absolute; right: 20px; top: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div class="user-info-section" style="margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                        <h3>Öğrenci Bilgileri</h3>
                        <p><strong>Ad Soyad:</strong> ${user.name}</p>
                        <p><strong>E-posta:</strong> ${user.email}</p>
                        <p><strong>Kayıt Tarihi:</strong> ${new Date(user.created_at).toLocaleDateString('tr-TR')}</p>
                        ${currentClass ? `<p><strong>Mevcut Sınıf:</strong> ${currentClass.class_name}</p>` : '<p><strong>Mevcut Sınıf:</strong> Henüz sınıfa atanmamış</p>'}
                    </div>
                    
                    <div class="class-selection-section">
                        <h3>Sınıf Seçimi</h3>
                        <div class="class-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 15px;">
                            ${classOptions}
                        </div>
                    </div>
                    
                    <div id="selectedClassInfo" style="margin-top: 20px; display: none;">
                        <div style="padding: 15px; background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px;">
                            <h4>Seçilen Sınıf: <span id="selectedClassName"></span></h4>
                            <p id="selectedClassDetails"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 20px; text-align: right; border-top: 1px solid #e5e7eb;">
                    <button onclick="closeClassAssignmentModal()" class="btn btn-secondary">İptal</button>
                    <button id="assignButton" onclick="confirmClassAssignment()" class="btn btn-primary" style="display: none;">Sınıfa Ata</button>
                </div>
            </div>
        </div>
    `;
    
    // Modal'ı body'ye ekle
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Global değişkenlere kullanıcı ve sınıf bilgilerini kaydet
    window.currentAssignmentUser = user;
    window.currentAssignmentClasses = filteredClasses;
    window.selectedClassId = null;
}

async function openUserDetailsModal(userId) {
    try {
        console.log('Kullanıcı detayları modalı açılıyor:', userId);
        
        const adminService = new AdminService();
        const result = await adminService.getAllUsers();
        
        if (!result.success) {
            showNotification('Kullanıcı bilgileri alınamadı', 'error');
            return;
        }
        
        const user = result.users.find(u => u.id === userId);
        if (!user) {
            showNotification('Kullanıcı bulunamadı', 'error');
            return;
        }
        
        // Kullanıcının sınıf bilgilerini al
        const { data: enrollmentData } = await adminService.supabase
            .from('class_enrollments')
            .select(`
                *,
                classes (
                    class_name,
                    program_type,
                    schedule_type
                )
            `)
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();
        
        // Kullanıcının ödeme bilgilerini al
        const { data: paymentData } = await adminService.supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        const modalContent = `
            <div class="modal" id="userDetailsModal" style="display: block;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header" style="position: relative;">
                        <h2>Kullanıcı Detayları</h2>
                        <button class="modal-close" onclick="closeUserDetailsModal()" style="position: absolute; right: 20px; top: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
                    </div>
                    <div class="modal-body" style="padding: 20px;">
                        <div class="user-info" style="margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
                            <h3>Kişisel Bilgiler</h3>
                            <p><strong>Ad Soyad:</strong> ${user.name || 'Belirtilmemiş'}</p>
                            <p><strong>E-posta:</strong> ${user.email}</p>
                            <p><strong>Telefon:</strong> ${user.phone || 'Belirtilmemiş'}</p>
                            <p><strong>Kayıt Tarihi:</strong> ${user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</p>
                        </div>
                        
                        <div class="enrollment-info" style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px;">
                            <h3>Sınıf Bilgileri</h3>
                            ${enrollmentData ? `
                                <p><strong>Sınıf:</strong> ${enrollmentData.classes.class_name}</p>
                                <p><strong>Program:</strong> ${enrollmentData.classes.program_type}</p>
                                <p><strong>Program Türü:</strong> ${enrollmentData.classes.schedule_type}</p>
                                <p><strong>Kayıt Tarihi:</strong> ${new Date(enrollmentData.enrollment_date).toLocaleDateString('tr-TR')}</p>
                            ` : '<p>Henüz sınıfa kayıtlı değil</p>'}
                        </div>
                        
                        <div class="payment-info" style="padding: 15px; background: #f0fdf4; border-radius: 8px;">
                            <h3>Ödeme Bilgileri</h3>
                            ${paymentData ? `
                                <p><strong>Program:</strong> ${paymentData.program}</p>
                                <p><strong>Tutar:</strong> ${paymentData.price} TL</p>
                                <p><strong>Ödeme Tarihi:</strong> ${new Date(paymentData.created_at).toLocaleDateString('tr-TR')}</p>
                                <p><strong>Durum:</strong> <span style="color: ${paymentData.payment_status === 'completed' ? 'green' : 'orange'}">${paymentData.payment_status}</span></p>
                            ` : '<p>Ödeme bilgisi bulunamadı</p>'}
                        </div>
                    </div>
                    <div class="modal-footer" style="padding: 20px; text-align: right; border-top: 1px solid #e5e7eb;">
                        <button onclick="closeUserDetailsModal()" class="btn btn-secondary">Kapat</button>
                    </div>
                </div>
            </div>
        `;
        
        // Modal'ı body'ye ekle
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
    } catch (error) {
        console.error('Kullanıcı detayları modalı açılırken hata:', error);
        showNotification('Kullanıcı detayları açılırken hata oluştu', 'error');
    }
}

// Kullanıcı detayları modalını kapat
function closeUserDetailsModal() {
    const modal = document.getElementById('userDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Ders programı düzenleme fonksiyonları
let pendingChanges = new Map(); // Bekleyen değişiklikleri sakla

// Saat güncelleme
async function updateScheduleTime(scheduleId, field, value) {
    try {
        console.log(`Saat güncelleniyor: ${scheduleId} - ${field} = ${value}`);
        
        // Mevcut ders bilgilerini al
        const adminService = new AdminService();
        const { data: schedule } = await adminService.supabase
            .from('class_schedules')
            .select('*')
            .eq('id', scheduleId)
            .single();
        
        if (!schedule) {
            showNotification('Ders bilgisi bulunamadı', 'error');
            return;
        }
        
        // Güncellenmiş veriyi hazırla
        const updateData = {
            ...schedule,
            [field]: value
        };
        
        const result = await adminService.updateClassSchedule(scheduleId, updateData);
        
        if (result.success) {
            showNotification('Saat başarıyla güncellendi', 'success');
            pendingChanges.delete(scheduleId);
        } else {
            showNotification('Saat güncellenirken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Saat güncelleme hatasi:', error);
        showNotification('Saat güncellenirken hata oluştu', 'error');
    }
}

// Alan güncelleme (ders, öğretmen)
async function updateScheduleField(scheduleId, field, value) {
    try {
        console.log(`Alan güncelleniyor: ${scheduleId} - ${field} = ${value}`);
        
        // Mevcut ders bilgilerini al
        const adminService = new AdminService();
        const { data: schedule } = await adminService.supabase
            .from('class_schedules')
            .select('*')
            .eq('id', scheduleId)
            .single();
        
        if (!schedule) {
            showNotification('Ders bilgisi bulunamadı', 'error');
            return;
        }
        
        // Güncellenmiş veriyi hazırla
        const updateData = {
            ...schedule,
            [field]: value
        };
        
        const result = await adminService.updateClassSchedule(scheduleId, updateData);
        
        if (result.success) {
            showNotification('Alan başarıyla güncellendi', 'success');
            pendingChanges.delete(scheduleId);
        } else {
            showNotification('Alan güncellenirken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Alan güncelleme hatasi:', error);
        showNotification('Alan güncellenirken hata oluştu', 'error');
    }
}

// Ders silme
async function deleteSchedule(scheduleId) {
    if (!confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        console.log(`Ders siliniyor: ${scheduleId}`);
        
        const adminService = new AdminService();
        const result = await adminService.deleteClassSchedule(scheduleId);
        
        if (result.success) {
            showNotification('Ders başarıyla silindi', 'success');
            // Modal'ı yeniden yükle
            const modal = document.getElementById('scheduleEditModal');
            if (modal) {
                modal.remove();
                // Modal'ı yeniden açmak için sınıf ID'sini bul
                const classId = modal.querySelector('[data-class-id]')?.getAttribute('data-class-id');
                if (classId) {
                    editClassSchedule(classId);
                }
            }
        } else {
            showNotification('Ders silinirken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Ders silme hatasi:', error);
        showNotification('Ders silinirken hata oluştu', 'error');
    }
}

// Yeni ders ekleme
async function addNewSchedule(classId) {
    // Öğretmenleri al
    const adminService = new AdminService();
    const teachersResult = await adminService.getAllTeachers();
    const activeTeachers = teachersResult.success ? teachersResult.teachers.filter(t => t.status === 'active') : [];
    
    const day = prompt('Hangi gün? (Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar)');
    if (!day) return;
    
    const startTime = prompt('Başlangıç saati? (HH:MM formatında)');
    if (!startTime) return;
    
    const endTime = prompt('Bitiş saati? (HH:MM formatında)');
    if (!endTime) return;
    
    const subject = prompt('Ders? (Matematik, Fen Bilgisi, Türkçe, T.C. İnkılap Tarihi, Din Kültürü, İngilizce)');
    if (!subject) return;
    
    // Öğretmen seçeneklerini oluştur
    const teacherOptions = activeTeachers.map(t => `${t.name} - ${t.branch}`).join(', ');
    const teacher = prompt(`Öğretmen? (${teacherOptions})`);
    if (!teacher) return;
    
    try {
        console.log(`Yeni ders ekleniyor: ${classId} - ${day} ${startTime}-${endTime} ${subject} ${teacher}`);
        
        const adminService = new AdminService();
        const result = await adminService.addClassSchedule({
            class_id: classId,
            day_of_week: day,
            start_time: startTime,
            end_time: endTime,
            subject: subject,
            teacher_name: teacher
        });
        
        if (result.success) {
            showNotification('Yeni ders başarıyla eklendi', 'success');
            // Modal'ı yeniden yükle
            const modal = document.getElementById('scheduleEditModal');
            if (modal) {
                modal.remove();
                editClassSchedule(classId);
            }
        } else {
            showNotification('Yeni ders eklenirken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Yeni ders ekleme hatasi:', error);
        showNotification('Yeni ders eklenirken hata oluştu', 'error');
    }
}

// Tüm değişiklikleri kaydet
async function saveAllChanges() {
    if (pendingChanges.size === 0) {
        showNotification('Kaydedilecek değişiklik bulunmuyor', 'info');
        return;
    }
    
    try {
        console.log(`${pendingChanges.size} değişiklik kaydediliyor...`);
        
        const adminService = new AdminService();
        let successCount = 0;
        
        for (const [scheduleId, changes] of pendingChanges) {
            const result = await adminService.updateClassSchedule(scheduleId, changes);
            if (result.success) {
                successCount++;
            }
        }
        
        if (successCount === pendingChanges.size) {
            showNotification('Tüm değişiklikler başarıyla kaydedildi', 'success');
            pendingChanges.clear();
        } else {
            showNotification(`${successCount}/${pendingChanges.size} değişiklik kaydedildi`, 'warning');
        }
    } catch (error) {
        console.error('Değişiklik kaydetme hatasi:', error);
        showNotification('Değişiklikler kaydedilirken hata oluştu', 'error');
    }
}

// Ders programı düzenleme modal'ını kapat
function closeScheduleEditModal() {
    if (pendingChanges.size > 0) {
        if (confirm('Kaydedilmemiş değişiklikler var. Kapatmak istediğinizden emin misiniz?')) {
            pendingChanges.clear();
        } else {
            return;
        }
    }
    
    const modal = document.getElementById('scheduleEditModal');
    if (modal) {
        modal.remove();
    }
}

// Sınıf atama fonksiyonları
function selectClass(classId, className) {
    console.log('Sınıf seçildi:', classId, className);
    
    // Seçilen sınıfı global değişkene kaydet
    window.selectedClassId = classId;
    
    // Seçilen sınıf bilgilerini göster
    const selectedClass = window.currentAssignmentClasses.find(c => c.id === classId);
    const enrollmentCount = selectedClass.class_enrollments?.filter(e => e.status === 'active').length || 0;
    
    document.getElementById('selectedClassName').textContent = className;
    document.getElementById('selectedClassDetails').innerHTML = `
        <strong>Program:</strong> ${selectedClass.program_type} - ${selectedClass.schedule_type}<br>
        <strong>Kapasite:</strong> ${enrollmentCount}/${selectedClass.max_capacity}<br>
        <strong>Durum:</strong> ${selectedClass.status}
    `;
    
    // Seçim bilgisini göster
    document.getElementById('selectedClassInfo').style.display = 'block';
    
    // Atama butonunu göster
    document.getElementById('assignButton').style.display = 'inline-block';
    
    // Tüm sınıf seçeneklerinden seçim stilini kaldır
    document.querySelectorAll('.class-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Seçilen sınıfı vurgula
    const selectedOption = document.querySelector(`[onclick*="${classId}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
}

// Sınıf atamasını onayla
async function confirmClassAssignment() {
    if (!window.selectedClassId || !window.currentAssignmentUser) {
        showNotification('Lütfen bir sınıf seçin', 'error');
        return;
    }
    
    const selectedClass = window.currentAssignmentClasses.find(c => c.id === window.selectedClassId);
    const user = window.currentAssignmentUser;
    
    if (!confirm(`${user.name} öğrencisini ${selectedClass.class_name} sınıfına atamak istediğinizden emin misiniz?`)) {
        return;
    }
    
    try {
        console.log('Sınıf ataması yapılıyor:', user.id, window.selectedClassId);
        
        const adminService = new AdminService();
        
        // Önce mevcut aktif kayıtları pasif yap
        const currentEnrollment = user.class_enrollments?.find(e => e.status === 'active');
        if (currentEnrollment) {
            await adminService.removeUserFromClass(user.id, currentEnrollment.class_id);
        }
        
        // Yeni sınıfa ata
        const result = await adminService.assignUserToClass(user.id, window.selectedClassId);
        
        if (result.success) {
            showNotification(`${user.name} başarıyla ${selectedClass.class_name} sınıfına atandı`, 'success');
            closeClassAssignmentModal();
            
            // Admin panelini yenile
            setTimeout(() => {
                loadAdminData();
            }, 1000);
        } else {
            showNotification('Sınıf ataması yapılırken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Sınıf atama hatasi:', error);
        showNotification('Sınıf ataması yapılırken hata oluştu', 'error');
    }
}

// Sınıf atama modal'ını kapat
function closeClassAssignmentModal() {
    const modal = document.getElementById('classAssignmentModal');
    if (modal) {
        modal.remove();
    }
    
    // Global değişkenleri temizle
    window.currentAssignmentUser = null;
    window.currentAssignmentClasses = null;
    window.selectedClassId = null;
}

// Öğrenci yönetimi modal'ını kapat
function closeStudentManagementModal() {
    const modal = document.getElementById('studentManagementModal');
    if (modal) {
        modal.remove();
    }
}

// Öğrenciyi sınıftan çıkar
async function removeStudentFromClass(userId, className) {
    if (!confirm(`Bu öğrenciyi ${className} sınıfından çıkarmak istediğinizden emin misiniz?`)) {
        return;
    }
    
    try {
        console.log('Öğrenci sınıftan çıkarılıyor:', userId, className);
        
        const adminService = new AdminService();
        
        // Öğrencinin mevcut sınıfını bul
        const userResult = await adminService.getUserClass(userId);
        
        if (!userResult.success) {
            showNotification('Öğrenci bilgileri alınamadı', 'error');
            return;
        }
        
        const currentClass = userResult.class;
        
        if (!currentClass) {
            showNotification('Öğrenci zaten sınıfa kayıtlı değil', 'error');
            return;
        }
        
        // Öğrenciyi sınıftan çıkar
        const result = await adminService.removeUserFromClass(userId, currentClass.class_id);
        
        if (result.success) {
            showNotification('Öğrenci başarıyla sınıftan çıkarıldı', 'success');
            
            // Modal'ı kapat ve yeniden aç
            closeStudentManagementModal();
            
            // Kısa bir süre sonra modal'ı yeniden aç
            setTimeout(() => {
                openStudentManagementModal(currentClass.class_id);
            }, 500);
            
        } else {
            showNotification('Öğrenci çıkarılırken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Öğrenci çıkarma hatasi:', error);
        showNotification('Öğrenci çıkarılırken hata oluştu', 'error');
    }
}

// ==================== ÖĞRETMEN YÖNETİMİ FONKSİYONLARI ====================

// Öğretmen ekleme modal'ını aç
function openAddTeacherModal() {
    const modal = document.getElementById('addTeacherModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Öğretmen ekleme modal'ını kapat
function closeAddTeacherModal() {
    const modal = document.getElementById('addTeacherModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('addTeacherForm').reset();
    }
}

// Öğretmen düzenleme modal'ını aç
function openEditTeacherModal(teacher) {
    const modal = document.getElementById('editTeacherModal');
    if (modal) {
        document.getElementById('editTeacherId').value = teacher.id;
        document.getElementById('editTeacherName').value = teacher.name;
        document.getElementById('editTeacherBranch').value = teacher.branch;
        document.getElementById('editTeacherSpecialties').value = teacher.specialties || '';
        document.getElementById('editTeacherInitial').value = teacher.initial || '';
        document.getElementById('editTeacherStatus').value = teacher.status || 'active';
        document.getElementById('editTeacherZoomLink').value = teacher.zoom_link || '';
        modal.style.display = 'block';
    }
}

// Öğretmen düzenleme modal'ını kapat
function closeEditTeacherModal() {
    const modal = document.getElementById('editTeacherModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('editTeacherForm').reset();
    }
}

// Öğretmen silme modal'ını aç
function openDeleteTeacherModal(teacher) {
    const modal = document.getElementById('deleteTeacherModal');
    if (modal) {
        document.getElementById('deleteTeacherName').textContent = teacher.name;
        document.getElementById('deleteTeacherBranch').textContent = teacher.branch;
        window.currentDeleteTeacher = teacher;
        modal.style.display = 'block';
    }
}

// Öğretmen silme modal'ını kapat
function closeDeleteTeacherModal() {
    const modal = document.getElementById('deleteTeacherModal');
    if (modal) {
        modal.style.display = 'none';
        window.currentDeleteTeacher = null;
    }
}

// Yeni öğretmen kaydet
async function saveTeacher() {
    try {
        const form = document.getElementById('addTeacherForm');
        const formData = new FormData(form);
        
        const teacherData = {
            name: formData.get('name'),
            branch: formData.get('branch'),
            specialties: formData.get('specialties'),
            initial: formData.get('initial'),
            status: formData.get('status'),
            zoom_link: formData.get('zoom_link')
        };

        console.log('Yeni öğretmen kaydediliyor:', teacherData);
        
        const adminService = new AdminService();
        const result = await adminService.addTeacher(teacherData);
        
        if (result.success) {
            showNotification('Öğretmen başarıyla eklendi', 'success');
            closeAddTeacherModal();
            
            // Öğretmen listesini yenile
            await loadTeachers();
            
            // Ana sayfa öğretmen listesini güncelle
            await updateMainPageTeachers();
        } else {
            showNotification('Öğretmen eklenirken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Öğretmen kaydetme hatasi:', error);
        showNotification('Öğretmen kaydedilirken hata oluştu', 'error');
    }
}

// Öğretmen güncelle
async function updateTeacher() {
    try {
        const form = document.getElementById('editTeacherForm');
        const formData = new FormData(form);
        
        const teacherId = formData.get('id');
        const teacherData = {
            name: formData.get('name'),
            branch: formData.get('branch'),
            specialties: formData.get('specialties'),
            initial: formData.get('initial'),
            status: formData.get('status'),
            zoom_link: formData.get('zoom_link')
        };

        console.log('Öğretmen güncelleniyor:', teacherId, teacherData);
        
        const adminService = new AdminService();
        const result = await adminService.updateTeacher(teacherId, teacherData);
        
        if (result.success) {
            showNotification('Öğretmen başarıyla güncellendi', 'success');
            closeEditTeacherModal();
            
            // Öğretmen listesini yenile
            await loadTeachers();
            
            // Ana sayfa öğretmen listesini güncelle
            await updateMainPageTeachers();
        } else {
            showNotification('Öğretmen güncellenirken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Öğretmen güncelleme hatasi:', error);
        showNotification('Öğretmen güncellenirken hata oluştu', 'error');
    }
}

// Öğretmen silme işlemini onayla
async function confirmDeleteTeacher() {
    try {
        const teacher = window.currentDeleteTeacher;
        if (!teacher) {
            showNotification('Öğretmen bilgisi bulunamadı', 'error');
            return;
        }

        console.log('Öğretmen siliniyor:', teacher.id);
        
        const adminService = new AdminService();
        const result = await adminService.deleteTeacher(teacher.id);
        
        if (result.success) {
            showNotification('Öğretmen başarıyla silindi', 'success');
            closeDeleteTeacherModal();
            
            // Öğretmen listesini yenile
            await loadTeachers();
            
            // Ana sayfa öğretmen listesini güncelle
            await updateMainPageTeachers();
        } else {
            showNotification('Öğretmen silinirken hata oluştu: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Öğretmen silme hatasi:', error);
        showNotification('Öğretmen silinirken hata oluştu', 'error');
    }
}

// Öğretmenleri yükle
async function loadTeachers() {
    try {
        console.log('Öğretmenler yükleniyor...');
        
        const adminService = new AdminService();
        const result = await adminService.getAllTeachers();
        
        if (result.success) {
            // Öğretmenleri global olarak sakla
            window.allTeachers = result.teachers;
            
            // Öğretmen seçim listesini güncelle
            updateTeacherSelect(result.teachers);
            
            // Öğretmen programlarını yenile
            await loadTeacherSchedules(adminService);
        } else {
            console.error('Öğretmenler yüklenemedi:', result.error);
        }
    } catch (error) {
        console.error('Öğretmen yükleme hatasi:', error);
    }
}

// Öğretmen seçim listesini güncelle (LGS öğretmenleri)
function updateTeacherSelect(teachers) {
    const teacherSelect = document.getElementById('teacherSelect');
    if (teacherSelect) {
        // Mevcut seçenekleri temizle (ilk seçenek hariç)
        teacherSelect.innerHTML = '<option value="">Tüm Öğretmenler</option>';
        
        // LGS öğretmenlerini filtrele ve ekle
        teachers.filter(teacher => 
            teacher.status === 'active' && 
            (teacher.specialties?.toLowerCase().includes('lgs') || 
             teacher.branch?.toLowerCase().includes('lgs')) &&
            !teacher.branch?.toLowerCase().includes('tyt') &&
            !teacher.branch?.toLowerCase().includes('ayt')
        ).forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.name;
            option.textContent = `${teacher.name} - ${teacher.branch}`;
            teacherSelect.appendChild(option);
        });
    }
}

// Ana sayfa öğretmen listesini güncelle
async function updateMainPageTeachers() {
    try {
        console.log('Ana sayfa öğretmen listesi güncelleniyor...');
        
        const adminService = new AdminService();
        const result = await adminService.getAllTeachers();
        
        if (result.success) {
            // Aktif öğretmenleri filtrele
            const activeTeachers = result.teachers.filter(teacher => teacher.status === 'active');
            
            // Global teachersData'yı güncelle
            window.teachersData = activeTeachers.map(teacher => ({
                name: teacher.name,
                branch: teacher.branch,
                specialties: teacher.specialties ? teacher.specialties.split(',').map(s => s.trim()) : [],
                initial: teacher.initial || teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()
            }));
            
            console.log('Ana sayfa öğretmen listesi güncellendi:', window.teachersData);
        } else {
            console.error('Ana sayfa öğretmen listesi güncellenemedi:', result.error);
        }
    } catch (error) {
        console.error('Ana sayfa öğretmen listesi güncelleme hatasi:', error);
    }
}

// Öğretmen kartına düzenleme ve silme butonları ekle
function createTeacherCardWithActions(teacherName, schedules) {
    // Veritabanından öğretmen bilgilerini al
    const teacher = window.allTeachers?.find(t => t.name === teacherName);
    const teacherInfo = teacher ? { 
        id: teacher.id,
        name: teacher.name,
        subject: teacher.branch,
        branch: teacher.branch,
        specialties: teacher.specialties,
        initial: teacher.initial,
        status: teacher.status,
        zoom_link: teacher.zoom_link
    } : getTeacherInfo(teacherName);
    // Ders saati hesaplama (40 dakika = 1 ders saati)
    const totalLessons = schedules.length; // Her ders 40 dakika
    const totalHours = totalLessons; // 1 ders = 1 ders saati

    return `
        <div class="teacher-card">
            <div class="teacher-header" onclick="showTeacherScheduleModal('${teacherName}', ${JSON.stringify(schedules).replace(/"/g, '&quot;')})" style="cursor: pointer;">
                <div class="teacher-name">${teacherName}</div>
                <div class="teacher-subject">${teacherInfo.subject}</div>
                <div class="teacher-hours">${totalHours} ders saati/hafta</div>
            </div>
            <div class="schedule-content" onclick="showTeacherScheduleModal('${teacherName}', ${JSON.stringify(schedules).replace(/"/g, '&quot;')})" style="cursor: pointer;">
                ${schedules.length > 0 ? schedules.map(schedule => `
                    <div class="day-schedule">
                        <div class="day-title">${getDayName(schedule.day_of_week)}</div>
                        <div class="class-item">
                            <div class="class-time">${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}</div>
                            <div class="class-info">
                                <div class="class-name">${schedule.classes?.class_name || 'Bilinmeyen Sınıf'}</div>
                                <div class="class-type">${schedule.subject}</div>
                            </div>
                        </div>
                    </div>
                `).join('') : '<div class="no-classes">Henüz program bulunmuyor</div>'}
            </div>
            <div class="teacher-actions" style="padding: 15px; border-top: 1px solid #e5e7eb;">
                <button class="btn btn-primary" onclick="event.stopPropagation(); openEditTeacherModal(${JSON.stringify(teacherInfo).replace(/"/g, '&quot;')})" style="margin-right: 10px;">
                    Düzenle
                </button>
                <button class="btn btn-danger" onclick="event.stopPropagation(); openDeleteTeacherModal(${JSON.stringify(teacherInfo).replace(/"/g, '&quot;')})">
                    Sil
                </button>
            </div>
        </div>
    `;
}

// Gün adını getir
function getDayName(dayOfWeek) {
    const dayMap = {
        'monday': 'Pazartesi',
        'tuesday': 'Salı',
        'wednesday': 'Çarşamba',
        'thursday': 'Perşembe',
        'friday': 'Cuma',
        'saturday': 'Cumartesi',
        'sunday': 'Pazar',
        'Pazartesi': 'Pazartesi',
        'Salı': 'Salı',
        'Çarşamba': 'Çarşamba',
        'Perşembe': 'Perşembe',
        'Cuma': 'Cuma',
        'Cumartesi': 'Cumartesi',
        'Pazar': 'Pazar'
    };
    
    return dayMap[dayOfWeek] || dayOfWeek;
}

// Program seçimi fonksiyonları
function openLGSAdmin() {
    window.location.href = 'admin-lgs';
}

function openYKSAdmin() {
    window.location.href = 'admin-yks';
}

function goBackToMainAdmin() {
    window.location.href = 'admin';
}

// Öğretmen programı modal'ını göster
function showTeacherScheduleModal(teacherName, schedules) {
    const teacherInfo = getTeacherInfo(teacherName);
    // Ders saati hesaplama (40 dakika = 1 ders saati)
    const totalLessons = schedules.length; // Her ders 40 dakika
    const totalHours = totalLessons; // 1 ders = 1 ders saati
    
    // Programları günlere göre grupla
    const dayGroups = {};
    schedules.forEach(schedule => {
        const day = schedule.day_of_week;
        if (!dayGroups[day]) {
            dayGroups[day] = [];
        }
        dayGroups[day].push(schedule);
    });
    
    // Günleri sırala
    const dayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const sortedDays = dayOrder.filter(day => dayGroups[day]);
    
    const scheduleTable = sortedDays.map(day => {
        const daySchedules = dayGroups[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
        
        const dayRows = daySchedules.map(schedule => {
            return `
                <tr>
                    <td>${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}</td>
                    <td>${schedule.classes?.class_name || 'Bilinmeyen Sınıf'}</td>
                    <td>${schedule.subject}</td>
                    <td>${schedule.classes?.program_type || '-'}</td>
                    <td>${schedule.classes?.schedule_type || '-'}</td>
                </tr>
            `;
        }).join('');
        
        return `
            <tr class="day-header">
                <td colspan="5" style="background: #f3f4f6; font-weight: bold; text-align: center; padding: 10px;">
                    ${day}
                </td>
            </tr>
            ${dayRows}
        `;
    }).join('');
    
    const modalContent = `
        <div class="modal" id="teacherScheduleModal" style="display: block;">
            <div class="modal-content" style="max-width: 1000px;">
                <div class="modal-header" style="position: relative;">
                    <h2>${teacherName} - Haftalık Program</h2>
                    <button class="modal-close" onclick="closeTeacherScheduleModal()" style="position: absolute; right: 20px; top: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div class="teacher-info" style="margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px;">
                        <h3>Öğretmen Bilgileri</h3>
                        <p><strong>Ad Soyad:</strong> ${teacherName}</p>
                        <p><strong>Branş:</strong> ${teacherInfo.subject}</p>
                        <p><strong>Toplam Ders Saati:</strong> ${totalHours} ders saati/hafta</p>
                    </div>
                    
                    <div class="schedule-table">
                        <h3>Haftalık Ders Programı</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <thead>
                                <tr style="background: #374151; color: white;">
                                    <th style="padding: 12px; text-align: left; border: 1px solid #6b7280;">Saat</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #6b7280;">Sınıf</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #6b7280;">Ders</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #6b7280;">Program Tipi</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #6b7280;">Program Türü</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${scheduleTable}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 20px; text-align: right; border-top: 1px solid #e5e7eb;">
                    <button onclick="closeTeacherScheduleModal()" class="btn btn-secondary">Kapat</button>
                </div>
            </div>
        </div>
    `;
    
    // Modal'ı body'ye ekle
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

// Öğretmen programı modal'ını kapat
function closeTeacherScheduleModal() {
    const modal = document.getElementById('teacherScheduleModal');
    if (modal) {
        modal.remove();
    }
}
