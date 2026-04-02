# Tổng quan về Prisma
- Prisma là 1 next-generation ORM (Object Relation Mapper) dành cho NodeJS + Typescript. 
- Giúp lập trình viên tương tác với Database dễ dàng hơn.
- Điểm khác biệt của Prisma so với các con hàng khác là thay vì sử dụng Class để định nghĩa model thì nó sử dụng 1 ngôn ngữ khai báo riêng gọi là Prisma Schema.

# Các thành phần chính:
- Prisma Client: Bộ tạo truy vấn (Query Builder) tự động được sinh ra dựa trên schema cá nhân. Hỗ trợ Type-safety
- Prisma Migrate: Công cụ quản lý lịch sử thay đổi cơ sở dữ liệu (Giúp chuyển đổi từ file cấu hình Prisma sang bảng SQL thực tế).
- Prisma Studio: Giao diện đồ hoạ (GUI) cho phép chỉnh sửa dữ liệu trực tiếp trong trình duyệt.

# Luồng hoạt động của Prisma

Ta sẽ chia ra là 2 giai đoạn: Phát triển và Vận hành

## Phát triển:
1. Định nghĩa Schema: Viết các model trong file schema.prisma. Tại đây ta xác định các bảng, quan hệ (1-1, 1-n, n-n) và các ràng buộc.
2. Đồng bộ DB (Migrate): Chạy lệnh npx prisma migrate dev --> Prisma sẽ so sánh file schema với DB hiện tại, tạo file SQL migration và thực thi vào DB.
3. Sinh Client: Prisma sẽ tự động chạy lệnh prisma generate để tạo ra bộ mã nguồn Prisma Client nằm trong thư mục node_modules.

## Vận hành:
1. Gửi truy vấn: Gọi các hàm như prisma.user.findMany()
2. Prisma Engine: Bên dưới Prisma Client là 1 Query Engine được viết bằng Rust. Nó sẽ nhận yêu cầu từ NodeJS, tối ưu hoá câu lệnh và biên dịch nó thành câu lệnh SQL thuần tuý.
3. Phản hồi: Database trả về kết quả cho Engine, Engine sẽ chuyển đổi kết quả đó thành các Object Javascript/Type và gửi lại cho ứng dụng.

 --> Prisma Vip Hơn TypeORM