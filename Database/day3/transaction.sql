-- Viết luồng chuyển tiền giữa 2 ví.

/* 
    Yêu cầu:
    1. Kiểm tra số dư ví 
    2. Lock 2 ví --> Tránh race condition
    3. ACID transaction
*/  

BEGIN;

-- lock 2 ví
select id, balance
from wallets
where id in (1, 2)
for update;

-- kiểm tra số dư
do $$
declare
    sender_balance NUMERIC;
BEGIN
    select balance into sender_balance from wallets where id = 1;
    if sender_balance < 100 then
        raise exception 'Not enough balance';
    end if;
end $$;

-- trừ tiền ví gửi
update wallets
set balance = balance - 100
where id = 1;

-- cộng tiền ví nhận
update wallets
set balance = balance + 100
where id = 2;

-- insert bản ghi vào transactions
insert into transactions (sender_wallet_id, receiver_wallet_id, type_id, amount, note)
values (1,2,3,200, 'Transfer 100 from wallet 1 to wallet 2');
RETURNING id;

-- insert log
insert into transaction_logs (transaction_id, step, status)
values (currval('transactions_id_seq'), 'Transfer completed', 'success');

COMMIT;

-- rollback nếu có lỗi
BEGIN;

update wallets set balance = balance - 100
where id = 1;

rollback;

-- transaction nap tien

BEGIN;

select balance from wallets where id = 1 for update;

update wallets set balance = balance + 100
where id = 1;

insert into transactions (sender_wallet_id, receiver_wallet_id, type_id, amount, note)
values (null, 1, 1, 100, 'Deposit 100 to wallet 1');
RETURNING id;

insert into transaction_logs (transaction_id, step, status)
values (currval('transactions_id_seq'), 'Deposit completed', 'success');

COMMIT;
