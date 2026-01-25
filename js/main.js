// ===== تهيئة الموقع =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('موقع العين الثالثة - جاهز للعمل');
    console.log('المطور: ilperata | البريد: ilperata@msn.com');
    
    // تهيئة الموقع
    initSite();
    
    // إضافة تأثيرات للتحميل
    addLoadingEffects();
    
    // إعداد نموذج الاتصال
    setupContactForm();
    
    // إعداد الأسئلة المتكررة
    setupFAQ();
    
    // إعداد الترجمة البسيطة
    setupSimpleTranslation();
    
    // إعداد زر العودة للأعلى
    setupBackToTop();
});

// ===== التهيئة الأساسية =====
function initSite() {
    // إضافة التاريخ الحالي في التذييل
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
    
    // اكتشاف لغة المتصفح
    detectBrowserLanguage();
    
    // تهيئة الروابط العائمة
    initFloatingNav();
}

// ===== نظام الترجمة البسيط =====
function setupSimpleTranslation() {
    const translateBtn = document.querySelector('.translate-simple-btn');
    const dropdown = document.querySelector('.simple-translation-dropdown');
    
    if (translateBtn && dropdown) {
        // إظهار/إخفاء القائمة
        translateBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function() {
            dropdown.classList.remove('active');
        });
        
        // منع إغلاق القائمة عند النقر داخلها
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

function detectBrowserLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    const isArabic = userLang.startsWith('ar');
    
    if (!isArabic) {
        // إذا كان الزائر غير عربي، نعرض رسالة ترحيب بعد 3 ثوانٍ
        setTimeout(() => {
            showTranslationWelcome();
        }, 3000);
    }
}

