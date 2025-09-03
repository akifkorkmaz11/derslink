// Dashboard JavaScript - Ayrı dosya
console.log('📱 Dashboard.js yüklendi');

// Global değişkenler
let currentUser = null;
let userProgram = null;

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

// ClassService yüklenmesini bekle
async function waitForClassService() {
    let attempts = 0;
    const maxAttempts = 50; // 5 saniye
    
    while (typeof window.ClassService === 'undefined' && attempts < maxAttempts) {
        console.log('⏳ ClassService yükleniyor... deneme:', attempts + 1, '/', maxAttempts);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (typeof window.ClassService === 'undefined') {
        console.error('❌ ClassService yüklenemedi!');
        return false;
    }
    
    console.log('✅ ClassService yüklendi');
    return true;
}

// Sayfa yüklendikinde
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 Dashboard sayfa yüklendi');
    console.log('🔍 window.supabase mevcut mu?', !!window.supabase);
    console.log('🔍 window.UserService mevcut mu?', !!window.UserService);
    console.log('🔍 window.ClassService mevcut mu?', !!window.ClassService);
    
    // Loading indicator göster
    showLoadingIndicator();
    
    try {
        await checkUserAuthentication();
        if (currentUser) {
            await loadUserData();
            updateCurrentTime();
            setInterval(updateCurrentTime, 1000); // Her saniye güncelle
            setInterval(updateZoomButtons, 30000); // Her 30 saniyede zoom butonlarını güncelle
        }
    } catch (error) {
        console.error('❌ Dashboard initialization hatası:', error);
    } finally {
        hideLoadingIndicator();
    }
});

// Loading indicator göster
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'dashboardLoading';
    loadingDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(102, 126, 234, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-family: 'Poppins', sans-serif;
        ">
            <div style="text-align: center;">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin: 0 auto 20px;
                "></div>
                <h3 style="margin: 0;">Dashboard Yükleniyor...</h3>
                <p style="margin: 10px 0 0; opacity: 0.8;">Sistem bileşenleri hazırlanıyor</p>
            </div>
        </div>
        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loadingDiv);
}

// Loading indicator gizle
function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('dashboardLoading');
    if (loadingDiv) {
        loadingDiv.style.opacity = '0';
        setTimeout(() => {
            loadingDiv.remove();
        }, 300);
    }
}

