// هذا السكربت يضيف البيانات المرسلة عبر نموذج HTML إلى جدول بيانات Google Sheet
function doPost(e) {
  // اسم الورقة التي تريد إضافة البيانات إليها (يجب أن تكون Recordings)
  const sheetName = 'Recordings'; 
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    // إرجاع خطأ بصيغة JSON
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found! Check sheet name." }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // استخراج بيانات الحقل الواحد (مثل الاسم، العمر)
  const data = e.parameter;
  
  // =======================================================
  // *** نقطة التصحيح: استخراج الدورات من e.parameters (الجمع) ***
  // =======================================================
  
  // e.parameters.courses_selected يعيد مصفوفة بجميع الاختيارات
  let coursesArray = e.parameters.courses_selected; 
  let courses;

  if (coursesArray && Array.isArray(coursesArray)) {
    // دمج جميع الدورات في نص واحد مفصول بفاصلة عربية
    courses = coursesArray.join('، '); 
  } else if (coursesArray) {
    // في حال تم اختيار دورة واحدة فقط، قد تعود كنص مفرد، نحولها لنص
    courses = coursesArray.toString();
  } else {
    // لم يتم اختيار أي دورة
    courses = "لم يتم اختيار دورة";
  }
  
  // =======================================================
  
  // ترتيب البيانات وفقاً لرؤوس الأعمدة
  const rowData = [
    data['الاسم الكامل'],
    data['البريد الإلكتروني'],
    data['رقم الهاتف'],
    data['العمر'],
    data['الجنس'],
    courses, // الدورات المختارة الآن هي النص المدمج الصحيح
    data['ملاحظات إضافية'],
    new Date() // إضافة تاريخ ووقت الإرسال
  ];

  // إضافة الصف الجديد إلى الجدول
  sheet.appendRow(rowData);
  
  // إرجاع استجابة JSON للنموذج
  return ContentService.createTextOutput(JSON.stringify({ success: true, message: "تم تسجيل البيانات بنجاح!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
