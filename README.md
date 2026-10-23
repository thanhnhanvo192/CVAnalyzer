# Smart CV Analyzer & Job Match 🚀

> **AI-Powered Career Copilot** — Nền tảng phân tích CV và so khớp Job Description (JD) thông minh sử dụng **Google Gemini 2.5 Flash**. Giúp ứng viên nhận diện lỗ hổng kỹ năng, từ khóa còn thiếu theo chuẩn ATS và nhận các đề xuất chỉnh sửa thực chiến dưới 20 giây.

---

## 🌟 Tính năng nổi bật (Core Features)

1. **Xác thực bảo mật (Authentication)**:
   - Đăng ký, đăng nhập với mã hóa mật khẩu `bcrypt`.
   - Phiên làm việc lưu trữ trong `httpOnly cookie` chống tấn công XSS.
   - Endpoint `/api/auth/me` và bảo vệ route phía client (`ProtectedRoute`).

2. **Quản lý & Bóc tách CV (Document Extraction)**:
   - Hỗ trợ tải lên file định dạng **PDF** và **DOCX** (giới hạn 10MB).
   - Bộ bóc tách thông minh (`pdf-parse`, `mammoth`) tự động trích xuất nội dung text thô và chuẩn hóa cấu trúc.
   - Lưu trữ file gốc lên đám mây **Cloudinary** (kèm cơ chế Fallback Local Storage tự động).
   - Hỗ trợ xem trực tiếp text đã bóc tách (`rawText`) và tải lại file gốc.

3. **Quản lý Mô tả Công việc (Job Description Manager)**:
   - Dán nhanh nội dung yêu cầu tuyển dụng từ LinkedIn, TopCV, ITviec.
   - Tự động suy luận Tiêu đề vị trí và tên Công ty.
   - **1-Click Sample Templates**: Có sẵn các mẫu JD (Frontend React, Backend Node.js) để thử nghiệm ngay lập tức.

4. **AI Matching Engine (Gemini 2.5 Flash)**:
   - Kiến trúc module hóa qua interface `AIProvider`, không phụ thuộc chặt vào một SDK duy nhất.
   - Chấm điểm phù hợp tổng quan (0–100%) hiển thị qua **SVG Radial Score Gauge** trực quan.
   - Phân tích chi tiết:
     - **Kỹ năng đáp ứng tốt** (kèm bằng chứng trích dẫn từ CV).
     - **Kỹ năng còn thiếu** (kèm mức độ ưu tiên: Ưu tiên cao, Quan trọng, Khuyến khích).
   - Đề xuất cải thiện CV chuẩn hệ thống lọc hồ sơ tự động (**ATS**).
   - Tính năng **Sao chép toàn bộ báo cáo Markdown** để lưu trữ hoặc chia sẻ.

5. **Lịch sử & Theo dõi tiến trình (History & Analytics)**:
   - Tìm kiếm và lọc lịch sử theo tiêu đề công việc, công ty, tên CV hoặc dải điểm số.
   - Tự động tính toán điểm phù hợp trung bình qua các lần phân tích.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Lớp | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | Giao diện Dark theme, Tailwind CSS v4, Glassmorphism |
| **Backend** | Express 5, TypeScript | Kiến trúc phân tầng Controller, Service, Middleware |
| **Database** | PostgreSQL 16 | Quản lý schema & migrations qua Prisma ORM v6 |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/genai`) | Structured Output JSON, Zod validation |
| **Storage** | Cloudinary & Multer | Lưu trữ nhị phân file gốc và văn bản trích xuất |
| **Container** | Docker & Docker Compose | Môi trường cơ sở dữ liệu cục bộ |

---

## 🏗️ Kiến trúc hệ thống (Architecture)

```
[ Frontend: Next.js 16 Web App (Port 3000) ]
                      │
           REST API (JSON & Multipart)
                      ▼
[ Backend: Express 5 API Server (Port 4000) ]
   ├── Authentication (JWT httpOnly Cookie)
   ├── Parser Engine (PDF / DOCX -> Raw Text)
   ├── AI Matching Engine (Gemini 2.5 Flash / Fallback)
   └── Prisma ORM Client
        ├── PostgreSQL Database (Docker Port 5432)
        └── Cloudinary / Local Storage
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### 1. Yêu cầu hệ thống
- **Node.js**: v20+ hoặc v24+ (LTS)
- **Docker Desktop**: Đang chạy

### 2. Cài đặt biến môi trường
Tạo file cấu hình từ các file mẫu:

* **Backend (`api/.env`)**:
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://cvanalyzer:devpassword@localhost:5432/cvanalyzer_dev?schema=public
JWT_SECRET=cv_analyzer_dev_super_secret_jwt_key_2026

# Tùy chọn (Nếu muốn dùng Cloudinary và Gemini Live):
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_key
# CLOUDINARY_API_SECRET=your_secret
# GEMINI_API_KEY=your_gemini_api_key
```

* **Frontend (`web/.env.local`)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Khởi chạy dự án

Từ thư mục gốc `CVAnalyzer/`:

```powershell
# 1. Khởi động PostgreSQL Container
npm run db:up

# 2. Khởi động Backend API (Terminal 1)
npm run dev:api

# 3. Khởi động Frontend Web (Terminal 2)
npm run dev:web
```

* Truy cập Website: **`http://localhost:3000`**
* Kiểm tra API Health: **`http://localhost:4000/health`**

---

## 📡 Danh sách API Endpoints

### Auth
- `POST /api/auth/register`: Đăng ký tài khoản mới.
- `POST /api/auth/login`: Đăng nhập & cấp phát JWT cookie.
- `POST /api/auth/logout`: Đăng xuất & xóa cookie.
- `GET /api/auth/me`: Lấy thông tin user hiện tại (yêu cầu auth).

### CV
- `POST /api/cv`: Tải lên và bóc tách CV (`multipart/form-data`, file `.pdf` hoặc `.docx`).
- `GET /api/cv`: Lấy danh sách CV của user.
- `GET /api/cv/:id`: Lấy chi tiết nội dung CV.
- `DELETE /api/cv/:id`: Xóa file CV.

### Job Description
- `POST /api/job-descriptions`: Lưu JD mới (`title`, `company`, `rawText`).
- `GET /api/job-descriptions`: Lấy danh sách JD của user.
- `GET /api/job-descriptions/:id`: Lấy chi tiết JD.
- `DELETE /api/job-descriptions/:id`: Xóa JD.

### AI Match
- `POST /api/match`: So khớp CV và JD (`{ cvId, jdId }`), gọi Gemini 2.5 Flash và lưu kết quả.
- `GET /api/match`: Lấy lịch sử tất cả các lần so khớp.
- `GET /api/match/:id`: Lấy chi tiết báo cáo so khớp.
- `DELETE /api/match/:id`: Xóa kết quả so khớp.

---

## 🎯 Tiêu chí nghiệm thu (PRD Success Metrics)

- [x] Người dùng hoàn thành luồng: Đăng ký ➔ Upload CV ➔ Dán JD ➔ Nhận kết quả phân tích trong < 2 phút.
- [x] Parse thành công > 95% tài liệu PDF/DOCX phổ biến mà không gây crash hệ thống.
- [x] AI trả kết quả có cấu trúc và đọc được trong dưới 20 giây.
- [x] Lưu trữ đầy đủ file gốc và raw text cho phép xem lại bất kỳ lúc nào.
- [x] Sẵn sàng demo trực tiếp khi phỏng vấn với giao diện hiện đại, chuẩn SaaS cao cấp.
