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