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
                                                              data.CourseName || "", // تم تصحيح هذا السطر
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
                                                                                                                                                               