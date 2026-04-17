# เว็บติดตามงาน — CLAUDE.md

## บทบาท
Claude ทำหน้าที่เป็นผู้พัฒนาหน้าเว็บสำหรับ **ระบบติดตามงาน** ของ กสฟ. ปี 69

---

## สถาปัตยกรรมโปรเจกต์

### แหล่งข้อมูล
- **ข้อมูลจริง**: Google Sheets (ดึงผ่าน Google Sheets API หรือ Published CSV/JSON URL)
- **ต้นแบบโครงสร้างข้อมูล**: ไฟล์ Excel `ร่างแผนติดตามงาน กสฟ. ปี 69.xlsx` ในโฟลเดอร์ `อ้างอิงตาราง/`
  - ใช้ Excel เป็นแม่แบบสำหรับโครงสร้างคอลัมน์ ชื่อฟิลด์ และ layout เท่านั้น
  - ข้อมูลจริงบนเว็บดึงจาก Google Sheets เสมอ

### การ Deploy
- **Hosting**: GitHub Pages (static HTML/CSS/JS)
- **URL**: `https://<username>.github.io/<repo>` หรือ Custom Domain ที่ผูกกับ repo
- **ไฟล์หลัก**: `index.html` ที่ root ของ repo

---

## โครงสร้างโฟลเดอร์ที่คาดหวัง

```
เว็บติดตามงาน/
├── index.html          # หน้าหลัก
├── css/
│   └── style.css
├── js/
│   └── main.js         # logic ดึงข้อมูลจาก Google Sheets
├── อ้างอิงตาราง/       # ไฟล์ Excel ต้นแบบ (ไม่ deploy)
│   └── ร่างแผนติดตามงาน กสฟ. ปี 69.xlsx
├── requirement.txt     # requirement ของโปรเจกต์
├── .gitignore
└── CLAUDE.md
```

---

## Requirement
> อ้างอิงจากไฟล์ `requirement.txt` ในโฟลเดอร์นี้
> *(ยังไม่มีไฟล์ — กรุณาสร้าง `requirement.txt` แล้ว Claude จะอ่านก่อนพัฒนาทุกครั้ง)*

---

## แนวทางการพัฒนา

- ใช้ **vanilla HTML/CSS/JS** เป็นหลัก (ไม่มี build step เพื่อให้ GitHub Pages รันได้ตรง)
- ดึงข้อมูลจาก Google Sheets ผ่าน **Published CSV** หรือ **Sheets API v4** (ไม่ต้อง backend)
- เมื่อเพิ่มฟีเจอร์ใหม่ ให้ตรวจสอบโครงสร้างตารางจาก Excel ใน `อ้างอิงตาราง/` ก่อนเสมอ
- ทุกการเปลี่ยนแปลงต้องรันได้บน GitHub Pages โดยไม่ต้องมี server-side

---

## สิ่งที่ห้ามทำ
- ห้าม hardcode ข้อมูลงานลงใน HTML โดยตรง
- ห้ามใช้ framework ที่ต้องการ build step (React, Vue, etc.) เว้นแต่ user ขอ
- ห้าม commit ไฟล์ `.env` หรือ API Key ลง repo
