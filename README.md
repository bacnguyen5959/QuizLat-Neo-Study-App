# QuizLat (Neo-Study) - Ứng dụng Học Thẻ Nhớ & Ôn Tập SRS



![QuizLat Banner](./assets/icon.png)

**QuizLat** là một ứng dụng di động hỗ trợ học tập thông qua Flashcard và làm bài trắc nghiệm (Quiz). Điểm nhấn của ứng dụng nằm ở thiết kế giao diện theo phong cách **Neo-Brutalist** hiện đại, kết hợp với các yếu tố "Game hóa" (Gamification) để biến việc ôn bài khô khan thành trải nghiệm giải trí thú vị.

## 🌟 Tính năng nổi bật

1. **Giao diện Neo-Brutalist**: Phong cách thô mộc, góc cạnh với nền vở học sinh (Grid Background), màu sắc tương phản mạnh và hoạt ảnh sinh động.
2. **Hệ thống Spaced Repetition (SRS) - Boss Fight Mode**: Thay vì ôn tập thẻ từ một cách nhàm chán, ứng dụng biến quá trình ôn thẻ thành một trận chiến với quái vật. Bạn có "Sinh lực" và sẽ mất máu nếu trả lời sai thẻ. Đi kèm hiệu ứng rung lắc (Camera Shake) và nhạc nền kịch tính.
3. **Quản lý Thẻ Từ**: 
   - Thêm, sửa, xóa thẻ cục bộ siêu tốc với `Zustand` & `AsyncStorage`.
   - Hỗ trợ nhập (Import) thẻ hàng loạt bằng văn bản.
4. **Hệ thống Kiểm Tra (Quiz)**: Làm bài trắc nghiệm với tính giờ, chấm điểm tự động và thống kê chi tiết độ chính xác ở màn hình Kết Quả.
5. **Cộng Đồng & Bảng Vàng (Online)**:
   - Tải xuống hàng trăm bộ thẻ từ thư viện công khai (tích hợp Firebase).
   - Đua TOP Kinh nghiệm (EXP) trên Bảng Vàng cùng sinh viên toàn quốc.

## 💻 Yêu cầu hệ thống

Để cài đặt và chạy ứng dụng này, thiết bị của giảng viên cần cài đặt:
- **Node.js**: Phiên bản 18.x trở lên.
- **Expo CLI**: Môi trường giả lập React Native (Ứng dụng sử dụng SDK mới nhất 52/54).
- **Thiết bị ảo (Simulator/Emulator)** hoặc Ứng dụng **Expo Go** trên điện thoại di động (kết nối chung mạng Wi-Fi với máy tính).

## 🚀 Hướng dẫn cài đặt & Khởi chạy

**Bước 1: Cài đặt thư viện**
Mở terminal (Command Prompt/PowerShell) tại thư mục chứa source code và chạy lệnh:
```bash
npm install
```

**Bước 2: Khởi động Server Expo**
Tiếp tục chạy lệnh sau để khởi chạy dự án:
```bash
npx expo start -c
```

**Bước 3: Mở ứng dụng**
- Nếu dùng máy ảo Android: Nhấn phím `a` trong terminal.
- Nếu dùng điện thoại thật: Mở ứng dụng **Expo Go** và quét mã QR hiển thị trên màn hình terminal.

---

### 🛡️ Ghi chú về Bảo mật & CSDL (Firebase)
Mã nguồn đã tích hợp sẵn API Key của dự án để thuận tiện cho việc chấm bài (Giảng viên có thể mở lên là đăng nhập/đăng ký được ngay). Tuy API Key được đính kèm vào code client, nhưng Database (Firestore) của ứng dụng đã được bảo vệ hoàn toàn bằng **Firestore Security Rules**:

**Chúc thầy cô có một trải nghiệm thú vị khi sử dụng ứng dụng!**
