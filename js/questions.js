const FITRA_QUESTIONS = [
    {
        id: 1,
        number: "١",
        question: "لماذا أخلق؟ وما هدف حياتي؟",
        answer: {
            verse: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنْسَ إِلَّا لِيَعْبُدُونِ",
            source: "الذاريات: ٥٦",
            explanation: "خلقك الله لتعرفه، وتعبده، وتقترب منه. العبادة هنا ليست فقط صلاة وصوم، بل هي كل عمل يرضي الله: إحسان إلى الناس، طلب العلم، حفظ الأمانة..."
        }
    },
    {
        id: 2,
        number: "٢",
        question: "لماذا الموت؟ ولماذا نُبعث مرة أخرى؟",
        answer: {
            verse: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ثُمَّ إِلَيْنَا تُرْجَعُونَ",
            source: "العنكبوت: ٥٧",
            explanation: "الموت ليس نهاية، بل هو انتقال من دار الاختبار إلى دار الجزاء. لو كانت الحياة تنتهي بالموت، لكان الظلم قد انتصر. ولكن البعث يعني أن كل شيء سيُحاسب، والعدل الحقيقي سيُقام."
        }
    },
    // ... أضف 28 سؤالاً آخر
    {
        id: 30,
        number: "٣٠",
        question: "كيف أتأكد من صحة الإسلام دون تحيّز؟",
        answer: {
            verse: "وَقُلِ الْحَقُّ مِن رَّبِّكُمْ فَمَن شَاءَ فَلْيُؤْمِن وَمَن شَاءَ فَلْيَكْفُرْ",
            source: "الكهف: ٢٩",
            explanation: "اطلب الحق بصدق وقل: 'اللهم إن كنت تعلم أن هذا هو الحق فاهدني إليه'. ثم ادرس بموضوعية: 1- أدلة النبوة 2- الإعجاز العلمي 3- التحدي بالقرآن 4- تأثير الإسلام على حياة الناس."
        }
    }
];

// دالة لعرض الأسئلة
function renderFitraQuestions() {
    const container = document.getElementById('questions-container');
    if (!container) return;
    
    container.innerHTML = FITRA_QUESTIONS.map(q => `
        <div class="question-card" data-id="${q.id}">
            <div class="question-header">
                <span class="question-number">${q.number}</span>
                <h3 class="question-text">${q.question}</h3>
            </div>
            <div class="question-answer">
                <div class="quran-verse">
                    <i class="fas fa-book-quran"></i>
                    <p>﴿${q.answer.verse}﴾ <span>[${q.answer.source}]</span></p>
                </div>
                <p class="explanation">${q.answer.explanation}</p>
            </div>
        </div>
    `).join('');
}

// استدعاء الدالة عند تحميل الصفحة
if (document.getElementById('fitra')) {
    document.addEventListener('DOMContentLoaded', renderFitraQuestions);
}
