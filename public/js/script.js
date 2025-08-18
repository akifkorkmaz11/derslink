// Teachers Data
const teachersData = [
    {
        name: "Zülküf Memiş",
        branch: "Fen Bilgisi / Biyoloji",
        specialties: ["YKS", "LGS", "Biyoloji"],
        initial: "ZM"
    },
    {
        name: "Cemal Murat Turan",
        branch: "Türk Dili ve Edebiyatı",
        specialties: ["YKS", "LGS", "Edebiyat"],
        initial: "CMT"
    },
    {
        name: "Zeynep Sarı",
        branch: "Matematik",
        specialties: ["YKS", "LGS", "Analitik Geometri"],
        initial: "ZS"
    },
    {
        name: "Ayhan Zeytinli",
        branch: "Türkçe, Din, Sosyal, İngilizce (6. sınıfa kadar)",
        specialties: ["LGS", "5-6. Sınıf", "İngilizce"],
        initial: "AZ"
    },
    {
        name: "İshak Bilgin",
        branch: "Din Kültürü ve Ahlak Bilgisi",
        specialties: ["YKS", "LGS", "DKAB"],
        initial: "İB"
    },
    {
        name: "Kağan Şahin",
        branch: "Fizik / Fen Bilimleri",
        specialties: ["YKS", "TYT", "AYT"],
        initial: "KŞ"
    },
    {
        name: "Yusuf Cangat Altınışık",
        branch: "Türkçe / Yabancılara Türkçe",
        specialties: ["YKS", "LGS", "Türkçe"],
        initial: "YCA"
    },
    {
        name: "Yasin Karakaş",
        branch: "Matematik",
        specialties: ["YKS", "LGS", "Geometri"],
        initial: "YK"
    },
    {
        name: "Rabia Yardımcı",
        branch: "Rehberlik / Sosyoloji",
        specialties: ["Rehberlik", "Sosyoloji", "Psikoloji"],
        initial: "RY"
    },
    {
        name: "Seçkin Erdiker",
        branch: "Türk Dili ve Edebiyatı",
        specialties: ["YKS", "LGS", "Edebiyat"],
        initial: "SE"
    },
    {
        name: "Leyla Taşan",
        branch: "Sosyal Bilgiler",
        specialties: ["LGS", "5-6-7-8. Sınıf"],
        initial: "LT"
    },
    {
        name: "Tuğçe Ünal",
        branch: "Fen Bilgisi",
        specialties: ["LGS", "5-6-7-8. Sınıf"],
        initial: "TÜ"
    },
    {
        name: "Murat Uçar",
        branch: "Kimya",
        specialties: ["YKS", "TYT", "AYT"],
        initial: "MU"
    },
    {
        name: "Serhat Dede",
        branch: "Türkçe",
        specialties: ["YKS", "LGS", "Türkçe"],
        initial: "SD"
    },
    {
        name: "İrem Karadağ",
        branch: "Türk Dili ve Edebiyatı",
        specialties: ["YKS", "LGS", "Edebiyat"],
        initial: "İK"
    },
    {
        name: "Ayşegül Karamık",
        branch: "Türkçe",
        specialties: ["YKS", "LGS", "Türkçe"],
        initial: "AK"
    },
    {
        name: "Esra Yücel",
        branch: "Biyoloji",
        specialties: ["YKS", "AYT", "Sağlık Bilimleri"],
        initial: "EY"
    },
    {
        name: "Menekşe Nur Sucu",
        branch: "Tarih",
        specialties: ["YKS", "TYT", "AYT"],
        initial: "MNS"
    },
    {
        name: "Cemil Okten",
        branch: "Türk Dili ve Edebiyatı",
        specialties: ["YKS", "LGS", "Edebiyat"],
        initial: "CO"
    },
    {
        name: "İkra Nur Dikilitaş",
        branch: "Türkçe, Sosyal, DKAB",
        specialties: ["LGS", "5-6-7-8. Sınıf", "DKAB"],
        initial: "İND"
    },
    {
        name: "Yasemin Atalan",
        branch: "DKAB, Afet Yönetimi",
        specialties: ["YKS", "LGS", "DKAB"],
        initial: "YA"
    },
    {
        name: "Sevde İrem Gedik",
        branch: "Matematik (İngilizce)",
        specialties: ["YKS", "LGS", "İngilizce Matematik"],
        initial: "SİG"
    },
    {
        name: "Berfu Sena Deli",
        branch: "Coğrafya / Sınıf Öğretmenliği",
        specialties: ["YKS", "TYT", "AYT"],
        initial: "BSD"
    }
];

// Teachers Modal Functions
async function openTeachersModal() {
    const modal = document.getElementById('teachersModal');
    const teachersGrid = document.getElementById('teachersGrid');
    
    // Clear existing content
    teachersGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading-spinner"></div><p>Öğretmenler yükleniyor...</p></div>';
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => modal.style.opacity = '1', 10);
    
    try {
        // Load teachers from database
        const teachers = await loadTeachersFromDatabase();
        
        // Clear loading content
        teachersGrid.innerHTML = '';
        
        // Create teacher cards
        teachers.forEach(teacher => {
            const teacherCard = document.createElement('div');
            teacherCard.className = 'teacher-card';
            
            teacherCard.innerHTML = `
                <h3 class="teacher-name">${teacher.name}</h3>
                <div class="teacher-branch">${teacher.branch}</div>
            `;
            
            teachersGrid.appendChild(teacherCard);
        });
    } catch (error) {
        console.error('❌ Öğretmenler yüklenirken hata:', error);
        teachersGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #6b7280;">Öğretmenler yüklenirken hata oluştu</div>';
    }
}

