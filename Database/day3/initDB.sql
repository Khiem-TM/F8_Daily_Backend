-- 1. Bảng wallets
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    owner_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    balance NUMERIC(18, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng transaction_types
CREATE TABLE transaction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);
-- insert
INSERT INTO transaction_types (name) VALUES
('deposit'),
('withdraw'),
('transfer');

-- 3. Bảng transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    sender_wallet_id INT, -- null nếu là nạp tiền từ ngoài vào
    receiver_wallet_id INT, -- null nếu là rút tiền từ ví ra ngoài
    type_id INT NOT NULL,
    amount NUMERIC(18, 2) NOT NULL CHECK (amount > 0),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sender_wallet
        FOREIGN KEY (sender_wallet_id)
        REFERENCES wallets(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_receiver_wallet
        FOREIGN KEY (receiver_wallet_id)
        REFERENCES wallets(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_transaction_type
        FOREIGN KEY (type_id)
        REFERENCES transaction_types(id)
);

-- 4. Bảng transaction_logs
CREATE TABLE transaction_logs (
    id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL,
    step VARCHAR,
    status VARCHAR CHECK (status IN ('success', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction
        FOREIGN KEY (transaction_id)
        REFERENCES transactions(id)
        ON DELETE CASCADE
);

-- Lý do sử dụng Numeríc(18, 2) cho balance và amount:
/*
    1. Độ chính xác tuyệt đối, không bị lệch bits như float hoặc double
    2. Phù hợp với các ứng dụng tài chính, nơi mà độ chính xác là quan trọng tuyệt đối
    3. Chuyên lưu trữ các giá trị tiền tệ, với 18 chữ số tổng và 2 chữ số thập phân
    4. Hỗ trợ các phép toán số học chính xác, tránh lỗi làm tròn số
    5. Cho phép lưu trữ các giá trị rất lớn, phù hợp với các giao dịch tài chính lớn
    6. Đảm bảo tính toàn vẹn dữ liệu
*/

-- Lý do cột balance tồn tại:
/*
    1. Cải thiện hiệu suất query --> Đỡ phải tính toán lại số dư
    2. Đảm bảm tính nhất quán dữ liệu --> Cập nhật số dư ngay khi có giao dịch
    3. Giúp xử lý các case phức tạp như hoàn tiền, giao dịch bị lỗi
    4. Hỗ trợ các tính năng như cảnh báo số dư thấp, giới hạn (bonus)
*/

