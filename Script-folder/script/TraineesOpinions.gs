// قم بتغيير هذه القيم لتتناسب مع ورقة قوقل شيت الخاصة بك
const SHEET_ID_TESTIMONIALS = "1VXDYpK2lFBJkU9f7vIqaXbI0JmVs3M32ffjfB-O0MRI"; 
const SHEET_NAME_TESTIMONIALS = "Courses"; // تأكد من أن هذا الاسم صحيح

function doGet(e) {
  try {
      const sheet = SpreadsheetApp.openById(SHEET_ID_TESTIMONIALS).getSheetByName(SHEET_NAME_TESTIMONIALS);
          const data = sheet.getRange('A2:A' + sheet.getLastRow()).getValues(); // يفترض أن الآراء في العمود A

              const formattedData = data.map(row => ({
                    testimonials: row[0]
                        }));

                            return ContentService.createTextOutput(JSON.stringify(formattedData))
                                  .setMimeType(ContentService.MimeType.JSON);

                                    } catch (err) {
                                        return ContentService.createTextOutput(JSON.stringify({
                                                status: "error",
                                                        message: "❌ حدث خطأ: " + err.message
                                                              }))
                                                                    .setMimeType(ContentService.MimeType.JSON);
                                                                      }
                                                                      }

                                                                      function doPost(e) {
                                                                        return ContentService.createTextOutput(JSON.stringify({
                                                                              status: "ready",
                                                                                    message: "🚀 هذا التطبيق جاهز"
                                                                                        }))
                                                                                            .setMimeType(ContentService.MimeType.JSON);
                                                                                            }
                                                                                            