// Kullanıcı authentication kontrolü
async function checkUserAuthentication() {
    console.log('🔐 checkUserAuthentication başlatılıyor...');
    
    try {
        // Supabase yüklenene kadar bekle
        let attempts = 0;
        const maxAttempts = 100; // 10 saniye
        
        while (!window.supabase && attempts < maxAttempts) {
            console.log('⏳ Supabase yükleniyor... deneme:', attempts + 1, '/', maxAttempts);
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.supabase) {
            console.error('❌ Supabase yüklenemedi!');
            console.log('🔍 Supabase script kontrolü:', !!document.querySelector('script[src*="supabase"]'));
            console.log('🔍 window nesneleri:', Object.keys(window).filter(k => k.includes('supa')));
            
            // Manuel refresh butonu ile daha iyi UX
            const refreshBtn = document.createElement('div');
            refreshBtn.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    text-align: center;
                    z-index: 10000;
                ">
                    <h3 style="color: #ff6b6b; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-triangle"></i> Yükleme Hatası
                    </h3>
                    <p style="margin-bottom: 20px; color: #666;">
                        Sistem bileşenleri yüklenirken sorun oluştu.
                    </p>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 600;
                    ">
                        <i class="fas fa-redo"></i> Sayfayı Yenile
                    </button>
                </div>
            `;
            document.body.appendChild(refreshBtn);
            return;
        }
        
        console.log('✅ Supabase yüklendi, auth kontrol ediliyor...');
        
        // Önce Auth sistemini dene
        try {
            const { data: { user }, error } = await window.supabase.auth.getUser();
            
            console.log('🔐 Auth kontrol sonucu:', { user: !!user, error });
            
            if (error) {
                console.log('⚠️ Auth hatası, database kontrol ediliyor...');
                throw error;
            }
            
            if (user) {
                console.log('✅ Auth kullanıcısı bulundu:', user.email);
                currentUser = user;
                return;
            }
        } catch (authError) {
            console.log('⚠️ Auth başarısız, database kontrol ediliyor...');
        }
        
        // Auth başarısız oldu, localStorage'dan database kullanıcı bilgisini kontrol et
        console.log('🔍 Database kullanıcı kontrol ediliyor...');
        
        // Tab-specific localStorage key'i kontrol et
        const tabId = sessionStorage.getItem('tabId') || 'default';
        const storedUserKey = `databaseUser_${tabId}`;
        const storedUser = localStorage.getItem(storedUserKey) || localStorage.getItem('databaseUser');
        
        console.log('🔍 Aranan localStorage key:', storedUserKey);
        console.log('🔍 Stored user mevcut mu:', !!storedUser);
        
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                console.log('✅ Database kullanıcı bulundu:', userData);
                currentUser = userData;
                return;
            } catch (parseError) {
                console.error('❌ Stored user parse hatası:', parseError);
                localStorage.removeItem(storedUserKey);
                localStorage.removeItem('databaseUser');
            }
        }
        
        // Hiçbir kullanıcı bulunamadı
        console.log('❌ Kullanıcı giriş yapmamış, ana sayfaya yönlendiriliyor...');
        
        // Kullanıcıya daha iyi bir mesaj göster
        const loginPrompt = document.createElement('div');
        loginPrompt.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                text-align: center;
                z-index: 10000;
                max-width: 400px;
            ">
                <h3 style="color: #667eea; margin-bottom: 15px;">
                    <i class="fas fa-user-lock"></i> Giriş Gerekli
                </h3>
                <p style="margin-bottom: 20px; color: #666;">
                    Dashboard'a erişmek için giriş yapmanız gerekiyor.
                </p>
                <button onclick="window.location.href='/'" style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    margin-right: 10px;
                ">
                    <i class="fas fa-sign-in-alt"></i> Giriş Yap
                </button>
                <button onclick="location.reload()" style="
                    background: #f8f9fa;
                    color: #667eea;
                    border: 2px solid #667eea;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    <i class="fas fa-redo"></i> Yenile
                </button>
            </div>
        `;
        document.body.appendChild(loginPrompt);
        
        // 5 saniye sonra otomatik yönlendir
        setTimeout(() => {
            window.location.href = '/';
        }, 5000);
        
    } catch (error) {
        console.error('❌ Auth kontrol hatası:', error);
        alert('Giriş kontrolü yapılamadı: ' + error.message);
        window.location.href = '/';
    }
}

// Kullanıcı verilerini yükle
async function loadUserData() {
    console.log('🔄 loadUserData başlatılıyor...');
    console.log('👤 currentUser:', currentUser);
    
    try {
        // Users tablosundan kullanıcı bilgilerini al
        console.log('📊 Users tablosundan veri alınıyor, email:', currentUser.email);
        
        let userData = null;
        let userError = null;
        
        // Database kullanıcısı ise zaten bilgileri var
        if (currentUser.name) {
            console.log('✅ Database kullanıcısı, mevcut bilgiler kullanılıyor');
            userData = currentUser;
        } else {
            // Auth kullanıcısı ise database'den al
            const { data: dbUserData, error: dbUserError } = await window.supabase
                .from('users')
                .select('*')
                .eq('email', currentUser.email)
                .single();
            
            userData = dbUserData;
            userError = dbUserError;
        }

        console.log('📊 Users sorgu sonucu:', { userData, userError });

        let userName;
        if (userError) {
            console.warn('⚠️ Kullanıcı verisi alınamadı:', userError);
            userName = currentUser.email.split('@')[0];
        } else {
            console.log('✅ Kullanıcı verisi alındı:', userData);
            userName = userData.name || currentUser.email.split('@')[0];
        }
        
        // Navbar'daki bilgileri güncelle
        document.getElementById('userName').textContent = userName;
        const firstLetter = userName.charAt(0).toUpperCase();
        document.getElementById('userAvatar').textContent = firstLetter;
        
        // Hero section'daki hoş geldin mesajını güncelle
        document.getElementById('userNameDisplay').textContent = `Hoş geldin, ${userName}!`;

        // Payments tablosundan program bilgisini al - ÖNCE EMAIL İLE DENE
        console.log('💳 Payments tablosundan veri alınıyor, email ile...');
        console.log('📧 Aranacak email:', currentUser.email);
        
        // 1. Önce email ile payment ara (daha güvenilir)
        const { data: paymentByEmail, error: emailPaymentError } = await window.supabase
            .from('payments')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(1);
        
        console.log('💳 Email ile payment sorgusu:', { paymentByEmail, emailPaymentError });
        
        let paymentData = null;
        
        // 2. Eğer email ile bulunamazsa, user_id ile dene
        if (!paymentByEmail || paymentByEmail.length === 0) {
            console.log('🔍 Email ile payment bulunamadı, user_id ile deneniyor...');
            console.log('🔍 Aranan user_id:', currentUser.id);
            
            const { data: paymentDataResult, error: paymentError } = await window.supabase
                .from('payments')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(1);

            console.log('💳 User ID ile payment sorgusu:', { paymentDataResult, paymentError });
            
            if (paymentError || !paymentDataResult || paymentDataResult.length === 0) {
                console.warn('⚠️ Her iki yöntemle de payment verisi bulunamadı');
                console.log('🔍 DEBUG: currentUser:', currentUser);
                
                // 3. Son çare: tüm payments tablosunu kontrol et
                const { data: allPayments, error: allPaymentsError } = await window.supabase
                    .from('payments')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(10);
                
                console.log('🔍 DEBUG: Son 10 payment:', allPayments);
                console.log('🔍 DEBUG: All payments error:', allPaymentsError);
                
                // Fallback: demo program göster
                document.getElementById('userProgramDisplay').innerHTML = `
                    <i class="fas fa-graduation-cap"></i>
                    Demo Programı - Veri Bulunamadı
                `;
                
                const fallbackSchedule = getScheduleForProgram('YKS', 'karma');
                updateClassCounts(fallbackSchedule);
                displayTodayClasses(fallbackSchedule);
                displayWeeklyTable(fallbackSchedule);
                return;
            } else {
                paymentData = paymentDataResult[0];
                console.log('✅ User ID ile payment bulundu:', paymentData);
            }
        } else {
            paymentData = paymentByEmail[0];
            console.log('✅ Email ile payment bulundu:', paymentData);
        }

        // Program bilgisini ayarla
        const program = paymentData.program; // LGS, YKS, vs.
        userProgram = program;
        
        console.log('📘 Program bilgisi:', program);
        
        // Program detaylarını güncelle
        updateProgramInfo(program);
        
        // LGS ve YKS kullanıcıları için sınıf sistemini kullan
        if (program === 'LGS' || program === 'YKS') {
            console.log(`🎓 ${program} kullanıcısı tespit edildi`);
            
            // ClassService'i bekle
            const classServiceReady = await waitForClassService();
            
            if (classServiceReady) {
                console.log('✅ ClassService hazır, sınıf sistemi kullanılıyor');
                try {
                    await loadClassSchedule();
                } catch (error) {
                    console.error('❌ Sınıf sistemi hatası, fallback kullanılıyor:', error);
                    const schedule = getScheduleForProgram(program, paymentData.schedule);
                    updateClassCounts(schedule);
                    displayTodayClasses(schedule);
                    displayWeeklyTable(schedule);
                }
            } else {
                console.warn('⚠️ ClassService yüklenemedi, eski sistem kullanılıyor');
                const schedule = getScheduleForProgram(program, paymentData.schedule);
                updateClassCounts(schedule);
                displayTodayClasses(schedule);
                displayWeeklyTable(schedule);
            }
        } else {
            // Diğer programlar için eski sistemi kullan
            console.log('📚 Diğer program kullanıcısı, eski sistem kullanılıyor');
            const schedule = getScheduleForProgram(program, paymentData.schedule);
            updateClassCounts(schedule);
            displayTodayClasses(schedule);
            displayWeeklyTable(schedule);
        }

    } catch (error) {
        console.error('❌ Veri yükleme hatası:', error);
        
        // Element mevcut mu kontrol et
        const userProgramElement = document.getElementById('userProgramDisplay');
        if (userProgramElement) {
            userProgramElement.innerHTML = `
                <i class="fas fa-times-circle"></i>
                Veri yüklenemedi
            `;
        }
        
        // Hata durumunda da demo program göster
        const fallbackSchedule = getScheduleForProgram('YKS', 'karma');
        updateClassCounts(fallbackSchedule);
        displayTodayClasses(fallbackSchedule);
        displayWeeklyTable(fallbackSchedule);
    }
}

// Sınıf programını yükle
async function loadClassSchedule() {
    try {
        console.log('🎓 Sınıf programı yükleniyor...');
        
        if (typeof window.ClassService === 'undefined') {
            console.error('❌ ClassService bulunamadı');
            // Basit LGS programı göster
            const fallbackSchedule = getScheduleForProgram('LGS', 'karma');
            updateClassCounts(fallbackSchedule);
            displayTodayClasses(fallbackSchedule);
            displayWeeklyTable(fallbackSchedule);
            return;
        }
        
        // Kullanıcının sınıfını al - database ID'sini kullan
        const classService = new window.ClassService();
        
        // Database ID'sini al
        let databaseUserId = currentUser.id;
        if (currentUser.name) {
            // Database kullanıcısı ise ID'si doğru
            databaseUserId = currentUser.id;
        } else {
            // Auth kullanıcısı ise database'den ID'sini al
            const { data: userData } = await window.supabase
                .from('users')
                .select('id')
                .eq('email', currentUser.email)
                .single();
            
            if (userData) {
                databaseUserId = userData.id;
                console.log('🔄 Database ID kullanılıyor:', databaseUserId);
            }
        }
        
        const userClassResult = await classService.getUserClass(databaseUserId);
        
        if (!userClassResult.success) {
            console.error('❌ Kullanıcı sınıfı alınamadı:', userClassResult.error);
            // Kullanıcının programına göre fallback göster
            const fallbackSchedule = getScheduleForProgram(userProgram, 'karma');
            updateClassCounts(fallbackSchedule);
            displayTodayClasses(fallbackSchedule);
            displayWeeklyTable(fallbackSchedule);
            return;
        }

        // Sınıf verisi kontrolü
        if (!userClassResult.class || !userClassResult.class.classes) {
            console.warn('⚠️ Kullanıcının sınıf verisi eksik, henüz sınıfa atanmamış');
            
            // Kullanıcı henüz sınıfa atanmamış, fallback göster
            const fallbackSchedule = getScheduleForProgram(userProgram, 'karma');
            updateClassCounts(fallbackSchedule);
            displayTodayClasses(fallbackSchedule);
            displayWeeklyTable(fallbackSchedule);
            return;
        }
        
        if (!userClassResult.class) {
            console.log('ℹ️ Kullanıcı henüz sınıfa kayıtlı değil');
            // Kullanıcının programına göre fallback göster
            const fallbackSchedule = getScheduleForProgram(userProgram, 'karma');
            updateClassCounts(fallbackSchedule);
            displayTodayClasses(fallbackSchedule);
            displayWeeklyTable(fallbackSchedule);
            return;
        }
        
        const classData = userClassResult.class.classes;
        console.log('✅ Kullanıcının sınıfı:', classData);
        console.log('🔍 Sınıf detayları:', {
            class_name: classData?.class_name,
            program_type: classData?.program_type,
            schedule_type: classData?.schedule_type,
            current_enrollment: classData?.current_enrollment,
            max_capacity: classData?.max_capacity
        });
        console.log('🔍 Tam sınıf objesi:', JSON.stringify(classData, null, 2));
        
        // Kullanıcı zaten bir sınıfa atanmış, bekleme listesine ekleme yapmaya gerek yok
        console.log('✅ Kullanıcı zaten sınıfa atanmış:', classData.class_name);
        
        // Veri kontrolü
        if (!classData || !classData.class_name) {
            console.warn('⚠️ Sınıf verisi eksik, fallback kullanılıyor');
            const fallbackSchedule = getScheduleForProgram(userProgram, 'karma');
            updateClassCounts(fallbackSchedule);
            displayTodayClasses(fallbackSchedule);
            displayWeeklyTable(fallbackSchedule);
            return;
        }
        
        // Sınıf bilgisini güncelle
        const scheduleTypeText = classData.schedule_type === 'hafta-ici' ? 'Hafta İçi' : 
                                classData.schedule_type === 'hafta-sonu' ? 'Hafta Sonu' : 'Karma';
        
        document.getElementById('userProgramDisplay').innerHTML = `
            <i class="fas fa-graduation-cap"></i>
            ${classData.class_name}
        `;
        
        // Bugünkü dersleri göster
        const todayClassesResult = await classService.getTodayClasses(databaseUserId);
        if (todayClassesResult.success) {
            console.log('✅ Bugünkü dersler alındı:', todayClassesResult.classes);
            displayTodayClasses(todayClassesResult.classes);
        } else {
            console.warn('⚠️ Bugünkü dersler alınamadı, boş liste gösteriliyor');
            displayTodayClasses([]);
        }
        
        // Haftalık programı göster
        const weeklyScheduleResult = await classService.getWeeklySchedule(databaseUserId);
        if (weeklyScheduleResult.success) {
            displayWeeklyTable(weeklyScheduleResult.schedule);
            updateClassCounts(weeklyScheduleResult.schedule);
        } else {
            console.warn('⚠️ Haftalık program alınamadı, boş program gösteriliyor');
            displayWeeklyTable({});
            updateClassCounts({});
        }
        
    } catch (error) {
        console.error('❌ Sınıf programı yükleme hatası:', error);
        // Hata durumunda kullanıcının programına göre fallback göster
        const fallbackSchedule = getScheduleForProgram(userProgram, 'karma');
        updateClassCounts(fallbackSchedule);
        displayTodayClasses(fallbackSchedule);
        displayWeeklyTable(fallbackSchedule);
    }
}

// Program bilgisini güncelle
function updateProgramInfo(program) {
    const programNames = {
        'LGS': 'LGS Hazırlık Programı',
        'YKS': 'YKS - TYT - AYT Programı'
    };
    
    document.getElementById('userProgramDisplay').innerHTML = `
        <i class="fas fa-graduation-cap"></i>
        ${programNames[program] || program}
    `;
}

// Bugünkü dersleri göster
function displayTodayClasses(schedule) {
    const todayContainer = document.getElementById('todayClasses');
    
    // Eğer schedule bir array ise (sınıf verisi), direkt kullan
    if (Array.isArray(schedule)) {
        console.log('📅 Sınıf dersleri gösteriliyor:', schedule);
        
        if (schedule.length === 0) {
            todayContainer.innerHTML = `
                <div class="class-card">
                    <div class="class-time">🛌</div>
                    <div class="class-subject">Bugün Ders Yok</div>
                    <div class="class-status passed">Dinlenme Günü</div>
                    <p style="color: #6b7280; text-align: center; margin: 0;">
                        Bugün ders programında ders bulunmuyor. Dinlenme ve tekrar günü.
                    </p>
                </div>
            `;
            return;
        }
        
        // Sınıf derslerini göster
        todayContainer.innerHTML = '';
        schedule.forEach(classItem => {
            console.log('📅 Ders kartı oluşturuluyor:', classItem);
            
            // Veri kontrolü
            if (!classItem || !classItem.subject) {
                console.warn('⚠️ Geçersiz ders verisi:', classItem);
                return;
            }
            
            // Sınıf verisi için durum hesaplama
            const status = getClassStatus(classItem.start_time, new Date());
            const classCard = createClassCard(
                classItem.subject || 'Bilinmeyen Ders', 
                classItem.teacher_name || 'Bilinmeyen Öğretmen', 
                formatTime(classItem.start_time) || '00:00', 
                formatTime(classItem.end_time) || '00:00', 
                status
            );
            todayContainer.appendChild(classCard);
        });
        return;
    }
    
    // Eski sistem (schedule objesi)
    const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
    const todayData = schedule[today];
    
    console.log('📅 Bugünkü dersler gösteriliyor:', { today, todayData });
    
    if (!todayData || !todayData.totalHours) {
        todayContainer.innerHTML = `
            <div class="class-card">
                <div class="class-time">🛌</div>
                <div class="class-subject">Bugün Ders Yok</div>
                <div class="class-status passed">Dinlenme Günü</div>
                <p style="color: #6b7280; text-align: center; margin: 0;">
                    Bugün ders programında ders bulunmuyor. Dinlenme ve tekrar günü.
                </p>
            </div>
        `;
        return;
    }
    
    // Bugünkü dersleri oluştur
    const classTimes = generateClassTimes(today, todayData.totalHours, todayData.classes);
    const currentTime = new Date();
    
    todayContainer.innerHTML = '';
    
    // Sadece ders saatlerini göster (teneffüsleri değil)
    const classes = classTimes.filter(item => item.type === 'class');
    
    classes.forEach((classItem, index) => {
        const status = getClassStatus(classItem.time, currentTime);
        
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        
        classCard.innerHTML = `
            <div class="class-time">${classItem.time}</div>
            <div class="class-subject">${classItem.subject}</div>
            <div class="class-teacher">
                <i class="fas fa-user-tie"></i>
                ${classItem.teacher}
            </div>
            <div class="class-status ${status.statusClass}">${status.statusText}</div>
            <button class="class-join-btn ${status.buttonClass}" 
                    onclick="openJoinModal('${classItem.subject}', '${classItem.teacher}', '${classItem.time}', '${today.toLowerCase()}-${index}')"
                    ${status.disabled ? 'disabled' : ''}>
                <i class="fas fa-${status.icon}"></i>
                ${status.buttonText}
            </button>
        `;
        
        todayContainer.appendChild(classCard);
    });
}

// Ders kartı oluştur
function createClassCard(subject, teacher, startTime, endTime, status) {
    const card = document.createElement('div');
    card.className = 'class-card';
    
    const statusClass = status === 'current' ? 'current' : 
                       status === 'upcoming' ? 'upcoming' : 
                       status === 'passed' ? 'passed' : 'upcoming';
    
    const statusText = status === 'current' ? 'Şu An' : 
                      status === 'upcoming' ? 'Yakında' : 
                      status === 'passed' ? 'Tamamlandı' : 'Yakında';
    
    const statusIcon = status === 'current' ? '🎯' : 
                      status === 'upcoming' ? '⏰' : 
                      status === 'passed' ? '✅' : '⏰';
    
    // HTML injection'ı önle
    const safeSubject = subject.replace(/[<>]/g, '');
    const safeTeacher = teacher.replace(/[<>]/g, '');
    const safeStartTime = startTime.replace(/[<>]/g, '');
    const safeEndTime = endTime.replace(/[<>]/g, '');
    
    // Zoom linkinin aktif olup olmadığını kontrol et
    const isZoomActive = isZoomLinkActive(startTime, status);
    
    card.innerHTML = `
        <div class="class-time">${safeStartTime} - ${safeEndTime}</div>
        <div class="class-subject">${safeSubject}</div>
        <div class="class-teacher">👨‍🏫 ${safeTeacher}</div>
        <div class="class-status ${statusClass}">
            ${statusIcon} ${statusText}
        </div>
        <button class="join-btn ${isZoomActive ? 'active' : 'disabled'}" 
                onclick="${isZoomActive ? `openJoinModal('${safeSubject}', '${safeTeacher}', '${safeStartTime}', 'demo-meeting').catch(console.error)` : 'showZoomNotActiveMessage()'}"
                ${!isZoomActive ? 'disabled' : ''}>
            <i class="fas fa-video"></i> ${isZoomActive ? 'Katıl' : '15 dk kala aktif'}
        </button>
    `;
    
    return card;
}

// Ders durumunu kontrol et
function getClassStatus(classTime, currentTime) {
    // Veri kontrolü
    if (!classTime || typeof classTime !== 'string') {
        console.warn('⚠️ Geçersiz saat formatı:', classTime);
        return 'upcoming';
    }
    
    try {
        const [hour, minute] = classTime.split(':').map(Number);
        
        // Saat kontrolü
        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            console.warn('⚠️ Geçersiz saat değerleri:', { hour, minute });
            return 'upcoming';
        }
        
        // Bugünün tarihini al
        const today = new Date();
        const classStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute, 0, 0);
        
        const classEnd = new Date(classStart);
        classEnd.setMinutes(classEnd.getMinutes() + 40);
        
        const now = currentTime.getTime();
        
        // Ders şu an devam ediyor
        if (now >= classStart.getTime() && now <= classEnd.getTime()) {
            return 'current';
        }
        
        // Ders geçti
        if (now > classEnd.getTime()) {
            return 'passed';
        }
        
        // Ders henüz zamanı gelmedi
        return 'upcoming';
    } catch (error) {
        console.error('❌ Saat hesaplama hatası:', error);
        return 'upcoming';
    }
}

