function doGet(e) {
    // هذه هي نقطة الدخول الرئيسية لـ Google Apps Script كخدمة ويب (GET request).
    
    // تعريف معرف جدول بيانات جوجل (Google Sheet ID)
    var sheetId = '1RR2Trg7DyvCnHRBaHLaFn10DT61Fedwp55Ej3iIGyOA';
    
    // تعريف اسم ورقة البيانات المراد التعامل معها
    var sheetName = 'Courses'; // يمكنك تغيير هذا إلى اسم ورقة البيانات الخاصة بك إذا كان مختلفاً
    // ورقة صور المدربين
    
    // فتح جدول البيانات بواسطة المعرف والحصول على الورقة بالاسم المحدد
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    
    // الحصول على جميع البيانات الموجودة في نطاق البيانات المستخدم (من A1 وحتى آخر صف وعمود يحتوي على بيانات)
    var data = sheet.getDataRange().getValues();
    
    // الصف الأول يحتوي على رؤوس الأعمدة (العناوين)
    var headers = data[0];
    
    // مصفوفة فارغة لتخزين البيانات المعالجة (كل صف سيكون كائناً - Object)
    var courses = [];
    
    // البدء في تكرار الصفوف من الصف الثاني (i=1) لأن الصف الأول (i=0) هو رؤوس الأعمدة
    for (var i = 1; i < data.length; i++) {
        var row = data[i]; // الصف الحالي من البيانات
        var course = {};   // كائن فارغ لتمثيل "الدورة" الحالية (أو السجل)
        
        // التكرار على جميع الأعمدة في الصف الحالي
        for (var j = 0; j < headers.length; j++) {
            var header = headers[j]; // اسم العمود (العنوان)
            var value = row[j];      // قيمة الخلية الحالية
            
            // --- معالجة الحقول الخاصة (التي تحتاج إلى تحليل - Parsing) ---
            
            // التحقق من أن العمود هو "instructors" (المدربون) وأن القيمة ليست فارغة
            if (header === 'instructors' && value) {
                // تقسيم القيمة باستخدام الفاصل "|" للحصول على بيانات كل مدرب على حدة
                var instructorsArray = value.split('|').map(function(instructor) {
                    // تقسيم بيانات المدرب باستخدام الفاصل " - "
                    var parts = instructor.trim().split(' - ');
                    // التأكد من وجود 3 أجزاء على الأقل: الاسم، الدور، والصورة
                    if (parts.length >= 3) {
                        return {
                            name: parts[0].trim(),   // الاسم
                            role: parts[1].trim(),   // الدور
                            photo: parts[2].trim()   // رابط الصورة
                        };
                    }
                    return null; // تجاهل المدربين الذين لا تتطابق بياناتهم مع التنسيق المطلوب
                }).filter(Boolean); // إزالة أي قيم "null" التي تم إرجاعها
                
                // تحويل مصفوفة المدربين إلى سلسلة JSON وتعيينها لحقل "instructors"
                course[header] = JSON.stringify(instructorsArray);
                
            // التحقق من أن العمود هو "testimonials" (الشهادات) وأن القيمة ليست فارغة
            } else if (header === 'testimonials' && value) {
                // تقسيم القيمة باستخدام الفاصل "|" للحصول على بيانات كل شهادة
                var testimonialsArray = value.split('|').map(function(t) {
                    // تقسيم بيانات الشهادة باستخدام الفاصل " - " (عادةً النص - الاسم)
                    var parts = t.trim().split(' - ');
                    return {
                        name: parts[1] ? parts[1].trim() : '', // اسم صاحب الشهادة (الجزء الثاني)
                        text: parts[0] ? parts[0].trim() : ''  // نص الشهادة (الجزء الأول)
                    };
                });
                // تحويل مصفوفة الشهادات إلى سلسلة JSON وتعيينها للحقل
                course[header] = JSON.stringify(testimonialsArray);
                
            // التحقق من أن العمود هو "faqs" (الأسئلة الشائعة) وأن القيمة ليست فارغة
            } else if (header === 'faqs' && value) {
                // تقسيم القيمة باستخدام الفاصل "|" للحصول على بيانات كل سؤال وجواب
                var faqsArray = value.split('|').map(function(f) {
                    // تقسيم السؤال والجواب باستخدام الفاصل ":"
                    var parts = f.trim().split(':');
                    return {
                        question: parts[0] ? parts[0].trim() : '', // السؤال
                        answer: parts[1] ? parts[1].trim() : ''    // الإجابة
                    };
                });
                // تحويل مصفوفة الأسئلة الشائعة إلى سلسلة JSON وتعيينها للحقل
                course[header] = JSON.stringify(faqsArray);
                
            // --- معالجة الحقول العادية ---
            } else {
                // إذا لم يكن حقلاً خاصاً، يتم تعيين القيمة مباشرة
                course[header] = value;
            }
        }
        
        // إضافة الكائن المعالج (الدورة/السجل) إلى مصفوفة الدورات
        courses.push(course);
    }
    
    // تحويل مصفوفة الدورات (الكائنات) بالكامل إلى سلسلة نصية بتنسيق JSON
    var result = JSON.stringify(courses);
    
    // إرجاع النتيجة كاستجابة نصية لطلب الـ GET
    return ContentService.createTextOutput(result)
        // تحديد نوع محتوى الاستجابة ليكون JSON (وهو التنسيق المطلوب لخدمات الويب API)
        .setMimeType(ContentService.MimeType.JSON);
}