// Load teachers from database
async function loadTeachersFromDatabase() {
    try {
        if (!window.supabase) {
            console.error('❌ Supabase client bulunamadı');
            return teachersData; // Fallback to hardcoded data
        }
        
        const { data, error } = await window.supabase
            .from('teachers')
            .select('*')
            .eq('status', 'active')
            .order('name');
            
        if (error) {
            console.error('❌ Öğretmenler alınamadı:', error);
            return teachersData; // Fallback to hardcoded data
        }
        
        console.log('✅ Öğretmenler veritabanından yüklendi:', data);
        return data || teachersData;
    } catch (error) {
        console.error('❌ Öğretmen yükleme hatası:', error);
        return teachersData; // Fallback to hardcoded data
    }
}

function closeTeachersModal() {
    const modal = document.getElementById('teachersModal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('teachersModal');
    if (event.target === modal && (modal.style.display === 'flex' || modal.style.display === 'block')) {
        closeTeachersModal();
    }
});

// Instagram link tracking
document.addEventListener('DOMContentLoaded', function() {
    const instagramLink = document.querySelector('a[href*="instagram"]');
    if (instagramLink) {
        instagramLink.addEventListener('click', function(e) {
            console.log('📸 Instagram link tıklandı - Derslink Instagram sayfasına yönlendiriliyor');
            // Google Analytics veya başka tracking servisi buraya eklenebilir
        });
    }
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}



function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Password Toggle Function
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Program Data
const programData = {
    LGS: {
        name: "📘 LGS Hazırlık",
        programs: {
            "hafta-ici": {
                title: "🔹 Sadece Hafta İçi Programı",
                days: "Pazartesi (3h), Salı (3h), Çarşamba (3h), Perşembe (3h)",
                time: "17:20",
                hours: "12 saat/hafta",
                price: "₺5,000/ay",
                value: "LGS-WEEKDAY",
                description: "Öğrencilerimiz ders çıkışı vakitlerinde kaliteli bir tekrar ve takviye eğitimiyle sınavlara hazırlanır.",
                schedule: {
                    "Pazartesi": { hours: 3, zoomLink: "https://zoom.us/j/lgs-pazartesi" },
                    "Salı": { hours: 3, zoomLink: "https://zoom.us/j/lgs-sali" },
                    "Çarşamba": { hours: 3, zoomLink: "https://zoom.us/j/lgs-carsamba" },
                    "Perşembe": { hours: 3, zoomLink: "https://zoom.us/j/lgs-persembe" }
                }
            },
            "hafta-sonu": {
                title: "🔹 Sadece Hafta Sonu Programı",
                days: "Cumartesi (6h), Pazar (6h)",
                time: "09:30",
                hours: "12 saat/hafta",
                price: "₺5,000/ay",
                value: "LGS-WEEKEND",
                description: "Sabah saatlerinde zihnin en açık olduğu vakitlerde, dolu dolu bir sınav hazırlık süreci.",
                schedule: {
                    "Cumartesi": { hours: 6, zoomLink: "https://zoom.us/j/lgs-cumartesi" },
                    "Pazar": { hours: 6, zoomLink: "https://zoom.us/j/lgs-pazar" }
                }
            },
            "karma": {
                title: "🔹 Hafta İçi + Hafta Sonu Karma Programı",
                days: "Pazartesi (3h), Çarşamba (3h), Cumartesi (3h), Pazar (3h)",
                time: "Hafta İçi: 17:20 | Hafta Sonu: 09:30",
                hours: "12 saat/hafta",
                price: "₺5,000/ay",
                value: "LGS-MIXED",
                description: "Hem hafta içi takip hem de hafta sonu yoğun tekrar isteyen öğrenciler için ideal denge.",
                schedule: {
                    "Pazartesi": { hours: 3, zoomLink: "https://zoom.us/j/lgs-karma-pazartesi" },
                    "Çarşamba": { hours: 3, zoomLink: "https://zoom.us/j/lgs-karma-carsamba" },
                    "Cumartesi": { hours: 3, zoomLink: "https://zoom.us/j/lgs-karma-cumartesi" },
                    "Pazar": { hours: 3, zoomLink: "https://zoom.us/j/lgs-karma-pazar" }
                }
            }
        }
    },
    YKS: {
        name: "📗 YKS - TYT - AYT",
        programs: {
            "hafta-ici": {
                title: "🔸 Sadece Hafta İçi Programı",
                days: "Pazartesi, Salı, Çarşamba, Perşembe (her gün 3h)",
                time: "17:20",
                hours: "12 saat/hafta",
                price: "₺5,000/ay",
                value: "YKS-WEEKDAY",
                description: "TYT–AYT hazırlığında hafta içi disiplinli çalışma tercih edenler için yoğun ve planlı bir içerik.",
                schedule: {
                    "Pazartesi": { hours: 3, zoomLink: "https://zoom.us/j/yks-pazartesi" },
                    "Salı": { hours: 3, zoomLink: "https://zoom.us/j/yks-sali" },
                    "Çarşamba": { hours: 3, zoomLink: "https://zoom.us/j/yks-carsamba" },
                    "Perşembe": { hours: 3, zoomLink: "https://zoom.us/j/yks-persembe" }
                }
            },
            "hafta-sonu": {
                title: "🔸 Sadece Hafta Sonu Programı",
                days: "Cumartesi (6h), Pazar (6h)",
                time: "09:30",
                hours: "12 saat/hafta",
                price: "₺5,000/ay",
                value: "YKS-WEEKEND",
                description: "Hafta sonunu verimli kullanmak isteyen öğrenciler için sınav odaklı yüksek tempolu eğitim.",
                schedule: {
                    "Cumartesi": { hours: 6, zoomLink: "https://zoom.us/j/yks-cumartesi" },
                    "Pazar": { hours: 6, zoomLink: "https://zoom.us/j/yks-pazar" }
                }
            },
            "karma": {
                title: "🔸 Hafta İçi + Hafta Sonu Karma Programı",
                days: "Salı (3h), Perşembe (3h), Cumartesi (3h), Pazar (3h)",
                time: "Hafta İçi: 17:20 | Hafta Sonu: 09:30",
                hours: "12 saat/hafta",
                price: "₺5,000/ay",
                value: "YKS-MIXED",
                description: "Konulara hem aralıklı tekrar hem de yoğun pratikle çalışmak isteyenler için kusursuz uyum.",
                schedule: {
                    "Salı": { hours: 3, zoomLink: "https://zoom.us/j/yks-karma-sali" },
                    "Perşembe": { hours: 3, zoomLink: "https://zoom.us/j/yks-karma-persembe" },
                    "Cumartesi": { hours: 3, zoomLink: "https://zoom.us/j/yks-karma-cumartesi" },
                    "Pazar": { hours: 3, zoomLink: "https://zoom.us/j/yks-karma-pazar" }
                }
            }
        }
    },
    LISE: {
        name: "🎯 Lise Takviye",
        programs: {
            "hafta-ici": {
                title: "🎯 Hafta İçi Takviye Programı",
                days: "Pazartesi, Çarşamba, Cuma (her gün 2h)",
                time: "17:20",
                hours: "6 saat/hafta",
                price: "₺5,000/ay",
                description: "9, 10 ve 11. sınıf öğrencilerine özel destek programları."
            },
            "hafta-sonu": {
                title: "🎯 Hafta Sonu Takviye Programı",
                days: "Cumartesi (4h), Pazar (4h)",
                time: "09:30",
                hours: "8 saat/hafta",
                price: "₺5,000/ay",
                description: "Sınavlara ve okul derslerine hazırlık için hafta sonu programı."
            }
        }
    },
    KPSS: {
        name: "🏛 KPSS Hazırlık",
        programs: {
            "hafta-ici": {
                title: "🏛 Hafta İçi KPSS Programı",
                days: "Salı, Perşembe (her gün 3h)",
                time: "18:00",
                hours: "6 saat/hafta",
                price: "₺5,000/ay",
                description: "Kamuya açılan kapı, bilinçli ve etkili hazırlıkla açılır!"
            },
            "hafta-sonu": {
                title: "🏛 Hafta Sonu KPSS Programı",
                days: "Cumartesi (5h), Pazar (5h)",
                time: "09:30",
                hours: "10 saat/hafta",
                price: "₺5,000/ay",
                description: "Yoğun KPSS hazırlık süreci için hafta sonu programı."
            }
        }
    }
};

// Update Sub Programs
function updateSubPrograms() {
    const mainProgram = document.getElementById('registerProgram').value;
    const subProgramGroup = document.getElementById('subProgramGroup');
    const subProgramSelect = document.getElementById('registerSubProgram');
    const programDetails = document.getElementById('programDetails');
    
    if (mainProgram && programData[mainProgram]) {
        subProgramGroup.style.display = 'block';
        subProgramSelect.innerHTML = '<option value="">Program türü seçiniz</option>';
        
        Object.keys(programData[mainProgram].programs).forEach(key => {
            const program = programData[mainProgram].programs[key];
            const option = document.createElement('option');
            option.value = key;
            option.textContent = program.title;
            subProgramSelect.appendChild(option);
        });
        
        // Add change event listener
        subProgramSelect.onchange = updateProgramDetails;
    } else {
        subProgramGroup.style.display = 'none';
        programDetails.style.display = 'none';
    }
}

// Update Program Details
function updateProgramDetails() {
    const mainProgram = document.getElementById('registerProgram').value;
    const subProgram = document.getElementById('registerSubProgram').value;
    const programDetails = document.getElementById('programDetails');
    
    if (mainProgram && subProgram && programData[mainProgram] && programData[mainProgram].programs[subProgram]) {
        const program = programData[mainProgram].programs[subProgram];
        
        document.getElementById('programTitle').textContent = program.title;
        document.getElementById('programDays').textContent = program.days;
        document.getElementById('programHours').textContent = program.hours;
        document.getElementById('programPrice').textContent = program.price;
        
        programDetails.style.display = 'block';
    } else {
        programDetails.style.display = 'none';
    }
}

// Payment System Functions
// Email validation fonksiyonu
function validateEmail(email) {
    // Temel email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Geçerli bir email adresi giriniz' };
    }
    
    // Yasaklı domain'ler
    const forbiddenDomains = [
        'example.com',
        'test.com',
        'fake.com',
        'dummy.com',
        'temp.com',
        'tempmail.com',
        '10minutemail.com',
        'guerrillamail.com',
        'mailinator.com'
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

async function initializeRegistration(firstName, lastName, email, phone, mainProgram, subProgram, selectedProgram, password) {
    const submitBtn = document.getElementById('registerSubmitBtn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Global değişkenleri temizle (güvenlik için)
        window.pendingRegistrationData = null;
        window.completedPaymentData = null;
        
        // Önce email validation yap
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            throw new Error(emailValidation.message);
        }
        
        // Show loading state - Kayıt işlemi başlıyor
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kayıt İşlemi Yapılıyor...';
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        
        console.log('📝 Kayıt işlemi başlatılıyor...');
        
        // ÖNCE KAYIT İŞLEMİ YAP (Para çekilmeden)
        const registrationData = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            selectedProgram: selectedProgram,
            mainProgram: mainProgram
        };
        
        // UserService ile kayıt işlemi
        if (typeof window.UserService === 'undefined') {
            throw new Error('UserService bulunamadı');
        }
        
        console.log('🔄 UserService.registerUser çağrılıyor...');
        const registrationResult = await window.UserService.registerUser(registrationData);
        
        if (!registrationResult.success) {
            throw new Error('Kayıt işlemi başarısız: ' + (registrationResult.error || 'Bilinmeyen hata'));
        }
        
        console.log('✅ Kayıt işlemi başarılı, ödeme işlemi başlatılıyor...');
        
        // KAYIT BAŞARILI - ŞİMDİ ÖDEME YAP
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ödeme Hazırlanıyor...';
        
        // Create payment form data
        const paymentData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password,
            mainProgram: mainProgram,
            subProgram: subProgram,
            selectedProgram: selectedProgram,
            programTitle: selectedProgram.title,
            price: selectedProgram.price,
            amount: extractAmount(selectedProgram.price),
            userId: registrationResult.user.id // Kayıt edilen kullanıcının ID'si
        };
        
        // Gerçek Iyzico ödeme sistemini başlat
        console.log('💳 Gerçek Iyzico ödeme sistemi başlatılıyor...');
        
        if (typeof window.IyzicoPaymentService !== 'undefined') {
            try {
                        // Form verilerini global değişkende sakla (callback için)
        window.pendingRegistrationData = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            selectedProgram: selectedProgram,
            mainProgram: mainProgram,
            userId: registrationResult.user.id, // Kullanıcı ID'sini de sakla
            scheduleType: subProgram // Hafta içi, hafta sonu, karma bilgisi
        };
                
                const result = await window.IyzicoPaymentService.initializePayment(paymentData);
                
                if (!result.success) {
                    console.error('❌ Ödeme başlatma hatası:', result.error);
                    showNotification('Ödeme başlatılamadı: ' + result.error, 'error');
                    resetButton(submitBtn, originalText);
                    
                    // Ödeme başarısız olursa kayıt edilen kullanıcıyı sil
                    console.log('🗑️ Ödeme başarısız, kayıt edilen kullanıcı siliniyor...');
                    try {
                        await window.UserService.deleteUser(email);
                        console.log('✅ Kayıt edilen kullanıcı silindi');
                    } catch (deleteError) {
                        console.error('❌ Kullanıcı silme hatası:', deleteError);
                    }
                }
                // Başarılı durumda modal açılacak, button reset modal kapanırken olacak
                
            } catch (error) {
                console.error('❌ Ödeme sistemi hatası:', error);
                showNotification('Ödeme sistemi hatası: ' + error.message, 'error');
                resetButton(submitBtn, originalText);
                
                // Ödeme hatası olursa kayıt edilen kullanıcıyı sil
                console.log('🗑️ Ödeme hatası, kayıt edilen kullanıcı siliniyor...');
                try {
                    await window.UserService.deleteUser(email);
                    console.log('✅ Kayıt edilen kullanıcı silindi');
                } catch (deleteError) {
                    console.error('❌ Kullanıcı silme hatası:', deleteError);
                }
            }
        } else {
            console.error('❌ IyzicoPaymentService bulunamadı');
            showNotification('Ödeme sistemi yüklenemedi. Sayfayı yenileyin.', 'error');
            resetButton(submitBtn, originalText);
            
            // Ödeme servisi bulunamazsa kayıt edilen kullanıcıyı sil
            console.log('🗑️ Ödeme servisi bulunamadı, kayıt edilen kullanıcı siliniyor...');
            try {
                await window.UserService.deleteUser(email);
                console.log('✅ Kayıt edilen kullanıcı silindi');
            } catch (deleteError) {
                console.error('❌ Kullanıcı silme hatası:', deleteError);
            }
        }
    } catch (error) {
        console.error('Registration/Payment error:', error);
        showNotification('İşlem hatası: ' + error.message, 'error');
        resetButton(submitBtn, originalText);
    }
}

