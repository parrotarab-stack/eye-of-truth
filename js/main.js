// بيانات مواقيت الصلاة (يمكن استبدالها بAPI حقيقي)
const PRAYER_TIMES = {
    fajr: "04:30",
    sunrise: "06:00",
    dhuhr: "12:15",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45",
    jumuah: "12:30"
};

// بيانات سور القرآن مع روابط حقيقية لعبد الباسط
const QURAN_SURAH = {
    fatiha: {
        name: "سورة الفاتحة",
        audio: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/001001.mp3",
        ayahs: 7
    },
    baqarah: {
        name: "سورة البقرة",
        audio: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/002001.mp3",
        ayahs: 286
    },
    ikhlas: {
        name: "سورة الإخلاص",
        audio: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/112001.mp3",
        ayahs: 4
    },
    falaq: {
        name: "سورة الفلق",
        audio: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/113001.mp3",
        ayahs: 5
    },
    nas: {
        name: "سورة الناس",
        audio: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/114001.mp3",
        ayahs: 6
    },
    yaseen: {
        name: "سورة يس",
        audio: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/036001.mp3",
        ayahs: 83
    },
    rahman: {
        name: "سورة الرحمن",
        audio: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/055001.mp3",
        ayahs: 78
    },
    mulk: {
        name: "سورة الملك",
        audio: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/067001.mp3",
        ayahs: 30
    }
};

class ThirdEyeApp {
    constructor() {
        this.audio = new Audio();
        this.currentSurah = 'fatiha';
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        this.questions = [];
        this.messages = [];
        
        this.init();
    }

    async init() {
        // إخفاء شاشة التحميل
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 2000);

        // تهيئة الأحداث
        this.setupEventListeners();
        
        // تحديث مواقيت الصلاة
        this.updatePrayerTimes();
        
        // تحميل الأسئلة
        await this.loadQuestions();
        
        // تحميل الرسائل
        await this.loadMessages();
        
        // بدء تنبيه الصلاة على النبي
        this.startSalahReminder();
        
        // تحديث الوقت كل دقيقة
        setInterval(() => this.updatePrayerTimes(), 60000);
        
        // تحديث الوقت الحالي كل ثانية
        setInterval(() => this.updateCurrentTime(), 1000);
        
