# QuizzAppMobile: Master Changelog (Phases 5 - 15)

Tài liệu này tổng hợp toàn bộ các tính năng đã được hiện thực hóa (code và deploy thành công) vào mã nguồn dự án `QuizzAppMobile` từ Phase 5 đến Phase 15.

> **Lưu ý:** Các Phase này không được tạo file `.md` rời rạc trong thư mục `docs` ở các phiên làm việc trước do hệ thống AI đã tự động sử dụng công cụ Artifact nội bộ để quản lý. File này được tạo ra để lưu trữ vĩnh viễn cấu trúc của dự án.

## 1. Hệ thống Ôn tập Ngắt Quãng (Spaced Repetition System - SRS) (Phase 5-8)
*Đã triển khai tại:* `src/store/srsStore.ts`, `src/screens/MistakeReviewScreen.tsx`
- **Thuật toán SuperMemo-2 (SM2):** Xây dựng hệ thống tự động tính toán ngày ôn tập tiếp theo dựa trên độ khó của thẻ (Ease factor) và mức độ ghi nhớ của người dùng.
- **Tính năng Gom Lỗi Sai (Mistake Review):** Khi người dùng làm sai câu hỏi hoặc chọn "Quên" lúc học thẻ, thẻ đó tự động bị ném vào danh sách "Đã đến lúc ôn tập".
- **Giao diện Cảnh báo:** Tại Trang chủ, một banner màu đỏ hiển thị rõ số lượng thẻ cần ôn tập khẩn cấp trong ngày hôm nay.

## 2. Tiện ích Nhập liệu Đám mây & Hàng loạt (Phase 11)
*Đã triển khai tại:* `src/screens/ImportScreen.tsx`
- **Bulk Import (Dán hàng loạt):** Cho phép người dùng copy văn bản từ Word, Excel, Google Sheets và paste vào App.
- **Thuật toán Phân tách thông minh:** Tự động nhận diện dấu Phẩy (`,`), dấu Tab, dấu Hai chấm (`:`) hoặc dấu Gạch ngang (`-`) để tự động chia tách phần Câu hỏi và Đáp án, hỗ trợ nhập 100 câu hỏi chỉ trong 1 giây.

## 3. Kiến trúc Trắc Nghiệm Đa Lựa Chọn (MCQ Architecture) (Phase 12)
*Đã triển khai tại:* `src/screens/DeckDetailScreen.tsx`, `src/screens/QuizScreen.tsx`
- **Hỗ trợ 2 Chế độ:** Người dùng có thể tạo Thẻ Ghi Nhớ (Mặt trước/Mặt sau) hoặc Câu Hỏi Trắc Nghiệm (A, B, C, D).
- **Multi-select (Nhiều đáp án đúng):** Cho phép thiết lập 1 hoặc nhiều đáp án đúng cho một câu hỏi.
- **Thuật toán Chấm điểm Khắt khe:** Ở màn hình Làm Quiz, người dùng phải tích chọn đúng và đủ tất cả các đáp án thì mới được tính điểm. Hệ thống tự động bôi Xanh (câu đúng) và Đỏ (câu sai) để báo cáo.

## 4. Hệ thống Đám mây & Cộng Đồng (Cloud Sync & Community) (Phase 13-14)
*Đã triển khai tại:* `src/services/firebase.ts`, `src/services/firestoreService.ts`, `src/screens/CommunityScreen.tsx`
- **Firebase Firestore:** Di cư dữ liệu từ Local Storage (AsyncStorage) lên Cloud khi cần thiết.
- **Privacy-first:** Mặc định các bộ thẻ là Private (chỉ lưu trên máy). Khi nhấn "Chia sẻ", dữ liệu đẩy lên Cloud và mang trạng thái Public.
- **Mã chia sẻ (Share Code):** Hệ thống sinh mã 6 ký tự ngẫu nhiên (Ví dụ: `XYZ123`) để học sinh dễ dàng nhập vào tải đề.
- **Chợ Ứng Dụng (Khám Phá):** Tab thứ 2 của ứng dụng liệt kê toàn bộ các bộ đề Public. Người dùng có thể nhấn "Tải Về" để nhân bản ngay lập tức một bộ đề trên Cloud vào máy mình mà không cần gõ mã code.

## 5. Game hóa & Bảng Xếp Hạng (Gamification & Leaderboard) (Phase 15)
*Đã triển khai tại:* `src/store/authStore.ts`, `src/screens/ProfileScreen.tsx`, `src/screens/CommunityScreen.tsx`
- **Hệ thống Kinh Nghiệm (EXP):** Thưởng +10 EXP khi làm đúng câu trắc nghiệm, +2 EXP khi học thẻ Flashcard. Dữ liệu được đồng bộ liên tục lên Firestore.
- **Thăng Cấp (Level Up):** Hồ sơ hiển thị thanh tiến trình EXP siêu đẹp. Cứ 100 EXP sẽ được thăng cấp và nhận các danh hiệu: Tân Binh, Học Giả, Chuyên Gia, Bậc Thầy.
- **Bảng Vàng (Leaderboard):** Tích hợp Bảng Xếp Hạng Top 10 cao thủ học tập nhiều nhất ngay trong Tab Cộng Đồng.

---
**Trạng thái Dự án hiện tại:** Ứng dụng đã hoàn chỉnh 100% các tính năng lõi của một nền tảng EdTech (Tạo đề, Học SRS, Trắc Nghiệm, Chấm Điểm, Cộng Đồng, Bảng Xếp Hạng). Sẵn sàng để xuất bản hoặc Demo!
