# 2HAND — Sàn giao dịch đồ cũ điện tử & thể thao

2HAND là một giao diện marketplace mua bán đồ cũ được thiết kế theo phong cách hiện đại, tập trung vào các sản phẩm điện tử và dụng cụ thể thao đã qua sử dụng nhưng vẫn đảm bảo chất lượng. Ứng dụng cho phép người dùng duyệt sản phẩm, xem chi tiết, lưu yêu thích, thêm vào giỏ hàng, đăng tin bán hàng và trải nghiệm giao dịch trực tiếp trong môi trường demo.

## Tính năng chính

- Trang chủ với banner hero, danh mục nổi bật và sản phẩm mới
- Danh mục sản phẩm theo nhóm: điện tử và thể thao
- Tìm kiếm và lọc theo loại sản phẩm
- Xem chi tiết từng sản phẩm với thông tin đánh giá, điều kiện sản phẩm và người bán
- Lưu sản phẩm yêu thích
- Thêm sản phẩm vào giỏ hàng và thực hiện thanh toán demo
- Chế độ đăng nhập / đăng ký người dùng
- Trang đăng tin thanh lý cho người bán
- Hồ sơ người dùng và giao diện thân thiện trên mobile / desktop
- Tông màu pastel hồng và xanh, phù hợp với phong cách thương mại điện tử hiện đại

## Công nghệ sử dụng

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

## Cấu trúc dự án

```bash
src/
├── App.tsx
├── main.tsx
├── index.css
├── types.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CartDrawer.tsx
│   ├── ChatModal.tsx
│   ├── EscrowModal.tsx
│   ├── MakeOfferModal.tsx
│   └── ProductCard.tsx
├── data/
│   └── mockData.ts
├── views/
│   ├── AuthView.tsx
│   ├── CatalogView.tsx
│   ├── CreateListingView.tsx
│   ├── HomeView.tsx
│   ├── ProductDetailView.tsx
│   └── ProfileView.tsx
└── ...
```

## Yêu cầu hệ thống

- Node.js >= 18
- npm hoặc yarn

## Cài đặt

```bash
npm install
```

## Chạy dự án ở môi trường local

```bash
npm run dev
```

Sau khi chạy, ứng dụng sẽ mở trên port 3000 theo cấu hình trong package.json.

## Build production

```bash
npm run build
```

## Kiểm tra lỗi TypeScript

```bash
npm run lint
```

## Scripts có sẵn

- `npm run dev`: chạy ứng dụng ở chế độ phát triển
- `npm run build`: build production
- `npm run preview`: xem bản build local
- `npm run lint`: kiểm tra TypeScript
- `npm run clean`: xoá thư mục build và file tạm

## Ghi chú

Dự án hiện đang dùng dữ liệu mock trong `src/data/mockData.ts`, phù hợp cho demo UI và flow người dùng. Nếu bạn muốn mở rộng sang backend thật, có thể tích hợp API cho đăng nhập, quản lý sản phẩm, giỏ hàng và escrow.

## Demo flow

1. Người dùng vào trang chủ để xem sản phẩm nổi bật
2. Chọn danh mục hoặc dùng thanh tìm kiếm
3. Xem chi tiết từng sản phẩm
4. Thêm sản phẩm vào giỏ hàng nếu đã đăng nhập
5. Đăng tin thanh lý hoặc quản lý hồ sơ cá nhân
6. Hoàn tất flow mua bán như một marketplace demo

## Tác giả

Dự án được xây dựng để mô phỏng một nền tảng giao dịch đồ cũ với trải nghiệm mua bán hiện đại, minh bạch và tiết kiệm thời gian cho người dùng.

