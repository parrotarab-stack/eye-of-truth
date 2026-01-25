// ===== ملف JavaScript الرئيسي =====

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌙 موقع العين الثالثة - جاهز');
    
    // إخفاء شاشة التحميل
    hideLoadingScreen();
    
    // تحديث آية اليوم
    updateDailyVerse();
    
    // تحديث أوقات الصلاة
    updatePrayerTimes();
    
    // تهيئة التنقل السلس
    initSmoothScroll();
    
    // تهيئة شريط التقدم
    initProgressBar();
    
    // تهيئة القائمة المتحركة
    initMobileMenu();
    
    // تهيئة الأسئلة المتكررة
    initFAQ();
    
    // إضافة تأثيرات للبطاقات
    initCardAnimations();
    
    // تحديث الإحصائيات
    updateStats();
    
    // تعيين تاريخ اليوم
    setCurrentDate();
});

// ===== وظائف التحكم =====

// إخفاء شاشة التحميل
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1000);
}

// تحديث آية اليوم
function updateDailyVerse() {
    const verses = [
        {
            text: '﴿وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ﴾',
            ref: 'سورة القلم - الآية 4',
            meaning: 'تكريم الله لرسوله محمد ﷺ'
        },
        {
            text: '﴿قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ﴾',
            ref: 'سورة الإخلاص',
            meaning: 'توحيد الله الخالص'
        },
        {
            text: '﴿رَبِّ زِدْنِي عِلْمًا﴾',
            ref: 'سورة طه - الآية 114',
            meaning: 'دعاء طلب العلم'
        },
        {
            text: '﴿إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾',
            ref: 'سورة الشرح - الآية 6',
            meaning: 'البشرى بالفرج بعد الشدة'
        },
        {
            text: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ﴾',
            ref: 'سورة التوبة - الآية 119',
            meaning: 'أمر بالتقوى والصدق'
        },
        {
            text: '﴿وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ﴾',
            ref: 'سورة الطلاق - الآية 3',
            meaning: 'التوكل على الله'
        },
        {
            text: '﴿إِنَّ اللَّهَ مَعَ الصَّابِرِينَ﴾',
            ref: 'سورة البقرة - الآية 153',
            meaning: 'البشرى للصابرين'
        }
    ];
    
    // استخدام تاريخ اليوم لاختيار آية مختلفة كل يوم
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const verseIndex = dayOfYear % verses.length;
    const verse = verses[verseIndex];
    
    // تحديث الآية في الصفحة
    const verseElements = document.querySelectorAll('.daily-verse, .verse-text');
    const refElements = document.querySelectorAll('.verse-reference, .verse-details');
    
    verseElements.forEach(el => {
        if (el.classList.contains('daily-verse')) {
            el.textContent = verse.text;
        } else if (el.classList.contains('verse-text')) {
            el.textContent = verse.text;
        }
    });
    
    refElements.forEach(el => {
        if (el.classList.contains('verse-reference')) {
            el.textContent = verse.ref;
        } else if (el.classList.contains('verse-details')) {
            el.textContent = verse.ref;
        }
    });
    
    console.log(`📖 آية اليوم: ${verse.text} (${verse.ref})`);
}

// تحديث أوقات الصلاة
function updatePrayerTimes() {
    // هذه أوقات افتراضية، يمكن استبدالها بـ API حقيقي
    const prayerTimes = {
        fajr: '04:30',
        dhuhr: '12:15',
        asr: '15:45',
        maghrib: '18:20',
        isha: '19:45'
    };
    
    // تحديث الأوقات في الصفحة
    document.querySelectorAll('.prayer-time, .time').forEach((el, index) => {
        const times = Object.values(prayerTimes);
        if (times[index]) {
            el.textContent = times[index];
        }
    });
    
    // حساب الوقت المتبقي للصلاة التالية
    updateNextPrayerTime();
}

function updateNextPrayerTime() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayerTimes = [
        { name: 'الفجر', time: '04:30', minutes: 270 },
        { name: 'الظهر', time: '12:15', minutes: 735 },
        { name: 'العصر', time: '15:45', minutes: 945 },
        { name: 'المغرب', time: '18:20', minutes: 1100 },
        { name: 'العشاء', time: '19:45', minutes: 1185 }
    ];
    
    // إيجاد الصلاة التالية
    let nextPrayer = null;
    for (const prayer of prayerTimes) {
        if (prayer.minutes > currentTime) {
            nextPrayer = prayer;
            break;
        }
    }
    
    // إذا لم نجد صلاة تالية (بعد العشاء)، نعود للفجر
    if (!nextPrayer) {
        nextPrayer = prayerTimes[0];
        nextPrayer.minutes += 24 * 60; // إضافة يوم كامل
    }
    
    // حساب الوقت المتبقي
    const timeLeft = nextPrayer.minutes - currentTime;
    const hours = Math.floor(timeLeft / 60);
    const minutes = timeLeft % 60;
    
    // تحديث العرض (يمكن إضافته لاحقاً)
    console.log(`🕌 الصلاة التالية: ${nextPrayer.name} - متبقي: ${hours} ساعة ${minutes} دقيقة`);
}

