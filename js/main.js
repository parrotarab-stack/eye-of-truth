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
// نظام الترجمة البديل
function openTranslateModal() {
    document.getElementById('translate-modal').style.display = 'block';
    document.getElementById('translate-btn').innerHTML = '<i class="fas fa-times"></i> إغلاق';
}

function closeTranslateModal() {
    document.getElementById('translate-modal').style.display = 'none';
    document.getElementById('translate-btn').innerHTML = '<i class="fas fa-globe"></i> لغات أخرى';
}

function showTranslationMessage(message) {
    alert('🚧 ' + message + '\n\nحاليًا: الموقع بالعربية فقط. يمكنك استخدام:\n1. مترجم المتصفح المدمج\n2. إضافة Google Translate\n3. انتظار النسخ المترجمة يدويًا');
}

function showBrowserTranslationHelp() {
    const helpText = `
🎯 طريقة الترجمة الفورية:

1. في متصفح Chrome أو Edge:
   - انقر بزر الماوس الأيمن على أي مكان في الصفحة
   - اختر "ترجمة إلى..." أو "Translate to..."
   - اختر لغتك

2. في متصفح Firefox:
   - اضغط Ctrl+Shift+Y (أو Cmd+Shift+Y في Mac)
   - أو نزل إضافة Google Translate

3. في الهاتف:
   - افتح القائمة ☰
   - اختر "ترجمة الصفحة"
   
✅ بهذه الطريقة يمكنك ترجمة كل المحتوى فورياً!`;
    
    alert(helpText);
}

// تحديث زر الترجمة في الشريط العلوي
document.getElementById('translate-btn').addEventListener('click', function() {
    if (document.getElementById('translate-modal').style.display === 'block') {
        closeTranslateModal();
    } else {
        openTranslateModal();
    }
});

// إغلاق النافذة عند النقر خارجها
window.addEventListener('click', function(event) {
    const modal = document.getElementById('translate-modal');
    if (event.target === modal) {
        closeTranslateModal();
    }
});
// اكتشاف لغة الزائر
function detectUserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    const nonArabicLangs = ['en', 'fr', 'es', 'zh', 'ru', 'de', 'pt', 'it', 'ja', 'ko'];
    
    if (lang && !lang.startsWith('ar')) {
        // إذا كان الزائر يتحدث لغة غير عربية
        showWelcomeTranslationMessage(lang);
        return lang.substring(0, 2); // إرجاع كود اللغة (مثل 'en')
    }
    return 'ar';
}