// Zoom linkinin aktif olup olmadığını kontrol et
function isZoomLinkActive(startTime, status) {
    // Eğer ders geçmişse zoom linki aktif değil
    if (status === 'passed') {
        return false;
    }
    
    // Eğer ders şu an devam ediyorsa zoom linki aktif
    if (status === 'current') {
        return true;
    }
    
    // Eğer ders henüz gelmediyse, 15 dakika kala kontrol et
    if (status === 'upcoming') {
        try {
            const [hour, minute] = startTime.split(':').map(Number);
            
            // Bugünün tarihini al
            const today = new Date();
            const classStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute, 0, 0);
            
            // 15 dakika öncesini hesapla
            const zoomActivationTime = new Date(classStart);
            zoomActivationTime.setMinutes(zoomActivationTime.getMinutes() - 15);
            
            const now = new Date();
            
            // Şu an zoom aktivasyon zamanından sonra mı?
            return now >= zoomActivationTime;
        } catch (error) {
            console.error('❌ Zoom aktivasyon kontrolü hatası:', error);
            return false;
        }
    }
    
    return false;
}

// Zoom linki henüz aktif değil mesajı göster
function showZoomNotActiveMessage() {
    showNotification('Zoom linki derse 15 dakika kala aktif olacak', 'info');
}

