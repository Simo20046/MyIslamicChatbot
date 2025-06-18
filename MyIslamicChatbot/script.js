// script.js

document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatTitle = document.getElementById('chat-title'); // جلب عنصر العنوان

    // تغيير اسم البوت في الهيدر
    chatTitle.textContent = 'البوت الإسلامي';

    // --- قاعدة بيانات الأسئلة والأجوبة في JavaScript (بلا Python) ---
    // هذا هو المكان الذي ستضيف فيه جميع أسئلتك وأجوبتك وتصنيفاتها.
    // يجب أن يكون الـ 'keyword' فريدًا لكل سؤال.
    // 'display_question' هو النص الذي سيظهر للمستخدم.
    const islamicKnowledge = [
        // تصنيف: العقيدة والإيمان
        { category: 'العقيدة والإيمان', keyword: 'ما هو الإسلام', display_question: 'ما هو الإسلام؟', response: 'الإسلام هو دين التوحيد والاستسلام لله وحده، وهو الدين الخاتم الذي جاء به سيدنا محمد صلى الله عليه وسلم.' },
        { category: 'العقيدة والإيمان', keyword: 'من هو الله', display_question: 'من هو الله؟', response: 'الله سبحانه وتعالى هو الخالق البارئ المصور، رب العالمين، لا إله إلا هو وحده لا شريك له.' },
        { category: 'العقيدة والإيمان', keyword: 'من هو النبي محمد', display_question: 'من هو النبي محمد صلى الله عليه وسلم؟', response: 'سيدنا محمد صلى الله عليه وسلم هو خاتم الأنبياء والمرسلين، أرسله الله رحمة للعالمين، وهو قدوتنا الحسنة.' },
        { category: 'العقيدة والإيمان', keyword: 'أركان الإيمان', display_question: 'ما هي أركان الإيمان؟', response: 'أركان الإيمان ستة: الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، وبالقدر خيره وشره.' },

        // تصنيف: أركان الإسلام
        { category: 'أركان الإسلام', keyword: 'أركان الإسلام', display_question: 'ما هي أركان الإسلام؟', response: 'أركان الإسلام خمسة: الشهادتان، إقامة الصلاة، إيتاء الزكاة، صوم رمضان، وحج البيت لمن استطاع إليه سبيلاً.' },

        // تصنيف: القرآن والسنة
        { category: 'القرآن والسنة', keyword: 'ما هو القرآن', display_question: 'ما هو القرآن الكريم؟', response: 'القرآن الكريم هو كلام الله تعالى المنزل على سيدنا محمد صلى الله عليه وسلم، وهو كتاب هداية ونور للبشرية.' },
        { category: 'القرآن والسنة', keyword: 'ما هو الحديث', display_question: 'ما هو الحديث النبوي؟', response: 'الحديث هو ما ورد عن النبي صلى الله عليه وسلم من قول أو فعل أو تقرير أو صفة.' },
        { category: 'القرآن والسنة', keyword: 'فضل القرآن', display_question: 'ما فضل قراءة القرآن؟', response: 'قراءة القرآن نور وهداية وشفاء، وحرف بحسنة، والحسنة بعشر أمثالها.' },

        // تصنيف: الطهارة
        { category: 'الطهارة', keyword: 'كيفية الوضوء', display_question: 'كيفية الوضوء؟', response: 'الوضوء هو غسل أعضاء معينة بالماء الطهور بنية التطهر للصلاة وما في حكمها، وله صفة معينة مذكورة في السنة النبوية.' },
        { category: 'الطهارة', keyword: 'نواقض الوضوء', display_question: 'ما هي نواقض الوضوء؟', response: 'نواقض الوضوء هي كل ما يبطل الوضوء، ومنها: الخارج من السبيلين، النوم العميق، زوال العقل، ومس الفرج مباشرة بغير حائل.' },
        { category: 'الطهارة', keyword: 'كيفية الغسل', display_question: 'كيفية الغسل من الجنابة؟', response: 'الغسل هو تعميم الماء الطهور على جميع البدن بنية رفع الحدث الأكبر، وله صفتان: صفة الإجزاء وصفة الكمال.' },
        { category: 'الطهارة', keyword: 'التيمم', display_question: 'متى يجوز التيمم؟', response: 'التيمم هو المسح بالصعيد الطيب (التراب) على الوجه والكفين بنية الطهارة عند عدم وجود الماء أو العجز عن استعماله.' },

        // تصنيف: الصلاة
        { category: 'الصلاة', keyword: 'أوقات الصلاة', display_question: 'ما هي أوقات الصلاة؟', response: 'أوقات الصلاة هي الفجر، الظهر، العصر، المغرب، والعشاء. لكل صلاة وقت محدد يجب أداؤها فيه.' },
        { category: 'الصلاة', keyword: 'كيفية الصلاة', display_question: 'كيفية أداء الصلاة؟', response: 'الصلاة هي ركن من أركان الإسلام، وتؤدى بكيفية معينة تبدأ بالتكبير وتنتهي بالتسليم، مع الركوع والسجود والطمأنينة فيها.' },
        { category: 'الصلاة', keyword: 'شروط الصلاة', display_question: 'ما هي شروط صحة الصلاة؟', response: 'من شروط الصلاة: الطهارة من الحدثين، وطهارة الثوب والبدن والمكان، وستر العورة، واستقبال القبلة، ودخول الوقت، والنية.' },
        { category: 'الصلاة', keyword: 'صلاة الوتر', display_question: 'ما هي صلاة الوتر؟', response: 'صلاة الوتر هي سنة مؤكدة، وتصلى ركعة واحدة أو ثلاث أو أكثر بعد صلاة العشاء، وهي خاتمة صلاة الليل.' },
        { category: 'الصلاة', keyword: 'سجود السهو', display_question: 'ما هو سجود السهو؟', response: 'سجود السهو هو سجدتان يسجدهما المصلي لجبر النقص أو الزيادة أو الشك في الصلاة.' },

        // تصنيف: الزكاة
        { category: 'الزكاة', keyword: 'تعريف الزكاة', display_question: 'ما هي الزكاة؟', response: 'الزكاة هي ركن من أركان الإسلام، وهي قدر معلوم من المال يخرجه المسلم من ماله بشروط معينة ويدفعه لمستحقيه.' },
        { category: 'الزكاة', keyword: 'لمن تعطى الزكاة', display_question: 'لمن تعطى الزكاة؟', response: 'تعطى الزكاة للفقراء والمساكين والعاملين عليها والمؤلفة قلوبهم وفي الرقاب والغارمين وفي سبيل الله وابن السبيل.' },
        { category: 'الزكاة', keyword: 'نصاب الزكاة', display_question: 'ما هو نصاب الزكاة؟', response: 'نصاب الزكاة يختلف باختلاف أنواع المال (ذهب، فضة، نقود، عروض تجارة، زروع). مثلاً، نصاب الذهب 85 جراماً من الذهب الخالص.' },
        { category: 'الزكاة', keyword: 'زكاة الفطر', display_question: 'ما هي زكاة الفطر؟', response: 'زكاة الفطر هي صدقة تجب على كل مسلم عند انتهاء شهر رمضان، وتدفع قبل صلاة عيد الفطر.' },

        // تصنيف: الصيام
        { category: 'الصيام', keyword: 'صيام رمضان', display_question: 'ما هو صيام رمضان؟', response: 'صوم رمضان هو الإمساك عن المفطرات من الفجر إلى غروب الشمس بنية العبادة، وهو ركن من أركان الإسلام.' },
        { category: 'الصيام', keyword: 'مبطلات الصوم', display_question: 'ما هي مبطلات الصوم؟', response: 'من مبطلات الصوم: الأكل والشرب عمداً، والجماع، والقيء عمداً، وخروج الدم بالحجامة، والحيض والنفاس.' },
        { category: 'الصيام', keyword: 'قضاء الصيام', display_question: 'أحكام قضاء الصيام؟', response: 'قضاء الصوم يكون لمن أفطر في رمضان بعذر شرعي كالسفر أو المرض، وعليه أن يصوم الأيام التي أفطرها.' },

        // تصنيف: الحج والعمرة
        { category: 'الحج والعمرة', keyword: 'تعريف الحج', display_question: 'ما هو الحج؟', response: 'الحج هو قصد بيت الله الحرام لأداء مناسك مخصوصة، وهو ركن من أركان الإسلام لمن استطاع إليه سبيلاً.' },
        { category: 'الحج والعمرة', keyword: 'مناسك الحج', display_question: 'ما هي مناسك الحج؟', response: 'مناسك الحج تبدأ بالإحرام، ثم الطواف والسعي، والوقوف بعرفة، والمبيت بمزدلفة ومنى، ورمي الجمرات، والطواف الوداعي.' },
        { category: 'الحج والعمرة', keyword: 'العمرة', display_question: 'ما هي العمرة؟', response: 'العمرة هي زيارة البيت الحرام في غير موسم الحج لأداء مناسك معينة، وتسمى الحج الأصغر.' },

        // تصنيف: الأخلاق والمعاملات
        { category: 'الأخلاق والمعاملات', keyword: 'أخلاق الإسلام', display_question: 'ما هي أخلاق الإسلام؟', response: 'أخلاق الإسلام تقوم على الصدق، الأمانة، الإحسان، التواضع، العدل، والرحمة، وهي دعوة لكل خير.' },
        { category: 'الأخلاق والمعاملات', keyword: 'بر الوالدين', display_question: 'ما هو بر الوالدين؟', response: 'بر الوالدين هو طاعتهما والإحسان إليهما والاعتناء بهما، وهو من أعظم القربات إلى الله تعالى.' },
        { category: 'الأخلاق والمعاملات', keyword: 'صلة الرحم', display_question: 'ما هي صلة الرحم؟', response: 'صلة الرحم هي الإحسان إلى الأقارب والتواصل معهم، وهي من الأمور التي أمر بها الإسلام وحث عليها.' },
        { category: 'الأخلاق والمعاملات', keyword: 'الربا', display_question: 'ما هو الربا؟', response: 'الربا هو الزيادة في المال عند المبادلة أو التأخير في الدفع، وهو محرم في الإسلام، لما فيه من ظلم وأكل لأموال الناس بالباطل.' },
        { category: 'الأخلاق والمعاملات', keyword: 'البيع في الإسلام', display_question: 'كيف يتم البيع في الإسلام؟', response: 'البيع في الإسلام قائم على الرضا والصدق والوضوح، ويجب أن يكون خالياً من الغش والربا والميسر.' },
        { category: 'الأخلاق والمعاملات', keyword: 'الميراث', display_question: 'ما هي أحكام الميراث؟', response: 'الميراث هو انتقال ملكية الأموال والحقوق من الميت إلى ورثته الأحياء وفق أحكام الشريعة الإسلامية.' },

        // استجابات عامة/افتراضية (يمكن وضعها في تصنيف "عامة" أو التعامل معها بشكل خاص)
        { category: 'عامة', keyword: 'سلام', display_question: 'السلام عليكم', response: 'وعليكم السلام ورحمة الله وبركاته! كيف أستطيع مساعدتك في أمور دينك اليوم؟' },
        { category: 'عامة', keyword: 'اهلا', display_question: 'أهلاً بك', response: 'أهلاً بك! كيف يمكنني خدمتك؟' },
        { category: 'عامة', keyword: 'شكرا', display_question: 'شكراً لك', response: 'لا شكر على واجب! أنا هنا لخدمتك.' },
        { category: 'عامة', keyword: 'من انت', display_question: 'من أنت؟', response: 'أنا بوت إسلامي، مهمتي هي تقديم إجابات على أسئلتك الدينية.' }
    ];

    // دالة لإضافة الرسائل للدردشة
    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(`${sender}-message`);
        messageDiv.innerHTML = message;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // دالة لإظهار مؤشر الكتابة
    function showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.classList.add('message', 'bot-message', 'typing-indicator');
        indicatorDiv.innerHTML = `<span></span><span></span><span></span>`;
        indicatorDiv.id = 'typing-indicator';
        chatBody.appendChild(indicatorDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // دالة لإزالة مؤشر الكتابة
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // دالة لمعالجة رسالة المستخدم والحصول على رد البوت
    function getBotResponse(userMessage) {
        const cleanedMessage = userMessage.trim();

        // 1. البحث عن تطابق مباشر مع display_question أو keyword
        const exactMatch = islamicKnowledge.find(item =>
            item.display_question && item.display_question.trim() === cleanedMessage ||
            item.keyword.trim() === cleanedMessage
        );
        if (exactMatch) {
            return exactMatch.response;
        }

        // 2. البحث عن كلمات مفتاحية في رسالة المستخدم
        // يمكن توسيع هذا الجزء بشكل كبير ليتضمن مرادفات عديدة لكل مفهوم
        // نستخدم RegExp.test() للبحث عن الكلمة المفتاحية بغض النظر عن حالة الأحرف
        if (/أركان الإسلام/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'أركان الإسلام').response;
        if (/أركان الإيمان/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'أركان الإيمان').response;
        if (/(ما هو|تعريف)?\s*الإسلام/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'ما هو الإسلام').response;
        if (/(من هو)?\s*الله/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'من هو الله').response;
        if (/(من هو)?\s*محمد|النبي/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'من هو النبي محمد').response;
        if (/(ما هو)?\s*القرآن/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'ما هو القرآن').response;
        if (/(ما هو)?\s*الحديث/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'ما هو الحديث').response;
        if (/فضل القرآن/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'فضل القرآن').response;
        if (/(كيفية|كيف)\s*الوضوء/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'كيفية الوضوء').response;
        if (/نواقض الوضوء/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'نواقض الوضوء').response;
        if (/(كيفية|كيف)\s*الغسل/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'كيفية الغسل').response;
        if (/(متى يجوز)?\s*التيمم/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'التيمم').response;
        if (/أوقات الصلاة/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'أوقات الصلاة').response;
        if (/(كيفية|كيف)\s*الصلاة/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'كيفية الصلاة').response;
        if (/شروط الصلاة/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'شروط الصلاة').response;
        if (/صلاة الوتر/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'صلاة الوتر').response;
        if (/سجود السهو/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'سجود السهو').response;
        if (/(ما هي|تعريف)?\s*الزكاة/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'تعريف الزكاة').response;
        if (/لمن تعطى الزكاة/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'لمن تعطى الزكاة').response;
        if (/نصاب الزكاة/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'نصاب الزكاة').response;
        if (/زكاة الفطر/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'زكاة الفطر').response;
        if (/(ما هو)?\s*صيام رمضان/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'صيام رمضان').response;
        if (/مبطلات الصوم/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'مبطلات الصوم').response;
        if (/قضاء الصيام/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'قضاء الصيام').response;
        if (/(ما هو|تعريف)?\s*الحج/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'تعريف الحج').response;
        if (/مناسك الحج/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'مناسك الحج').response;
        if (/(ما هي)?\s*العمرة/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'العمرة').response;
        if (/(ما هي)?\s*أخلاق الإسلام/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'أخلاق الإسلام').response;
        if (/(ما هو)?\s*بر الوالدين/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'بر الوالدين').response;
        if (/(ما هي)?\s*صلة الرحم/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'صلة الرحم').response;
        if (/(ما هو)?\s*الربا/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'الربا').response;
        if (/(كيف يتم)?\s*البيع في الإسلام/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'البيع في الإسلام').response;
        if (/(ما هي أحكام)?\s*الميراث/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'الميراث').response;
        if (/سلام/.test(cleanedMessage) || /السلام عليكم/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'سلام').response;
        if (/أهلا/.test(cleanedMessage) || /أهلاً بك/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'اهلا').response;
        if (/شكرا/.test(cleanedMessage) || /شكراً لك/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'شكرا').response;
        if (/من أنت/.test(cleanedMessage) || /من انت/.test(cleanedMessage)) return islamicKnowledge.find(item => item.keyword === 'من انت').response;


        // إذا لم يتم العثور على أي تطابق، إرجاع الاستجابة الافتراضية
        return islamicKnowledge.find(item => item.keyword === 'default').response;
    }

    // دالة لعرض التصنيفات
    function displayCategories() {
        // استخراج التصنيفات الفريدة (مع استبعاد 'عامة' إذا كنت لا تريد عرضها كخيار أول)
        const categories = [...new Set(islamicKnowledge.map(item => item.category))]
                            .filter(category => category !== 'عامة'); // استبعاد التصنيف العام من العرض الأولي
        
        if (categories.length > 0) {
            let categoriesHtml = '<div class="suggestions-container"><p>أهلاً بك في البوت الإسلامي! اختر أحد التصنيفات:</p>';
            categories.forEach(category => {
                categoriesHtml += `<button class="category-btn" data-category="${category}">${category}</button>`;
            });
            categoriesHtml += '</div>';
            addMessage(categoriesHtml, 'bot');

            document.querySelectorAll('.category-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const categoryName = button.dataset.category;
                    addMessage(`اخترت: ${categoryName}`, 'user');
                    // إزالة أزرار التصنيفات
                    const suggestionsContainer = chatBody.querySelector('.suggestions-container');
                    if (suggestionsContainer) {
                        suggestionsContainer.closest('.message').remove();
                    }
                    // عرض الأسئلة لهذا التصنيف
                    displayQuestionsByCategory(categoryName);
                });
            });
        } else {
            addMessage("عذراً، لا توجد تصنيفات لعرضها حالياً.", 'bot');
        }
    }

    // دالة لعرض الأسئلة لتصنيف معين
    function displayQuestionsByCategory(categoryName) {
        const questions = islamicKnowledge.filter(item => item.category === categoryName && item.keyword !== 'default');

        if (questions.length > 0) {
            let questionsHtml = `<div class="suggestions-container"><p>إليك بعض الأسئلة في فئة **${categoryName}**:`;
            questions.forEach(item => {
                questionsHtml += `<button class="suggestion-btn" data-question="${item.display_question}">${item.display_question}</button>`;
            });
            questionsHtml += `</p><button class="back-to-categories-btn">الرجوع للتصنيفات الرئيسية</button></div>`;
            addMessage(questionsHtml, 'bot');

            document.querySelectorAll('.suggestion-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const question = button.dataset.question;
                    addMessage(question, 'user');
                    userInput.value = '';
                    
                    // هنا يتم جلب الرد من الـ JS Object وليس من السيرفر
                    showTypingIndicator();
                    setTimeout(() => { // محاكاة التأخير لتبدو كأنها تفكر
                        removeTypingIndicator();
                        const botResponse = getBotResponse(question);
                        addMessage(botResponse, 'bot');
                    }, 500); // 0.5 ثانية تأخير

                    // إزالة أزرار الأسئلة
                    const suggestionsContainer = chatBody.querySelector('.suggestions-container');
                    if (suggestionsContainer) {
                        suggestionsContainer.closest('.message').remove();
                    }
                });
            });

            // زر الرجوع
            document.querySelector('.back-to-categories-btn').addEventListener('click', () => {
                const suggestionsContainer = chatBody.querySelector('.suggestions-container');
                if (suggestionsContainer) {
                    suggestionsContainer.closest('.message').remove();
                }
                displayCategories(); // العودة لعرض التصنيفات
            });

        } else {
            addMessage(`لا توجد أسئلة حالياً في فئة **${categoryName}**.`, 'bot');
            addMessage('<button class="back-to-categories-btn">الرجوع للتصنيفات الرئيسية</button>', 'bot');
            document.querySelector('.back-to-categories-btn').addEventListener('click', () => {
                const messagesToRemove = chatBody.querySelectorAll('.bot-message:last-child, .bot-message:nth-last-child(2)');
                messagesToRemove.forEach(msg => msg.remove());
                displayCategories();
            });
        }
    }

    // معالجة إرسال الرسالة من مربع الإدخال
    function handleSendMessage() {
        const message = userInput.value.trim();
        if (message === "") {
            return;
        }

        addMessage(message, 'user');
        userInput.value = '';

        showTypingIndicator();
        setTimeout(() => { // محاكاة التأخير
            removeTypingIndicator();
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 500);

        // إزالة أزرار الاقتراحات (التصنيفات أو الأسئلة) بعد أن يكتب المستخدم سؤاله الخاص
        const suggestionsContainer = chatBody.querySelector('.suggestions-container');
        if (suggestionsContainer) {
            suggestionsContainer.closest('.message').remove();
        }
    }

    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    userInput.focus();

    // عند تحميل الصفحة، اعرض التصنيفات فقط
    displayCategories();
});