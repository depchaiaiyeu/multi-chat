# Phòng Chat Realtime

Ứng dụng chat realtime với giao diện tối đẹp mắt, cho phép nhiều người dùng nhắn tin cùng lúc.

## Tính năng

- Chat realtime với Socket.io
- Giao diện tối đẹp mắt
- Hiển thị số người online
- Đổi tên hiển thị
- Hiển thị trạng thái đang nhập
- Responsive trên mobile
- Lưu trữ 100 tin nhắn gần nhất

## Cài đặt và chạy local

### Backend
```bash
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

## Deploy lên Vercel

1. Tạo tài khoản Vercel
2. Kết nối với repository GitHub
3. Vercel sẽ tự động build và deploy

### Hoặc sử dụng Vercel CLI:
```bash
npm install -g vercel
vercel
```

## Cấu trúc thư mục

```
├── server.js              # Backend Node.js
├── package.json           # Backend dependencies
├── vercel.json           # Vercel config
├── client/
│   ├── src/
│   │   ├── App.js        # React app chính
│   │   ├── index.js      # Entry point
│   │   └── index.css     # Styles
│   ├── public/
│   │   └── index.html    # HTML template
│   └── package.json      # Frontend dependencies
└── README.md
```

## Công nghệ sử dụng

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: React, Socket.io-client
- **Styling**: CSS thuần
- **Deployment**: Vercel

## Hướng dẫn sử dụng

1. Mở ứng dụng trong trình duyệt
2. Tên mặc định là "Người ẩn danh"
3. Nhấn "Đổi tên" để thay đổi tên hiển thị
4. Nhập tin nhắn và nhấn "Gửi" hoặc Enter
5. Tin nhắn sẽ hiện ngay lập tức cho tất cả người dùng

## Tối ưu hóa

- Giới hạn tin nhắn tối đa 500 ký tự
- Tên hiển thị tối đa 20 ký tự
- Lưu trữ tối đa 100 tin nhắn gần nhất
- Tự động scroll xuống tin nhắn mới
- Hiển thị thời gian theo múi giờ Việt Nam
