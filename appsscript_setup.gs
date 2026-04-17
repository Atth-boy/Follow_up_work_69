// ============================================================
//  Apps Script สำหรับ page2.html — บันทึกผู้เข้าสถานีไฟฟ้า
//  วิธีติดตั้ง: ดูขั้นตอนท้ายไฟล์นี้
// ============================================================

const SHEET_NAME = 'บันทึก';  // ชื่อ Sheet tab (เปลี่ยนได้)

const HEADERS = [
  'timestamp', 'area', 'name', 'empId',
  'site', 'dept', 'div', 'tel', 'dateFrom', 'dateTo'
];

// ---------- รับข้อมูลจากเว็บ (POST) ----------
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const data = JSON.parse(e.parameter.data);
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // สร้าง sheet ใหม่ถ้ายังไม่มี
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // สร้าง header row ถ้า sheet ว่าง
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight('bold')
           .setBackground('#374151')
           .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const now = Utilities.formatDate(
      new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss'
    );

    sheet.appendRow([
      now,
      data.area    || '',
      data.name    || '',
      data.empId   || '',
      data.site    || '',
      data.dept    || '',
      data.div     || '',
      data.tel     || '',
      data.dateFrom|| '',
      data.dateTo  || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', msg: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// ---------- ทดสอบ script (รันใน Apps Script Editor) ----------
function testWrite() {
  const mock = {
    parameter: {
      data: JSON.stringify({
        area: 'บางแค', name: 'ทดสอบ ระบบ', empId: '9999999',
        site: 'สถานีไฟฟ้าบางแค', dept: 'ฝทดสอบ', div: 'กทดสอบ',
        tel: '099-999-9999', dateFrom: '2026-04-18', dateTo: '2026-04-18'
      })
    }
  };
  const result = doPost(mock);
  Logger.log(result.getContent());
}

// ============================================================
//  ขั้นตอนติดตั้ง
// ============================================================
//
//  1. เปิด Google Sheet ที่ link ให้ไว้
//
//  2. เมนู Extensions > Apps Script
//
//  3. ลบ code เดิมออกทั้งหมด แล้ววาง code นี้ลงไป
//     (เอาเฉพาะส่วน code ด้านบน ไม่ต้องเอา comment ขั้นตอนนี้)
//
//  4. กด Save (Ctrl+S)
//
//  5. รัน testWrite() ก่อน 1 ครั้งเพื่อ authorize
//     (กด Run > ขออนุญาต Google Account)
//
//  6. Deploy > New deployment
//     - Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//     - กด Deploy > Copy the Web App URL
//
//  7. เปิด page2.html หาบรรทัด:
//       let SCRIPT_URL = '';
//     เปลี่ยนเป็น:
//       let SCRIPT_URL = 'https://script.google.com/macros/s/xxx.../exec';
//
//  8. อย่าลืมแชร์ Google Sheet เป็น "Anyone with link can view"
//     เพื่อให้เว็บอ่านข้อมูลผ่าน CSV URL ได้
//
// ============================================================
