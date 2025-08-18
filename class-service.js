// Class Service - Sınıf sistemi için servisler
class ClassService {
    constructor() {
        this.supabase = window.supabase;
    }

    // Mevcut sınıfları getir
    async getAvailableClasses(programType = 'LGS', scheduleType = null) {
        try {
            console.log('🔍 Mevcut sınıflar aranıyor:', { programType, scheduleType });
            
            let query = this.supabase
                .from('classes')
                .select(`
                    *,
                    class_schedules (
                        day_of_week,
                        start_time,
                        end_time,
                        subject,
                        teacher_name
                    )
                `)
                .eq('program_type', programType)
                .eq('status', 'active');

            if (scheduleType) {
                query = query.eq('schedule_type', scheduleType);
            }

            const { data, error } = await query;

            if (error) {
                console.error('❌ Sınıf listesi alınamadı:', error);
                throw error;
            }

            console.log('✅ Sınıf listesi alındı:', data);
            return { success: true, classes: data };
        } catch (error) {
            console.error('❌ Sınıf listesi hatası:', error);
            return { success: false, error: error.message };
        }
    }

    // Sınıfa kayıt ol
    async enrollToClass(userId, classId) {
        try {
            console.log('📝 Sınıfa kayıt işlemi başlatılıyor:', { userId, classId });

            // Önce sınıfın kapasitesini kontrol et
            const { data: classData, error: classError } = await this.supabase
                .from('classes')
                .select('max_capacity, current_enrollment')
                .eq('id', classId)
                .single();

            if (classError) {
                console.error('❌ Sınıf bilgisi alınamadı:', classError);
                throw classError;
            }

            if (classData.current_enrollment >= classData.max_capacity) {
                throw new Error('Bu sınıf dolu. Başka bir sınıf seçin.');
            }

            // Kullanıcının zaten bu sınıfa kayıtlı olup olmadığını kontrol et
            const { data: existingEnrollment, error: checkError } = await this.supabase
                .from('class_enrollments')
                .select('*')
                .eq('user_id', userId)
                .eq('class_id', classId)
                .eq('status', 'active')
                .single();

            if (existingEnrollment) {
                throw new Error('Bu sınıfa zaten kayıtlısınız.');
            }

            // Sınıfa kayıt ol
            const { data, error } = await this.supabase
                .from('class_enrollments')
                .insert([{
                    user_id: userId,
                    class_id: classId,
                    status: 'active'
                }])
                .select();

            if (error) {
                console.error('❌ Sınıfa kayıt hatası:', error);
                throw error;
            }

            // Sınıfın current_enrollment sayısını güncelle
            const { error: updateEnrollmentError } = await this.supabase
                .from('classes')
                .update({ 
                    current_enrollment: this.supabase.rpc('update_class_enrollment_count', { class_id: classId })
                })
                .eq('id', classId);

            if (updateEnrollmentError) {
                console.error('❌ Sınıf enrollment sayısı güncelleme hatası:', updateEnrollmentError);
                // Ana işlem başarılı olduğu için bu hatayı görmezden gel
            }

            console.log('✅ Sınıfa başarıyla kayıt olundu:', data);
            return { success: true, enrollment: data[0] };
        } catch (error) {
            console.error('❌ Sınıfa kayıt hatası:', error);
            return { success: false, error: error.message };
        }
    }

    // Kullanıcının sınıfını getir
    async getUserClass(userId) {
        try {
            console.log('🔍 Kullanıcının sınıfı aranıyor:', userId);

            const { data, error } = await this.supabase
                .from('class_enrollments')
                .select(`
                    *,
                    classes!inner (
                        *,
                        class_schedules (
                            day_of_week,
                            start_time,
                            end_time,
                            subject,
                            teacher_name,
                            status
                        )
                    )
                `)
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Kullanıcı henüz sınıfa kayıtlı değil
                    console.log('ℹ️ Kullanıcı henüz sınıfa kayıtlı değil');
                    return { success: true, class: null };
                }
                console.error('❌ Kullanıcı sınıfı alınamadı:', error);
                return { success: true, class: null }; // Hata durumunda da null döndür
            }

            console.log('✅ Kullanıcının sınıfı alındı:', data);
            
            // Veri kontrolü
            if (!data || !data.classes || !data.classes.class_schedules) {
                console.warn('⚠️ Sınıf verisi eksik:', data);
                return { success: true, class: null };
            }
            