// Zoom butonlarını güncelle
function updateZoomButtons() {
    const joinButtons = document.querySelectorAll('.join-btn');
    const currentTime = new Date();
    
    joinButtons.forEach(button => {
        const card = button.closest('.class-card');
        if (!card) return;
        
        const timeElement = card.querySelector('.class-time');
        if (!timeElement) return;
        
        const timeText = timeElement.textContent;
        const startTime = timeText.split(' - ')[0];
        
        // Ders durumunu kontrol et
        const status = getClassStatus(startTime, currentTime);
        
        // Zoom linkinin aktif olup olmadığını kontrol et
        const isZoomActive = isZoomLinkActive(startTime, status);
        
        // Buton durumunu güncelle
        if (isZoomActive) {
            button.classList.remove('disabled');
            button.classList.add('active');
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-video"></i> Katıl';
            
            // Onclick fonksiyonunu güncelle
            const subject = card.querySelector('.class-subject').textContent;
            const teacher = card.querySelector('.class-teacher').textContent.replace('👨‍🏫 ', '');
            button.onclick = () => openJoinModal(subject, teacher, startTime, 'demo-meeting').catch(console.error);
        } else {
            button.classList.remove('active');
            button.classList.add('disabled');
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-video"></i> 15 dk kala aktif';
            button.onclick = showZoomNotActiveMessage;
        }
    });
}

