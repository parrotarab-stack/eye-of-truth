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

// ===== 2. نظام مواقيت الصلاة الكامل مع تحديد الموقع التلقائي =====
let currentCity = "auto";
let prayerTimesData = null;
let userLocation = null;

// دالة للحصول على اسم المدينة من الإحداثيات (Geocoding)
async function getCityNameFromCoords(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ar`);
        const data = await response.json();
        
        if (data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.state;
            const country = data.address.country;
            return { city, country, fullName: `${city}, ${country}` };
        }
        return null;
    } catch (error) {
        console.error("خطأ في جلب اسم المدينة:", error);
        return null;
    }
}

// دالة جلب مواقيت الصلاة الرئيسية
async function fetchPrayerTimes(location = currentCity) {
    let url;
    
    try {
        if (location === "auto" && userLocation) {
            // استخدام الموقع التلقائي
            url = `https://api.aladhan.com/v1/timings?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&method=5&school=0`;
        } else if (location === "auto") {
            // إذا لم يتم تحديد موقع بعد، استخدم القاهرة افتراضياً
            url = `https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5&school=0`;
        } else {
            // استخدام مدينة محددة
            const [cityName, country] = location.split(',');
            url = `https://api.aladhan.com/v1/timingsByCity?city=${cityName.trim()}&country=${country.trim()}&method=5&school=0`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === 200) {
            prayerTimesData = data.data;
            updatePrayerTimesUI();
            updateNextPrayer();
           function startCountdown() {
    // إيقاف أي عد تنازلي سابق
    if (window.prayerCountdownInterval) {
        clearInterval(window.prayerCountdownInterval);
    }
    
    window.prayerCountdownInterval = setInterval(() => {
        if (!prayerTimesData) return;
        
        const nextPrayer = updateNextPrayer();
        if (!nextPrayer) return;
        
        const now = new Date();
        const [nextHour, nextMinute] = prayerTimesData.timings[nextPrayer.key].split(':').map(Number);
        
        let nextPrayerTime = new Date();
        nextPrayerTime.setHours(nextHour, nextMinute, 0);
        
        // إذا كانت الصلاة التالية هي فجر الغد (بعد منتصف الليل)
        if (nextPrayer.key === "Fajr" && now.getHours() >= 18) {
            nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
        }
        
        const diffMs = nextPrayerTime - now;
        
        if (diffMs > 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            
            document.getElementById('next-countdown').textContent = 
                `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
        } else {
            document.getElementById('next-countdown').textContent = 'الآن!';
            
            // تحديث تلقائي عند دخول وقت الصلاة
            if (diffMs < -60000) { // بعد دقيقة من دخول الوقت
                fetchPrayerTimes(currentCity);
            }
        }
    }, 1000);
}
    
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
        `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ - ${hijri.weekday.ar}`;
    
    // تحديث اسم المدينة في الواجهة
    updateLocationName();
}

// دالة تحديث اسم المدينة المعروضة
function updateLocationName() {
    const locationName = document.getElementById('city-name');
    if (currentCity === "auto" && userLocation) {
        locationName.textContent = "موقعك الحالي";
    } else if (currentCity === "auto") {
        locationName.textContent = "جاري التعرف على الموقع...";
    } else {
        const cityParts = currentCity.split(',');
        locationName.textContent = cityParts[0].trim();
    }
}

// دالة تحديد الموقع التلقائي
function detectUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('المتصفح لا يدعم تحديد الموقع');
            return;
        }
        
        const detectBtn = document.getElementById('detect-location');
        const originalHTML = detectBtn.innerHTML;
        detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                // الحصول على اسم المدينة
                const cityInfo = await getCityNameFromCoords(userLocation.latitude, userLocation.longitude);
                
                detectBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    detectBtn.innerHTML = originalHTML;
                }, 2000);
                
                // تحديث القائمة لتظهر المدينة المكتشفة
                if (cityInfo) {
                    const citySelect = document.getElementById('city-select');
                    const autoOption = citySelect.querySelector('option[value="auto"]');
                    autoOption.textContent = `📍 ${cityInfo.fullName}`;
                }
                
                // جلب مواقيت الصلاة للموقع الجديد
                await fetchPrayerTimes("auto");
                resolve(userLocation);
            },
            (error) => {
                detectBtn.innerHTML = '<i class="fas fa-times"></i>';
                setTimeout(() => {
                    detectBtn.innerHTML = originalHTML;
                }, 2000);
                
                let errorMessage = "تعذر تحديد الموقع";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "تم رفض الإذن. يرجى السماح بالموقع في إعدادات المتصفح.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "معلومات الموقع غير متاحة.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "انتهت مهلة طلب الموقع.";
                        break;
                }
                
                alert(`⚠️ ${errorMessage}\nسيتم استخدام القاهرة افتراضياً.`);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// دالة عرض الخطأ
function showPrayerError() {
    document.getElementById('prayer-times-list').innerHTML = `
        <div class="prayer-item" style="color: #d32f2f;">
            <span class="prayer-name">⚠️ خطأ في التحميل</span>
            <button onclick="fetchPrayerTimes()" style="background: var(--color-secondary); color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">
                إعادة تحميل
            </button>
        </div>
    `;
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
// تفعيل عناصر التحكم
document.addEventListener('DOMContentLoaded', function() {
    // تحديث عند تغيير المدينة
    const citySelect = document.getElementById('city-select');
    if (citySelect) {
        citySelect.addEventListener('change', function() {
            currentCity = this.value;
            
            if (currentCity === "auto") {
                // محاولة تحديد الموقع تلقائياً
                detectUserLocation().then(() => {
                    fetchPrayerTimes("auto");
                });
            } else {
                fetchPrayerTimes(currentCity);
            }
        });
    }
    
    // زر تحديث
    const refreshBtn = document.getElementById('refresh-prayer');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('loading');
            fetchPrayerTimes(currentCity).then(() => {
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
            detectUserLocation().then((location) => {
                if (location) {
                    // تحديث القائمة لتحديد "الموقع التلقائي"
                    citySelect.value = "auto";
                    currentCity = "auto";
                }
            });
        });
    }
    
    // التحميل الأولي - محاولة تحديد الموقع تلقائياً
    const citySelectElement = document.getElementById('city-select');
    if (citySelectElement) {
        // حاول تحديد الموقع تلقائياً عند التحميل
        detectUserLocation().then((location) => {
            if (location) {
                citySelectElement.value = "auto";
                currentCity = "auto";
            }
            fetchPrayerTimes(currentCity);
        }).catch(() => {
            fetchPrayerTimes("Cairo,Egypt"); // افتراضي إذا فشل
        });
    }
});
// تذكير قبل الأذان
function setupPrayerReminders() {
    setInterval(() => {
        if (!prayerTimesData) return;
        
        const now = new Date();
        const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
        
        prayers.forEach(prayer => {
            const [prayerHour, prayerMinute] = prayerTimesData.timings[prayer].split(':').map(Number);
            const prayerTime = new Date();
            prayerTime.setHours(prayerHour, prayerMinute, 0);
            
            // قبل 5 دقائق
            const reminderTime = new Date(prayerTime.getTime() - 5 * 60000);
            
            if (now >= reminderTime && now < prayerTime) {
                // إذا لم ننبه بعد عن هذه الصلاة
                if (!localStorage.getItem(`reminded_${prayer}_${prayerTime.toDateString()}`)) {
                    const prayerNames = {
                        "Fajr": "الفجر",
                        "Dhuhr": "الظهر", 
                        "Asr": "العصر",
                        "Maghrib": "المغرب",
                        "Isha": "العشاء"
                    };
                    
                    // إشعار على الشاشة
                    if (Notification.permission === "granted") {
                        new Notification("⏰ تذكير بصلاة " + prayerNames[prayer], {
                            body: "تبقى 5 دقائق على الأذان. استعد للصلاة.",
                            icon: "https://cdn-icons-png.flaticon.com/512/201/201623.png"
                        });
                    }
                    
                    // علامة أننا أنبّهنا
                    localStorage.setItem(`reminded_${prayer}_${prayerTime.toDateString()}`, "true");
                }
            }
        });
    }, 60000); // كل دقيقة
}

// طلب إذن الإشعارات
if ("Notification" in window) {
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
}
// ===== نظام مواقيت الصلاة المصرية مع الأذان =====
let prayerTimes = {};
let currentPrayer = null;
let nextPrayer = null;
let azanEnabled = true;
let azanVolume = 0.5;

// روابط الأذان المختلفة
const azanSounds = {
    fajr: "https://www.islamcan.com/audio/adhan/abdul_basit_abdus_samad/fajr.mp3",
    default: "https://www.islamcan.com/audio/adhan/abdul_basit_abdus_samad/azan1.mp3"
};

// جلب مواقيت الصلاة لمصر
async function fetchEgyptPrayerTimes() {
    try {
        // استخدام API Aladhan لمصر
        const today = new Date();
        const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5&school=0`);
        const data = await response.json();
        
        if (data.code === 200) {
            prayerTimes = data.data.timings;
            
            // تحديث التواريخ
            document.getElementById('hijri-date').textContent = 
                `${data.data.date.hijri.day} ${data.data.date.hijri.month.ar} ${data.data.date.hijri.year} هـ`;
            
            document.getElementById('gregorian-date').textContent = 
                `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
            
            // تحديث الأوقات في الواجهة
            updatePrayerTimesDisplay();
            
            // تحديد الصلاة الحالية والتالية
            determineCurrentAndNextPrayer();
            
            // بدء العد التنازلي
            startPrayerCountdown();
            
            // جدولة التحديث اليومي
            scheduleDailyUpdate();
            
            console.log("تم تحديث مواقيت الصلاة بنجاح");
            return true;
        }
    } catch (error) {
        console.error("خطأ في جلب مواقيت الصلاة:", error);
        // استخدام أوقات افتراضية في حالة الخطأ
        setDefaultPrayerTimes();
        return false;
    }
}

// أوقات افتراضية (فجر، ظهر، عصر، مغرب، عشاء)
function setDefaultPrayerTimes() {
    const defaultTimes = {
        Fajr: "04:30",
        Dhuhr: "12:00", 
        Asr: "15:15",
        Maghrib: "18:00",
        Isha: "19:30"
    };
    
    prayerTimes = defaultTimes;
    updatePrayerTimesDisplay();
    determineCurrentAndNextPrayer();
    startPrayerCountdown();
}

// تحديث عرض الأوقات
function updatePrayerTimesDisplay() {
    document.getElementById('fajr-time').textContent = formatTime(prayerTimes.Fajr);
    document.getElementById('dhuhr-time').textContent = formatTime(prayerTimes.Dhuhr);
    document.getElementById('asr-time').textContent = formatTime(prayerTimes.Asr);
    document.getElementById('maghrib-time').textContent = formatTime(prayerTimes.Maghrib);
    document.getElementById('isha-time').textContent = formatTime(prayerTimes.Isha);
}

// تنسيق الوقت
function formatTime(timeStr) {
    if (!timeStr) return "--:--";
    return timeStr;
}

// تحديد الصلاة الحالية والتالية
function determineCurrentAndNextPrayer() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: "fajr", time: prayerTimes.Fajr, display: "الفجر" },
        { name: "dhuhr", time: prayerTimes.Dhuhr, display: "الظهر" },
        { name: "asr", time: prayerTimes.Asr, display: "العصر" },
        { name: "maghrib", time: prayerTimes.Maghrib, display: "المغرب" },
        { name: "isha", time: prayerTimes.Isha, display: "العشاء" }
    ];
    
    // تحويل أوقات الصلاة إلى دقائق
    const prayerMinutes = prayers.map(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        return {
            name: prayer.name,
            display: prayer.display,
            minutes: hours * 60 + minutes
        };
    });
    
    // إعادة تعيين حالة جميع البطاقات
    document.querySelectorAll('.prayer-time-card').forEach(card => {
        card.classList.remove('current', 'passed');
    });
    
    // تحديد الصلاة الحالية
    let current = null;
    let next = null;
    
    for (let i = prayerMinutes.length - 1; i >= 0; i--) {
        if (currentTime >= prayerMinutes[i].minutes) {
            current = prayerMinutes[i];
            next = prayerMinutes[(i + 1) % prayerMinutes.length];
            break;
        }
    }
    
    // إذا لم توجد صلاة حالية (قبل الفجر)
    if (!current) {
        current = prayerMinutes[prayerMinutes.length - 1]; // العشاء
        next = prayerMinutes[0]; // الفجر
    }
    
    currentPrayer = current;
    nextPrayer = next;
    
    // تحديث الواجهة
    updatePrayerStatus(current, next, prayerMinutes);
}

// تحديث حالة الصلوات في الواجهة
function updatePrayerStatus(current, next, allPrayers) {
    // تحديث الصلاة الحالية
    const currentCard = document.querySelector(`[data-prayer="${current.name}"]`);
    if (currentCard) {
        currentCard.classList.add('current');
        document.getElementById(`${current.name}-status`).textContent = 'حاليا';
    }
    
    // تحديث الصلاة التالية
    document.getElementById('next-prayer-name').textContent = next.display;
    
    // تحديث حالة الصلوات الماضية
    allPrayers.forEach(prayer => {
        const card = document.querySelector(`[data-prayer="${prayer.name}"]`);
        if (card && prayer.minutes < current.minutes) {
            card.classList.add('passed');
            document.getElementById(`${prayer.name}-status`).textContent = 'مضت';
        } else if (card && prayer.name !== current.name) {
            document.getElementById(`${prayer.name}-status`).textContent = 'قادمة';
        }
    });
}

// بدء العد التنازلي
function startPrayerCountdown() {
    setInterval(() => {
        if (!nextPrayer) return;
        
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        // حساب الوقت المتبقي للصلاة التالية
        let timeRemaining = nextPrayer.minutes - currentTime;
        
        // إذا كان الوقت سالباً (بعد منتصف الليل)
        if (timeRemaining < 0) {
            timeRemaining += 24 * 60; // إضافة يوم كامل
        }
        
        // تحويل إلى ساعات ودقائق وثواني
        const hours = Math.floor(timeRemaining / 60);
        const minutes = timeRemaining % 60;
        const seconds = 59 - now.getSeconds();
        
        // تحديث العد التنازلي
        document.getElementById('next-prayer-countdown').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // التحقق إذا حان وقت الصلاة
        if (timeRemaining <= 0.5 && timeRemaining >= -0.5) { // هامش نصف دقيقة
            triggerAzan(nextPrayer.name);
            // تحديث الصلاة الحالية والتالية
            determineCurrentAndNextPrayer();
        }
    }, 1000);
}

// تشغيل الأذان
function triggerAzan(prayerName) {
    if (!azanEnabled) return;
    
    const audio = document.getElementById('azan-audio');
    
    // تحديد رابط الأذان المناسب
    let azanUrl = azanSounds.default;
    if (prayerName === 'fajr') {
        azanUrl = azanSounds.fajr;
    }
    
    // تعيين المصدر والمستوى الصوتي
    audio.src = azanUrl;
    audio.volume = azanVolume;
    
    // تشغيل الأذان
    audio.play().then(() => {
        // إظهار إشعار
        showAzanNotification(prayerName);
    }).catch(error => {
        console.error("خطأ في تشغيل الأذان:", error);
    });
}

// إظهار إشعار الأذان
function showAzanNotification(prayerName) {
    const prayerNames = {
        'fajr': 'الفجر',
        'dhuhr': 'الظهر',
        'asr': 'العصر',
        'maghrib': 'المغرب',
        'isha': 'العشاء'
    };
    
    // إزالة أي إشعار سابق
    const existingNotification = document.querySelector('.azan-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // إنشاء إشعار جديد
    const notification = document.createElement('div');
    notification.className = 'azan-notification';
    notification.innerHTML = `
        <i class="fas fa-mosque"></i>
        <div class="azan-notification-content">
            <h4>حان وقت صلاة ${prayerNames[prayerName]}</h4>
            <p>الأذان يعمل الآن. قم للصلاة يا عبد الله.</p>
        </div>
        <button class="close-azan">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // زر الإغلاق
    notification.querySelector('.close-azan').addEventListener('click', () => {
        notification.remove();
    });
    
    // إزالة تلقائية بعد 30 ثانية
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 30000);
}

// جدولة التحديث اليومي
function scheduleDailyUpdate() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0); // بعد منتصف الليل بدقيقة
    
    const timeUntilUpdate = tomorrow - now;
    
    setTimeout(() => {
        fetchEgyptPrayerTimes();
        // إعادة الجدولة لليوم التالي
        scheduleDailyUpdate();
    }, timeUntilUpdate);
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // جلب مواقيت الصلاة
    fetchEgyptPrayerTimes();
    
    // زر تفعيل/تعطيل الأذان
    const toggleAzanBtn = document.getElementById('toggle-azan');
    if (toggleAzanBtn) {
        toggleAzanBtn.addEventListener('click', function() {
            azanEnabled = !azanEnabled;
            if (azanEnabled) {
                this.innerHTML = '<i class="fas fa-volume-up"></i> تفعيل الأذان التلقائي';
                this.classList.remove('active');
                alert('✓ تم تفعيل الأذان التلقائي');
            } else {
                this.innerHTML = '<i class="fas fa-volume-mute"></i> تعطيل الأذان التلقائي';
                this.classList.add('active');
                alert('✗ تم تعطيل الأذان التلقائي');
            }
        });
    }
    
    // تحكم مستوى الصوت
    const volumeControl = document.getElementById('azan-volume');
    if (volumeControl) {
        volumeControl.addEventListener('input', function() {
            azanVolume = this.value / 100;
            document.getElementById('azan-audio').volume = azanVolume;
        });
    }
    
    // زر تجربة الأذان
    const testAzanBtn = document.getElementById('azan-test');
    if (testAzanBtn) {
        testAzanBtn.addEventListener('click', function() {
            triggerAzan('dhuhr');
        });
    }
    
    // تحديث المواقيت كل ساعة (لكن التحديث الرئيسي يومي)
    setInterval(fetchEgyptPrayerTimes, 60 * 60 * 1000);
});
