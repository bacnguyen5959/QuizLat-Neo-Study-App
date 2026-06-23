# ⚡ QuizLat (Neo-Study) — Spaced Repetition (SRS) Flashcard Mobile App

> **QuizLat** là một ứng dụng di động hỗ trợ học tập thông qua thẻ ghi nhớ (Flashcard) và làm bài trắc nghiệm (Quiz). Điểm nhấn của ứng dụng nằm ở thiết kế giao diện theo phong cách **Neo-Brutalist** hiện đại, kết hợp với các yếu tố **Game hóa (Gamification)** giúp việc ôn tập từ vựng, kiến thức trở nên lôi cuốn và thú vị hơn.

---

## 🌟 Tính năng nổi bật

1. **Giao diện Neo-Brutalist độc đáo:** Phong cách thô mộc, góc cạnh với họa tiết nền lưới tập học sinh, độ tương phản màu sắc mạnh và các hiệu ứng chuyển động mượt mà bằng **React Native Reanimated**.
2. **Hệ thống Spaced Repetition (SRS) dưới dạng "Boss Fight Mode":** Thay vì ôn tập thẻ ghi nhớ một cách nhàm chán, ứng dụng biến quá trình ôn bài thành một trận chiến sinh tồn với quái vật. Trả lời đúng để gây sát thương lên quái vật, trả lời sai sẽ bị trừ HP của bản thân. Tích hợp hiệu ứng rung màn hình (**Expo Haptics**) và âm thanh nhạc nền sống động (**Expo AV**).
3. **Quản lý Thẻ ghi nhớ cực nhanh:** Thêm, sửa, xóa bộ thẻ (Decks) và thẻ từ (Flashcards) cục bộ tốc độ cao với **Zustand** và lưu trữ bền vững qua **AsyncStorage**. Hỗ trợ import thẻ từ hàng loạt qua định dạng văn bản.
4. **Chế độ làm bài kiểm tra (Quiz):** Tạo bài thi trắc nghiệm tự động dựa trên bộ thẻ học, tính thời gian làm bài, tự động chấm điểm và xem biểu đồ thống kê kết quả.
5. **Đồng bộ Đám mây & Bảng xếp hạng:**
   - Đăng ký/đăng nhập tài khoản và đồng bộ bộ thẻ học lên Đám mây (**Firebase Firestore & Auth**).
   - Tải về hàng trăm bộ thẻ từ thư viện chia sẻ công cộng của cộng đồng sinh viên.
   - Bảng vàng danh vọng (Leaderboard): Đua top điểm kinh nghiệm (EXP) thời gian thực với cộng đồng.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** React Native (Expo SDK 54), TypeScript, NativeWind (TailwindCSS 3), React Navigation 7.
- **Quản lý trạng thái:** Zustand 5.
- **Đám mây & Cơ sở dữ liệu:** Firebase SDK 12 (Authentication, Cloud Firestore).
- **Hoạt ảnh & Tương tác:** React Native Reanimated 4, Expo Haptics (Phản hồi rung), Expo AV (Âm thanh).
- **Kiểm thử:** Jest, React Native Testing Library.

---

## 🗂️ Cấu trúc thư mục dự án

```text
QuizzAppMobile/
├── assets/                     # Ảnh, icons, fonts tĩnh
├── src/
│   ├── components/             # Components dùng chung (Buttons, Cards, Layouts)
│   ├── screens/                # Màn hình chính (Home, Quiz, Flashcard, Leaderboard, Arena)
│   ├── services/               # Cấu hình Firebase & Firestore logic
│   │   ├── firebase.ts         # Cấu hình kết nối Firebase App
│   │   └── firestoreService.ts # Các hàm CRUD Firestore (sync, import, exp, leaderboard)
│   ├── store/                  # Quản lý state cục bộ với Zustand
│   └── utils/                  # Dữ liệu tĩnh, hàm helper
├── App.tsx                     # Entry point của ứng dụng
├── app.json                    # Cấu hình Expo
├── tailwind.config.js          # Cấu hình TailwindCSS
└── tsconfig.json               # Cấu hình TypeScript
```

