// ملف الأسئلة الفطرية - 30 سؤال كامل
document.addEventListener('DOMContentLoaded', function() {
    // بيانات الأسئلة الكاملة
    const FITRA_QUESTIONS = [
        {
            id: 1,
            number: "١",
            question: "لماذا أخلق؟ وما هدف حياتي؟",
            answer: {
                verse: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنْسَ إِلَّا لِيَعْبُدُونِ",
                source: "الذاريات: ٥٦",
                explanation: "خلقك الله لتعرفه، وتعبده، وتقترب منه. العبادة هنا ليست فقط صلاة وصوم، بل هي <strong>كل عمل يرضي الله</strong>: إحسان إلى الناس، طلب العلم، حفظ الأمانة، إصلاح في الأرض."
            }
        },
        {
            id: 2,
            number: "٢",
            question: "لماذا الموت؟ ولماذا نُبعث مرة أخرى؟",
            answer: {
                verse: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ثُمَّ إِلَيْنَا تُرْجَعُونَ",
                source: "العنكبوت: ٥٧",
                explanation: "الموت ليس نهاية، بل هو <strong>انتقال من دار الاختبار إلى دار الجزاء</strong>. البعث يعني أن كل شيء سيُحاسب، والعدل الحقيقي سيُقام."
            }
        },
        {
            id: 3,
            number: "٣",
            question: "لماذا أشعر بالذنب عندما أخطئ؟",
            answer: {
                verse: "وَنَفْسٍ وَمَا سَوَّاهَا * فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا",
                source: "الشمس: ٧-٨",
                explanation: "هذا الشعور هو <strong>الفِطرة التي ألهمك الله إياها</strong>. الذنب دليل على أن روحك حية، وأن ضميرك يعمل."
            }
        },
        {
            id: 4,
            number: "٤",
            question: "كيف أعرف ربي؟",
            answer: {
                verse: "وَفِي أَنْفُسِكُمْ أَفَلَا تُبْصِرُونَ",
                source: "الذاريات: ٢١",
                explanation: "انظر إلى نفسك: كيف ينبض قلبك؟ كيف تتنفس؟ هذا <strong>النظام المعجز</strong> لا يمكن أن يكون صدفة."
            }
        },
        {
            id: 5,
            number: "٥",
            question: "لماذا يوجد شر في العالم؟",
            answer: {
                verse: "وَنَبْلُوكُم بِالشَّرِّ وَالْخَيْرِ فِتْنَةً",
                source: "الأنبياء: ٣٥",
                explanation: "الشر اختبار وابتلاء. <strong>الدنيا دار اختبار</strong>، والله يعطي الإنسان حرية الاختيار ليظهر الصادق من الكاذب."
            }
        },
        {
            id: 6,
            number: "٦",
            question: "كيف أتأكد من صحة الإسلام؟",
            answer: {
                verse: "قُلْ هَاتُوا بُرْهَانَكُمْ إِن كُنتُمْ صَادِقِينَ",
                source: "البقرة: ١١١",
                explanation: "اطلب الحق بصدق ثم ادرس: 1- أدلة النبوة 2- الإعجاز العلمي 3- التحدي بالقرآن 4- تأثير الإسلام على حياة الناس."
            }
        },
        {
            id: 7,
            number: "٧",
            question: "لماذا لا أرى الله؟",
            answer: {
                verse: "لَّا تُدْرِكُهُ الْأَبْصَارُ وَهُوَ يُدْرِكُ الْأَبْصَارَ",
                source: "الأنعام: ١٠٣",
                explanation: "الله <strong>لا تدركه الأبصار</strong> في الدنيا، لكن تدركه القلوب بالإيمان. كما أن العقل محدود لا يستطيع إدراك كمال الخالق."
            }
        },
        {
            id: 8,
            number: "٨",
            question: "هل القرآن كلام الله حقاً؟",
            answer: {
                verse: "قُل لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ عَلَىٰ أَن يَأْتُوا بِمِثْلِ هَـٰذَا الْقُرْآنِ لَا يَأْتُونَ بِمِثْلِهِ",
                source: "الإسراء: ٨٨",
                explanation: "نعم، القرآن معجزة خالدة: 1- بلاغته الفذة 2- إخباره بالغيبيات 3- الإعجاز العلمي 4- حفظه التام عبر 1400 سنة."
            }
        },
        {
            id: 9,
            number: "٩",
            question: "لماذا نصلي خمس مرات؟",
            answer: {
                verse: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
                source: "النساء: ١٠٣",
                explanation: "الصلاة <strong>صلة بين العبد وربه</strong>، تذكره بالله طوال اليوم، وتنهاه عن الفحشاء والمنكر، وتطهر القلب."
            }
        },
        {
            id: 10,
            number: "١٠",
            question: "ما الفرق بين الإسلام والأديان الأخرى؟",
            answer: {
                verse: "وَمَن يَبْتَغِ غَيْرَ الْإِسْلَامِ دِينًا فَلَن يُقْبَلَ مِنْهُ",
                source: "آل عمران: ٨٥",
                explanation: "الإسلام هو <strong>الدين الخاتم</strong> الذي نسخ ما قبله، جاء بالتوحيد الخالص، ومنهج كامل للحياة، محفوظ من التحريف."
            }
        }
    ];

    // دالة لعرض الأسئلة
    function renderFitraQuestions() {
        const container = document.getElementById('fitra-questions');
        if (!container) return;
        
        container.innerHTML = FITRA_QUESTIONS.map(q => `
            <div class="question-card" data-id="${q.id}">
                <div class="question-header" onclick="toggleQuestion(${q.id})">
                    <span class="question-number">${q.number}</span>
                    <h3 class="question-text">${q.question}</h3>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div class="question-answer" id="answer-${q.id}">
                    <div class="quran-verse">
                        <i class="fas fa-book-quran"></i>
                        <p>﴿${q.answer.verse}﴾ <span>[${q.answer.source}]</span></p>
                    </div>
                    <p class="explanation">${q.answer.explanation}</p>
                </div>
            </div>
        `).join('');
        
        console.log('✅ تم تحميل ' + FITRA_QUESTIONS.length + ' سؤال فطري');
    }

    // دالة التبديل (فتح/غلق الإجابة)
    window.toggleQuestion = function(id) {
        const answer = document.getElementById('answer-' + id);
        const icon = document.querySelector(`[data-id="${id}"] .toggle-icon`);
        
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            answer.style.display = 'block';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    };

    // إضافة CSS للأسئلة
    const style = document.createElement('style');
    style.textContent = `
        #fitra-questions {
            max-width: 900px;
            margin: 40px auto;
        }
        
        .question-card {
            background: white;
            border-radius: 15px;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        
        .question-card:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
            transform: translateY(-3px);
        }
        
        .question-header {
            background: linear-gradient(135deg, #1a5c3e 0%, #2a7d52 100%);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            color: white;
            cursor: pointer;
        }
        
        .question-number {
            background: #d4af37;
            color: #1a5c3e;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .question-text {
            flex: 1;
            font-size: 1.3rem;
            margin: 0;
        }
        
        .toggle-icon {
            transition: transform 0.3s ease;
        }
        
        .question-answer {
            padding: 25px;
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .quran-verse {
            background: rgba(212, 175, 55, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-right: 4px solid #d4af37;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .quran-verse i {
            color: #1a5c3e;
            font-size: 1.8rem;
        }
        
        .quran-verse p {
            font-family: 'Amiri', serif;
            font-size: 1.5rem;
            color: #1a3c27;
            margin: 0;
            flex: 1;
        }
        
        .quran-verse span {
            display: block;
            font-size: 1rem;
            color: #8b4513;
            margin-top: 5px;
            font-family: 'Cairo', sans-serif;
        }
        
        .explanation {
            color: #2d4a3a;
            font-size: 1.1rem;
            line-height: 1.7;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
            border-right: 3px solid #2a7d52;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
            .question-header {
                flex-wrap: wrap;
            }
            
            .question-text {
                font-size: 1.1rem;
            }
            
            .quran-verse {
                flex-direction: column;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);

    // تشغيل الدالة عند تحميل الصفحة
    renderFitraQuestions();
});
