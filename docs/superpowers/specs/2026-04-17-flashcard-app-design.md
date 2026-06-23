# Đặc Tả Thiết Kế Ứng Dụng Flashcard

## Tổng Quan
Một ứng dụng ôn tập bằng thẻ nhớ (flashcard) và làm bài trắc nghiệm (quiz) trên di động, xây dựng bằng Expo (Bare Workflow) và Firebase. Ứng dụng tập trung vào một kiến trúc tối giản và linh hoạt, chú trọng khả năng hoạt động ngoại tuyến (offline), trò chơi hóa (lưu chuỗi ngày học - streaks), và một Hệ thống lặp lại ngắt quãng (Spaced Repetition System - SRS) được đơn giản hóa.

## Đối Tượng & Nền Tảng
- **Nền tảng**: Cả Android và iOS
- **Môi trường phát triển**: Expo Bare Workflow (SDK 54)

## Tech Stack
- **Frontend**: Expo (React Native), React Navigation v7, Zustand v5, NativeWind v4
- **Backend (BaaS)**: Firebase Authentication, Firestore, Firebase Storage
- **Công cụ hỗ trợ**: Node.js, npm, Antigravity (AI Code)

## Kiến Trúc
Kiến trúc dựa trên cấu trúc các tầng (layer-based) được thiết kế ưu tiên cho tốc độ và sự đơn giản.

```
src/
 ├─ components/  (Các UI Component dùng chung, sử dụng NativeWind)
 ├─ screens/     (10 màn hình cốt lõi)
 ├─ store/       (Lưu trữ Zustand: auth, deck, quiz)
 ├─ services/    (Các hàm gọi Firebase: auth, firestore, storage)
 ├─ utils/       (Tiện ích: logic streak, offline cache, toán học SRS đơn giản)
 └─ navigation/  (Cấu hình stack của React Navigation)
```

## Danh Sách Màn Hình (10 Màn Hình)
1. **Deck List**: Bảng điều khiển chính hiển thị danh sách các bộ thẻ.
2. **Deck Detail**: Xem thống kê và các tùy chọn của một bộ thẻ cụ thể.
3. **Create Deck**: Biểu mẫu để tạo bộ thẻ mới.
4. **Edit Deck**: Biểu mẫu để chỉnh sửa bộ thẻ đã có.
5. **Flashcard**: Giao diện học tập (lật mặt trước/sau).
6. **Quiz**: Giao diện làm bài kiểm tra (trắc nghiệm hoặc nhập văn bản).
7. **Result**: Điểm số và bảng tóm tắt sau mỗi phiên quiz/flashcard.
8. **Progress**: Thống kê tổng quan và lịch sử học tập.
9. **Profile**: Cài đặt người dùng, hiển thị chuỗi ngày học (streak), và đăng xuất.
10. **Mistake Review**: Giao diện chuyên dụng dành riêng cho những thẻ SRS đã đến hạn cần ôn lại.

## Tính Năng Chính & Cách Triển Khai

### 1. Hỗ trợ hình ảnh cho Flashcard
- **Lưu trữ**: Firebase Storage
- **Quy trình**: Người dùng chọn ảnh qua `expo-image-picker` -> Tải lên Firebase Storage -> Lưu đường dẫn tải về (download URL) vào document `flashcards` trong Firestore.

### 2. Chế độ Ngoại tuyến (Offline Mode)
- **Chiến lược**: Tận dụng bộ nhớ đệm ngoại tuyến (offline persistence cache) có sẵn của Firestore.
- **Triển khai**: Bật chế độ persistence khi khởi tạo Firebase. Zustand sẽ xử lý trạng thái UI cục bộ (cập nhật tích cực - optimistic updates) trong khi Firestore tự đồng bộ ngầm dưới nền. Không cần viết logic đồng bộ phức tạp.

### 3. Trò Chơi Hóa (Gamification - Streaks)
- **Logic**: Theo dõi hoạt động liên tục mỗi ngày.
- **Lưu trữ**: Lưu `currentStreak` và `lastActiveDate` trong collection `users`. Cập nhật hàng ngày dựa trên hoạt động đầu tiên của ngày đó.

### 4. Hệ Thống SRS Lược Giản
- **Thuật toán**: Phiên bản tối giản của thuật toán SM-2.
- **Lưu trữ**: Collection `mistakeReviews` sẽ theo dõi `lastReviewed` (lần ôn cuối), `ease` (hệ số độ khó), `interval` (khoảng cách ngày), và `nextReviewDate` (ngày cần ôn tiếp theo).
- **Quy trình**: Thẻ sẽ được lấy ra dựa trên điều kiện `nextReviewDate <= current_time` và hiển thị trong màn hình `Mistake Review`.


## Yêu Cầu Cài Đặt Ban Đầu (Firebase)
Vì đây là một dự án Firebase mới, quy trình cài đặt ban đầu yêu cầu:
1. Tạo một project trong Firebase Console.
2. Bật chức năng Authentication (Email/Password).
3. Bật Firestore Database (cấu hình rules cơ bản).
4. Bật Firebase Storage (cấu hình rules cơ bản).
5. Tải `google-services.json` (Android) và `GoogleService-Info.plist` (iOS) để tích hợp vào Bare workflow của Expo.

