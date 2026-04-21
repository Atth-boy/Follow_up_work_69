const SECRET_TOKEN = "mea2569";

function doGet(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const action = params.action || 'read';
  const token  = params.token || '';

  if (token !== SECRET_TOKEN) {
    return jsonResponse({ status: 'error', msg: 'รหัสผ่านไม่ถูกต้อง (Unauthorized)' });
  }

  if (action === 'update') {
    return handleUpdate(params);
  }

  return handleRead();
}

function handleRead() {
  const ss    = SpreadsheetApp.openById('12phzuN2fWAbTPJ5zRAM2YFPt6SwkMTdify6b2qSVwyk');
  const sheet = ss.getSheets()[0];
  const data  = sheet.getDataRange().getValues();
  const rows  = data.slice(1).map((r, i) => ({
    _row:  i + 2,
    no:    r[0], item: r[1], plan: r[2],
    step:  r[3], date: r[4], owner: r[5],
    status: r[6] || 'ongoing'
  }));
  return jsonResponse({ status: 'ok', rows });
}

function handleUpdate(p) {
  const row = parseInt(p.row);
  if (!row || row < 2) return jsonResponse({ status: 'error', msg: 'invalid row' });

  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const ss    = SpreadsheetApp.openById('12phzuN2fWAbTPJ5zRAM2YFPt6SwkMTdify6b2qSVwyk');
    const sheet = ss.getSheets()[0];

    if (p.plan   !== undefined) sheet.getRange(row, 3).setValue(p.plan);
    if (p.step   !== undefined) sheet.getRange(row, 4).setValue(p.step);
    if (p.date   !== undefined) sheet.getRange(row, 5).setValue(p.date);
    if (p.status !== undefined) sheet.getRange(row, 7).setValue(p.status);

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

function testUpdate() {
  const mock = { parameter: { action: 'update', row: '2', plan: 'ทดสอบแผน', step: 'ทดสอบความคืบหน้า', date: '18/04/2569', status: 'ongoing' } };
  Logger.log(doGet(mock).getContent());
}
