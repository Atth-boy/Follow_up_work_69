// ============================================================
//  Apps Script สำหรับ index.html — อัปเดตข้อมูลแผนติดตามงาน
//  Sheet ID: 12phzuN2fWAbTPJ5zRAM2YFPt6SwkMTdify6b2qSVwyk
// ============================================================
//
//  คอลัมน์ใน Sheet:
//    A=ลำดับ  B=รายการ  C=แผน  D=ความคืบหน้า  E=วันที่อัปเดต  F=ผู้รับผิดชอบ
//
// ============================================================

function doGet(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const action = params.action || 'read';

  if (action === 'update') {
    return handleUpdate(params);
  }

  return handleRead();
}

// ---------- อ่านข้อมูลทั้งหมด ----------
function handleRead() {
  const ss    = SpreadsheetApp.openById('12phzuN2fWAbTPJ5zRAM2YFPt6SwkMTdify6b2qSVwyk');
  const sheet = ss.getSheets()[0];
  const data  = sheet.getDataRange().getValues();
  const rows  = data.slice(1).map((r, i) => ({
    _row:  i + 2,
    no:    r[0], item: r[1], plan: r[2],
    step:  r[3], date: r[4], owner: r[5]
  }));
  return jsonResponse({ status: 'ok', rows });
}

// ---------- อัปเดตแถวที่ระบุ ----------
function handleUpdate(p) {
  const row = parseInt(p.row);
  if (!row || row < 2) return jsonResponse({ status: 'error', msg: 'invalid row' });

  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const ss    = SpreadsheetApp.openById('12phzuN2fWAbTPJ5zRAM2YFPt6SwkMTdify6b2qSVwyk');
    const sheet = ss.getSheets()[0];

    if (p.plan !== undefined) sheet.getRange(row, 3).setValue(p.plan);
    if (p.step !== undefined) sheet.getRange(row, 4).setValue(p.step);
    if (p.date !== undefined) sheet.getRange(row, 5).setValue(p.date);

    return jsonResponse({ status: 'ok', row });
  } catch (err) {
    return jsonResponse({ status: 'error', msg: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------- ทดสอบ ----------
function testUpdate() {
  const mock = { parameter: { action: 'update', row: '2', plan: 'ทดสอบแผน', step: 'ทดสอบความคืบหน้า', date: '18/04/2569' } };
  Logger.log(doGet(mock).getContent());
}

// ============================================================
//  ขั้นตอนติดตั้ง
// ============================================================
//
//  1. เปิด Google Sheet ของ index (ID: 12phzuN2fWAbTPJ5zRAM2YFPt6SwkMTdify6b2qSVwyk)
//
//  2. เมนู Extensions > Apps Script
//
//  3. ลบ code เดิมออก แล้ววาง code นี้ (เฉพาะส่วนบน ไม่ต้องรวม comment ขั้นตอน)
//
//  4. กด Save (Ctrl+S)
//
//  5. รัน testUpdate() 1 ครั้งเพื่อ authorize
//
//  6. Deploy > New deployment
//     - Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//     - กด Deploy > Copy the Web App URL
//
//  7. เปิด index.html หาบรรทัด:
//       const INDEX_SCRIPT_URL = '';
//     เปลี่ยนเป็น URL ที่ได้จากข้อ 6
//
// ============================================================
