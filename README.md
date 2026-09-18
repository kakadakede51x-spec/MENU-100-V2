# menu100 — แพลตฟอร์มจัดอันดับอาหารและคอมมูนิตี้นักชิม

เว็บแอปพลิเคชันสำหรับจัดอันดับสุดยอดอาหาร (Ranking Top 20 อาหารโลก & ยอดนิยม), ค้นหาและโปรโมทร้านอาหาร SME ทั่วไทย 77 จังหวัดพร้อมระบบยืนยันดาว (Verified 1-5 ดาว), ร้านจำหน่ายสินค้าที่ระลึก (Merch Store), เว็บบอร์ดกระทู้นักชิม, ระบบสมาชิกระดับ Royal Member (คะแนนโหวต x2) และระบบหลังบ้าน (Admin Backoffice) สำหรับจัดการข้อมูล

---

## 🌟 ฟีเจอร์หลัก (Key Features)

1. **ระบบยืนยันตัวตนก่อนเข้าใช้งาน (Authentication Gate)**
   - บังคับสมัครสมาชิก / เข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่านก่อนเข้าใช้งาน
   - รองรับการออกจากระบบ (Logout) เพื่อเปลี่ยนบัญชีหรือทดสอบการสมัครใหม่
2. **ระบบจัดอันดับ (Ranking & Top 20 อาหารโลก)**
   - จัดอันดับเมนูยอดนิยมพร้อมรอบการรีเซ็ตทุกๆ 2 เดือน (2-Month Season Reset)
   - คำนวณคะแนนรวมจาก Regular Vote และ Royal Vote (ถ่วงน้ำหนัก 2 เท่า)
   - กรองเมนูตามหมวดหมู่อาหาร
3. **ระบบร้านอาหาร & SME ทั่วไทย 77 จังหวัด**
   - แสดงตรารับรองคุณภาพ 1-5 ดาว จากการตรวจสอบโดยเจ้าของร้าน (Owner Verification)
   - ป้ายกำกับสนับสนุน SME และสตรีทฟู้ดท้องถิ่น
   - ค้นหาตามภาคและจังหวัด พร้อมแบบฟอร์มยื่นขอรับการตรวจสอบ
4. **ร้านค้าสินค้าที่ระลึก (Merch Store)**
   - สินค้าพรีเมียมเฉพาะแบรนด์ (เสื้อยืด, ผ้ากันเปื้อน, หมวกแก๊ป, กระบอกน้ำ)
   - สิทธิประโยชน์ส่วนลดพิเศษ 15% อัตโนมัติสำหรับสมาชิกระดับ Royal Member
   - ระบบตะกร้าสินค้าและการคำนวณยอดรวม
5. **กระทู้นักชิม (Community Forum)**
   - พื้นที่แบ่งปันประสบการณ์ รีวิวร้านอาหาร และตั้งคำถามสำหรับสายกิน
6. **ระบบสมาชิก & Royal Member**
   - แสดง Virtual Member Card
   - สิทธิ์โหวตคูณ 2 (Weight 2x) และโควตาโหวตรายเดือน
7. **ระบบหลังบ้านผู้ดูแลระบบ (Admin Backoffice Portal)**
   - เพิ่ม/แก้ไข/ลบเมนูอาหาร เปลี่ยนรูปภาพ และปรับแก้คะแนนโหวต
   - อัปเดตดาวและสถานะการรับรองร้านอาหาร
   - จัดการข้อมูลสินค้า Merch และราคา
   - จำลองการสรุปผลและรีเซ็ตรอบซีซัน 2 เดือน
8. **วงล้อสุ่มเมนู "กินอะไรดีวันนี้?"**
   - ช่วยเลือกเมนูอาหารสำหรับผู้ที่คิดไม่ออกว่าจะกินอะไร

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: React 19, TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Local Storage**: บันทึกสถานะผู้ใช้, คะแนนโหวต, รายการอาหาร, ร้านอาหาร และตะกร้าสินค้า

---

## 🚀 วิธีติดตั้งและรันในเครื่อง (Local Setup)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

### 3. ตรวจสอบโค้ด (Lint)
```bash
npm run lint
```

### 4. สั่ง Build สำหรับ Production
```bash
npm run build
```

---

## 📦 วิธีนำขึ้น GitHub (How to Push to GitHub)

### วิธีที่ 1: ผ่าน Git Command Line
```bash
# 1. กำหนดค่าเริ่มต้น Git
git init

# 2. เพิ่มไฟล์ทั้งหมด
git add .

# 3. บันทึก Commit
git commit -m "feat: Initial commit for menu100 platform"

# 4. เปลี่ยนชื่อ Branch หลักเป็น main
git branch -M main

# 5. เชื่อมต่อกับ GitHub Repository ของคุณ (เปลี่ยน URL เป็นของคุณ)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push ไฟล์ขึ้น GitHub
git push -u origin main
```

---

## ⚡ วิธีนำขึ้น Vercel (How to Deploy to Vercel)

โปรเจกต์นี้ตั้งค่า `vercel.json` และรองรับการ Deploy บน Vercel เรียบร้อยแล้ว (Framework Preset: **Vite**):

### วิธีที่ 1: Deploy ผ่านหน้าเว็บ Vercel (แนะนำ - ง่ายที่สุด)
1. นำโค้ดขึ้น GitHub ตามขั้นตอนด้านบน
2. ไปที่ [vercel.com](https://vercel.com) แล้วล็อกอินด้วย GitHub
3. คลิกปุ่ม **"Add New..."** -> **"Project"**
4. เลือก Repository ของคุณที่เพิ่ง Push ไป แล้วคลิก **"Import"**
5. ตรวจสอบการตั้งค่า Build & Output Settings (Vercel จะตรวจพบ Vite ให้อัตโนมัติ):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. คลิก **"Deploy"** รอประมาณ 30-60 วินาที จะได้ URL เว็บจริงพร้อมแชร์ใช้งานได้ทันที

### วิธีที่ 2: Deploy ผ่าน Vercel CLI
```bash
# ติดตั้ง Vercel CLI (หากยังไม่มี)
npm i -g vercel

# สั่ง Deploy
vercel
```

