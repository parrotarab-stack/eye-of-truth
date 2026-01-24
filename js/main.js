// إظهار/إخفاء الترجمة التلقائية
document.getElementById('translate-btn').addEventListener('click', function() {
    const translateDiv = document.getElementById('google-translate');
    if (translateDiv.style.display === 'none' || translateDiv.style.display === '') {
        translateDiv.style.display = 'block';
        this.innerHTML = '<i class="fas fa-times"></i> إغلاق';
        this.classList.add('active');
    } else {
        translateDiv.style.display = 'none';
        this.innerHTML = '<i class="fas fa-globe"></i> لغات أخرى';
        this.classList.remove('active');
    }
});

// تغيير اللغة النشطة
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (!this.id) { // ليست زر الترجمة
            e.preventDefault();
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // هنا يمكن إضافة تغيير المحتوى حسب اللغة
            showLanguageMessage(this.textContent);
        }
    });
});

// إظهار وإخفاء روابط التنقل السريع
window.addEventListener('scroll', function() {
    const quickNav = document.querySelector('.quick-nav');
    if (window.scrollY > 500) {
        quickNav.style.display = 'flex';
    } else {
        quickNav.style.display = 'none';
    }
});

// التنقل السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // إضافة تأثير على القسم المحدد
            highlightSection(targetElement);
        }
    });
});

// إرسال نموذج الأسئلة الخاصة
document.getElementById('private-question-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const question = document.getElementById('question').value;
    const email = document.getElementById('email').value;
    
    if (!question.trim()) {
        alert('الرجاء كتابة سؤال');
        return;
    }
    
    // هنا يمكن إرسال البيانات إلى الخادم
    // للنسخة البسيطة، سنظهر رسالة تأكيد فقط
    
    alert('شكرًا لك! سؤالك وصل إلينا. سنرد عليك قريبًا إذا قدمت بريدك الإلكتروني.\n\nملاحظة: هذه نسخة تجريبية، في النسخة الكاملة سيتم إرسال الأسئلة إلى صندوق بريد فعلي.');
    
    // مسح النموذج
    this.reset();
});

// مسح النموذج
document.getElementById('clear-form').addEventListener('click', function() {
    if (confirm('هل تريد مسح النص؟')) {
        document.getElementById('private-question-form').reset();
    }
});

// الأسئلة المتكررة
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const isActive = answer.classList.contains('active');
        
        // إغلاق جميع الإجابات الأخرى
        document.querySelectorAll('.faq-answer').forEach(a => {
            a.classList.remove('active');
        });
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
        });
        
        // فتح/إغلاق الإجابة الحالية
        if (!isActive) {
            answer.classList.add('active');
            this.classList.add('active');
        }
    });
});

// إظهار رسالة تغيير اللغة
function showLanguageMessage(language) {
    const messages = {
        'العربية': 'النسخة العربية هي النسخة الأصلية والأكمل.',
        'English': 'English version coming soon! Content will be available shortly.',
        'Français': 'Version française à venir bientôt ! Le contenu sera disponible sous peu.',
        '中文': '中文版本即将推出！内容将很快提供。'
    };
    
    if (messages[language]) {
        alert(messages[language] + '\n\nحاليًا: المحتوى يظهر بالعربية، والترجمة التلقائية متاحة للغات الأخرى.');
    }
}

// إضافة تأثير على القسم عند الانتقال إليه
function highlightSection(section) {
    section.style.transition = 'background-color 0.5s ease';
    section.style.backgroundColor = '#f0f7ff';
    
    setTimeout(() => {
        section.style.backgroundColor = '';
    }, 1500);
}

// إضافة تأثيرات عند التمرير
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
            section.classList.add('in-view');
        } else {
            section.classList.remove('in-view');
        }
    });
});

// تحميل الصفحة - تهيئة
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تاريخ ووقت آخر تحديث
    const updateDate = new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // يمكن إضافة التاريخ في مكان ما إذا أردت
    console.log('موقع "العين الثالثة" - آخر تحديث: ' + updateDate);
    
    // رسالة ترحيب
    setTimeout(() => {
        console.log('مرحبًا بك في موقع "العين الثالثة لم ترَ جائعًا"');
        console.log('موقع دعوي يعتمد على الفطرة والقرآن والسيرة النبوية');
    }, 1000);
});

// إضافة تأثيرات للبطاقات عند الظهور
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// مراقبة العناصر لإضافة تأثيرات
document.querySelectorAll('.card, .story-card, .step').forEach(el => {
    observer.observe(el);
});

// تأثير الكتابة في الوصف الرئيسي (اختياري)
function typeWriterEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    
    // بدء التأثير بعد تحميل الصفحة
    setTimeout(type, 1000);
}

// تفعيل تأثير الكتابة إذا أردت
// typeWriterEffect();