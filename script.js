// script.js - ملف التفاعلات للموقع

// ===== 1. تذكير الصلاة على النبي (كل 5 دقائق) =====
const reminderBox = document.getElementById('prophet-reminder');
let reminderShown = false;

function showReminder() {
    if (!reminderShown) {
        reminderBox.style.display = 'flex';
        reminderShown = true;
        // بعد 30 ثانية، يختفي التذكير تلقائياً
        setTimeout(() => {
            reminderBox.style.display = 'none';
        }, 30000);
    }
}

function closeReminder() {
    reminderBox.style.display = 'none';
}

// عرض التذكير أول مرة بعد 5 دقائق (300000 ميلي ثانية)
setTimeout(showReminder, 300000);
// ثم كل 5 دقائق بعد ذلك
setInterval(showReminder, 300000);

// ===== 2. نظام مواقيت الصلاة الكامل =====
let currentCity = "Cairo,Egypt";
let prayerTimesData = null;

async function fetchPrayerTimes(city = currentCity) {
    const [cityName, country] = city.split(',');
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${cityName.trim()}&country=${country.trim()}&method=5&school=0`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 200) {
            prayerTimesData = data.data;
            updatePrayerTimesUI();
            updateNextPrayer();
            startCountdown();
            return true;
        } else {
            throw new Error('استجابة غير صحيحة من API');
        }
    } catch (error) {
        console.error("خطأ في جلب مواقيت الصلاة:", error);
        document.getElementById('prayer-times-list').innerHTML = `
            <div class="prayer-item">
                <span class="prayer-name">خطأ</span>
                <span class="prayer-time">تحديث</span>
            </div>
        `;
        return false;
    }
}

function updatePrayerTimesUI() {
    if (!prayerTimesData) return;
    
    const timings = prayerTimesData.timings;
    const prayers = [
        { key: "Fajr", name: "الفجر" },
        { key: "Dhuhr", name: "الظهر" },
        { key: "Asr", name: "العصر" },
        { key: "Maghrib", name: "المغرب" },
        { key: "Isha", name: "العشاء" }
    ];
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    let currentPrayerIndex = -1;
    
    // تحديد الصلاة الحالية
    prayers.forEach((prayer, index) => {
        const [prayerHour, prayerMinute] = timings[prayer.key].split(':').map(Number);
        if (currentHour > prayerHour || (currentHour === prayerHour && currentMinute >= prayerMinute)) {
            currentPrayerIndex = index;
        }
    });
    
    const nextPrayerIndex = (currentPrayerIndex + 1) % prayers.length;
    
    // تحديث القائمة
    const prayerList = document.getElementById('prayer-times-list');
    prayerList.innerHTML = '';
    
    prayers.forEach((prayer, index) => {
        const prayerItem = document.createElement('div');
        prayerItem.className = 'prayer-item';
        
        if (index === nextPrayerIndex) {
            prayerItem.classList.add('current-next');
        }
        
        prayerItem.innerHTML = `
            <span class="prayer-name">${prayer.name}</span>
            <span class="prayer-time">${timings[prayer.key]}</span>
        `;
        
        prayerList.appendChild(prayerItem);
    });
    
    // تحديث التاريخ الهجري
    const hijri = prayerTimesData.date.hijri;
    document.getElementById('hijri-date').textContent = 
        `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
}

function updateNextPrayer() {
    if (!prayerTimesData) return;
    
    const timings = prayerTimesData.timings;
    const prayers = [
        { key: "Fajr", name: "الفجر" },
        { key: "Dhuhr", name: "الظهر" },
        { key: "Asr", name: "العصر" },
        { key: "Maghrib", name: "المغرب" },
        { key: "Isha", name: "العشاء" }
    ];
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    let nextPrayer = prayers[1]; // افتراضي الظهر
    let found = false;
    
    for (const prayer of prayers) {
        const [prayerHour, prayerMinute] = timings[prayer.key].split(':').map(Number);
        if (currentHour < prayerHour || (currentHour === prayerHour && currentMinute < prayerMinute)) {
            nextPrayer = prayer;
            found = true;
            break;
        }
    }
    
    if (!found) {
        // إذا كانت كل الصلوات مضت، التالية هي فجر اليوم التالي
        nextPrayer = prayers[0];
    }
    
    document.getElementById('next-name').textContent = nextPrayer.name;
    document.getElementById('next-countdown').textContent = 'حساب...';
    
    return nextPrayer;
}

function startCountdown() {
    setInterval(() => {
        if (!prayerTimesData) return;
        
        const nextPrayer = updateNextPrayer();
        const now = new Date();
        const [nextHour, nextMinute] = prayerTimesData.timings[nextPrayer.key].split(':').map(Number);
        
        let nextPrayerTime = new Date();
        nextPrayerTime.setHours(nextHour, nextMinute, 0);
        
        // إذا كانت الصلاة التالية هي فجر الغد
        if (nextPrayer.key === "Fajr" && now.getHours() > 12) {
            nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
        }
        
        const diffMs = nextPrayerTime - now;
        
        if (diffMs > 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('next-countdown').textContent = 
                `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}`;
        } else {
            document.getElementById('next-countdown').textContent = 'الآن!';
        }
    }, 1000);
}

