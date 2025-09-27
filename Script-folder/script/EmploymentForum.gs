// --- الثوابت الرئيسية ---
const FOLDER_ID = "1ooJOEvn0yUrsR3_oQ9d_LYfJHNI-9Cu9"; // مجلد Drive
const SHEET_ID = "1VXDYpK2lFBJkU9f7vIqaXbI0JmVs3M32ffjfB-O0MRI"; // Google Sheet
const SHEET_NAME = "Forum"; // اسم الورقة

// 🔹 استقبال البيانات من النموذج
function doPost(e) {
  try {
      if (!e.postData || !e.postData.contents) {
            return createJsonResponse("error", "لم يتم استقبال بيانات.");
                }

                    const data = JSON.parse(e.postData.contents);
                        let fileUrl = "";

                            // رفع الملف إذا كان موجود
                                if (data.cvFile && data.cvName) {
                                      fileUrl = saveBase64File(data.cvFile, data.cvName, data.full_name);
                                          }

                                              // حفظ البيانات في Google Sheets
                                                  saveDataToSheet(data, fileUrl);

                                                      return createJsonResponse("success", "✅ تم حفظ البيانات ورفع السيرة الذاتية.", fileUrl);

                                                        } catch (err) {
                                                            Logger.log("❌ خطأ: " + err.message);
                                                                return createJsonResponse("error", "❌ " + err.message);
                                                                  }
                                                                  }

                                                                  // 🔹 رفع الملف إلى Google Drive من Base64 باسم الشخص
                                                                  function saveBase64File(base64Data, fileName, fullName) {
                                                                    const folder = DriveApp.getFolderById(FOLDER_ID);

                                                                      // استخراج امتداد الملف من اسمه الأصلي
                                                                        const extension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();

                                                                          // تحديد نوع MIME المناسب حسب الامتداد
                                                                            let mimeType = MimeType.PLAIN_TEXT; // افتراضي
                                                                              if (extension === 'pdf') mimeType = MimeType.PDF;
                                                                                else if (extension === 'jpg' || extension === 'jpeg') mimeType = MimeType.JPEG;
                                                                                  else if (extension === 'png') mimeType = MimeType.PNG;
                                                                                    else if (extension === 'doc') mimeType = 'application/msword';
                                                                                      else if (extension === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

                                                                                        // اسم الملف سيكون اسم الشخص فقط + الامتداد
                                                                                          const safeName = (fullName || "ملف").replace(/[\\/:*?"<>|]/g, "") + '.' + extension;

                                                                                            // فك ترميز Base64 وإنشاء Blob
                                                                                              const decoded = Utilities.base64Decode(base64Data);
                                                                                                const blob = Utilities.newBlob(decoded, mimeType, safeName);

                                                                                                  // رفع الملف إلى Google Drive
                                                                                                    const file = folder.createFile(blob);
                                                                                                      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

                                                                                                        return file.getUrl();
                                                                                                        }

                                                                                                        // 🔹 حفظ البيانات في Google Sheets
                                                                                                        function saveDataToSheet(data, fileUrl) {
                                                                                                          const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
                                                                                                            if (!sheet) throw new Error("⚠️ لم يتم العثور على الورقة: " + SHEET_NAME);

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
                                                                                                                                                                        }

                                                                                                                                                                        // 🔹 إنشاء استجابة JSON
                                                                                                                                                                        function createJsonResponse(status, message, fileUrl = "") {
                                                                                                                                                                          return ContentService.createTextOutput(
                                                                                                                                                                              JSON.stringify({ status, message, fileUrl })
                                                                                                                                                                                ).setMimeType(ContentService.MimeType.JSON);
                                                                                                                                                                                }

                                                                                                                                                                                // 🔹 جاهزية التطبيق
                                                                                                                                                                                function doGet() {
                                                                                                                                                                                  return createJsonResponse("ready", "🚀 التطبيق جاهز لاستقبال البيانات.");
                                                                                                                                                                                  }