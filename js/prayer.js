class PrayerTimes {
    constructor() {
        this.times = {};
        this.loadPrayerTimes();
    }

    async loadPrayerTimes() {
        // يمكن استخدام API مثل https://api.aladhan.com/v1/timingsByCity
        try {
            const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
            const data = await response.json();
            this.times = data.data.timings;
            this.updateUI();
        } catch (error) {
            // استخدام مواقيت افتراضية في حالة الخطأ
            this.times = {
                Fajr: "04:30",
                Sunrise: "06:00",
                Dhuhr: "12:15",
                Asr: "15:45",
                Sunset: "18:20",
                Maghrib: "18:20",
                Isha: "19:45",
                Imsak: "04:20",
                Midnight: "23:30"
            };
            this.updateUI();
        }
    }

    updateUI() {
        const elements = {
            'prayer-fajr': this.times.Fajr,
            'prayer-sunrise': this.times.Sunrise,
            'prayer-dhuhr': this.times.Dhuhr,
            'prayer-asr': this.times.Asr,
            'prayer-maghrib': this.times.Maghrib,
            'prayer-isha': this.times.Isha
        };

        Object.entries(elements).forEach(([id, time]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = time;
            }
        });
    }

    getNextPrayer() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = [
            { name: 'الفجر', time: this.convertTimeToMinutes(this.times.Fajr) },
            { name: 'الظهر', time: this.convertTimeToMinutes(this.times.Dhuhr) },
            { name: 'العصر', time: this.convertTimeToMinutes(this.times.Asr) },
            { name: 'المغرب', time: this.convertTimeToMinutes(this.times.Maghrib) },
            { name: 'العشاء', time: this.convertTimeToMinutes(this.times.Isha) }
        ];

        for (const prayer of prayers) {
            if (currentTime < prayer.time) {
                return {
                    name: prayer.name,
                    time: this.convertMinutesToTime(prayer.time)
                };
            }
        }

        // إذا كانت جميع الصلوات قد مضت، يعود للفجر التالي
        return {
            name: 'الفجر',
            time: this.times.Fajr
        };
    }

    convertTimeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    convertMinutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
}

// تهيئة مواقيت الصلاة
const prayerTimes = new PrayerTimes();
