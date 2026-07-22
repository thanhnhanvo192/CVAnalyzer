# Tech Spec - Smart CV Analyzer & Job Match

## 1. Kiến trúc tổng quan
Monorepo: /web (Next.js 15, App Router, TypeScript) + /api (Express, TypeScript). Frontend gọi backend qua REST API. Backend là nơi duy nhất gọi AI provider và truy cập DB - frontend không bao giờ có API key.

## 2. Stack
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: Express 5, TypeScript, Prisma ORM
- Database: PostgreSQL (Docker khi dev, Render + Neon khi deploy)
- Auth: JWT lưu trong httpOnly cookie
- AI: interface `AIProvider` dùng chung - implementation đầu tiên gọi model free (Gemini 2.5 Flash), implementation sau gọi Anthropic (Claude Haiku 3.5 / Sonnet)
- Deploy: Vercel (web) + Render (api) + Neon (postgres)

## 3. Luồng dữ liệu chính (CV -> kết quả phân tích)
1. Frontend upload file CV -> POST /api/cv (multipart/form-data)
2. Backend parse file (PDF/DOCX) -> text thô, lưu vào bảng CV
3. Frontend gửi JD -> POST /api/job-descriptions
4. Frontend gọi POST /api/match { cvId, jdId }
5. Backend gọi AIProvider.matchCvToJob(cvText, jdText) -> JSON có cấu trúc
6. Backend lưu kết quả vào bảng MatchResult, trả về cho frontend

## 4. Data model (sẽ mở rộng dần theo từng tuần)
- User (Tuần 1) - đã có
- CV (Tuần 3)
- JobDescription (Tuần 4)
- MatchResult (Tuần 6)

## 5. Nguyên tắc thiết kế
- Mọi logic gọi AI di qua interface AIProvider, không gọi thẳng SDK ở nhiều nơi trong code
- Validate input ở cả frontend (UX) và backend (bảo mật - không tin frontend)
- Không lưu password thô, không lưu API key ở frontend
- Error trả về theo format thống nhất: { error: string, code: string }

## 6. Rủi ro đã biết
- Output AI có thể không đúng JSON format 100% các lần -> cần validate + xử lý fallback khi parse JSON thất bại
- Free tier AI model có giới hạn rate limit -> cần cache/retry