function showWelcomeTranslationMessage(langCode) {
    const messages = {
        'en': 'Welcome! This site is in Arabic. You can translate it using your browser.',
        'fr': 'Bienvenue ! Ce site est en arabe. Vous pouvez le traduire avec votre navigateur.',
        'es': '¡Bienvenido! Este sitio está en árabe. Puedes traducirlo con tu navegador.',
        'zh': '欢迎！本网站为阿拉伯语。您可以使用浏览器进行翻译。'
    };
    
    const message = messages[langCode] || 
                   'Welcome! This site is in Arabic. You can translate it using browser right-click.';
    
    setTimeout(() => {
        // إشعار لطيف
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-globe-americas"></i>
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // تنسيق الإشعار
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideUp 0.5s ease;
            max-width: 90%;
        `;
        
        notification.querySelector('.close-notification').onclick = () => {
            notification.style.animation = 'slideDown 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        };
        
        // إزالة تلقائية بعد 10 ثوانٍ
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideDown 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 10000);
    }, 2000);
}

// استدعاء اكتشاف اللغة عند التحميل
detectUserLanguage();
// نظام الترجمة الحقيقي
const translations = {
    ar: {
        // النصوص العربية الأصلية
    },
    en: {
        // الترجمات الإنجليزية
        "العين الثالثة لم ترَ قط جائعًا": "The Third Eye Never Saw Hunger",
        "لأنها كانت تُطعمه سرًا بذيل النسيان": "Because it secretly fed him with the tail of forgetfulness",
        "هذا المكان ليس للجدال، ولا للفلسفة المعقدة": "This place is not for argument, nor for complex philosophy",
        "هنا نبحث عن الفِطرة النقية": "Here we search for pure instinct (Fitra)",
        "والكلام الواضح": "and clear speech",
        "والباب المفتوح لمن يريد أن يعرف ربه": "and the open door for those who want to know their Lord",
        "العين الثالثة: معنى العبارة": "The Third Eye: Meaning of the Phrase",
        "مفتاح لفهم أعمق للحياة": "A key to a deeper understanding of life",
        "البصيرة الروحية": "Spiritual insight",
        "تعرفها بالفطرة": "Know it instinctively",
        "بصيرة ونور": "Insight and light",
        "قصة رمزية": "Symbolic story",
        "فيه بالفطرة": "Within him instinctively",
        "الفِطرة: أسئلة عميقة لها إجابات": "Instinct (Fitra): Deep questions with answers",
        "اسأل نفسك... ثم استمع إلى القرآن يجيبك": "Ask yourself... then listen to the Quran answer you",
        "ما هي الفِطرة؟": "What is instinct (Fitra)?",
        "الجِبِلَّة الأصلية": "Original nature",
        "كل مولود يولد على الفطرة": "Every child is born with instinct (Fitra)",
        "لماذا أخلق؟ وما هدف حياتي؟": "Why was I created? What is my life's purpose?",
        "خلقك الله لتعرفه، وتعبده، وتقترب منه": "God created you to know Him, worship Him, and draw near to Him",
        "كل عمل يرضي الله": "Every act that pleases God",
        "لماذا الموت؟ ولماذا نُبعث مرة أخرى؟": "Why death? And why are we resurrected again?",
        "انتقال من دار الاختبار إلى دار الجزاء": "Transition from the abode of testing to the abode of recompense",
        "لماذا أشعر بالذنب عندما أخطئ؟": "Why do I feel guilty when I make a mistake?",
        "الفِطرة التي ألهمك الله إياها": "The instinct (Fitra) that God inspired in you",
        "كيف أعرف ربي؟": "How do I know my Lord?",
        "النظام المعجز": "The miraculous system",
        "اختبار فطري بسيط": "Simple instinctive test",
        "هل تفرح عندما تساعد غيرك؟": "Do you feel happy when you help others?",
        "هل تشعر بالذنب عندما تؤذي أحدًا؟": "Do you feel guilty when you hurt someone?",
        "هل تبحث عن معنى للحياة؟": "Do you search for meaning in life?",
        "الميل الفطري إلى الخير والحقيقة": "The natural inclination towards good and truth",
        "مقارنة واضحة: القرآن والكتب الأخرى": "Clear comparison: Quran and other books",
        "نصوص جنبًا إلى جنب - لتقرر بنفسك": "Texts side by side - so you can decide for yourself",
        "كل الرسل جاءوا بـ \"الله واحد\"": "All messengers came with \"One God\"",
        "ولكن البشر حرّفوا بعض الكتب": "But humans distorted some books",
        "نترك لك الحكم بنفسك": "We leave the judgment to you",
        "وحدانية الله": "Oneness of God",
        "حفظ النص": "Preservation of the text",
        "صفات الله": "Attributes of God",
        "النبوة الأخيرة": "The final prophecy",
        "توحيد خالص، لا تشبيه، لا تعدد": "Pure monotheism, no anthropomorphism, no multiplicity",
        "نفس النص في كل العالم منذ 1400 سنة": "The same text worldwide for 1400 years",
        "منزه عن التشبيه، كامل العلم والحكمة": "Transcendent above resemblance, complete in knowledge and wisdom",
        "خاتم النبيين، جاء مصدقًا لما بين يديه": "Seal of the prophets, came confirming what came before",
        "ما الذي نستنتجه؟": "What do we conclude?",
        "القرآن وحده بقي محفوظًا كما نزل": "Only the Quran remained preserved as it was revealed",
        "القرآن وحده حافظ على التوحيد الخالص": "Only the Quran maintained pure monotheism",
        "القرآن وحده جاء مصدقًا للكتب السابقة ومهيمنًا عليها": "Only the Quran came confirming previous books and superceding them",
        "قصص الهداية: نور على نور": "Guidance stories: light upon light",
        "تجارب حقيقية لأناس وجدوا طريقهم إلى الله": "Real experiences of people who found their way to God",
        "من ملحد إلى مؤمن": "From atheist to believer",
        "كنت أعتقد أن الكون صدفة...": "I used to believe the universe was a coincidence...",
        "كيف عرف هذا النبي أمي قبل 1400 سنة؟": "How did this prophet know this 1400 years ago?",
        "من مسيحي إلى مسلم": "From Christian to Muslim",
        "كنت أبحث عن التوحيد الخالص...": "I was searching for pure monotheism...",
        "كيف يكون الله واحدًا وفي نفس الوقت ثلاثة؟": "How can God be one and three at the same time?",
        "من لا أدري إلى طالب علم": "From agnostic to seeker of knowledge",
        "لم أكن أعرف ماذا أؤمن...": "I didn't know what to believe...",
        "وجدته يتوافق مع فطرتي": "Found it compatible with my instinct (Fitra)",
        "ملاحظة: هذه قصص حقيقية، لكننا حذفنا الأسماء تفاديًا للإحراج أو الأذى": "Note: These are real stories, but we removed names to avoid embarrassment or harm",
        "لست وحدك": "You are not alone",
        "ابدأ رحلتك: خطوات عملية": "Start your journey: Practical steps",
        "لا تحتاج إلى تعقيد، فقط ابدأ": "You don't need complexity, just start",
        "الخطوة الأولى: النية الصادقة": "Step 1: Sincere intention",
        "الله، إذا كنت موجودًا، فاهدني إلى الحق": "God, if You exist, guide me to the truth",
        "الخطوة الثانية: النطق بالشهادتين": "Step 2: Uttering the two testimonies",
        "أشهد أن لا إله إلا الله، وأشهد أن محمدًا رسول الله": "I bear witness that there is no god but Allah, and I bear witness that Muhammad is His messenger",
        "هذه هي العقدة التي تربطك بالله": "This is the bond that connects you to God",
        "لا تحتاج إلى إمام أو شهود": "You don't need an imam or witnesses",
        "الخطوة الثالثة: تعلم الصلاة": "Step 3: Learn prayer",
        "الصلاة هي الصلة المباشرة بينك وبين الله": "Prayer is the direct connection between you and God",
        "شاهد فيديو تعليم الصلاة في 10 دقائق": "Watch a 10-minute prayer tutorial video",
        "الخطوة الرابعة: قراءة القرآن": "Step 4: Reading the Quran",
        "ابدأ بـ: سورة الفاتحة، ثم الإخلاص، ثم الفلق، ثم الناس": "Start with: Surah Al-Fatihah, then Al-Ikhlas, then Al-Falaq, then An-Nas",
        "حمل مصحف إلكتروني مجاني": "Download a free digital Quran",
        "تذكير مهم": "Important reminder",
        "لا تيأس إذا أخطأت": "Don't despair if you make a mistake",
        "التدرج مطلوب": "Gradualism is required",
        "اسأل بخفاء: نحترم خصوصيتك": "Ask secretly: We respect your privacy",
        "يمكنك السؤال دون ذكر اسمك": "You can ask without mentioning your name",
        "رسالتك سريّة": "Your message is confidential",
        "سؤالك:": "Your question:",
        "اكتب سؤالك هنا... يمكن أن يكون عن الله، عن الإسلام، عن الشكوك، عن أي شيء يهمك": "Write your question here... It can be about God, Islam, doubts, anything that concerns you",
        "البريد الإلكتروني (اختياري، إذا أردت الرد):": "Email (optional, if you want a reply):",
        "أرسل سؤالك": "Send your question",
        "مسح النص": "Clear text",
        "أسئلة متكررة": "Frequently asked questions",
        "كيف أتأكد من وجود الله؟": "How can I be sure God exists?",
        "هل يمكن أن يكون هذا الكون الدقيق صدفة؟": "Could this precise universe be a coincidence?",
        "ماذا لو كنت خائفًا من التحول إلى الإسلام؟": "What if I'm afraid to convert to Islam?",
        "الخوف طبيعي": "Fear is natural",
        "كيف أتعلم الإسلام دون ضغط من الآخرين؟": "How can I learn Islam without pressure from others?",
        "هذا الموقع مكان آمن": "This website is a safe place",
        "Translate": "Translate",
        "ترجمة الموقع": "Website Translation",
        "الإنجليزية قريبًا": "English coming soon",
        "Français": "French",
        "Español": "Spanish",
        "نعمل على إضافة المزيد من اللغات قريبًا": "We're working on adding more languages soon"
    }
};

// وظائف الترجمة
let currentLanguage = 'ar';

function toggleRealTranslation() {
    const window = document.getElementById('translation-window');
    const overlay = document.createElement('div');
    overlay.className = 'translation-overlay';
    overlay.onclick = closeTranslationWindow;
    
    if (!window.classList.contains('active')) {
        document.body.appendChild(overlay);
        window.classList.add('active');
        setTimeout(() => overlay.classList.add('active'), 10);
    } else {
        closeTranslationWindow();
    }
}

function closeTranslationWindow() {
    const window = document.getElementById('translation-window');
    const overlay = document.querySelector('.translation-overlay');
    
    window.classList.remove('active');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

function changeLanguage(lang) {
    if (lang === currentLanguage) return;
    
    // تحديد الخيار المحدد
    document.querySelectorAll('.translation-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.lang === lang) {
            opt.classList.add('selected');
        }
    });
    
    // تغيير اللغة
    if (lang === 'ar') {
        // إرجاع إلى العربية
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        revertToArabic();
    } else if (translations[lang]) {
        // تطبيق الترجمة
        document.documentElement.lang = lang;
        document.documentElement.dir = 'ltr';
        applyTranslation(lang);
    }
    
    currentLanguage = lang;
    
    // إغلاق النافذة بعد الترجمة
    setTimeout(closeTranslationWindow, 500);
}

function applyTranslation(lang) {
    const trans = translations[lang];
    
    // ترجمة جميع العناصر التي تحتوي على نص عربي
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, td, th, li, .card-text, .hero-title, .hero-subtitle, .hero-description, .section-subtitle, .explanation, .story-text, .test-question, .test-note, .quran-text, .text-good, .text-bad, .text-note, .text-prophet, .final-note, .step-note, .lang-name, .lang-native, .faq-question')
        .forEach(element => {
            const originalText = element.getAttribute('data-original') || element.textContent.trim();
            if (trans[originalText]) {
                element.setAttribute('data-original', originalText);
                element.textContent = trans[originalText];
            }
        });
    
    // ترجمة العناصر الخاصة
    const translateBtn = document.querySelector('.floating-translate-btn span');
    if (translateBtn && trans['Translate']) {
        translateBtn.textContent = trans['Translate'];
    }
}

function revertToArabic() {
    // إرجاع جميع النصوص إلى العربية
    document.querySelectorAll('[data-original]').forEach(element => {
        const original = element.getAttribute('data-original');
        element.textContent = original;
        element.removeAttribute('data-original');
    });
}

// إضافة نص البدء
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء زر الترجمة العائم إذا لم يكن موجودًا
    if (!document.querySelector('.floating-translate-btn')) {
        const btn = document.createElement('div');
        btn.className = 'floating-translate-btn';
        btn.innerHTML = '<i class="fas fa-language"></i><span>Translate</span>';
        btn.onclick = toggleRealTranslation;
        document.body.appendChild(btn);
    }
    
    // إنشاء نافذة الترجمة إذا لم تكن موجودة
    if (!document.getElementById('translation-window')) {
        const windowHTML = `
            <div id="translation-window" class="translation-window">
                <div class="translation-header">
                    <h3><i class="fas fa-globe-americas"></i> ${translations.en['ترجمة الموقع'] || 'Website Translation'}</h3>
                    <button onclick="closeTranslationWindow()">&times;</button>
                </div>
                <div class="translation-body">
                    <div class="translation-options">
                        <div class="translation-option selected" data-lang="ar" onclick="changeLanguage('ar')">
                            <span class="flag">🇸🇦</span>
                            <span>العربية</span>
                        </div>
                        <div class="translation-option" data-lang="en" onclick="changeLanguage('en')">
                            <span class="flag">🇬🇧</span>
                            <span>English</span>
                        </div>
                    </div>
                    <div class="translation-note">
                        <p><i class="fas fa-info-circle"></i> ${translations.en['نعمل على إضافة المزيد من اللغات قريبًا'] || 'More languages coming soon'}</p>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', windowHTML);
    }
});