function showTranslationWelcome() {
    // إنشاء إشعار ترحيب للزوار غير العرب
    const notification = document.createElement('div');
    notification.className = 'translation-welcome';
    notification.innerHTML = `
        <div class="welcome-content">
            <i class="fas fa-globe-americas"></i>
            <div>
                <h4>Welcome non-Arabic visitor!</h4>
                <p>This site is in Arabic. To translate: <strong>Right-click → Translate to your language</strong></p>
            </div>
            <button class="close-welcome">&times;</button>
        </div>
    `;
    
    // إضافة التنسيقات
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        background: linear-gradient(135deg, #2c3e50, #3498db);
        color: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInLeft 0.5s ease;
    `;
    
    const welcomeContent = notification.querySelector('.welcome-content');
    welcomeContent.style.cssText = `
        display: flex;
        align-items: flex-start;
        gap: 20px;
    `;
    
    welcomeContent.querySelector('i').style.cssText = `
        font-size: 2.5rem;
        color: #f1c40f;
        margin-top: 5px;
    `;
    
    welcomeContent.querySelector('div').style.cssText = `
        flex: 1;
    `;
    
    welcomeContent.querySelector('h4').style.cssText = `
        margin: 0 0 10px 0;
        font-size: 1.2rem;
    `;
    
    welcomeContent.querySelector('p').style.cssText = `
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
    `;
    
    welcomeContent.querySelector('strong').style.cssText = `
        color: #f1c40f;
    `;
    
    const closeBtn = welcomeContent.querySelector('.close-welcome');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255,255,255,0.2)';
    });
    
    closeBtn.addEventListener('mouseout', function() {
        this.style.background = 'none';
    });
    
    // إضافة للإغلاق
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOutLeft 0.5s ease';
        setTimeout(() => {
            notification.remove();
            // حفظ في localStorage حتى لا تظهر مرة أخرى
            localStorage.setItem('translationWelcomeClosed', 'true');
        }, 500);
    });
    
    // التحقق إذا كانت الرسالة مخفية مسبقًا
    if (!localStorage.getItem('translationWelcomeClosed')) {
        document.body.appendChild(notification);
        
        // الإزالة التلقائية بعد 15 ثانية
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutLeft 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 15000);
    }
}

// ===== الروابط العائمة =====
function initFloatingNav() {
    const floatingNav = document.querySelector('.floating-nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            floatingNav.style.display = 'flex';
            setTimeout(() => {
                floatingNav.style.opacity = '1';
                floatingNav.style.transform = 'translateX(-50%) translateY(0)';
            }, 10);
        } else {
            floatingNav.style.opacity = '0';
            floatingNav.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => {
                if (window.scrollY <= 500) {
                    floatingNav.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // التنقل السلس
    document.querySelectorAll('.floating-nav-btn, a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // إضافة تأثير على القسم
                    highlightSection(targetElement);
                }
            }
        });
    });
}

function highlightSection(element) {
    element.style.transition = 'background-color 0.5s ease';
    element.style.backgroundColor = '#f0f7ff';
    
    setTimeout(() => {
        element.style.backgroundColor = '';
    }, 2000);
}

// ===== إعداد نموذج الاتصال =====
function setupContactForm() {
    const form = document.getElementById('real-contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const loadingDiv = document.getElementById('submit-loading');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const charCounter = document.getElementById('char-counter');
    
    if (!form) return;
    
    // عداد الأحرف
    const questionField = document.getElementById('real-question');
    if (questionField && charCounter) {
        questionField.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = length;
            
            if (length > 2000) {
                charCounter.style.color = '#e74c3c';
            } else if (length > 1500) {
                charCounter.style.color = '#f39c12';
            } else {
                charCounter.style.color = '#7f8c8d';
            }
        });
    }
    
    // التحقق من البريد الإلكتروني
    const emailField = document.getElementById('sender-email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
    
    // معالجة إرسال النموذج
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // التحقق من صحة الحقول
        if (!validateForm()) {
            return;
        }
        
        // إظهار حالة التحميل
        submitBtn.disabled = true;
        loadingDiv.style.display = 'flex';
        submitBtn.querySelector('span').style.visibility = 'hidden';
        
        // إخفاء الرسائل السابقة
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        try {
            // إرسال البيانات عبر Formspree
            const formData = new FormData(form);
            
            // إضافة بيانات إضافية
            formData.append('_gotcha', ''); // لمكافحة البوتات
            formData.append('_format', 'plain');
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // نجاح الإرسال
                showSuccessMessage();
                form.reset();
                charCounter.textContent = '0';
                
                // تتبع الحدث
                trackEvent('contact_form_success');
            } else {
                // خطأ في الإرسال
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            // فشل الإرسال
            console.error('Error submitting form:', error);
            showErrorMessage();
            
            // تتبع الحدث
            trackEvent('contact_form_error');
        } finally {
            // إعادة تعيين حالة الزر
            submitBtn.disabled = false;
            loadingDiv.style.display = 'none';
            submitBtn.querySelector('span').style.visibility = 'visible';
        }
    });
    
    // وظائف المساعدة
    function validateForm() {
        const question = questionField ? questionField.value.trim() : '';
        const email = emailField ? emailField.value.trim() : '';
        
        // التحقق من السؤال
        if (question.length < 10) {
            alert('الرجاء كتابة سؤال واضح (على الأقل 10 أحرف)');
            if (questionField) questionField.focus();
            return false;
        }
        
        if (question.length > 2000) {
            alert('السؤال طويل جدًا (الحد الأقصى 2000 حرف)');
            if (questionField) questionField.focus();
            return false;
        }
        
        // التحقق من البريد الإلكتروني (إذا تم إدخاله)
        if (email && !validateEmail(emailField)) {
            return false;
        }
        
        return true;
    }
    
    function showSuccessMessage() {
        successMessage.style.display = 'flex';
        errorMessage.style.display = 'none';
        
        // إخفاء الرسالة بعد 10 ثوانٍ
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 10000);
    }
    
    function showErrorMessage() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'flex';
        
        // إخفاء الرسالة بعد 10 ثوانٍ
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 10000);
    }
}

function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        input.style.borderColor = '#e74c3c';
        input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        // إضافة رسالة خطأ صغيرة
        let errorMsg = input.parentNode.querySelector('.email-error');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'email-error';
            errorMsg.style.cssText = `
                color: #e74c3c;
                font-size: 0.9rem;
                margin-top: 5px;
            `;
            input.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = 'البريد الإلكتروني غير صحيح';
        
        return false;
    } else {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        
        // إزالة رسالة الخطأ
        const errorMsg = input.parentNode.querySelector('.email-error');
        if (errorMsg) {
            errorMsg.remove();
        }
        
        return true;
    }
}

function clearContactForm() {
    if (confirm('هل تريد مسح النص؟')) {
        const form = document.getElementById('real-contact-form');
        if (form) {
            form.reset();
            
            // إعادة تعيين عداد الأحرف
            const charCounter = document.getElementById('char-counter');
            if (charCounter) {
                charCounter.textContent = '0';
            }
            
            // إخفاء الرسائل
            const successMessage = document.getElementById('success-message');
            const errorMessage = document.getElementById('error-message');
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
        }
    }
}

// ===== إعداد الأسئلة المتكررة =====
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

function toggleFAQ(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('i');
    
    // إغلاق جميع الإجابات الأخرى
    document.querySelectorAll('.faq-answer').forEach(item => {
        if (item !== answer && item.classList.contains('active')) {
            item.classList.remove('active');
            item.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
        }
    });
    
    // فتح/إغلاق الإجابة الحالية
    answer.classList.toggle('active');
    
    if (answer.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

// ===== وظائف الصلاة والموارد =====
function trackResourceClick(resourceName) {
    // تتبع النقر على الموارد
    console.log(`تم النقر على المورد: ${resourceName}`);
    trackEvent(`resource_click_${resourceName}`);
    
    // يمكن إضافة Google Analytics هنا
    // gtag('event', 'resource_click', { 'resource_name': resourceName });
}

function playShahadahAudio() {
    // تشغيل النطق الصحيح للشهادتين
    const audio = new Audio('https://www.everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/001001.mp3');
    audio.play().catch(e => {
        console.log('تعذر تشغيل الصوت:', e);
        alert('يمكنك سماع النطق الصحيح من خلال هذا الرابط: https://youtu.be/مثال');
    });
    
    trackEvent('shahadah_audio_played');
}

function showEncouragement() {
    const messages = [
        "كل رحلة تبدأ بخطوة، وأنت قد بدأت! الله معك.",
        "لا تستعجل، التدرج سنة الله في الكون. أنت على الطريق الصحيح.",
        "الله يحب العبد المتأني في أمره. خذ وقتك وتأكد.",
        "الشك أول مراحل اليقين. ابحث بصدق تجد الحق.",
        "الله يهدي من يشاء. وأنت تبحث، وهذا دليل أن الله يريد بك خيرًا."
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    alert('💝 تشجيع لك:\n\n' + randomMessage);
    
    trackEvent('encouragement_shown');
}

function showCommonMistakes() {
    const mistakes = `
🚫 **أخطاء شائعة للمبتدئين:**

1. **التسرع**: الإسلام دين يسر، لا تعجل في كل شيء.

2. **المقارنة بالآخرين**: كل شخص له رحلته الخاصة.

3. **الشعور بعدم الكفاية**: الله يغفر الذنوب جميعًا.

4. **التركيز على الشكليات**: الإيمان أولاً، ثم الأعمال.

5. **الاستسلام للوساوس**: الشيطان يحاول إبعادك عن الحق.

✅ **نصيحة:** ابدأ بما تستطيع، وداوم عليه. الأهم هو الإخلاص لله.
`;
    
    alert(mistakes);
    trackEvent('common_mistakes_shown');
}

// ===== زر العودة للأعلى =====
function setupBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
            setTimeout(() => {
                backToTopBtn.style.opacity = '1';
            }, 10);
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.scrollY <= 300) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
    
    backToTopBtn.addEventListener('click', scrollToTop);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    trackEvent('back_to_top_clicked');
}

// ===== وظائف إضافية =====
function addLoadingEffects() {
    // إضافة تأثيرات للعناصر عند ظهورها
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
    
    // مراقبة العناصر
    document.querySelectorAll('.feature-card, .question-item, .step-card').forEach(el => {
        observer.observe(el);
    });
}

function showContactInfo() {
    const info = `
📞 **للتواصل المباشر:**

📧 البريد الإلكتروني: **ilperata@msn.com**

⏰ وقت الرد المتوقع: 24-48 ساعة

📋 للأسئلة العاجلة أو الخاصة جدًا

🔒 نضمن خصوصيتك التامة
`;
    
    alert(info);
    trackEvent('contact_info_shown');
}

function showTranslationHelp() {
    const help = `
🌐 **كيف تترجم الموقع بلغتك:**

1. **في متصفح Chrome أو Edge:**
   - انقر بزر الماوس الأيمن في أي مكان
   - اختر "ترجمة إلى..." أو "Translate to..."
   - اختر لغتك

2. **في الهاتف:**
   - اضغط على القائمة ☰
   - ابحث عن خيار "ترجمة الصفحة"

3. **بديل سريع:**
   - افتح https://translate.google.com
   - الصق الرابط: https://eye-of-truth.vercel.app
   - اختر لغتك

💡 **ملاحظة:** جوجل ترجمة قد لا تكون دقيقة 100% للنصوص الدينية، لكنها تعطي الفكرة العامة.
`;
    
    alert(help);
    trackEvent('translation_help_shown');
}

// ===== التتبع والتحليلات =====
function trackEvent(eventName) {
    console.log(`[Event Tracked]: ${eventName}`);
    
    // يمكن إضافة Google Analytics هنا
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': 'User Interaction'
        });
    }
    */
    
    // يمكن إضافة تحليلات أخرى
    try {
        // مثال لـ Facebook Pixel
        // fbq('track', 'Custom', { event_name: eventName });
    } catch (e) {
        // تجاهل الأخطاء
    }
}

// ===== رسومات CSS إضافية =====
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInLeft {
            from { transform: translateX(-100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutLeft {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-100px); opacity: 0; }
        }
        
        .animated {
            animation: fadeInUp 0.8s ease;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .simple-translation-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
    `;
    
    document.head.appendChild(style);
}

// إضافة الرسومات عند التحميل
addCustomStyles();

// ===== دالة للمساعدة في تطوير الموقع =====
function siteInfo() {
    console.log(`
    🌟 معلومات الموقع 🌟
    
    اسم الموقع: العين الثالثة لم ترَ جائعًا
    الرابط: https://eye-of-truth.vercel.app
    البريد: ilperata@msn.com
    المطور: ilperata
    الإصدار: 2.0.0
    التاريخ: ${new Date().toLocaleDateString('ar-SA')}
    
    المميزات:
    - موقع دعوي يعتمد على الفطرة
    - نموذج اتصال حقيقي يرسل للبريد
    - روابط تعليمية حقيقية للصلاة
    - متجاوب مع جميع الأجهزة
    - يدعم الترجمة عبر المتصفح
    
    للتطوير: يمكنك فتح وحدة التحكم لمزيد من المعلومات.
    `);
}

// جعل الدالة متاحة عالميًا للمطورين
window.siteInfo = siteInfo;
