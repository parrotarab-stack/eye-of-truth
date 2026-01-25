// main.js - النسخة المبسطة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 موقع العين الثالثة يعمل!');
    
    // إنشاء المحتوى الرئيسي
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <!-- شريط التنقل -->
        <nav class="navbar">
            <div class="container">
                <div class="nav-content">
                    <div class="logo">
                        <i class="fas fa-eye"></i>
                        <span>العين الثالثة | منارة الباحث عن الحق</span>
                    </div>
                    <div>
                        <a href="#ask-private" class="btn btn-secondary">اسأل بخفاء</a>
                        <a href="#start" class="btn btn-primary">ابدأ الرحلة</a>
                    </div>
                </div>
            </div>
        </nav>
        
        <!-- قسم البطل -->
        <section class="hero-section" id="start">
            <div class="container">
                <h1 class="hero-title">
                    <i class="fas fa-eye"></i>
                    العين الثالثة لم ترَ قط جائعًا
                </h1>
                <p class="hero-subtitle">
                    لأنها كانت تُطعمه سرًا بذيل النسيان
                </p>
                <p class="hero-description">
                    هذا المكان ليس للجدال، ولا للفلسفة المعقدة. هنا نبحث عن <strong>الفِطرة النقية</strong>، 
                    و<strong>الكلام الواضح</strong>، و<strong>الباب المفتوح</strong> لمن يريد أن يعرف ربه.
                    <br><br>
                    <em>موقع "العين الثالثة" - منارة الباحث عن الحق © 2026</em>
                </p>
                <div>
                    <a href="#third-eye" class="btn btn-primary">
                        <i class="fas fa-book-open"></i> ابدأ الرحلة
                    </a>
                    <a href="#fitra" class="btn btn-secondary">
                        <i class="fas fa-question-circle"></i> أسئلة فطرية
                    </a>
                </div>
            </div>
        </section>
        
        <!-- قسم العين الثالثة -->
        <section id="third-eye" class="container" style="padding: 80px 0;">
            <h2 style="text-align: center; margin-bottom: 40px; color: var(--primary-dark);">
                <i class="fas fa-eye"></i> العين الثالثة: معنى العبارة
            </h2>
            <div class="content-grid">
                <div class="card">
                    <div class="card-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>المعنى الروحي</h3>
                    <p>العين الثالثة هي البصيرة الروحية التي ترى ما وراء المادة.</p>
                </div>
                <div class="card">
                    <div class="card-icon">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <h3>المعنى الفطري</h3>
                    <p>الفطرة السليمة لا تجوع للحقيقة لأنها تعرفها بالفطرة.</p>
                </div>
            </div>
        </section>
        
        <!-- نموذج اسأل بخفاء -->
        <section id="ask-private" style="padding: 80px 0; background: #f8f9fa;">
            <div class="container">
                <h2 style="text-align: center; margin-bottom: 30px; color: var(--primary-dark);">
                    <i class="fas fa-user-secret"></i> اسأل بخفاء
                </h2>
                <div class="contact-form">
                    <div class="form-group">
                        <label>سؤالك:</label>
                        <textarea id="question" placeholder="اكتب سؤالك هنا..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>البريد الإلكتروني (اختياري):</label>
                        <input type="email" id="email" placeholder="example@email.com" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                    </div>
                    <button id="send-btn" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-paper-plane"></i> أرسل سؤالك
                    </button>
                    <p id="message-response" style="text-align: center; margin-top: 20px; color: green; display: none;">
                        تم إرسال سؤالك بنجاح!
                    </p>
                </div>
            </div>
        </section>
    `;
    
    // إضافة حدث لإرسال الأسئلة
    document.getElementById('send-btn').addEventListener('click', function() {
        const question = document.getElementById('question').value;
        if (question.trim()) {
            document.getElementById('message-response').style.display = 'block';
            document.getElementById('question').value = '';
            document.getElementById('email').value = '';
            
            // حفظ في LocalStorage
            const messages = JSON.parse(localStorage.getItem('thirdEyeMessages') || '[]');
            messages.push({
                question: question,
                email: document.getElementById('email').value || 'غير معروف',
                date: new Date().toISOString()
            });
            localStorage.setItem('thirdEyeMessages', JSON.stringify(messages));
            
            setTimeout(() => {
                document.getElementById('message-response').style.display = 'none';
            }, 3000);
        } else {
            alert('يرجى كتابة سؤال');
        }
    });
    
    // تنبيه الصلاة على النبي
    setInterval(function() {
        const confirmPrayer = confirm('تذكير: اللهم صل على سيدنا محمد 🌹\n\nهل تريد الصلاة على النبي الآن؟');
        if (confirmPrayer) {
            alert('اللهم صل على سيدنا محمد وعلى آل سيدنا محمد 🌹');
        }
    }, 300000); // كل 5 دقائق
});
