export function getAuthErrorMessage(error: any): string {
  if (!error || !error.code) return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Địa chỉ email không hợp lệ.';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị vô hiệu hóa.';
    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản với email này.';
    case 'auth/wrong-password':
      return 'Mật khẩu không chính xác.';
    case 'auth/email-already-in-use':
      return 'Email này đã được sử dụng. Vui lòng chọn email khác.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu có ít nhất 6 ký tự.';
    case 'auth/too-many-requests':
      return 'Bạn đã thử quá nhiều lần. Vui lòng đợi một lát rồi thử lại.';
    case 'auth/invalid-credential':
      return 'Thông tin đăng nhập không chính xác.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền internet.';
    case 'auth/invalid-api-key':
      return 'Lỗi cấu hình hệ thống: API Key không hợp lệ. Vui lòng cấu hình Firebase thực sự.';
    default:
      return error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
  }
}
