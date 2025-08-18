// API endpoint'lerini test etmek için kod
async function testTeacherSchedulesAPI() {
    try {
        console.log('🔍 API Test başlatılıyor...');
        
        // LGS öğretmen programlarını test et
        const response = await fetch('/api/admin/teacher-schedules?program=LGS');
        const result = await response.json();
        
        console.log('📊 API Response:', result);
        
        if (result.success) {
            console.log('✅ API başarılı');
            console.log('📈 Program sayısı:', result.schedules?.length || 0);
            
            // İlk birkaç programı detaylı göster
            const sampleSchedules = result.schedules?.slice(0, 5) || [];
            console.log('🔍 Örnek programlar:', sampleSchedules);
            
            // Sınıf adlarını kontrol et
            const classNames = sampleSchedules.map(s => s.class_name);
            console.log('🏫 Sınıf adları:', classNames);
            
            // "Bilinmeyen Sınıf" var mı kontrol et
            const unknownClasses = sampleSchedules.filter(s => s.class_name === 'Bilinmeyen Sınıf');
            console.log('❓ Bilinmeyen sınıf sayısı:', unknownClasses.length);
            
        } else {
            console.error('❌ API hatası:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Test hatası:', error);
    }
}

// Sayfa yüklendiğinde test et
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧪 API Test hazırlanıyor...');
    
    // Test butonu ekle
    const testButton = document.createElement('button');
    testButton.textContent = 'API Test Et';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: #667eea;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
    `;
    testButton.onclick = testTeacherSchedulesAPI;
    
    document.body.appendChild(testButton);
    console.log('✅ Test butonu eklendi');
});

// Console'da manuel test için global fonksiyon
window.testAPI = testTeacherSchedulesAPI;