            return { success: true, class: data };
        } catch (error) {
            console.error('❌ Kullanıcı sınıfı hatası:', error);
            return { success: true, class: null }; // Hata durumunda da null döndür
        }
    }

    // Sınıftan çık
    async leaveClass(userId, classId) {
        try {
            console.log('🚪 Sınıftan çıkış işlemi başlatılıyor:', { userId, classId });

            const { data, error } = await this.supabase
                .from('class_enrollments')
                .update({ status: 'dropped' })
                .eq('user_id', userId)
                .eq('class_id', classId)
                .eq('status', 'active')
                .select();

            if (error) {
                console.error('❌ Sınıftan çıkış hatası:', error);
                throw error;
            }

            // Sınıfın current_enrollment sayısını güncelle
            const { error: updateEnrollmentError } = await this.supabase
                .from('classes')
                .update({ 
                    current_enrollment: this.supabase.rpc('update_class_enrollment_count', { class_id: classId })
                })
                .eq('id', classId);

            if (updateEnrollmentError) {
                console.error('❌ Sınıf enrollment sayısı güncelleme hatası:', updateEnrollmentError);
                // Ana işlem başarılı olduğu için bu hatayı görmezden gel
            }

            console.log('✅ Sınıftan başarıyla çıkıldı:', data);
            return { success: true, result: data[0] };
        } catch (error) {
            console.error('❌ Sınıftan çıkış hatası:', error);
            return { success: false, error: error.message };
        }
    }

    // Sınıf detaylarını getir
    async getClassDetails(classId) {
        try {
            console.log('🔍 Sınıf detayları aranıyor:', classId);

            const { data, error } = await this.supabase
                .from('classes')
                .select(`
                    *,
                    class_schedules (
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
                console.error('❌ Sınıf detayları alınamadı:', error);
                throw error;
            }

            console.log('✅ Sınıf detayları alındı:', data);
            return { success: true, class: data };
        } catch (error) {
            console.error('❌ Sınıf detayları hatası:', error);
            return { success: false, error: error.message };
        }
    }

    // Bugünkü dersleri getir
    async getTodayClasses(userId) {
        try {
            console.log('📅 Bugünkü dersler aranıyor:', userId);

            // Önce kullanıcının sınıfını al
            const userClassResult = await this.getUserClass(userId);
            if (!userClassResult.success || !userClassResult.class) {
                console.log('ℹ️ Kullanıcının sınıfı bulunamadı, boş liste döndürülüyor');
                return { success: true, classes: [] };
            }

            const classSchedules = userClassResult.class.classes.class_schedules || [];
            const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
            
            console.log('📅 Bugün:', today);
            console.log('📅 Mevcut dersler:', classSchedules);
            
            // Gün ismi eşleştirmesi için alternatif kontrol
            const todayClasses = classSchedules.filter(schedule => {
                // Veri kontrolü
                if (!schedule || !schedule.day_of_week || !schedule.start_time) {
                    console.warn('⚠️ Geçersiz ders verisi:', schedule);
                    return false;
                }
                
                const isToday = schedule.day_of_week === today;
                const isActive = schedule.status !== 'cancelled'; // Aktif olmayan dersleri filtrele
                console.log(`📅 Ders kontrolü: ${schedule.day_of_week} === ${today} = ${isToday}, aktif = ${isActive}`);
                return isToday && isActive;
            });

            console.log('✅ Bugünkü dersler alındı:', todayClasses);
            return { success: true, classes: todayClasses };
        } catch (error) {
            console.error('❌ Bugünkü dersler hatası:', error);
            return { success: true, classes: [] };
        }
    }

    // Haftalık programı getir
    async getWeeklySchedule(userId) {
        try {
            console.log('📅 Haftalık program aranıyor:', userId);

            // Önce kullanıcının sınıfını al
            const userClassResult = await this.getUserClass(userId);
            if (!userClassResult.success || !userClassResult.class) {
                console.log('ℹ️ Kullanıcının sınıfı bulunamadı, boş program döndürülüyor');
                return { success: true, schedule: {} };
            }

            const classSchedules = userClassResult.class.classes.class_schedules || [];
            console.log('📅 Tüm ders programı:', classSchedules);
            
            // Günlere göre grupla
            const weeklySchedule = {};
            const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cumartesi', 'Pazar'];
            
            days.forEach(day => {
                const dayClasses = classSchedules
                    .filter(schedule => {
                        // Veri kontrolü
                        if (!schedule || !schedule.day_of_week || !schedule.start_time) {
                            return false;
                        }
                        return schedule.day_of_week === day && schedule.status !== 'cancelled';
                    })
                    .sort((a, b) => a.start_time.localeCompare(b.start_time));
                
                console.log(`📅 ${day} günü dersleri:`, dayClasses);
                weeklySchedule[day] = dayClasses;
            });

            console.log('✅ Haftalık program alındı:', weeklySchedule);
            return { success: true, schedule: weeklySchedule };
        } catch (error) {
            console.error('❌ Haftalık program hatası:', error);
            return { success: true, schedule: {} };
        }
    }
}

// Global olarak export et
window.ClassService = ClassService;
