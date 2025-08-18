// Özel Kart Formu Payment System

// Özel Kart Formu ile Iyzico Payment Service
window.IyzicoPaymentService = {
    
    // Ödeme başlat - kendi formumuzla
    async initializePayment(paymentData) {
        
        // Kendi kart formunu göster
        this.showCustomCardForm(paymentData);
        
        return { success: true };
    },
    
    // Özel kart formu
    showCustomCardForm(paymentData) {
        
        // Eski modalı kaldır
        const existingModal = document.getElementById('customCardModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // CSS stilleri
        const modalStyles = `
            <style id="customCardModalStyles">
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: translateY(-50px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                
                @keyframes cardFlip {
                    0% { transform: rotateY(0deg); }
                    50% { transform: rotateY(10deg); }
                    100% { transform: rotateY(0deg); }
                }
                
                .custom-card-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(10px);
                    z-index: 999999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    animation: modalSlideIn 0.4s ease-out;
                }
                
                .custom-card-container {
                    background: white;
                    border-radius: 24px;
                    width: 95%;
                    max-width: 500px;
                    max-height: 90vh; /* Ekran yüksekliğinin %90'ı */
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    overflow-y: auto; /* Dikey scroll */
                    overflow-x: hidden; /* Yatay scroll gizle */
                    animation: modalSlideIn 0.5s ease-out;
                    /* Smooth scrolling */
                    scroll-behavior: smooth;
                }
                
                .card-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 30px 25px;
                    color: white;
                    text-align: center;
                    position: relative;
                }
                
                .card-close {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 24px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                
                .card-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
                
                .card-title {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                }
                
                .card-subtitle {
                    margin: 8px 0 0 0;
                    font-size: 16px;
                    opacity: 0.9;
                }
                
                .payment-summary-card {
                    background: #f8fafc;
                    margin: 25px;
                    padding: 20px;
                    border-radius: 16px;
                    border-left: 5px solid #667eea;
                }
                
                .summary-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .summary-details {
                    display: grid;
                    gap: 12px;
                }
                
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .summary-label {
                    color: #718096;
                    font-size: 15px;
                }
                
                .summary-value {
                    font-weight: 600;
                    color: #2d3748;
                    font-size: 15px;
                }
                
                .total-amount {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px;
                    border-radius: 16px;
                    text-align: center;
                    margin: 0 25px 25px 25px;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                }
                
                .amount-label {
                    font-size: 16px;
                    opacity: 0.9;
                    margin-bottom: 8px;
                }
                
                .amount-value {
                    font-size: 32px;
                    font-weight: 800;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                
                .card-form {
                    padding: 0 25px 40px 25px; /* Alt padding artırıldı */
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }
                
                .form-input {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    transform: translateY(-1px);
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }
                
                .pay-button {
                    width: 100%;
                    background: linear-gradient(135deg, #10b981, #34d399);
                    color: white;
                    border: none;
                    padding: 18px;
                    border-radius: 16px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 10px;
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                }
                
                .pay-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
                }
                
                .pay-button:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .security-info {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 15px;
                    color: #6b7280;
                    font-size: 13px;
                }
                
                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid transparent;
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* Özel Scroll Bar Stili */
                .custom-card-container::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-card-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .custom-card-container::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                
                .custom-card-container::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #5a6fd8, #6b42a0);
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .custom-card-container {
                        width: 98%;
                        margin: 5px;
                        max-height: 95vh; /* Mobilde daha fazla alan */
                    }
                    
                    .card-header {
                        padding: 25px 20px;
                    }
                    
                    .card-title {
                        font-size: 22px;
                    }
                    
                    .amount-value {
                        font-size: 28px;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    /* Mobilde scroll bar'ı gizle (native scroll kullan) */
                    .custom-card-container::-webkit-scrollbar {
                        width: 0px;
                        background: transparent;
                    }
                    
                    /* Touch scroll için momentum */
                    .custom-card-container {
                        -webkit-overflow-scrolling: touch;
                    }
                }
            </style>
        `;
        
        // Stil ekle
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        
        // Modal HTML
        const modal = document.createElement('div');
        modal.id = 'customCardModal';
        modal.className = 'custom-card-overlay';
        
        modal.innerHTML = `
            <div class="custom-card-container">
                <div class="card-header">
                    <button class="card-close" onclick="window.IyzicoPaymentService.closeCardForm()">
                        ×
                    </button>
                    <h2 class="card-title">💳 Kart Bilgileri</h2>
                    <p class="card-subtitle">Güvenli ödeme için kart bilgilerinizi girin</p>
                </div>
                
                <div class="payment-summary-card">
                    <div class="summary-title">
                        📦 Ödeme Özeti
                    </div>
                    <div class="summary-details">
                        <div class="summary-item">
                            <span class="summary-label">Program:</span>
                            <span class="summary-value">${paymentData.selectedProgram.title}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Müşteri:</span>
                            <span class="summary-value">${paymentData.firstName} ${paymentData.lastName}</span>
                        </div>
                    </div>
                </div>
                
                <div class="total-amount">
                    <div class="amount-label">Ödenecek Tutar</div>
                    <div class="amount-value">${paymentData.amount} TL</div>
                </div>
                
                <form class="card-form" id="customCardForm">
                    <div class="form-group">
                        <label class="form-label">Kart Numarası</label>
                        <input type="text" class="form-input" id="cardNumber" placeholder="Kart numaranızı girin" maxlength="19" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Kart Sahibi</label>
                        <input type="text" class="form-input" id="cardHolder" placeholder="Kart üzerindeki isim" value="${paymentData.firstName} ${paymentData.lastName}" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Son Kullanma</label>
                            <input type="text" class="form-input" id="cardExpiry" placeholder="MM/YY" maxlength="5" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">CVV</label>
                            <input type="text" class="form-input" id="cardCvv" placeholder="CVV" maxlength="4" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="pay-button" id="payButton">
                        🔒 ${paymentData.amount} TL Öde
                    </button>
                    
                    <div class="security-info">
                        <i class="fas fa-shield-alt"></i>
                        SSL ile güvenli ödeme
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Form işlevselliği ekle
        this.setupCardForm(paymentData);
    },
    
    // Kart formu işlevselliği
    setupCardForm(paymentData) {
        const form = document.getElementById('customCardForm');
        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const cardCvv = document.getElementById('cardCvv');
        const payButton = document.getElementById('payButton');
        
        // Kart numarası formatla
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
        
        // Expiry formatla
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
        
        // CVV sadece rakam
        cardCvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
        
        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processCustomPayment(paymentData);
        });
    },
    
    // Özel ödeme işle
    async processCustomPayment(paymentData) {
        const payButton = document.getElementById('payButton');
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardHolder = document.getElementById('cardHolder').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        
        // Validasyon
        if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }
        
        if (cardNumber.length < 16) {
            alert('Kart numarası en az 16 hane olmalıdır!');
            return;
        }
        
        if (cardExpiry.length !== 5) {
            alert('Son kullanma tarihi MM/YY formatında olmalıdır!');
            return;
        }
        
        if (cardCvv.length < 3) {
            alert('CVV en az 3 hane olmalıdır!');
            return;
        }
        
        // Loading durumu
        payButton.disabled = true;
        payButton.innerHTML = '<div class="loading-spinner"></div> İşleniyor...';
        
        try {
            
            // Backend'e kart bilgileri ile ödeme isteği gönder
            const response = await fetch('/api/payment/process-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardNumber: cardNumber,
                    cardHolder: cardHolder,
                    cardExpiry: cardExpiry,
                    cardCvv: cardCvv,
                    amount: paymentData.amount,
                    firstName: paymentData.firstName,
                    lastName: paymentData.lastName,
                    email: paymentData.email,
                    phone: paymentData.phone,
                    mainProgram: paymentData.mainProgram,
                    subProgram: paymentData.subProgram,
                    programTitle: paymentData.programTitle
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Global'e ödeme detaylarını kaydet
                window.completedPaymentData = {
                    paymentId: result.paymentId,
                    conversationId: result.conversationId,
                    paymentDetails: result.paymentDetails || {},
                    customerInfo: {
                        firstName: paymentData.firstName,
                        lastName: paymentData.lastName,
                        email: paymentData.email,
                        phone: paymentData.phone
                    },
                    programInfo: {
                        title: paymentData.selectedProgram.title,
                        value: paymentData.selectedProgram.value
                    },
                    mainProgram: paymentData.mainProgram, // Ana program bilgisi
                    amount: paymentData.amount,
                    completedAt: new Date().toISOString()
                };
                
                // Modal'ı kapat
                this.closeCardForm();
                
                // Success event gönder (sadece bir kez)
                window.postMessage({
                    type: 'IYZICO_PAYMENT_SUCCESS',
                    paymentId: result.paymentId,
                    success: true
                }, '*');
                
            } else {
                throw new Error(result.error || 'Ödeme işlemi başarısız');
            }
            
        } catch (error) {
            console.error('Ödeme hatası:', error);
            alert('Ödeme işlemi başarısız: ' + error.message);
            
            // Button'ı resetle
            payButton.disabled = false;
            payButton.innerHTML = `🔒 ${paymentData.amount} TL Öde`;
        }
    },
    
    // Kart formunu kapat
    closeCardForm() {
        const modal = document.getElementById('customCardModal');
        const styles = document.getElementById('customCardModalStyles');
        
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
                setTimeout(() => {
                modal.remove();
                if (styles) styles.remove();
            }, 300);
        }
        
        // Register button'ı resetle
        const submitBtn = document.getElementById('registerSubmitBtn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-credit-card"></i> Ödeme ile Kayıt Ol';
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
        

    }
};

// Özel Kart Formu Payment Service Hazır