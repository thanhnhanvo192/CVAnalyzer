# PRD - Smart CV Analyzer & Job Match

## 1. Vấn đề
Người tìm việc thường phải chỉnh sửa CV cho từng vị trí ứng tuyển nhưng không biết CV đang thiếu kỹ năng nào hoặc phần nào chưa phù hợp với Job Description. Việc nhờ người khác review mất thời gian và không phải lúc nào cũng khả dụng.

## 2. Người dùng mục tiêu
- Sinh viên IT năm cuối
- Junior software engineers
- Career switchers

- Mục tiêu: Cải thiện CV, tăng khả năng đậu phỏng vấn, thấy được những kĩ năng chưa đảm bảo
- Pain point: không có người review CV, không chắc CV có phù hợp với JD không

## 3. Tính năng MVP (bắt buộc có trong 8 tuần)
- Đăng ký / Đăng nhập
- Upload CV (PDF/DOCX) -> Parse thành text -> lưu vào database
- Nhập/paste Job Description
- Phân tích CV bằng AI: trích xuất kỹ năng, kinh nghiệm
- So khớp CV với JD: điểm phù hợp + lý do + gợi ý cải thiện
- Xem lại lịch sử các lần phân tích

## 4. Luồng hoạt động
- Register -> Login -> Upload CV -> Parse CV -> Paste JD -> Analyze -> View Result -> History

## 5. Ngoài phạm vi MVP (không làm trong 8 tuần đầu)
- Export báo cáo PDF
- Thông báo qua email
- Admin dashboard
- Đa ngôn ngữ

## 6. TIêu chí thành công
- Người dùng hoàn thành được luồng: đăng ký -> upload CV -> nhập JD -> nhận kết quả phân tích, không gặp lỗi
- Kết quả phân tích AI đọc được, có ý nghĩa (không phải JSON lỗi hoặc chung chung vô nghĩa)
- User hoàn thành flow trong dưới 2 phút
- Parse thành công >95% file PDF/DOCX phổ biến
- AI trả kết quả dưới 20 giây
- Không crash khi upload file hợp lệ
- Deploy được bản live, demo được trực tiếp khi phỏng vấn