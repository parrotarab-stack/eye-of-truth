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