function extractAmount(priceString) {
    // Extract numeric amount from price string (e.g., "₺1,200/ay" -> 1200)
    const match = priceString.match(/₺([0-9,]+)/);
    if (match) {
        return parseInt(match[1].replace(/,/g, ''));
    }
    return 0;
}

function resetButton(button, originalText) {
    button.innerHTML = originalText;
    button.classList.remove('btn-loading');
    button.disabled = false;
}

// Eski karmaşık fonksiyonlar temizlendi - artık gerek yok

// Eski completeRegistration fonksiyonu kaldırıldı - artık handleModernPaymentSuccess kullanılıyor

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const forgotModal = document.getElementById('forgotPasswordModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === registerModal) {
        closeRegisterModal();
    }
    if (event.target === forgotModal) {
        closeForgotPasswordModal();
    }
});

// Form Validation and Submission
// Ödeme callback sistemi
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'IYZICO_PAYMENT_SUCCESS') {
        handleModernPaymentSuccess();
    }
});

// Ödeme başarı işleyicisi
// Payment success işlemi için güvenlik kilidi
let isPaymentSuccessProcessing = false;

async function handleModernPaymentSuccess() {
    // Güvenlik kilidi - aynı anda birden fazla işlem yapılmasını önle
    if (isPaymentSuccessProcessing) {
        console.log('⚠️ Payment success işlemi zaten devam ediyor, tekrar çalıştırılmıyor');
        return;
    }
    
    isPaymentSuccessProcessing = true;
    
    try {
        // Modal'ı kapat
        if (window.IyzicoPaymentService && window.IyzicoPaymentService.closeModal) {
            window.IyzicoPaymentService.closeModal();
        }

        // Başarı animasyonu
        showModernSuccessAnimation();

        // Form verilerini al
        const formData = window.pendingRegistrationData;
        
        if (!formData) {
            throw new Error('Kayıt verisi bulunamadı');
        }

        // Loading durumu
        showModernLoadingState('Ödeme tamamlanıyor...');

        // Kullanıcı zaten kayıt edilmiş, sadece payment kaydını güncelle
        console.log('✅ Kullanıcı zaten kayıt edilmiş, payment kaydı güncelleniyor...');
        
        // Payment kaydını güncelle (kullanıcı zaten kayıt edilmiş)
        if (window.completedPaymentData && formData.userId) {
            try {
                // Schedule tipini program value'dan çıkar
                const programValue = window.completedPaymentData.programInfo?.value || '';
                let scheduleType = 'karma'; // default
                
                if (programValue.includes('WEEKDAY')) {
                    scheduleType = 'hafta-ici';
                } else if (programValue.includes('WEEKEND')) {
                    scheduleType = 'hafta-sonu';
                } else if (programValue.includes('MIXED')) {
                    scheduleType = 'karma';
                }
                
                console.log('💾 Payment kayıt bilgileri:', {
                    userId: formData.userId,
                    email: formData.email,
                    program: window.completedPaymentData.mainProgram,
                    schedule: scheduleType,
                    programValue: programValue
                });
                
                // Önce kullanıcının gerçekten var olduğunu ve doğru kullanıcı olduğunu kontrol et
                const { data: userCheck, error: userCheckError } = await window.supabase
                    .from('users')
                    .select('id, email')
                    .eq('id', formData.userId)
                    .eq('email', formData.email)
                    .limit(1);
                
                if (userCheckError) {
                    console.error('❌ Kullanıcı kontrol hatası:', userCheckError);
                    throw new Error('Kullanıcı doğrulanamadı');
                }
                
                if (!userCheck || userCheck.length === 0) {
                    console.error('❌ Kullanıcı bulunamadı:', { userId: formData.userId, email: formData.email });
                    throw new Error('Kullanıcı bulunamadı');
                }
                
                console.log('✅ Kullanıcı doğrulandı:', userCheck[0]);
                
                const paymentPayload = {
                    user_id: formData.userId, // Doğrulanmış kullanıcının ID'si
                    program: window.completedPaymentData.mainProgram || window.completedPaymentData.programInfo?.value || window.completedPaymentData.programInfo?.title,
                    schedule: scheduleType,
                    price: window.completedPaymentData.amount,
                    payment_status: 'completed',
                    iyzico_payment_id: window.completedPaymentData.paymentId,
                    transaction_id: window.completedPaymentData.conversationId
                };
                
                // Önce aynı iyzico_payment_id ile payment kaydı var mı kontrol et (duplicate önleme)
                const { data: existingPaymentByIyzicoId } = await window.supabase
                    .from('payments')
                    .select('*')
                    .eq('iyzico_payment_id', window.completedPaymentData.paymentId)
                    .limit(1);
                
                if (existingPaymentByIyzicoId && existingPaymentByIyzicoId.length > 0) {
                    console.log('⚠️ Bu ödeme zaten kayıt edilmiş:', existingPaymentByIyzicoId[0]);
                    console.log('✅ Duplicate payment önlendi');
                } else {
                    // Aynı kullanıcının başka payment kaydı var mı kontrol et
                    const { data: existingPaymentsByUser } = await window.supabase
                        .from('payments')
                        .select('*')
                        .eq('user_id', formData.userId)
                        .limit(1);
                    
                    if (existingPaymentsByUser && existingPaymentsByUser.length > 0) {
                        // Mevcut kaydı güncelle
                        console.log('🔄 Mevcut payment kaydı güncelleniyor...');
                        const { error: updateError } = await window.supabase
                            .from('payments')
                            .update(paymentPayload)
                            .eq('user_id', formData.userId);
                        
                        if (updateError) {
                            console.error('Payment güncelleme hatası:', updateError);
                        } else {
                            console.log('✅ Payment kaydı güncellendi');
                        }
                    } else {
                        // Yeni kayıt oluştur
                        console.log('🆕 Yeni payment kaydı oluşturuluyor...');
                        const { error: insertError } = await window.supabase
                            .from('payments')
                            .insert([paymentPayload]);
                        
                        if (insertError) {
                            console.error('Payment kayıt hatası:', insertError);
                        } else {
                            console.log('✅ Payment kaydı oluşturuldu');
                        }
                    }
                }
            } catch (paymentError) {
                console.error('Payment kayıt hatası:', paymentError);
            }
        }
        
        // Başarı durumu
        showModernSuccessState();
        
        // Öğrenciyi otomatik olarak uygun sınıfa yerleştir
        if (window.ClassService) {
            try {
                console.log('🎓 Öğrenci otomatik sınıf yerleştirme başlatılıyor...');
                
                // ClassService instance oluştur
                const classService = new window.ClassService();
                
                // Schedule tipini belirle
                let scheduleType = 'karma';
                if (formData.scheduleType === 'hafta-ici') {
                    scheduleType = 'hafta-ici';
                } else if (formData.scheduleType === 'hafta-sonu') {
                    scheduleType = 'hafta-sonu';
                }
                
                // Program tipini belirle
                const programType = formData.mainProgram; // 'LGS' veya 'YKS'
                
                console.log(`📚 ${programType} öğrencisi ${scheduleType} sınıfına yerleştiriliyor...`);
                
                // Mevcut sınıfları getir
                const availableClasses = await classService.getAvailableClasses(programType, scheduleType);
                
                if (availableClasses.success && availableClasses.classes.length > 0) {
                    // En az dolu olan sınıfı seç
                    const selectedClass = availableClasses.classes
                        .filter(cls => cls.current_enrollment < cls.max_capacity)
                        .sort((a, b) => a.current_enrollment - b.current_enrollment)[0];
                    
                    if (selectedClass) {
                        // Sınıfa kayıt ol
                        const enrollmentResult = await classService.enrollToClass(formData.userId, selectedClass.id);
                        
                        if (enrollmentResult.success) {
                            console.log(`✅ ${programType} öğrencisi başarıyla sınıfa kayıt edildi:`, selectedClass.class_name);
                        } else {
                            console.warn('⚠️ Sınıfa kayıt hatası:', enrollmentResult.error);
                        }
                    } else {
                        console.warn('⚠️ Uygun sınıf bulunamadı');
                    }
                } else {
                    console.warn('⚠️ Mevcut sınıf bulunamadı');
                }
            } catch (classError) {
                console.error('❌ Sınıf kayıt hatası:', classError);
            }
        }
        
        // Kullanıcıya otomatik giriş yap
        try {
            console.log('🔐 Kullanıcıya otomatik giriş yapılıyor...');
            
            // Tab-specific key oluştur
            let tabId = sessionStorage.getItem('tabId');
            if (!tabId) {
                tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem('tabId', tabId);
            }
            const userDataKey = `databaseUser_${tabId}`;
            
            // Database kullanıcı bilgisini localStorage'a kaydet
            const userData = {
                id: formData.userId,
                email: formData.email,
                name: formData.firstName + ' ' + formData.lastName,
                phone: formData.phone,
                enrolled_program: formData.mainProgram
            };
            
            localStorage.setItem(userDataKey, JSON.stringify(userData));
            console.log(`✅ Kullanıcı bilgisi localStorage'a kaydedildi (key: ${userDataKey})`);
            
        } catch (loginError) {
            console.error('❌ Otomatik giriş hatası:', loginError);
        }
        
        // Global değişkenleri temizle
        window.pendingRegistrationData = null;
        window.completedPaymentData = null;
        
        // 3 saniye sonra dashboard'a yönlendir
        setTimeout(() => {
            window.location.href = 'dashboard';
        }, 3000);
        
    } catch (error) {
        console.error('Kayıt hatası:', error);
        showModernErrorState(error.message);
    } finally {
        // Güvenlik kilidini sıfırla
        isPaymentSuccessProcessing = false;
    }
}