// Haftalık program tablosunu göster
function displayWeeklyTable(schedule) {
    const tableContainer = document.getElementById('scheduleTable');
    const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
    
    console.log('📊 Haftalık tablo gösteriliyor:', { schedule, today });
    
    // Eğer schedule bir obje ise (sınıf verisi), direkt kullan
    if (schedule && typeof schedule === 'object' && !Array.isArray(schedule)) {
        const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
        
        // Tüm saatleri topla
        const allTimeSlots = new Set();
        dayNames.forEach(day => {
                            if (schedule[day] && Array.isArray(schedule[day])) {
                    schedule[day].forEach(classItem => {
                        allTimeSlots.add(formatTime(classItem.start_time));
                    });
                }
        });
        
        const timeSlots = Array.from(allTimeSlots).sort();
        
        // Tablo oluştur
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Saat</th>
                        ${dayNames.map(day => `<th>${day}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;
        
        timeSlots.forEach(timeSlot => {
            tableHTML += `<tr>`;
            tableHTML += `<td class="time-slot">${formatTime(timeSlot)}</td>`;
            
            dayNames.forEach(day => {
                const isToday = day === today;
                let cellContent = '<span class="no-class">-</span>';
                let cellClass = 'class-cell';
                
                if (schedule[day] && Array.isArray(schedule[day])) {
                    const matchingClass = schedule[day].find(classItem => 
                        classItem && formatTime(classItem.start_time) === timeSlot
                    );
                    if (matchingClass && matchingClass.subject) {
                        cellContent = `
                            <div style="font-weight: 600; margin-bottom: 4px;">${matchingClass.subject}</div>
                            <div style="font-size: 0.75rem; color: #6b7280;">${matchingClass.teacher_name || 'Bilinmeyen'}</div>
                        `;
                        if (isToday) {
                            cellClass += ' today';
                        }
                    }
                }
                
                tableHTML += `<td class="${cellClass}">${cellContent}</td>`;
            });
            
            tableHTML += `</tr>`;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
        return;
    }
    
    // Eski sistem (schedule objesi)
    // Saatleri hesapla - en erken ve en geç saatleri bul
    const timeSlots = [];
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    
    // Her günün derslerini kontrol et ve zaman dilimlerini oluştur
    dayNames.forEach(day => {
        const dayData = schedule[day];
        if (dayData && dayData.totalHours) {
            const classTimes = generateClassTimes(day, dayData.totalHours, dayData.classes);
            const classes = classTimes.filter(item => item.type === 'class');
            
            classes.forEach(classItem => {
                const formattedTime = formatTime(classItem.time);
                if (!timeSlots.includes(formattedTime)) {
                    timeSlots.push(formattedTime);
                }
            });
        }
    });
    
    // Saatleri sırala
    timeSlots.sort();
    
    // Tablo oluştur
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Saat</th>
                    ${dayNames.map(day => `<th>${day}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;
    
    timeSlots.forEach(timeSlot => {
        tableHTML += `<tr>`;
        tableHTML += `<td class="time-slot">${timeSlot}</td>`;
        
        dayNames.forEach(day => {
            const dayData = schedule[day];
            const isToday = day === today;
            let cellContent = '<span class="no-class">-</span>';
            let cellClass = 'class-cell';
            
            if (dayData && dayData.totalHours) {
                const classTimes = generateClassTimes(day, dayData.totalHours, dayData.classes);
                const classes = classTimes.filter(item => item.type === 'class');
                
                const matchingClass = classes.find(classItem => classItem.time === timeSlot);
                if (matchingClass) {
                    cellContent = `
                        <div style="font-weight: 600; margin-bottom: 4px;">${matchingClass.subject}</div>
                        <div style="font-size: 0.75rem; color: #6b7280;">${matchingClass.teacher}</div>
                    `;
                    if (isToday) {
                        cellClass += ' today';
                    }
                }
            }
            
            tableHTML += `<td class="${cellClass}">${cellContent}</td>`;
        });
        
        tableHTML += `</tr>`;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

// Schedule'u programdan al
function getScheduleForProgram(program, scheduleType) {
    const programSchedules = {
        'LGS': {
            'hafta-ici': {
                'Pazartesi': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Zeynep Sarı' },
                        { subject: 'Fen Bilgisi', teacher: 'Zülküf Memiş' },
                        { subject: 'Türkçe', teacher: 'Serhat Dede' }
                    ]
                },
                'Salı': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' },
                        { subject: 'Fen Bilgisi', teacher: 'Kağan Şahin' },
                        { subject: 'Türkçe', teacher: 'Ayşegül Karamık' }
                    ]
                },
                'Çarşamba': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Zeynep Sarı' },
                        { subject: 'Fen Bilgisi', teacher: 'Zülküf Memiş' },
                        { subject: 'Türkçe', teacher: 'Serhat Dede' }
                    ]
                },
                'Perşembe': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' },
                        { subject: 'Fen Bilgisi', teacher: 'Kağan Şahin' },
                        { subject: 'Türkçe', teacher: 'Ayşegül Karamık' }
                    ]
                },
                'Cuma': null,
                'Cumartesi': null,
                'Pazar': null
            },
            'hafta-sonu': {
                'Pazartesi': null,
                'Salı': null,
                'Çarşamba': null,
                'Perşembe': null,
                'Cuma': null,
                'Cumartesi': { 
                    totalHours: 6, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Zeynep Sarı' },
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' },
                        { subject: 'Fen Bilgisi', teacher: 'Zülküf Memiş' },
                        { subject: 'Fen Bilgisi', teacher: 'Kağan Şahin' },
                        { subject: 'Türkçe', teacher: 'Serhat Dede' },
                        { subject: 'Türkçe', teacher: 'Ayşegül Karamık' }
                    ]
                },
                'Pazar': { 
                    totalHours: 6, 
                    classes: [
                        { subject: 'T.C. İnkılap Tarihi', teacher: 'Menekşe Nur Sucu' },
                        { subject: 'Din Kültürü', teacher: 'İshak Bilgin' },
                        { subject: 'İngilizce', teacher: 'Sevde İrem Gidek' },
                        { subject: 'Matematik', teacher: 'Zeynep Sarı' },
                        { subject: 'Fen Bilgisi', teacher: 'Zülküf Memiş' },
                        { subject: 'Türkçe', teacher: 'Serhat Dede' }
                    ]
                }
            },
            'karma': {
                'Pazartesi': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Zeynep Sarı' },
                        { subject: 'Fen Bilgisi', teacher: 'Zülküf Memiş' },
                        { subject: 'Türkçe', teacher: 'Serhat Dede' }
                    ]
                },
                'Salı': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' },
                        { subject: 'Fen Bilgisi', teacher: 'Kağan Şahin' },
                        { subject: 'Türkçe', teacher: 'Ayşegül Karamık' }
                    ]
                },
                'Çarşamba': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'T.C. İnkılap Tarihi', teacher: 'Menekşe Nur Sucu' },
                        { subject: 'Din Kültürü', teacher: 'İshak Bilgin' },
                        { subject: 'İngilizce', teacher: 'Sevde İrem Gidek' }
                    ]
                },
                'Perşembe': null,
                'Cuma': null,
                'Cumartesi': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Zeynep Sarı' },
                        { subject: 'Fen Bilgisi', teacher: 'Zülküf Memiş' },
                        { subject: 'Türkçe', teacher: 'Serhat Dede' }
                    ]
                },
                'Pazar': null
            }
        },
        'YKS': {
            'hafta-ici': {
                'Pazartesi': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' },
                        { subject: 'Fizik', teacher: 'Kağan Şahin' },
                        { subject: 'Kimya', teacher: 'Murat Uçar' }
                    ]
                },
                'Salı': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Türk Dili ve Edebiyatı', teacher: 'Cemal Murat Turan' },
                        { subject: 'Edebiyat', teacher: 'Seçkin Erdiker' },
                        { subject: 'Tarih', teacher: 'Menekşe Nur Sucu' }
                    ]
                },
                'Çarşamba': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Biyoloji', teacher: 'Esra Yücel' },
                        { subject: 'Coğrafya', teacher: 'Berfu Sena Deli' },
                        { subject: 'Felsefe', teacher: 'Rabia Yardımcı' }
                    ]
                },
                'Perşembe': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' },
                        { subject: 'Geometri', teacher: 'Yasin Karakaş' },
                        { subject: 'İngilizce', teacher: 'Ayhan Zeytinli' }
                    ]
                },
                'Cuma': null,
                'Cumartesi': null,
                'Pazar': null
            },
            'hafta-sonu': {
                'Pazartesi': null,
                'Salı': null,
                'Çarşamba': null,
                'Perşembe': null,
                'Cuma': null,
                'Cumartesi': { 
                    totalHours: 6, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' },
                        { subject: 'Fizik', teacher: 'Kağan Şahin' },
                        { subject: 'Kimya', teacher: 'Murat Uçar' },
                        { subject: 'Biyoloji', teacher: 'Esra Yücel' },
                        { subject: 'Türkçe', teacher: 'Yusuf Cangat Altınışık' },
                        { subject: 'Tarih', teacher: 'Menekşe Nur Sucu' }
                    ]
                },
                'Pazar': { 
                    totalHours: 6, 
                    classes: [
                        { subject: 'Geometri', teacher: 'Yasin Karakaş' },
                        { subject: 'Edebiyat', teacher: 'İrem Karadağ' },
                        { subject: 'Coğrafya', teacher: 'Berfu Sena Deli' },
                        { subject: 'Felsefe', teacher: 'Rabia Yardımcı' },
                        { subject: 'İngilizce', teacher: 'Ayhan Zeytinli' },
                        { subject: 'DKAB', teacher: 'İshak Bilgin' }
                    ]
                }
            },
            'karma': {
                'Pazartesi': null,
                'Salı': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' },
                        { subject: 'Fizik', teacher: 'Kağan Şahin' },
                        { subject: 'Kimya', teacher: 'Murat Uçar' }
                    ]
                },
                'Çarşamba': null,
                'Perşembe': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Türkçe', teacher: 'Yusuf Cangat Altınışık' },
                        { subject: 'Edebiyat', teacher: 'İrem Karadağ' },
                        { subject: 'Tarih', teacher: 'Menekşe Nur Sucu' }
                    ]
                },
                'Cuma': null,
                'Cumartesi': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Biyoloji', teacher: 'Esra Yücel' },
                        { subject: 'Coğrafya', teacher: 'Berfu Sena Deli' },
                        { subject: 'Matematik', teacher: 'Yasin Karakaş' }
                    ]
                },
                'Pazar': { 
                    totalHours: 3, 
                    classes: [
                        { subject: 'Geometri', teacher: 'Yasin Karakaş' },
                        { subject: 'Felsefe', teacher: 'Rabia Yardımcı' },
                        { subject: 'İngilizce', teacher: 'Ayhan Zeytinli' }
                    ]
                }
            }
        }
    };

    // Schedule tipini belirle
    let scheduleKey = 'karma'; // Default
    if (scheduleType) {
        if (scheduleType.includes('hafta-ici')) scheduleKey = 'hafta-ici';
        else if (scheduleType.includes('hafta-sonu')) scheduleKey = 'hafta-sonu';
        else if (scheduleType.includes('karma')) scheduleKey = 'karma';
    }
    
    console.log('📅 Program:', program, 'Schedule tipi:', scheduleKey);
    
    // Doğru programı seç
    if (programSchedules[program] && programSchedules[program][scheduleKey]) {
        return programSchedules[program][scheduleKey];
    } else if (programSchedules[program] && programSchedules[program]['karma']) {
        return programSchedules[program]['karma'];
    } else {
        return programSchedules['LGS']['karma'];
    }
}