// التنقل السلس
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    // إغلاق القائمة المتحركة إذا كانت مفتوحة
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                    }
                    
                    // التمرير إلى القسم المطلوب
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // تحديث القائمة النشطة
                    updateActiveNavLink(href);
                }
            }
        });
    });
}

// تحديث الرابط النشط في القائمة
function updateActiveNavLink(href) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

// شريط التقدم
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

// القائمة المتحركة
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// الأسئلة المتكررة
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const icon = this.querySelector('i');
                
                // إغلاق جميع الإجابات الأخرى
                document.querySelectorAll('.faq-answer').forEach(item => {
                    if (item !== answer) {
                        item.style.maxHeight = null;
                        item.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
                    }
                });
                
                // فتح/إغلاق الإجابة الحالية
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                    if (icon) icon.style.transform = 'rotate(0deg)';
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            });
        });
        
        // فتح أول سؤال
        if (faqQuestions[0]) {
            const firstAnswer = faqQuestions[0].nextElementSibling;
            if (firstAnswer) {
                firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
                const firstIcon = faqQuestions[0].querySelector('i');
                if (firstIcon) firstIcon.style.transform = 'rotate(180deg)';
            }
        }
    }
}

// تأثيرات البطاقات
function initCardAnimations() {
    const cards = document.querySelectorAll('.learning-card, .conclusion-card, .story-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => observer.observe(card));
}

// تحديث الإحصائيات
function updateStats() {
    const stats = [
        { element: '.stat-number', value: 114, suffix: '' }, // سور القرآن
        { element: '.stat-number', value: 5, suffix: '' }, // صلوات
        { element: '.stat-number', value: 1.9, suffix: '' }, // مليار مسلم
        { element: '.stat-number', value: 57, suffix: '' } // دولة
    ];
    
    // تأثير العد المتزايد
    stats.forEach(stat => {
        const elements = document.querySelectorAll(stat.element);
        elements.forEach((el, index) => {
            if (index < stats.length) {
                animateCounter(el, stat.value, 2000);
            }
        });
    });
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// تعيين التاريخ الحالي
function setCurrentDate() {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        calendar: 'islamic'
    };
    
    const dateString = today.toLocaleDateString('ar-SA', options);
    console.log(`📅 التاريخ الهجري: ${dateString}`);
}

// ===== وظائف التنزيل =====

function downloadFile(type) {
    const fileMap = {
        'wudu': {
            name: 'دليل_الوضوء_الكامل.pdf',
            url: 'downloads/wudu-guide.pdf',
            size: '2.5 ميجابايت'
        },
        'prayer': {
            name: 'دليل_الصلاة_الكامل.pdf',
            url: 'downloads/prayer-guide.pdf',
            size: '3.2 ميجابايت'
        },
        'quran-pdf': {
            name: 'المصحف_الشريف.pdf',
            url: 'downloads/quran-complete.pdf',
            size: '15 ميجابايت'
        },
        'quran-audio': {
            name: 'تلاوة_القرآن_كاملة.zip',
            url: 'downloads/quran-audio.zip',
            size: '350 ميجابايت'
        },
        'quran-app': {
            name: 'مصحف_إلكتروني.apk',
            url: 'downloads/quran-app.apk',
            size: '25 ميجابايت'
        }
    };
    
    const file = fileMap[type];
    if (!file) return;
    
    // إظهار رسالة تأكيد
    if (confirm(`هل تريد تحميل "${file.name}" (${file.size})؟`)) {
        showNotification(`جارٍ تحميل: ${file.name}`, 'info');
        
        // محاكاة التحميل (في النسخة النهائية ستكون روابط حقيقية)
        setTimeout(() => {
            // window.open(file.url, '_blank'); // فتح الرابط الحقيقي
            showNotification(`تم بدء تحميل ${file.name}`, 'success');
        }, 1000);
    }
}

// ===== وظائف الفيديو =====

function showVideo(type) {
    const videos = {
        'wudu': 'https://www.youtube.com/embed/VIDEO_ID_WUDU',
        'prayer': 'https://www.youtube.com/embed/VIDEO_ID_PRAYER'
    };
    
    const videoUrl = videos[type];
    if (videoUrl) {
        // فتح نافذة جديدة أو إظهار فيديو في الموقع
        window.open(videoUrl, '_blank');
        showNotification('جارٍ فتح الفيديو التعليمي...', 'info');
    }
}

// ===== وظائف النموذج =====

function clearForm() {
    const form = document.querySelector('#ask-private form');
    if (form && confirm('هل تريد مسح جميع الحقول؟')) {
        form.reset();
        showNotification('تم مسح النموذج', 'success');
    }
}

// إرسال النموذج (مع Formspree)
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // تعطيل الزر وإظهار المؤشر
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ الإرسال...';
    
    // محاكاة الإرسال
    setTimeout(() => {
        // في الحقيقة: form.submit();
        
        // عرض رسالة نجاح
        showNotification('✅ تم إرسال سؤالك بنجاح! سنرد عليك قريبًا.', 'success');
        
        // إعادة تعيين النموذج
        form.reset();
        
        // إعادة تفعيل الزر
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 2000);
}

// إرفاق مستمع الحدث للنموذج
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#ask-private form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// ===== وظائف الأزرار العائمة =====

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('التمرير إلى الأعلى', 'info');
}

