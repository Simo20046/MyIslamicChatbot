# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import sqlite3
from langdetect import detect, DetectorFactory

DetectorFactory.seed = 0

app = Flask(__name__)
CORS(app)

DATABASE_NAME = 'islamic_chatbot.db'

# --- تهيئة قاعدة البيانات وإدخال البيانات الأولية (أسئلة وأجوبة دينية مصنفة) ---
def init_db():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lang TEXT NOT NULL,
            keyword TEXT NOT NULL,
            response TEXT NOT NULL,
            category TEXT,
            display_question TEXT, -- عمود جديد لتخزين السؤال بصيغة العرض
            UNIQUE(lang, keyword)
        )
    ''')

    # بيانات أولية دينية باللغة العربية الفصحى، مع تحديد الـ display_question
    initial_data = [
        # تصنيف: العقيدة والإيمان
        ('ar', 'ما هو الإسلام', 'الإسلام هو دين التوحيد والاستسلام لله وحده، وهو الدين الخاتم الذي جاء به سيدنا محمد صلى الله عليه وسلم.', 'العقيدة والإيمان', 'ما هو الإسلام؟'),
        ('ar', 'من هو الله', 'الله سبحانه وتعالى هو الخالق البارئ المصور، رب العالمين، لا إله إلا هو وحده لا شريك له.', 'العقيدة والإيمان', 'من هو الله؟'),
        ('ar', 'من هو النبي محمد', 'سيدنا محمد صلى الله عليه وسلم هو خاتم الأنبياء والمرسلين، أرسله الله رحمة للعالمين، وهو قدوتنا الحسنة.', 'العقيدة والإيمان', 'من هو النبي محمد صلى الله عليه وسلم؟'),
        ('ar', 'أركان الإيمان', 'أركان الإيمان ستة: الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، وبالقدر خيره وشره.', 'العقيدة والإيمان', 'ما هي أركان الإيمان؟'),

        # تصنيف: أركان الإسلام
        ('ar', 'أركان الإسلام', 'أركان الإسلام خمسة: الشهادتان، إقامة الصلاة، إيتاء الزكاة، صوم رمضان، وحج البيت لمن استطاع إليه سبيلاً.', 'أركان الإسلام', 'ما هي أركان الإسلام؟'),

        # تصنيف: القرآن والسنة
        ('ar', 'ما هو القرآن', 'القرآن الكريم هو كلام الله تعالى المنزل على سيدنا محمد صلى الله عليه وسلم، وهو كتاب هداية ونور للبشرية.', 'القرآن والسنة', 'ما هو القرآن الكريم؟'),
        ('ar', 'ما هو الحديث', 'الحديث هو ما ورد عن النبي صلى الله عليه وسلم من قول أو فعل أو تقرير أو صفة.', 'القرآن والسنة', 'ما هو الحديث النبوي؟'),
        ('ar', 'فضل القرآن', 'قراءة القرآن نور وهداية وشفاء، وحرف بحسنة، والحسنة بعشر أمثالها.', 'القرآن والسنة', 'ما فضل قراءة القرآن؟'),

        # تصنيف: الطهارة
        ('ar', 'كيفية الوضوء', 'الوضوء هو غسل أعضاء معينة بالماء الطهور بنية التطهر للصلاة وما في حكمها، وله صفة معينة مذكورة في السنة النبوية.', 'الطهارة', 'كيفية الوضوء؟'),
        ('ar', 'نواقض الوضوء', 'نواقض الوضوء هي كل ما يبطل الوضوء، ومنها: الخارج من السبيلين، النوم العميق، زوال العقل، ومس الفرج مباشرة بغير حائل.', 'الطهارة', 'ما هي نواقض الوضوء؟'),
        ('ar', 'كيفية الغسل', 'الغسل هو تعميم الماء الطهور على جميع البدن بنية رفع الحدث الأكبر، وله صفتان: صفة الإجزاء وصفة الكمال.', 'الطهارة', 'كيفية الغسل من الجنابة؟'),
        ('ar', 'التيمم', 'التيمم هو المسح بالصعيد الطيب (التراب) على الوجه والكفين بنية الطهارة عند عدم وجود الماء أو العجز عن استعماله.', 'الطهارة', 'متى يجوز التيمم؟'),

        # تصنيف: الصلاة
        ('ar', 'أوقات الصلاة', 'أوقات الصلاة هي الفجر، الظهر، العصر، المغرب، والعشاء. لكل صلاة وقت محدد يجب أداؤها فيه.', 'الصلاة', 'ما هي أوقات الصلاة؟'),
        ('ar', 'كيفية الصلاة', 'الصلاة هي ركن من أركان الإسلام، وتؤدى بكيفية معينة تبدأ بالتكبير وتنتهي بالتسليم، مع الركوع والسجود والطمأنينة فيها.', 'الصلاة', 'كيفية أداء الصلاة؟'),
        ('ar', 'شروط الصلاة', 'من شروط الصلاة: الطهارة من الحدثين، وطهارة الثوب والبدن والمكان، وستر العورة، واستقبال القبلة، ودخول الوقت، والنية.', 'الصلاة', 'ما هي شروط صحة الصلاة؟'),
        ('ar', 'صلاة الوتر', 'صلاة الوتر هي سنة مؤكدة، وتصلى ركعة واحدة أو ثلاث أو أكثر بعد صلاة العشاء، وهي خاتمة صلاة الليل.', 'الصلاة', 'ما هي صلاة الوتر؟'),
        ('ar', 'سجود السهو', 'سجود السهو هو سجدتان يسجدهما المصلي لجبر النقص أو الزيادة أو الشك في الصلاة.', 'الصلاة', 'ما هو سجود السهو؟'),

        # تصنيف: الزكاة
        ('ar', 'تعريف الزكاة', 'الزكاة هي ركن من أركان الإسلام، وهي قدر معلوم من المال يخرجه المسلم من ماله بشروط معينة ويدفعه لمستحقيه.', 'الزكاة', 'ما هي الزكاة؟'),
        ('ar', 'لمن تعطى الزكاة', 'تعطى الزكاة للفقراء والمساكين والعاملين عليها والمؤلفة قلوبهم وفي الرقاب والغارمين وفي سبيل الله وابن السبيل.', 'الزكاة', 'لمن تعطى الزكاة؟'),
        ('ar', 'نصاب الزكاة', 'نصاب الزكاة يختلف باختلاف أنواع المال (ذهب، فضة، نقود، عروض تجارة، زروع). مثلاً، نصاب الذهب 85 جراماً من الذهب الخالص.', 'الزكاة', 'ما هو نصاب الزكاة؟'),
        ('ar', 'زكاة الفطر', 'زكاة الفطر هي صدقة تجب على كل مسلم عند انتهاء شهر رمضان، وتدفع قبل صلاة عيد الفطر.', 'الزكاة', 'ما هي زكاة الفطر؟'),

        # تصنيف: الصيام
        ('ar', 'صيام رمضان', 'صوم رمضان هو الإمساك عن المفطرات من الفجر إلى غروب الشمس بنية العبادة، وهو ركن من أركان الإسلام.', 'الصيام', 'ما هو صيام رمضان؟'),
        ('ar', 'مبطلات الصوم', 'من مبطلات الصوم: الأكل والشرب عمداً، والجماع، والقيء عمداً، وخروج الدم بالحجامة، والحيض والنفاس.', 'الصيام', 'ما هي مبطلات الصوم؟'),
        ('ar', 'قضاء الصيام', 'قضاء الصوم يكون لمن أفطر في رمضان بعذر شرعي كالسفر أو المرض، وعليه أن يصوم الأيام التي أفطرها.', 'الصيام', 'أحكام قضاء الصيام؟'),

        # تصنيف: الحج والعمرة
        ('ar', 'تعريف الحج', 'الحج هو قصد بيت الله الحرام لأداء مناسك مخصوصة، وهو ركن من أركان الإسلام لمن استطاع إليه سبيلاً.', 'الحج والعمرة', 'ما هو الحج؟'),
        ('ar', 'مناسك الحج', 'مناسك الحج تبدأ بالإحرام، ثم الطواف والسعي، والوقوف بعرفة، والمبيت بمزدلفة ومنى، ورمي الجمرات، والطواف الوداعي.', 'الحج والعمرة', 'ما هي مناسك الحج؟'),
        ('ar', 'العمرة', 'العمرة هي زيارة البيت الحرام في غير موسم الحج لأداء مناسك معينة، وتسمى الحج الأصغر.', 'الحج والعمرة', 'ما هي العمرة؟'),

        # تصنيف: الأخلاق والمعاملات
        ('ar', 'أخلاق الإسلام', 'أخلاق الإسلام تقوم على الصدق، الأمانة، الإحسان، التواضع، العدل، والرحمة، وهي دعوة لكل خير.', 'الأخلاق والمعاملات', 'ما هي أخلاق الإسلام؟'),
        ('ar', 'بر الوالدين', 'بر الوالدين هو طاعتهما والإحسان إليهما والاعتناء بهما، وهو من أعظم القربات إلى الله تعالى.', 'الأخلاق والمعاملات', 'ما هو بر الوالدين؟'),
        ('ar', 'صلة الرحم', 'صلة الرحم هي الإحسان إلى الأقارب والتواصل معهم، وهي من الأمور التي أمر بها الإسلام وحث عليها.', 'الأخلاق والمعاملات', 'ما هي صلة الرحم؟'),
        ('ar', 'الربا', 'الربا هو الزيادة في المال عند المبادلة أو التأخير في الدفع، وهو محرم في الإسلام، لما فيه من ظلم وأكل لأموال الناس بالباطل.', 'الأخلاق والمعاملات', 'ما هو الربا؟'),

        # استجابة افتراضية
        ('ar', 'default', 'عذراً، لم أجد إجابة لسؤالك بالضبط. يمكنني مساعدتك في مواضيع أخرى في الدين الإسلامي. يرجى اختيار أحد التصنيفات أعلاه أو طرح سؤال مختلف.', 'مقدمة وعامة', 'سؤال افتراضي')
    ]

    try:
        c.execute("ALTER TABLE responses ADD COLUMN category TEXT")
        c.execute("ALTER TABLE responses ADD COLUMN display_question TEXT")
    except sqlite3.OperationalError as e:
        # تتجاهل الأخطاء إذا كانت الأعمدة موجودة بالفعل
        if "duplicate column name" not in str(e):
            raise

    for lang, keyword, response_text, category, display_question in initial_data:
        try:
            c.execute("INSERT INTO responses (lang, keyword, response, category, display_question) VALUES (?, ?, ?, ?, ?)",
                      (lang, keyword, response_text, category, display_question))
        except sqlite3.IntegrityError:
            # إذا كانت الكلمة المفتاحية موجودة، نحدث البيانات
            c.execute("UPDATE responses SET response = ?, category = ?, display_question = ? WHERE lang = ? AND keyword = ?",
                      (response_text, category, display_question, lang, keyword))
    conn.commit()
    conn.close()

init_db()

def get_bot_response(user_message):
    cleaned_message = user_message.lower().strip()
    detected_lang = 'ar'

    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()

    # محاولة البحث بالتطابق التام مع الـ keyword أو الـ display_question
    c.execute("SELECT response FROM responses WHERE lang = ? AND (keyword = ? OR display_question = ?)", (detected_lang, cleaned_message, cleaned_message))
    result = c.fetchone()
    if result:
        conn.close()
        return result[0]

    # إذا لم يكن هناك تطابق مباشر، البحث عن الكلمات المفتاحية في رسالة المستخدم
    # هنا يجب أن تكون الكلمات المفتاحية دقيقة لأسئلة الفصحى
    if re.search(r'\b(الإسلام)\b', cleaned_message) and 'ما هو' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'ما هو الإسلام'")
    elif re.search(r'\b(الله)\b', cleaned_message) and 'من هو' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'من هو الله'")
    elif re.search(r'\b(محمد|النبي)\b', cleaned_message) and 'من هو' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'من هو النبي محمد'")
    elif re.search(r'\b(أركان الإيمان)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'أركان الإيمان'")
    elif re.search(r'\b(أركان الإسلام)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'أركان الإسلام'")
    elif re.search(r'\b(القرآن)\b', cleaned_message) and 'ما هو' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'ما هو القرآن'")
    elif re.search(r'\b(الحديث)\b', cleaned_message) and 'ما هو' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'ما هو الحديث'")
    elif re.search(r'\b(فضل القرآن)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'فضل القرآن'")
    elif re.search(r'\b(الوضوء)\b', cleaned_message) and 'كيف' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'كيفية الوضوء'")
    elif re.search(r'\b(نواقض الوضوء)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'نواقض الوضوء'")
    elif re.search(r'\b(الغسل|الجنابة)\b', cleaned_message) and 'كيف' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'كيفية الغسل'")
    elif re.search(r'\b(التيمم)\b', cleaned_message) and 'متى' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'التيمم'")
    elif re.search(r'\b(أوقات الصلاة)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'أوقات الصلاة'")
    elif re.search(r'\b(كيفية الصلاة|الصلاة)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'كيفية الصلاة'")
    elif re.search(r'\b(شروط الصلاة)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'شروط الصلاة'")
    elif re.search(r'\b(صلاة الوتر)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'صلاة الوتر'")
    elif re.search(r'\b(سجود السهو)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'سجود السهو'")
    elif re.search(r'\b(الزكاة)\b', cleaned_message) and 'ما هي' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'تعريف الزكاة'")
    elif re.search(r'\b(لمن تعطى الزكاة)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'لمن تعطى الزكاة'")
    elif re.search(r'\b(نصاب الزكاة)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'نصاب الزكاة'")
    elif re.search(r'\b(زكاة الفطر)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'زكاة الفطر'")
    elif re.search(r'\b(صيام رمضان)\b', cleaned_message) and 'ما هو' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'صيام رمضان'")
    elif re.search(r'\b(مبطلات الصوم)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'مبطلات الصوم'")
    elif re.search(r'\b(قضاء الصيام)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'قضاء الصيام'")
    elif re.search(r'\b(الحج)\b', cleaned_message) and 'ما هو' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'تعريف الحج'")
    elif re.search(r'\b(مناسك الحج)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'مناسك الحج'")
    elif re.search(r'\b(العمرة)\b', cleaned_message) and 'ما هي' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'العمرة'")
    elif re.search(r'\b(أخلاق الإسلام)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'أخلاق الإسلام'")
    elif re.search(r'\b(بر الوالدين)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'بر الوالدين'")
    elif re.search(r'\b(صلة الرحم)\b', cleaned_message):
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'صلة الرحم'")
    elif re.search(r'\b(الربا)\b', cleaned_message) and 'ما هو' in cleaned_message:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'الربا'")

    else:
        c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'default'")

    result = c.fetchone()
    conn.close()
    if result:
        return result[0]

    conn = sqlite3.connect(DATABASE_NAME)
    c.execute("SELECT response FROM responses WHERE lang = 'ar' AND keyword = 'default'")
    default_response = c.fetchone()
    conn.close()
    return default_response[0] if default_response else "عذراً، لم أجد إجابة لسؤالك الديني. يرجى المحاولة بسؤال آخر."

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"response": "Error: No message provided."}), 400

    bot_response = get_bot_response(user_message)

    return jsonify({"response": bot_response})

# --- نقطة وصول جديدة لجلب التصنيفات فقط ---
@app.route('/categories', methods=['GET'])
def get_categories():
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("SELECT DISTINCT category FROM responses WHERE lang = 'ar' AND category IS NOT NULL AND category != 'مقدمة وعامة' ORDER BY category")
    categories = [row[0] for row in c.fetchall()]
    conn.close()
    return jsonify({"categories": categories})

# --- نقطة وصول جديدة لجلب الأسئلة لتصنيف معين ---
@app.route('/questions_by_category/<category_name>', methods=['GET'])
def get_questions_by_category(category_name):
    conn = sqlite3.connect(DATABASE_NAME)
    c = conn.cursor()
    c.execute("SELECT keyword, display_question FROM responses WHERE lang = 'ar' AND category = ? ORDER BY display_question", (category_name,))
    questions_data = [{'keyword': row[0], 'question': row[1]} for row in c.fetchall() if row[0] not in ['default', 'salam', 'labas', 'ach smitek', 'rachid', 'ahlan']]
    conn.close()
    return jsonify({"questions": questions_data})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)