// Ders sayılarını hesapla ve güncelle
function updateClassCounts(schedule) {
    const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
    
    // Eğer schedule bir obje ise (sınıf verisi), direkt kullan
    if (schedule && typeof schedule === 'object' && !Array.isArray(schedule)) {
        // Bugünkü ders sayısı
        let todayCount = 0;
        if (schedule[today] && Array.isArray(schedule[today])) {
            todayCount = schedule[today].filter(item => item && item.subject).length;
        }
        
        // Haftalık toplam ders sayısı
        let weeklyCount = 0;
        Object.values(schedule).forEach(day => {
            if (day && Array.isArray(day)) {
                weeklyCount += day.filter(item => item && item.subject).length;
            }
        });
        
        document.getElementById('todayClassCount').textContent = todayCount;
        document.getElementById('weeklyClassCount').textContent = weeklyCount;
        return;
    }
    
    // Eski sistem (schedule objesi)
    // Bugünkü ders sayısı
    let todayCount = 0;
    if (schedule[today] && schedule[today].totalHours) {
        todayCount = schedule[today].totalHours;
    }
    
    // Haftalık toplam ders sayısı
    let weeklyCount = 0;
    Object.values(schedule).forEach(day => {
        if (day && day.totalHours) {
            weeklyCount += day.totalHours;
        }
    });
    
    document.getElementById('todayClassCount').textContent = todayCount;
    document.getElementById('weeklyClassCount').textContent = weeklyCount;
}

// Basit ders programını göster
function displaySimpleSchedule(program = 'Genel', scheduleType = 'karma') {
    console.log('📅 displaySimpleSchedule çağrıldı:', { program, scheduleType });
    
    const scheduleGrid = document.getElementById('scheduleGrid');
    const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
    
    console.log('📅 Bugün:', today);
    
    // Program yapısı - Schedule tipine göre
    const programSchedules = {
        'LGS': {
            'hafta-ici': {
                'Pazartesi': { hours: '3', zoomLink: 'https://zoom.us/j/lgs-pazartesi' },
                'Salı': { hours: '3', zoomLink: 'https://zoom.us/j/lgs-sali' },
                'Çarşamba': { hours: '2', zoomLink: 'https://zoom.us/j/lgs-carsamba' },
                'Perşembe': { hours: '2', zoomLink: 'https://zoom.us/j/lgs-persembe' },
                'Cuma': null,
                'Cumartesi': null,
                'Pazar': null
            },
            'hafta-sonu': {
                'Pazartesi': null,
                'Salı': null,
                'Çarşamba': null,
                'Perşembe': null,
                'Cuma': null,
                'Cumartesi': { hours: '5', zoomLink: 'https://zoom.us/j/lgs-cumartesi' },
                'Pazar': { hours: '5', zoomLink: 'https://zoom.us/j/lgs-pazar' }
            },
            'karma': {
                'Pazartesi': { hours: '2', zoomLink: 'https://zoom.us/j/lgs-karma-pazartesi' },
                'Salı': null,
                'Çarşamba': { hours: '2', zoomLink: 'https://zoom.us/j/lgs-karma-carsamba' },
                'Perşembe': null,
                'Cuma': null,
                'Cumartesi': { hours: '3', zoomLink: 'https://zoom.us/j/lgs-karma-cumartesi' },
                'Pazar': { hours: '3', zoomLink: 'https://zoom.us/j/lgs-karma-pazar' }
            }
        },
        'YKS': {
            'hafta-ici': {
                'Pazartesi': { hours: '3', zoomLink: 'https://zoom.us/j/yks-pazartesi' },
                'Salı': { hours: '3', zoomLink: 'https://zoom.us/j/yks-sali' },
                'Çarşamba': { hours: '3', zoomLink: 'https://zoom.us/j/yks-carsamba' },
                'Perşembe': { hours: '3', zoomLink: 'https://zoom.us/j/yks-persembe' },
                'Cuma': null,
                'Cumartesi': null,
                'Pazar': null
            },
            'hafta-sonu': {
                'Pazartesi': null,
                'Salı': null,
                'Çarşamba': null,
                'Perşembe': null,
                'Cuma': null,
                'Cumartesi': { hours: '6', zoomLink: 'https://zoom.us/j/yks-cumartesi' },
                'Pazar': { hours: '6', zoomLink: 'https://zoom.us/j/yks-pazar' }
            },
            'karma': {
                'Pazartesi': null,
                'Salı': { hours: '3', zoomLink: 'https://zoom.us/j/yks-karma-sali' },
                'Çarşamba': null,
                'Perşembe': { hours: '3', zoomLink: 'https://zoom.us/j/yks-karma-persembe' },
                'Cuma': null,
                'Cumartesi': { hours: '3', zoomLink: 'https://zoom.us/j/yks-karma-cumartesi' },
                'Pazar': { hours: '3', zoomLink: 'https://zoom.us/j/yks-karma-pazar' }
            }
        }
    };

    // Schedule tipini belirle
    let scheduleKey = 'karma'; // Default
    if (scheduleType) {
        if (scheduleType.includes('hafta-ici')) scheduleKey = 'hafta-ici';
        else if (scheduleType.includes('hafta-sonu')) scheduleKey = 'hafta-sonu';
        else if (scheduleType.includes('karma')) scheduleKey = 'karma';
    }
    
    console.log('📅 Program:', program, 'Schedule tipi:', scheduleKey);
    
    // Doğru programı seç
    let schedule = null;
    if (programSchedules[program] && programSchedules[program][scheduleKey]) {
        schedule = programSchedules[program][scheduleKey];
    } else {
        // Fallback - karma programı dene
        if (programSchedules[program] && programSchedules[program]['karma']) {
            schedule = programSchedules[program]['karma'];
        } else {
            // Son fallback - LGS karma
            schedule = programSchedules['LGS']['karma'];
        }
    }
    
    console.log('📅 Kullanılacak schedule:', schedule);
    
    displaySchedule(schedule, today);
}