        console.log('🚀 تطبيق العين الثالثة جاهز!');
    }

    setupEventListeners() {
        // مشغل القرآن
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressBar = document.getElementById('progress-bar');
        const volumeSlider = document.getElementById('volume-slider');
        const surahSelect = document.getElementById('surah-select');
        const closePlayer = document.getElementById('close-player');

        playBtn?.addEventListener('click', () => this.playAudio());
        pauseBtn?.addEventListener('click', () => this.pauseAudio());
        prevBtn?.addEventListener('click', () => this.prevSurah());
        nextBtn?.addEventListener('click', () => this.nextSurah());
        volumeSlider?.addEventListener('input', (e) => this.setVolume(e.target.value));
        surahSelect?.addEventListener('change', (e) => this.changeSurah(e.target.value));
        closePlayer?.addEventListener('click', () => this.togglePlayer());

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
            this.updateTimeDisplay();
        });
        this.audio.addEventListener('ended', () => this.nextSurah());
        
        // الضغط على شريط التقدم
        progressBar?.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.duration;
        });

        // الأسئلة المتكررة
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.parentElement;
                item.classList.toggle('active');
            });
        });

        // بطاقات الأسئلة
        document.querySelectorAll('.question-header').forEach(header => {
            header.addEventListener('click', () => {
                const card = header.parentElement;
                card.classList.toggle('active');
            });
        });

        // نموذج الاتصال
        const contactForm = document.getElementById('private-question-form');
        const clearBtn = document.getElementById('clear-form');

        contactForm?.addEventListener('submit', (e) => this.submitQuestion(e));
        clearBtn?.addEventListener('click', () => this.clearForm());

        // الترجمة
        const translateBtn = document.getElementById('translate-btn');
        translateBtn?.addEventListener('click', () => this.toggleTranslation());

        // إظهار/إخفاء مشغل القرآن
        const audioToggle = document.getElementById('audio-toggle');
        audioToggle?.addEventListener('click', () => this.togglePlayer());
    }

    // مشغل القرآن
    playAudio() {
        if (!this.audio.src) {
            this.loadSurah(this.currentSurah);
        }
        
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                document.getElementById('play-btn').style.display = 'none';
                document.getElementById('pause-btn').style.display = 'flex';
                document.getElementById('current-surah').textContent = QURAN_SURAH[this.currentSurah].name;
            })
            .catch(err => {
                console.error('خطأ في تشغيل الصوت:', err);
                this.showError('تعذر تشغيل القرآن. يرجى التحقق من اتصال الإنترنت.');
            });
    }

    pauseAudio() {
        this.audio.pause();
        this.isPlaying = false;
        document.getElementById('play-btn').style.display = 'flex';
        document.getElementById('pause-btn').style.display = 'none';
    }

    loadSurah(surahKey) {
        const surah = QURAN_SURAH[surahKey];
        if (!surah) return;

        this.currentSurah = surahKey;
        this.audio.src = surah.audio;
        this.audio.load();
        
        // تحديث الواجهة
        document.getElementById('current-surah').textContent = surah.name;
        
        // حفظ في LocalStorage
        localStorage.setItem('lastSurah', surahKey);
    }

    changeSurah(surahKey) {
        this.pauseAudio();
        this.loadSurah(surahKey);
        setTimeout(() => this.playAudio(), 500);
    }

    prevSurah() {
        const surahs = Object.keys(QURAN_SURAH);
        const currentIndex = surahs.indexOf(this.currentSurah);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : surahs.length - 1;
        this.changeSurah(surahs[prevIndex]);
    }

    nextSurah() {
        const surahs = Object.keys(QURAN_SURAH);
        const currentIndex = surahs.indexOf(this.currentSurah);
        const nextIndex = currentIndex < surahs.length - 1 ? currentIndex + 1 : 0;
        this.changeSurah(surahs[nextIndex]);
    }

    setVolume(value) {
        this.volume = value / 100;
        this.audio.volume = this.volume;
        localStorage.setItem('quranVolume', value);
    }

    updateProgress() {
        if (!this.duration) return;

        const progress = (this.audio.currentTime / this.duration) * 100;
        const progressBar = document.querySelector('.progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        const currentTime = this.formatTime(this.audio.currentTime);
        const duration = this.formatTime(this.duration);
        document.getElementById('current-time').textContent = currentTime;
        document.getElementById('duration').textContent = duration;
    }

    formatTime(seconds) {
        if (!seconds) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    togglePlayer() {
        const player = document.querySelector('.audio-player');
        player.classList.toggle('hidden');
        localStorage.setItem('playerVisible', !player.classList.contains('hidden'));
    }

    // مواقيت الصلاة
    updatePrayerTimes() {
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let nextPrayer = '';
        let nextTime = '';
        
        // تحديد الصلاة التالية
        if (timeString < PRAYER_TIMES.fajr) {
            nextPrayer = 'الفجر';
            nextTime = PRAYER_TIMES.fajr;
        } else if (timeString < PRAYER_TIMES.dhuhr) {
            nextPrayer = 'الظهر';
            nextTime = PRAYER_TIMES.dhuhr;
        } else if (timeString < PRAYER_TIMES.asr) {
            nextPrayer = 'العصر';
            nextTime = PRAYER_TIMES.asr;
        } else if (timeString < PRAYER_TIMES.maghrib) {
            nextPrayer = 'المغرب';
            nextTime = PRAYER_TIMES.maghrib;
        } else if (timeString < PRAYER_TIMES.isha) {
            nextPrayer = 'العشاء';
            nextTime = PRAYER_TIMES.isha;
        } else {
            nextPrayer = 'الفجر';
            nextTime = PRAYER_TIMES.fajr;
        }
        
        // تحديث الواجهة
        document.getElementById('current-prayer').innerHTML = `
            <i class="fas fa-clock"></i>
            <span>${nextPrayer}: ${nextTime}</span>
        `;
        
        // تحديث كافة المواقيت
        document.getElementById('prayer-fajr').textContent = PRAYER_TIMES.fajr;
        document.getElementById('prayer-dhuhr').textContent = PRAYER_TIMES.dhuhr;
        document.getElementById('prayer-asr').textContent = PRAYER_TIMES.asr;
        document.getElementById('prayer-maghrib').textContent = PRAYER_TIMES.maghrib;
        document.getElementById('prayer-isha').textContent = PRAYER_TIMES.isha;
        document.getElementById('prayer-jumuah').textContent = PRAYER_TIMES.jumuah;
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-EG', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        document.getElementById('current-time-display')?.textContent = timeString;
    }

    // تنبيه الصلاة على النبي
    startSalahReminder() {
        // عرض أول تنبيه بعد 30 ثانية
        setTimeout(() => this.showSalahAlert(), 30000);
        
        // تكرار كل 5 دقائق
        setInterval(() => this.showSalahAlert(), 5 * 60 * 1000);
    }

    showSalahAlert() {
        const alert = document.getElementById('salah-alert');
        if (!alert) return;
        
        // تحديث النص عشوائياً
        const messages = [
            "اللهم صل على سيدنا محمد وعلى آل سيدنا محمد",
            "صلى الله عليه وسلم تسليماً كثيراً",
            "اللهم صل وسلم وبارك على سيدنا محمد",
            "من صلى عليّ مرة صلى الله عليه عشراً",
            "أكثروا من الصلاة عليّ فإنها نور في الدنيا والآخرة"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        alert.querySelector('p').textContent = randomMessage;
        
        // إظهار التنبيه
        alert.classList.add('show');
        
        // إخفاء بعد 10 ثوان
        setTimeout(() => {
            alert.classList.remove('show');
        }, 10000);
    }

    closeSalahAlert() {
        document.getElementById('salah-alert').classList.remove('show');
    }

    // الأسئلة والرسائل
    async loadQuestions() {
        try {
            // يمكن تحميل الأسئلة من ملف JSON أو API
            this.questions = [
                {
                    id: 1,
                    question: "كيف أعرف أن الإسلام هو الدين الحق؟",
                    answer: "يمكنك معرفة ذلك من خلال عدة طرق: 1- دراسة أدلة النبوة 2- الإعجاز العلمي في القرآن 3- منطقية وتكامل الشريعة 4- تأثير الإسلام الإيجابي على حياة المؤمنين."
                },
                // ... المزيد من الأسئلة
            ];
        } catch (error) {
            console.error('خطأ في تحميل الأسئلة:', error);
        }
    }

    async loadMessages() {
        try {
            // تحميل الرسائل من localStorage
            const saved = localStorage.getItem('thirdEyeMessages');
            this.messages = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('خطأ في تحميل الرسائل:', error);
            this.messages = [];
        }
    }

    async submitQuestion(event) {
        event.preventDefault();
        
        const form = event.target;
        const question = document.getElementById('question').value;
        const email = document.getElementById('email').value;
        
        if (!question.trim()) {
            this.showError('يرجى كتابة سؤال');
            return;
        }
        
        // إنشاء رسالة جديدة
        const newMessage = {
            id: Date.now(),
            question: question.trim(),
            email: email.trim() || null,
            date: new Date().toISOString(),
            read: false,
            replied: false
        };
        
        // إضافة للقائمة المحلية
        this.messages.push(newMessage);
        localStorage.setItem('thirdEyeMessages', JSON.stringify(this.messages));
        
        // هنا يمكن إرسال الرسالة إلى الخادم
        // await fetch('/api/questions', { method: 'POST', body: JSON.stringify(newMessage) });
        
        // إظهار رسالة النجاح
        this.showSuccess('تم إرسال سؤالك بنجاح! سوف نرد عليك قريباً إن شاء الله.');
        
        // تفريغ النموذج
        form.reset();
    }

    clearForm() {
        document.getElementById('private-question-form').reset();
    }

    // الترجمة
    toggleTranslation() {
        const translateContainer = document.getElementById('google-translate');
        translateContainer.classList.toggle('hidden');
    }

    // الرسائل التعبيرية
    showSuccess(message) {
        const successMsg = document.getElementById('success-message');
        if (!successMsg) return;
        
        successMsg.querySelector('p').textContent = message;
        successMsg.classList.add('show');
        
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 5000);
    }

    showError(message) {
        alert(message); // يمكن استبدالها بمودال أجمل
    }

    // أدوات مساعدة
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    // تصدير البيانات (للمسؤول)
    exportMessages() {
        const dataStr = JSON.stringify(this.messages, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `third-eye-messages-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ThirdEyeApp();
    
    // إضافة روابط التنقل السريع
    const quickNav = document.createElement('div');
    quickNav.className = 'quick-nav';
    quickNav.innerHTML = `
        <div class="container">
            <div class="quick-nav-links">
                <a href="#third-eye"><i class="fas fa-eye"></i> العين الثالثة</a>
                <a href="#fitra"><i class="fas fa-star"></i> الفِطرة (30+ سؤال)</a>
                <a href="#comparison"><i class="fas fa-balance-scale"></i> مقارنة الأديان</a>
                <a href="#stories"><i class="fas fa-book"></i> قصص الهداية</a>
                <a href="#start-journey"><i class="fas fa-flag"></i> ابدأ رحلتك</a>
                <a href="#ask-private"><i class="fas fa-user-secret"></i> اسأل بخفاء</a>
                <button id="audio-toggle" class="btn btn-secondary" style="padding: 8px 15px;">
                    <i class="fas fa-music"></i> القرآن
                </button>
            </div>
        </div>
    `;
    
    document.body.insertBefore(quickNav, document.querySelector('main'));
    
    // إضافة مشغل القرآن
    const audioPlayer = document.createElement('div');
    audioPlayer.className = 'audio-player';
    audioPlayer.innerHTML = `
        <div class="audio-info">
            <h4><i class="fas fa-play-circle"></i> القرآن الكريم</h4>
            <p class="current-surah" id="current-surah">${QURAN_SURAH.fatiha.name}</p>
        </div>
        <div class="audio-controls">
            <button id="prev-btn" class="audio-btn" title="السورة السابقة">
                <i class="fas fa-step-backward"></i>
            </button>
            <button id="play-btn" class="audio-btn" title="تشغيل">
                <i class="fas fa-play"></i>
            </button>
            <button id="pause-btn" class="audio-btn" title="إيقاف" style="display: none;">
                <i class="fas fa-pause"></i>
            </button>
            <button id="next-btn" class="audio-btn" title="السورة التالية">
                <i class="fas fa-step-forward"></i>
            </button>
            
            <div class="progress-container">
                <div class="progress-bar" id="progress-bar">
                    <div class="progress"></div>
                </div>
                <div class="time-display">
                    <span id="current-time">00:00</span> / <span id="duration">00:00</span>
                </div>
            </div>
            
            <div class="volume-control">
                <i class="fas fa-volume-up"></i>
                <input type="range" id="volume-slider" class="volume-slider" min="0" max="100" value="70" title="الصوت">
            </div>
            
            <select id="surah-select" class="surah-select">
                <option value="fatiha">الفاتحة</option>
                <option value="ikhlas">الإخلاص</option>
                <option value="falaq">الفلق</option>
                <option value="nas">الناس</option>
                <option value="yaseen">يس</option>
                <option value="rahman">الرحمن</option>
                <option value="mulk">الملك</option>
            </select>
            
            <button id="close-player" class="close-player" title="إغلاق">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(audioPlayer);
    
    // إضافة تنبيه الصلاة على النبي
    const salahAlert = document.createElement('div');
    salahAlert.id = 'salah-alert';
    salahAlert.className = 'salah-alert';
    salahAlert.innerHTML = `
        <button onclick="app.closeSalahAlert()">
            <i class="fas fa-times"></i>
        </button>
        <h4><i class="fas fa-heart"></i> تذكير بالصلاة على النبي</h4>
        <p>اللهم صل على سيدنا محمد وعلى آل سيدنا محمد</p>
        <p style="font-size: 0.9rem; opacity: 0.9;">من صلى عليّ مرة صلى الله عليه عشراً</p>
    `;
    
    document.body.appendChild(salahAlert);
    
    // إضافة رسالة النجاح
    const successMsg = document.createElement('div');
    successMsg.id = 'success-message';
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>تم إرسال سؤالك بنجاح!</p>
    `;
    
    document.body.appendChild(successMsg);
    
    // إضافة شاشة التحميل
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.className = 'loading';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">👁️ العين الثالثة</div>
            <p style="margin-top: 10px; color: var(--light-gold);">منارة الباحث عن الحق</p>
        </div>
    `;
    
    document.body.appendChild(loading);
});