function playQuran() {
    // يمكن إضافة مشغل صوتي حقيقي هنا
    showNotification('🔊 ستبدأ تلاوة القرآن قريباً...', 'info');
    
    // مثال لتشغيل صوت
    const audio = new Audio('https://www.islamicfinder.org/assets/media/athan/fajr.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => {
        console.log('خطأ في تشغيل الصوت:', e);
        showNotification('تعذر تشغيل التلاوة. حاول مجدداً.', 'error');
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.floating-btn:nth-child(3) i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        showNotification('🌙 تم تفعيل الوضع الداكن', 'success');
        
        // حفظ التفضيل
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        showNotification('☀️ تم تفعيل الوضع الفاتح', 'success');
        
        // حفظ التفضيل
        localStorage.setItem('theme', 'light');
    }
}

// تحميل التفضيلات المحفوظة
function loadPreferences() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.floating-btn:nth-child(3) i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// ===== الإشعارات =====

function showNotification(message, type = 'info') {
    // إزالة أي إشعارات سابقة
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // إنشاء الإشعار الجديد
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'info': 'fa-info-circle',
        'warning': 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // إضافة التنسيقات إذا لم تكن موجودة
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                padding: 15px 25px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                border-right: 4px solid var(--accent-color);
                max-width: 90%;
                width: 400px;
            }
            
            .notification.success {
                border-right-color: #2ecc71;
            }
            
            .notification.error {
                border-right-color: #e74c3c;
            }
            
            .notification.info {
                border-right-color: #3498db;
            }
            
            .notification.warning {
                border-right-color: #f39c12;
            }
            
            .notification i:first-child {
                font-size: 20px;
            }
            
            .notification.success i:first-child { color: #2ecc71; }
            .notification.error i:first-child { color: #e74c3c; }
            .notification.info i:first-child { color: #3498db; }
            .notification.warning i:first-child { color: #f39c12; }
            
            .notification span {
                flex: 1;
                font-weight: 500;
            }
            
            .notification button {
                background: none;
                border: none;
                cursor: pointer;
                color: #666;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideIn {
                from { top: -100px; opacity: 0; }
                to { top: 20px; opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // إزالة الإشعار تلقائياً بعد 5 ثوان
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== الترجمات =====

function toggleTranslate() {
    showNotification('🌐 يمكنك استخدام ميزة الترجمة في المتصفح:\n1. انقر بزر الماوس الأيمن\n2. اختر "ترجمة إلى العربية"\n3. اختر اللغة المطلوبة', 'info');
}

// ===== الكشف عن الموقع (لأوقات الصلاة) =====

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log('📍 الموقع:', position.coords.latitude, position.coords.longitude);
                // يمكن استخدام الإحداثيات لجلب أوقات الصلاة الدقيقة
            },
            error => {
                console.log('❌ خطأ في الحصول على الموقع:', error.message);
            }
        );
    }
}

// ===== تهيئة كل شيء عند التحميل =====

// استدعاء تحميل التفضيلات
loadPreferences();

// الكشف عن الموقع (اختياري)
// getLocation();