---

## ⚙️ Hướng dẫn cài đặt & Khởi chạy nhanh

### 1️⃣ Yêu cầu môi trường
- **Node.js** phiên bản 18.x hoặc cao hơn.
- Điện thoại thật cài đặt app **Expo Go** (để test trực tiếp) hoặc phần mềm giả lập máy ảo (Android Studio / Xcode).

### 2️⃣ Khởi chạy cục bộ
1. Di chuyển vào thư mục dự án:
   ```bash
   cd QuizzAppMobile
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi động Expo Server:
   ```bash
   npx expo start -c
   ```
4. Quét mã QR hiển thị ở terminal bằng ứng dụng **Expo Go** trên điện thoại (đối với Android) hoặc qua Camera mặc định (đối với iOS - chung mạng Wi-Fi) để chạy app.

---

## 🔗 Hướng dẫn thiết lập Firebase & Cloud Firestore

Dự án này sử dụng biến môi trường (Environment Variables) để bảo mật API Key của Firebase, tránh lộ thông tin khi đưa mã nguồn lên Git.

Để sử dụng Firebase của riêng bạn, vui lòng làm theo hướng dẫn sau:

### 1️⃣ Thiết lập file môi trường `.env`
1. Tại thư mục gốc của dự án `QuizzAppMobile`, copy file `.env.example` và đổi tên thành `.env`:
   ```bash
   cp .env.example .env
   ```
2. Mở file `.env` vừa tạo và điền các thông số tương ứng với dự án Firebase của bạn (hướng dẫn lấy các thông số này ở bước dưới).

### 2️⃣ Tạo dự án trên Firebase & Lấy API Keys
1. Truy cập [Firebase Console](https://console.firebase.google.com/) và tạo một dự án mới.
2. Tại trang tổng quan của dự án, nhấn vào biểu tượng **Web (</>)** để tạo ứng dụng Web.
3. Firebase sẽ hiển thị đoạn mã cấu hình `firebaseConfig`. Điền các giá trị đó vào file `.env` của bạn:
   - `apiKey` -> điền vào `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` -> điền vào `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` -> điền vào `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` -> điền vào `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` -> điền vào `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` -> điền vào `EXPO_PUBLIC_FIREBASE_APP_ID`
   - `measurementId` -> điền vào `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

### 3️⃣ Kích hoạt Firebase Authentication
1. Trên thanh menu trái của Firebase Console, chọn **Build** -> **Authentication**.
2. Chọn tab **Sign-in method** và kích hoạt phương thức đăng nhập bằng **Email/Password**.

### 4️⃣ Thiết lập Cloud Firestore Database & Rules
1. Chọn **Build** -> **Firestore Database** trên Firebase Console.
2. Nhấn **Create database**, chọn vị trí server và chế độ khởi tạo (chọn *Production mode*).
3. Nhấp sang tab **Rules** (Quy tắc bảo mật) của Firestore Database, copy nội dung quy tắc dưới đây dán đè vào để thiết lập phân quyền an toàn:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Quy tắc cho bảng users (EXP, Email người dùng)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quy tắc cho bảng decks (Bộ thẻ học tập)
    match /decks/{deckId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        resource == null || 
        resource.data.userId == request.auth.uid
      ) && request.resource.data.userId == request.auth.uid;
    }
    
    // Quy tắc cho bảng flashcards (Các thẻ từ chi tiết)
    match /flashcards/{cardId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        resource == null || 
        resource.data.userId == request.auth.uid
      ) && request.resource.data.userId == request.auth.uid;
    }
  }
}
```
4. Nhấn **Publish** để áp dụng quy tắc. Hệ thống của bạn hiện đã hoàn toàn sẵn sàng đồng bộ!