// Modern başarı animasyonu
function showModernSuccessAnimation() {
    // Confetti efekti
    if (typeof createConfetti === 'function') {
        createConfetti();
    }
    
    // Modern toast mesajı
    showNotification('🎉 Ödeme başarıyla tamamlandı!', 'success');
}

// Modern loading durumu
function showModernLoadingState(message) {
    const submitBtn = document.getElementById('registerSubmitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                ${message}
            </div>
        `;
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
    }
}

// Modern başarı durumu
function showModernSuccessState() {
    const submitBtn = document.getElementById('registerSubmitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-check-circle" style="color: #10B981;"></i>
                Kayıt Tamamlandı!
            </div>
        `;
        submitBtn.classList.remove('btn-loading');
        submitBtn.classList.add('btn-success');
        submitBtn.style.background = 'linear-gradient(45deg, #10B981, #34D399)';
        submitBtn.disabled = true;
    }
    
    showNotification('🎉 Kayıt işleminiz başarıyla tamamlandı!', 'success');
}

// Modern hata durumu
function showModernErrorState(errorMessage) {
    const submitBtn = document.getElementById('registerSubmitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-credit-card"></i> Ödeme ile Kayıt Ol';
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
    
    showNotification('❌ Ödeme başarılı ama kayıt hatası: ' + errorMessage, 'error');
}

document.addEventListener('DOMContentLoaded', function() {
    // URL parametrelerini kontrol et (ödeme sonucu)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        showNotification('🎉 Ödeme başarıyla tamamlandı! Kayıt işleminiz gerçekleştirildi.', 'success');
        // URL'yi temizle
        window.history.replaceState({}, document.title, '/');
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showNotification('Lütfen tüm alanları doldurun.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş yapılıyor...';
            submitBtn.disabled = true;
            
            try {
                console.log('🔍 Login işlemi başlatılıyor...');
                console.log('🔍 Email:', email);
                console.log('🔍 window.UserService:', typeof window.UserService);
                console.log('🔍 window.supabase:', typeof window.supabase);
                
                // Check if UserService is available
                if (typeof window.UserService === 'undefined') {
                    console.error('❌ UserService is not available');
                    showNotification('Sistem yapılandırması eksik. Lütfen sayfayı yenileyin.', 'error');
                    return;
                }
                
                console.log('✅ UserService mevcut, giriş işlemi başlatılıyor...');
                console.log('🔄 UserService.loginUser çağrılıyor...');
                
                // Attempt login with Supabase
                const result = await window.UserService.loginUser(email, password);
                
                console.log('📊 Login sonucu:', result);
                console.log('🔍 Result.success değeri:', result.success);
                console.log('🔍 Result tipi:', typeof result.success);
                
                if (result.success) {
                    console.log('✅ Login başarılı, dashboard\'a yönlendiriliyor...');
                    
                    // Database kullanıcısı ise localStorage'a kaydet (sekme bazlı)
                    if (result.authMethod === 'database' && result.user) {
                        const tabId = sessionStorage.getItem('tabId') || 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        sessionStorage.setItem('tabId', tabId);
                        const userKey = `databaseUser_${tabId}`;
                        
                        localStorage.setItem(userKey, JSON.stringify(result.user));
                        console.log('💾 Database kullanıcı bilgisi localStorage\'a kaydedildi (key:', userKey + ')');
                    }
                    
                    showNotification('Başarıyla giriş yapıldı! Dashboard\'a yönlendiriliyorsunuz...', 'success');
                    closeLoginModal();
                    createConfetti();
                    loginForm.reset();
                    
                    // Hemen yönlendir
                    setTimeout(() => {
                        console.log('🚀 Yönlendirme yapılıyor: dashboard.html');
                        window.location.replace('dashboard');
                    }, 1000);
                } else {
                    console.log('❌ Login başarısız:', result.error);
                    showNotification(result.error || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('registerFirstName').value;
            const lastName = document.getElementById('registerLastName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const mainProgram = document.getElementById('registerProgram').value;
            const subProgram = document.getElementById('registerSubProgram').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validation
            if (!firstName || !lastName || !email || !phone || !mainProgram || !subProgram || !password || !confirmPassword) {
                showNotification('Lütfen tüm alanları doldurun.', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Şifreler eşleşmiyor.', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Şifre en az 6 karakter olmalıdır.', 'error');
                return;
            }
            
            // Get program details
            const selectedProgram = programData[mainProgram].programs[subProgram];
            const price = selectedProgram.price;
            
            // Show registration confirmation
            if (confirm(`Seçtiğiniz program: ${selectedProgram.title}\nFiyat: ${price}\n\nÖnce kayıt işlemi yapılacak, sonra ödeme alınacak. Devam etmek istiyor musunuz?`)) {
                // Initialize registration (which will handle payment after successful registration)
                initializeRegistration(firstName, lastName, email, phone, mainProgram, subProgram, selectedProgram, password);
            }
        });
    }
    
    // Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('forgotEmail').value;
            
            if (!email) {
                showNotification('Lütfen e-posta adresinizi girin.', 'error');
                return;
            }
            
            // Simulate password reset process
            const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.', 'success');
                closeForgotPasswordModal();
                
                // Reset form
                forgotPasswordForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Update UI for logged in user
async function updateUIForLoggedInUser() {
    try {
        // Check if UserService is available
        if (typeof window.UserService === 'undefined') {
            console.error('UserService is not available');
            return;
        }
        
        const result = await window.UserService.getCurrentUser();
        
        if (result.success && result.user && result.user.id) {
            const navAuth = document.querySelector('.nav-auth');
            const mobileAuth = document.querySelector('.mobile-auth');
            
            // Basit isim alma - database öncelikli
            let displayName = 'Kullanıcı';
            
            try {
                // Database'den isim al
                const { data: dbUserData } = await window.supabase
                    .from('users')
                    .select('name')
                    .eq('id', result.user.id)
                    .limit(1);
                
                if (dbUserData && dbUserData.length > 0 && dbUserData[0].name) {
                    displayName = dbUserData[0].name;
                } else {
                    // Email'den isim al (@ öncesi)
                    displayName = result.user.email?.split('@')[0] || 'Kullanıcı';
                }
            } catch (error) {
                displayName = result.user.email?.split('@')[0] || 'Kullanıcı';
            }
            
            if (navAuth) {
                navAuth.innerHTML = `
                    <div class="user-menu">
                        <button class="btn btn-user" onclick="toggleUserMenu()">
                            <i class="fas fa-user-circle"></i>
                            <span>${displayName}</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="user-dropdown" id="userDropdown">
                            <a href="#" class="dropdown-item">
                                <i class="fas fa-user"></i>
                                Profil
                            </a>
                            <a href="dashboard.html" class="dropdown-item">
                                <i class="fas fa-tachometer-alt"></i>
                                Dashboard'a Git
                            </a>
                            <a href="#" class="dropdown-item">
                                <i class="fas fa-cog"></i>
                                Ayarlar
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item" onclick="logout()">
                                <i class="fas fa-sign-out-alt"></i>
                                Çıkış Yap
                            </a>
                        </div>
                    </div>
                `;
            }
            
            if (mobileAuth) {
                mobileAuth.innerHTML = `
                    <div class="mobile-user-info">
                        <i class="fas fa-user-circle"></i>
                        <span>Hoş geldiniz, ${displayName}!</span>
                    </div>
                    <a href="dashboard.html" class="btn btn-primary">
                        <i class="fas fa-tachometer-alt"></i>
                        Dashboard'a Git
                    </a>
                    <button class="btn btn-secondary" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Çıkış Yap
                    </button>
                `;
            }
        } else {
            // User not logged in, show login/register buttons
            const navAuth = document.querySelector('.nav-auth');
            const mobileAuth = document.querySelector('.mobile-auth');
            
            if (navAuth) {
                navAuth.innerHTML = `
                    <button class="btn btn-admin" onclick="openAdminModal()" style="background: #f59e0b; color: white; margin-right: 10px;">
                        <i class="fas fa-shield-alt"></i>
                        Admin
                    </button>
                    <button class="btn btn-login" onclick="openLoginModal()">
                        <i class="fas fa-sign-in-alt"></i>
                        Giriş Yap
                    </button>
                    <button class="btn btn-register" onclick="openRegisterModal()">
                        <i class="fas fa-user-plus"></i>
                        Kayıt Ol
                    </button>
                `;
            }
            
            if (mobileAuth) {
                mobileAuth.innerHTML = `
                    <button class="btn btn-login" onclick="openLoginModal()">
                        <i class="fas fa-sign-in-alt"></i>
                        Giriş Yap
                    </button>
                    <button class="btn btn-register" onclick="openRegisterModal()">
                        <i class="fas fa-user-plus"></i>
                        Kayıt Ol
                    </button>
                `;
            }
        }
    } catch (error) {
        console.error('Error updating UI for logged in user:', error);
        // Fallback to showing login/register buttons
        const navAuth = document.querySelector('.nav-auth');
        const mobileAuth = document.querySelector('.mobile-auth');
        
        if (navAuth) {
            navAuth.innerHTML = `
                <button class="btn btn-admin" onclick="openAdminModal()" style="background: #f59e0b; color: white; margin-right: 10px;">
                    <i class="fas fa-shield-alt"></i>
                    Admin
                </button>
                <button class="btn btn-login" onclick="openLoginModal()">
                    <i class="fas fa-sign-in-alt"></i>
                    Giriş Yap
                </button>
                <button class="btn btn-register" onclick="openRegisterModal()">
                    <i class="fas fa-user-plus"></i>
                    Kayıt Ol
                </button>
            `;
        }
        
        if (mobileAuth) {
            mobileAuth.innerHTML = `
                <button class="btn btn-login" onclick="openLoginModal()">
                    <i class="fas fa-sign-in-alt"></i>
                    Giriş Yap
                </button>
                <button class="btn btn-register" onclick="openRegisterModal()">
                    <i class="fas fa-user-plus"></i>
                    Kayıt Ol
                </button>
            `;
        }
    }
}

// Toggle user menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Logout function
async function logout() {
    try {
        // Check if UserService is available
        if (typeof window.UserService === 'undefined') {
            console.error('UserService is not available');
            showNotification('Sistem yapılandırması eksik. Lütfen sayfayı yenileyin.', 'error');
            return;
        }
        
        const result = await window.UserService.logoutUser();
        
        if (result.success) {
            // Database kullanıcı bilgisini temizle
            localStorage.removeItem('databaseUser');
            console.log('🗑️ Database kullanıcı bilgisi localStorage\'dan temizlendi');
            
            showNotification('Başarıyla çıkış yapıldı.', 'success');
            
            // Reset UI to original state
            const navAuth = document.querySelector('.nav-auth');
            const mobileAuth = document.querySelector('.mobile-auth');
            
            if (navAuth) {
                navAuth.innerHTML = `
                    <button class="btn btn-admin" onclick="openAdminModal()" style="background: #f59e0b; color: white; margin-right: 10px;">
                        <i class="fas fa-shield-alt"></i>
                        Admin
                    </button>
                    <button class="btn btn-login" onclick="openLoginModal()">
                        <i class="fas fa-sign-in-alt"></i>
                        Giriş Yap
                    </button>
                    <button class="btn btn-register" onclick="openRegisterModal()">
                        <i class="fas fa-user-plus"></i>
                        Kayıt Ol
                    </button>
                `;
            }
            
            if (mobileAuth) {
                mobileAuth.innerHTML = `
                    <button class="btn btn-login" onclick="openLoginModal()">
                        <i class="fas fa-sign-in-alt"></i>
                        Giriş Yap
                    </button>
                    <button class="btn btn-register" onclick="openRegisterModal()">
                        <i class="fas fa-user-plus"></i>
                        Kayıt Ol
                    </button>
                `;
            }
        } else {
            showNotification(result.error || 'Çıkış yapılırken bir hata oluştu.', 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Çıkış yapılırken bir hata oluştu.', 'error');
    }
}

// Close user dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && !userMenu.contains(event.target) && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});



// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Animate program cards
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate advantage cards
    const advantageCards = document.querySelectorAll('.advantage-card');
    advantageCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach((method, index) => {
        method.style.opacity = '0';
        method.style.transform = 'translateX(-30px)';
        method.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        method.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(method);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.shape');
    
    if (hero) {
        const rate = scrolled * -0.5;
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    }
});

// Add hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Add confetti effect for successful form submission
function createConfetti() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#a55eea'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall 3s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[action*="formsubmit.co"]');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitBtn.disabled = true;
            
            // After a short delay, redirect to thanks page
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        });
    }
    
    // Check authentication state on page load
    updateUIForLoggedInUser();
    
    // Admin form submission
    const adminForm = document.getElementById('adminForm');
    if (adminForm) {
        adminForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            
            // Demo admin credentials
            if (email === 'admin@derslink.com' && password === '123456') {
                showNotification('Admin girişi başarılı!', 'success');
                closeAdminModal();
                
                // Redirect to admin panel - DÜZELTME: admin-lgs -> admin
                setTimeout(() => {
                    window.location.href = 'admin';
                }, 1000);
            } else {
                showNotification('Hatalı e-posta veya şifre!', 'error');
            }
        });
    }
});

// Admin Modal Functions
function openAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

 
