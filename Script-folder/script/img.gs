// دالة تتعامل مع جميع طلبات GET الواردة إلى تطبيق الويب
function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let data;
    let sheetName;

    // التحقق من معلمة 'data' في الرابط لتحديد الورقة التي سيتم القراءة منها
    if (e.parameter.data === 'testimonials') {
      sheetName = 'Testimonials';
      data = getData(spreadsheet, sheetName, ['testimonials']);
    } else if (e.parameter.data === 'gallery') {
      // استخدام اسم الورقة 'Images' كما حدده المستخدم
      sheetName = 'Images';
      data = getData(spreadsheet, sheetName, ['URL', 'Name']);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid data type requested.' }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // إرجاع البيانات ككائن JSON
    return ContentService.createTextOutput(JSON.stringify(data))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // تسجيل وإرجاع أي أخطاء تحدث
    Logger.log(error);
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * تسترجع البيانات من ورقة محددة وتنسقها في مصفوفة من كائنات JSON.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet جدول البيانات النشط.
 * @param {string} sheetName اسم الورقة المراد القراءة منها.
 * @param {string[]} headers رؤوس الأعمدة المتوقعة في الورقة.
 * @return {object[]} مصفوفة من الكائنات، حيث يمثل كل كائن صفًا من البيانات.
 */
function getData(spreadsheet, sheetName, headers) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet with name '${sheetName}' not found.`);
  }

  const range = sheet.getDataRange();
  const values = range.getValues();

  // إذا كانت الورقة فارغة، أرجع مصفوفة فارغة
  if (values.length <= 1) {
    return [];
  }

  const data = [];
  const columnHeaders = values[0];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {};

    // ربط قيمة كل عمود برأسه المقابل
    columnHeaders.forEach((header, colIndex) => {
      const formattedHeader = header.trim();
      if (headers.includes(formattedHeader)) {
        item[formattedHeader] = row[colIndex];
      }
    });

    if (Object.keys(item).length > 0) {
      data.push(item);
    }
  }
  return data;
}