// تفعيل عناصر التحكم
document.addEventListener('DOMContentLoaded', function() {
    // تحديث عند تغيير المدينة
    const citySelect = document.getElementById('city-select');
    if (citySelect) {
        citySelect.addEventListener('change', function() {
            currentCity = this.value;
            fetchPrayerTimes(currentCity);
        });
    }
    
    // زر تحديث
    const refreshBtn = document.getElementById('refresh-prayer');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('loading');
            fetchPrayerTimes().then(() => {
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 500);
            });
        });
    }
    
    // زر تصغير
    const minimizeBtn = document.getElementById('minimize-prayer');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            const widget = document.getElementById('prayer-times-widget');
            widget.classList.toggle('minimized');
            this.innerHTML = widget.classList.contains('minimized') ? 
                '<i class="fas fa-plus"></i>' : '<i class="fas fa-minus"></i>';
        });
    }
    
    // زر الموقع الحالي
    const detectBtn = document.getElementById('detect-location');
    if (detectBtn) {
        detectBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    // يمكن إضافة API للعكس الجغرافي هنا
                    this.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
                    alert('تم تحديد موقعك! سيتم إضافة هذه الميزة قريباً.');
                });
            } else {
                alert('المتصفح لا يدعم تحديد الموقع');
            }
        });
    }
    
    // التحميل الأولي
    fetchPrayerTimes();
});
// ===== 3. معالجة نموذج "اسأل بخفاء" =====
const questionForm = document.getElementById('secret-question-form');
if (questionForm) {
    questionForm.addEventListener('submit', function(event) {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        const question = document.getElementById('question-input').value;
        const email = document.getElementById('user-email').value;

        if (!question || !email) {
            alert("الرجاء ملء كل الحقول المطلوبة.");
            return;
        }

        // هنا يجب أن يكون لديك سكريبت خادم (Backend) لمعالجة الإرسال
        // هذا مثال باستخدام خدمة Formspree المجانية (سأشرحها لك بعد قليل)
        alert(`شكراً لك. سؤالكم: "${question.substring(0, 50)}..."\nتم استلامه بنجاح وسنرد عليكم على البريد: ${email}\n\n(ملاحظة: هذه نسخة تجريبية. لتفعيل الإرسال الحقيقي، اتبع التعليمات في التعليقات أدناه.)`);

        // إعادة تعيين النموذج
        questionForm.reset();
    });
}

// ===== 4. تحسين تجربة الصوت =====
const audioPlayer = document.getElementById('quran-audio');
if (audioPlayer) {
    // يمكنك إضافة تفاعلات إضافية للصوت هنا
    audioPlayer.addEventListener('play', function() {
        console.log("بدأت الاستماع إلى التلاوة. بارك الله فيك.");
    });
}

// ===== 5. تفعيل التمرير السلس للروابط الداخلية =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// ===== 6. إضافة تأثير عند التمرير للبطاقات =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// مراقبة البطاقات
document.querySelectorAll('.question-card, .story-card').forEach(card => {
    observer.observe(card);
});


console.log("مرحباً بك في منارة 'العين الثالثة'. تم تحميل جميع التفاعلات بنجاح.");
// ===== 7. تفعيل فلتر مقارنات الأديان =====
const filterButtons = document.querySelectorAll('.filter-btn');
const comparisonRows = document.querySelectorAll('.comparison-row');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة النشاط من كل الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة النشاط للزر المختار
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // تصفية الصفوف
            comparisonRows.forEach(row => {
                if (category === 'all' || row.getAttribute('data-category') === category) {
                    row.classList.remove('hidden');
                    setTimeout(() => {
                        row.style.opacity = '1';
                        row.style.transform = 'translateX(0)';
                    }, 50);
                } else {
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        row.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// ===== 8. زر إظهار المزيد من المقارنات =====
const showMoreBtn = document.getElementById('showMoreComparisons');
if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function() {
        // هذا مثال لمقارنة إضافية يمكن إضافتها ديناميكياً
        const newComparison = `
        <tr class="comparison-row" data-category="text">
            <td class="point-title">
                <strong>النسخ والتحريف</strong>
                <div class="point-desc">هل اعترفت الكتب بوجود تحريف؟</div>
            </td>
            <td>
                <div class="text-box torah">
                    <p>"يد يهوه عليهم للتحريف" (سفر عزرا)</p>
                    <div class="analysis">نصوص تشير إلى تحريف سابق، مما يضعف ثقة القارئ بالنص الحالي.</div>
                </div>
            </td>
            <td>
                <div class="text-box gospel">
                    <p>"إن كان أحد يزيد على هذا يزيد الله عليه الضربات" (رؤيا 22:18)</p>
                    <div class="analysis">تحذير من الزيادة يدل على إمكانية التحريف.</div>
                </div>
            </td>
            <td>
                <div class="text-box quran highlight">
                    <p>﴿وَإِنَّهُ لَكِتَابٌ عَزِيزٌ * لَا يَأْتِيهِ الْبَاطِلُ مِنْ بَيْنِ يَدَيْهِ وَلَا مِنْ خَلْفِهِ﴾ [فصلت: 41-42]</p>
                    <div class="analysis">تحدي بعدم القدرة على تحريفه، وقد تحقق عبر 14 قرناً.</div>
                    <span class="verdict">مناعة ضد التحريف</span>
                </div>
            </td>
        </tr>
        `;
        
        // إضافة المقارنة الجديدة إلى الجدول
        const tbody = document.querySelector('.comparison-table tbody');
        if (tbody) {
            tbody.insertAdjacentHTML('beforeend', newComparison);
            this.innerHTML = '<i class="fas fa-check"></i> تمت إضافة مقارنة جديدة';
            this.disabled = true;
            this.style.backgroundColor = '#e8f5e9';
            
            // إعادة ربط حدث الفلتر للصف الجديد
            const newRow = tbody.lastElementChild;
            comparisonRows.push(newRow); // إضافة للصفيف (لنعمل بشكل مبسط)
        }
    });
}

