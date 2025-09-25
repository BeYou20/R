const FOLDER_ID = "1ooJOEvn0yUrsR3_oQ9d_LYfJHNI-9Cu9";
const SHEET_ID = "1VXDYpK2lFBJkU9f7vIqaXbI0JmVs3M32ffjfB-O0MRI";
const SHEET_NAME = "Forum";

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({status:"error", message:"لم يتم استقبال بيانات."})).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    let fileUrl = "";

    if (data.cvFile && data.cvName) {
      fileUrl = saveBase64File(data.cvFile, data.cvName, data.full_name);
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([
      data.full_name || "",
      data.age || "",
      data.gender || "",
      data.country_city || "",
      data.qualification || "",
      data.specialization || "",
      data.experience || "",
      data.skills || "",
      data.courses || "",
      data.phone || "",
      data.email || "",
      data.telegram || "",
      data.desired_field || "",
      fileUrl
    ]);

    return ContentService.createTextOutput(JSON.stringify({status:"success", message:"✅ تم حفظ البيانات ورفع السيرة الذاتية.", fileUrl})).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error", message:"❌ " + err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveBase64File(base64Data, fileName, fullName) {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const extension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  let mimeType = MimeType.PLAIN_TEXT;
  if (extension === 'pdf') mimeType = MimeType.PDF;
  else if (extension === 'jpg' || extension === 'jpeg') mimeType = MimeType.JPEG;
  else if (extension === 'png') mimeType = MimeType.PNG;
  else if (extension === 'doc') mimeType = 'application/msword';
  else if (extension === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const safeName = (fullName || "ملف").replace(/[\\/:*?"<>|]/g, "") + '.' + extension;
  const decoded = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decoded, mimeType, safeName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}







//فروم التسجيل 
const SHEET_ID_REG = "1VXDYpK2lFBJkU9f7vIqaXbI0JmVs3M32ffjfB-O0MRI";
const SHEET_NAME_REG = "RegistrationForm"; // ورقة فروم التسجيل

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID_REG).getSheetByName(SHEET_NAME_REG);
    const data = e.parameter;

    sheet.appendRow([
      data.name || "",
      data.gender || "",
      data.age || "",
      data.country || "",
      data.phone || "",
      data.email || "",
      data.telegram || "",
      data.courseName || "",
      data.registrationDate || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({status: "success", message: "✅ تم إرسال البيانات بنجاح"}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "❌ حدث خطأ: " + err.message}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({status: "ready", message: "🚀 التطبيق جاهز"}))
                       .setMimeType(ContentService.MimeType.JSON);
}






// صفحة الدورات 
const SHEET_ID_COURSES = "1VXDYpK2lFBJkU9f7vIqaXbI0JmVs3M32ffjfB-O0MRI";
const SHEET_NAME_COURSES = "Courses"; // ورقة الدورات

function doGet() {
  const sheet = SpreadsheetApp.openById(SHEET_ID_COURSES).getSheetByName(SHEET_NAME_COURSES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const courses = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let course = {};
    for (let j = 0; j < headers.length; j++) {
      course[headers[j]] = row[j];
    }
    courses.push(course);
  }

  return ContentService.createTextOutput(JSON.stringify(courses))
                       .setMimeType(ContentService.MimeType.JSON);
}