// Ders programını ekranda göster - YENİ TASARIM
function displaySchedule(schedule) {
    console.log('📅 displaySchedule çağrıldı:', { schedule });
    
    const scheduleGrid = document.getElementById('scheduleGrid');
    const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });
    const currentTime = new Date();
    
    console.log('📅 Bugün:', today);
    
    // Türkçe gün isimleri
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

    scheduleGrid.innerHTML = '';

    // Tüm günleri göster
    dayNames.forEach(day => {
        const dayCard = document.createElement('div');
        const dayData = schedule[day];
        const isToday = today === day;
        
        console.log(`📅 ${day}: hasClass=${!!dayData}, isToday=${isToday}`);
        
        dayCard.className = `day-card ${isToday ? 'today' : ''} ${!dayData ? 'no-class' : ''}`;
        
        if (dayData && dayData.totalHours) {
            // Ders saatleri ve konuları oluştur
            const classTimes = generateClassTimes(day, dayData.totalHours, dayData.subjects);
            const currentClassStatus = getCurrentClassStatus(classTimes, currentTime, isToday);
            
            dayCard.innerHTML = `
                <div class="day-header">
                    <div class="day-name">
                        <i class="fas fa-calendar-day"></i>
                        ${day}
                    </div>
                    <span class="day-badge ${isToday ? 'today' : ''}">
                        ${isToday ? 'Bugün' : dayData.totalHours + ' Ders'}
                    </span>
                </div>
                
                <div class="class-schedule">
                    ${classTimes.map((classItem, index) => {
                        if (classItem.type === 'break') {
                            return `<div class="break-item"><i class="fas fa-coffee"></i> ${classItem.time} - Teneffüs</div>`;
                        } else {
                            return `
                                <div class="class-item">
                                    <div class="class-info">
                                        <div class="class-time">${classItem.time}</div>
                                        <div class="class-subject">${classItem.subject}</div>
                                    </div>
                                    <div class="class-duration">40dk</div>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
                
                <div class="join-section">
                    <button class="zoom-btn ${currentClassStatus.class}" 
                            onclick="joinZoomClass('https://zoom.us/j/${day.toLowerCase()}', '${day}')"
                            ${currentClassStatus.disabled ? 'disabled' : ''}>
                        <i class="fas fa-${currentClassStatus.icon}"></i>
                        ${currentClassStatus.text}
                    </button>
                </div>
            `;
        } else {
            dayCard.innerHTML = `
                <div class="day-header">
                    <div class="day-name">
                        <i class="fas fa-calendar-day"></i>
                        ${day}
                    </div>
                    <span class="day-badge no-class">
                        ${isToday ? 'Bugün' : 'Dinlenme'}
                    </span>
                </div>
                
                <div class="no-class-message">
                    <i class="fas fa-bed" style="font-size: 2rem; color: #9ca3af; margin-bottom: 10px;"></i>
                    <p>Bu gün ders programında ders bulunmuyor.<br>Dinlenme ve tekrar günü.</p>
                </div>
            `;
        }
        
        scheduleGrid.appendChild(dayCard);
    });
    
    console.log('✅ Schedule görüntülendi');
}

// Ders saatlerini oluştur (40dk ders + 10dk teneffüs)
function generateClassTimes(day, totalHours, classesData) {
    const baseTime = getClassStartTime(day);
    const [startHour, startMinute] = baseTime.split(':').map(Number);
    
    let times = [];
    let currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0, 0);
    
    for (let i = 0; i < totalHours; i++) {
        const timeStr = currentTime.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const classData = classesData && classesData[i] ? classesData[i] : {
            subject: `Ders ${i + 1}`,
            teacher: 'Öğretmen'
        };
        
        times.push({
            type: 'class',
            time: timeStr,
            subject: classData.subject,
            teacher: classData.teacher,
            index: i
        });
        
        // 40 dakika ekle
        currentTime.setMinutes(currentTime.getMinutes() + 40);
        
        // Son ders değilse 10 dakika teneffüs ekle
        if (i < totalHours - 1) {
            const breakTimeStr = currentTime.toLocaleTimeString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            times.push({
                type: 'break',
                time: breakTimeStr,
                duration: '10dk'
            });
            
            // 10 dakika teneffüs ekle
            currentTime.setMinutes(currentTime.getMinutes() + 10);
        }
    }
    
    return times;
}

// Ders başlangıç saatini al
function getClassStartTime(day) {
    const weekendDays = ['Cumartesi', 'Pazar'];
    return weekendDays.includes(day) ? '21:30' : '17:20';
}

// Şu anki ders durumunu kontrol et
function getCurrentClassStatus(classTimes, currentTime, isToday) {
    if (!isToday) {
        return {
            class: '',
            disabled: true,
            icon: 'clock',
            text: 'Ders Günü Değil'
        };
    }
    
    const now = currentTime.getTime();
    const classItems = classTimes.filter(item => item.type === 'class');
    
    for (let i = 0; i < classItems.length; i++) {
        const classItem = classItems[i];
        const [hour, minute] = classItem.time.split(':').map(Number);
        
        const classStart = new Date();
        classStart.setHours(hour, minute, 0, 0);
        
        const classEnd = new Date(classStart);
        classEnd.setMinutes(classEnd.getMinutes() + 40);
        
        // Ders şu an devam ediyor
        if (now >= classStart.getTime() && now <= classEnd.getTime()) {
            return {
                class: '',
                disabled: false,
                icon: 'video',
                text: `${classItem.subject} Dersine Katıl`
            };
        }
        
        // Ders 15 dakika içinde başlayacak
        const waitTime = new Date(classStart);
        waitTime.setMinutes(waitTime.getMinutes() - 15);
        
        if (now >= waitTime.getTime() && now < classStart.getTime()) {
            const remainingMinutes = Math.ceil((classStart.getTime() - now) / 60000);
            return {
                class: 'waiting',
                disabled: false,
                icon: 'clock',
                text: `${remainingMinutes}dk Sonra: ${classItem.subject}`
            };
        }
    }
    
    // Hiçbir ders zamanı değil
    return {
        class: '',
        disabled: true,
        icon: 'ban',
        text: 'Ders Saati Değil'
    };
}

// Günün ders saatini getir
function getClassTime(day) {
    const weekendDays = ['Cumartesi', 'Pazar'];
    // Hafta sonu: 09:30, Hafta içi: 17:20
    return weekendDays.includes(day) ? '09:30' : '17:20';
}

// Şu an ders saati mi kontrol et
function isClassTimeNow(classTime) {
    const now = new Date();
    const [hour, minute] = classTime.split(':').map(Number);
    const classStart = new Date(now);
    classStart.setHours(hour, minute, 0, 0);
    
    const classEnd = new Date(classStart);
    classEnd.setHours(classStart.getHours() + 3); // 3 saat ders süresi varsayalım
    
    return now >= classStart && now <= classEnd;
}

// Öğretmenin Zoom linkini al
async function getTeacherZoomLink(teacherName) {
    try {
        // Önce zoom_link sütununun var olup olmadığını kontrol et
        const { data, error } = await window.supabase
            .from('teachers')
            .select('*')
            .eq('name', teacherName)
            .single();
        
        if (error) {
            console.error('❌ Öğretmen bilgileri alınamadı:', error);
            return 'https://zoom.us/j/123456789'; // Varsayılan link
        }
        
        // zoom_link sütunu varsa kullan, yoksa varsayılan link döndür
        return data.zoom_link || 'https://zoom.us/j/123456789';
    } catch (error) {
        console.error('❌ Öğretmen Zoom linki alma hatası:', error);
        return 'https://zoom.us/j/123456789'; // Varsayılan link
    }
}

// Zoom katılım modalını aç
async function openJoinModal(subject, teacher, time, meetingId) {
    // Öğretmenin Zoom linkini al
    const zoomLink = await getTeacherZoomLink(teacher);
    const modal = createJoinModal(subject, teacher, time, meetingId, zoomLink);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.join-modal-content').style.transform = 'scale(1)';
    }, 10);
}

// Zoom katılım modalı oluştur
function createJoinModal(subject, teacher, time, meetingId, zoomLink) {
    const modal = document.createElement('div');
    modal.className = 'join-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(8px);
    `;

    modal.innerHTML = `
        <div class="join-modal-content" style="
            background: white;
            border-radius: 25px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
            transform: scale(0.9);
            transition: transform 0.3s ease;
            position: relative;
            overflow: hidden;
        ">
            <!-- Gradient Header -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 6px;
                background: linear-gradient(135deg, #667eea, #764ba2);
            "></div>
            
            <!-- Ders Bilgileri -->
            <div style="margin-bottom: 30px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">📹</div>
                <h2 style="
                    color: #1e293b; 
                    margin-bottom: 10px; 
                    font-size: 1.8rem;
                    font-weight: 700;
                ">${subject} Dersine Katıl</h2>
                <div style="color: #64748b; font-size: 1.1rem; margin-bottom: 5px;">
                    <i class="fas fa-user-tie" style="color: #6366f1; margin-right: 8px;"></i>
                    Öğretmen: ${teacher}
                </div>
                <div style="color: #64748b; font-size: 1.1rem;">
                    <i class="fas fa-clock" style="color: #10b981; margin-right: 8px;"></i>
                    Ders Saati: ${time}
                </div>
            </div>
            
            <!-- Zoom Uyarıları -->
            <div style="
                background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                border: 1px solid #0ea5e9;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 30px;
                text-align: left;
            ">
                <h4 style="
                    color: #0c4a6e;
                    margin-bottom: 15px;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-info-circle"></i>
                    Zoom Dersine Katılım Bilgileri
                </h4>
                <ul style="
                    color: #075985;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    margin: 0;
                    padding-left: 20px;
                ">
                    <li>Zoom uygulamasının yüklü olduğundan emin olun</li>
                    <li>Mikrofonunuzu ve kameranızı kontrol edin</li>
                    <li>Sessiz bir ortamdan derse katılın</li>
                    <li>Ders başlamadan 5 dakika önce bağlanabilirsiniz</li>
                    <li>Öğretmen Zoom Linki: <strong>${zoomLink}</strong></li>
                </ul>
            </div>
            
            <!-- Butonlar -->
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="joinZoomMeeting('${zoomLink}', '${subject}')" style="
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-video"></i>
                    Zoom'a Katıl
                </button>
                
                <button onclick="closeJoinModal()" style="
                    background: #e5e7eb;
                    color: #374151;
                    border: none;
                    padding: 15px 25px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-times"></i>
                    İptal
                </button>
            </div>
        </div>
    `;

    return modal;
}

// Zoom toplantısına katıl
function joinZoomMeeting(zoomLink, subject) {
    // Zoom linkinden meeting ID'yi çıkar
    const meetingId = zoomLink.split('/').pop();
    
    // Zoom uygulaması için özel protokol URL'i oluştur
    const zoomAppUrl = `zoommtg://zoom.us/join?confno=${meetingId}`;
    const zoomWebUrl = zoomLink;
    
    try {
        // Önce Zoom uygulamasını açmayı dene
        window.location.href = zoomAppUrl;
        
        // Eğer uygulama açılmazsa 2 saniye sonra web versiyonunu aç
        setTimeout(() => {
            window.open(zoomWebUrl, '_blank');
        }, 2000);
        
        // Modal'ı kapat
        closeJoinModal();
        
        // Başarı mesajı
        showNotification(`${subject} dersine yönlendirildiniz. Zoom uygulaması açılmadıysa tarayıcı sekmesini kontrol edin.`, 'success');
        
    } catch (error) {
        console.error('Zoom açma hatası:', error);
        // Hata durumunda sadece web versiyonunu aç
        window.open(zoomWebUrl, '_blank');
        closeJoinModal();
    }
}

// Join modalını kapat
function closeJoinModal() {
    const modal = document.querySelector('.join-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Bildirim göster
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
        color: white;
        padding: 15px 25px;
        border-radius: 15px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10001;
        max-width: 350px;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // CSS animasyonu ekle
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.innerHTML = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // 5 saniye sonra kaldır
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Anlık zamanı güncelle
function updateCurrentTime() {
    const now = new Date();
    
    // Saat bilgisi (sadece saat:dakika)
    const timeString = now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Hero section'daki saat güncelle
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        currentTimeElement.textContent = timeString;
    }
}

// Çıkış yap
async function logout() {
    // Özelleştirilmiş onay modalı göster
    const logoutModal = createLogoutModal();
    document.body.appendChild(logoutModal);
    
    setTimeout(() => {
        logoutModal.style.opacity = '1';
        logoutModal.querySelector('.logout-modal-content').style.transform = 'scale(1)';
    }, 10);
}

// Çıkış modalı oluştur
function createLogoutModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    `;

    modal.innerHTML = `
        <div class="logout-modal-content" style="
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        ">
            <div style="font-size: 3rem; margin-bottom: 20px;">👋</div>
            <h3 style="color: #2d3748; margin-bottom: 15px; font-size: 1.5rem;">Çıkış Yapmak İstediğinizden Emin misiniz?</h3>
            <p style="color: #718096; margin-bottom: 30px;">Tekrar giriş yapmak için email ve şifrenizi girmeniz gerekecek.</p>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="confirmLogout()" style="
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                ">
                    <i class="fas fa-sign-out-alt"></i> Evet, Çıkış Yap
                </button>
                
                <button onclick="cancelLogout()" style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                ">
                    <i class="fas fa-times"></i> İptal
                </button>
            </div>
        </div>
    `;

    return modal;
}

// Çıkışı onayla
async function confirmLogout() {
    console.log('🚪 confirmLogout çağrıldı');
    
    const modal = document.querySelector('.logout-modal-content').parentElement;
    const logoutBtn = modal.querySelector('button[onclick="confirmLogout()"]');
    
    // Buton durumunu değiştir
    logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Çıkış yapılıyor...';
    logoutBtn.disabled = true;
    
    try {
        console.log('🚪 Çıkış işlemi başlatılıyor...');
        console.log('🔍 window.supabase mevcut mu?', !!window.supabase);
        
        if (!window.supabase) {
            throw new Error('Supabase yüklenmemiş');
        }
        
        // Database kullanıcı bilgisini temizle
        localStorage.removeItem('databaseUser');
        console.log('🗑️ Database kullanıcı bilgisi localStorage\'dan temizlendi');
        
        // Supabase'den çıkış yap (hata olsa bile devam et)
        console.log('🔑 signOut çağrılıyor...');
        try {
            const { error } = await window.supabase.auth.signOut();
            console.log('🔑 signOut sonucu:', { error });
            
            if (error) {
                console.warn('⚠️ Auth signOut hatası:', error);
            }
        } catch (signOutError) {
            console.warn('⚠️ Auth signOut hatası:', signOutError);
        }
        
        console.log('✅ Başarıyla çıkış yapıldı');
        
        // Modal'ı kapat
        modal.style.opacity = '0';
        setTimeout(() => {
            console.log('🏠 Ana sayfaya yönlendiriliyor...');
            modal.remove();
            
            // Ana sayfaya yönlendir
            window.location.replace('/');
        }, 300);
        
    } catch (error) {
        console.error('❌ Çıkış hatası:', error);
        
        // Hata durumunda butonu eski haline getir
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Evet, Çıkış Yap';
        logoutBtn.disabled = false;
        
        // Hata mesajı göster
        alert('Çıkış yapılırken bir hata oluştu: ' + error.message);
    }
}

// Çıkışı iptal et
function cancelLogout() {
    const modal = document.querySelector('.logout-modal-content').parentElement;
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.remove();
    }, 300);
}



console.log('✅ Dashboard.js yükleme tamamlandı');
