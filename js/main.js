// main.js
document.addEventListener('DOMContentLoaded', function() {
    // إظهار/إخفاء القائمة السريعة عند التمرير
    window.addEventListener('scroll', function() {
        const quickNav = document.querySelector('.quick-nav');
        if (window.scrollY > 300 && window.innerWidth > 992) {
            quickNav.style.display = 'flex';
        } else if (window.innerWidth <= 992) {
            quickNav.style.display = 'none';
        }
    });
    
    // تحديث وقت الصلاة بناءً على الموقع
    updatePrayerTimes();
    
    // تهيئة جميع الأسئلة المتكررة
    initFAQ();
    
    // إضافة تأثيرات للبطاقات
    initCardAnimations();
});

function updatePrayerTimes() {
    // يمكن استبدال هذا بـ API حقيقي لأوقات الصلاة
    const prayerTimes = {
        fajr: '4:30',
        dhuhr: '12:15',
        asr: '15:45',
        maghrib: '18:20',
        isha: '19:45'
    };
    
    // تحديث الأوقات في الصفحة
    document.querySelectorAll('.prayer-time').forEach((el, index) => {
        const times = Object.values(prayerTimes);
        if (times[index]) {
            el.textContent = times[index];
        }
    });
}

function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-question');
    
    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = answer.classList.contains('active');
            
            // إغلاق جميع الإجابات
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.remove('active');
                item.style.maxHeight = null;
            });
            
            // إغلاق جميع الأسهم
            document.querySelectorAll('.faq-question i').forEach(icon => {
                icon.style.transform = 'rotate(0deg)';
            });
            
            // فتح الإجابة الحالية إذا كانت مغلقة
            if (!isActive) {
                answer.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                this.querySelector('i').style.transform = 'rotate(180deg)';
            }
        });
    });
    
    // فتح أول سؤال
    if (faqButtons.length > 0) {
        const firstAnswer = faqButtons[0].nextElementSibling;
        firstAnswer.classList.add('active');
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        faqButtons[0].querySelector('i').style.transform = 'rotate(180deg)';
    }
}

function initCardAnimations() {
    const cards = document.querySelectorAll('.learning-card, .story-card, .card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => observer.observe(card));
}

// وظائف التنزيل
function downloadFile(type) {
    const fileMap = {
        'wudu-guide.pdf': 'دليل_الوضوء_الكامل.pdf',
        'prayer-guide.pdf': 'دليل_الصلاة_الكامل.pdf',
        'quran-complete.pdf': 'المصحف_الشريف.pdf',
        'quran-audio.zip': 'تلاوة_القرآن_كاملة.zip',
        'quran-app.apk': 'مصحف_إلكتروني.apk'
    };
    
    const filename = fileMap[type] || type;
    
    // محاكاة التحميل (في النسخة الحقيقية ستكون روابط حقيقية)
    alert(`سيبدأ تحميل: ${filename}\n\nفي النسخة النهائية، ستكون هذه روابط تحميل حقيقية.`);
    
    // مثال لرابط تحميل حقيقي:
    // window.location.href = `downloads/${type}`;
}

// إظهار رسائل التأكيد
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// إضافة تنسيقات للإشعارات
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        border-right: 4px solid #2c786c;
    }
    
    .notification.success {
        border-right-color: #2ecc71;
    }
    
    .notification.info {
        border-right-color: #3498db;
    }
    
    .notification button {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 5px;
    }
    
    @keyframes slideIn {
        from { top: -100px; opacity: 0; }
        to { top: 20px; opacity: 1; }
    }
`;
document.head.appendChild(style);
