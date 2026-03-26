-- Bai 1
-- Step 1: Add column
alter table order_items
add column price DECIMAL(10,2);

-- Step 2: Update data
update order_items
set price = products.current_price
from products
where order_items.product_id = products.id;

-- Tong tien don hang dua tren order_id
select
    o.id as order_id,
    SUM(oi.quantity * oi.price) as total_amount
from orders as o
join order_items as oi on o.id = oi.order_id
group by o.id;

-- Bai 2
-- Lấy ra 5 cháu tiêu nhiều nhất
select u.*, sum(order_items.price * order_items.quantity) as outcome from users as u
join orders on orders.user_id = u.id
join order_items on orders.id = order_items.order_id
where orders.order_date >= '2026-01-01' and orders.order_date < '2026-02-01' and orders.status = 'completed'
group by u.id
order by outcome DESC
limit 5;

-- Bai 3
-- Lay ra 5 user co so luong binh luan nhieu nhat trong thang 1/2026
select u.*, count(c.id) as comment_number from users as u
join comments as c on c.user_id = u.id
where c.created_at >= '2026-01-01' and c.created_at < '2026-02-01'
group by u.id
order by comment_number desc
limit 5;

-- bai 4
-- Lay tat ca san pham kem so luong comment
select p.*, count(c.id) as comment_number from products as p
left join comments as c on c.product_id = p.id
group by p.id
order by comment_number desc;

-- Bai 5
-- Lay ra cac khach hang co tong chi tieu lon hon muc chi tieu trung binh
with outcome_tbl as(
    select sum(order_items.quantity*order_items.price) as outcome, users.id as id from users
    join orders on orders.user_id = users.id
    join order_items on orders.id = order_items.order_id
    where orders.order_date >= '2026-01-01' and orders.order_date < '2026-02-01' and orders.status = 'completed'
    group by users.id
)
select u.*, o.outcome from users as u
join outcome_tbl as o on o.id = u.id
where o.outcome > (select avg(o.outcome) from outcome_tbl as o);

-- Bai 6
with products_with_count as (
    select p.*, sum(order_items.quantity) as count from products as p
    join order_items on order_items.product_id = p.id
    group by p.id
)

select * from products_with_count as p
where p.count = (
    select max(count) from products_with_count
 );

-- Bai 7

with orders_stats as (
    select u.id, count(distinct o.id) as total_orders, sum(oi.quantity * oi.price) as total_outcome
    from users as u
    join orders as o on o.user_id = u.id
    join order_items as oi on o.id = oi.order_id
    where o.order_date >= '2026-01-01'
      AND o.order_date < '2026-02-01'
    group by u.id
),
    comment_stats as (
        select user_id, count(*) as total_comments from comments
        where created_at >= '2026-01-01'
        and created_at < '2026-02-01'
        group by user_id
    )

select  u.full_name,
    os.total_orders,
    os.total_outcome,
    COALESCE(cs.total_comments, 0) AS total_comments,
    os.total_outcome / os.total_orders AS avg_order_value
from users as u
join orders_stats as os on u.id = os.id
left join comment_stats as cs on u.id = cs.user_id
order by os.total_outcome desc;


-- Bai 8

select p.* from products as p
left join order_items on order_items.product_id = p.id
group by p.id
having count(order_items.id) = 0;

-- Bai 9
WITH
tbl_1 AS (
    SELECT
        '01/2026' AS month,
        SUM(quantity) AS quantity,
        SUM(quantity * price) AS income,
        SUM(quantity * price) / SUM(quantity) AS avg
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.order_date >= '2026-01-01'
      AND o.order_date < '2026-02-01'
),
tbl_12 AS (
    SELECT
        '12/2025' AS month,
        SUM(quantity) AS quantity,
        SUM(quantity * price) AS income,
        SUM(quantity * price) / SUM(quantity) AS avg
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.order_date >= '2025-12-01'
      AND o.order_date < '2026-01-01'
)

SELECT * FROM tbl_1
UNION ALL
SELECT * FROM tbl_12;

-- Bai 10
select users.username, sum(order_items.quantity) as order_quantity, sum(order_items.quantity * order_items.price) as total_outcome from users
join orders on users.id = orders.user_id
join order_items on orders.id = order_items.order_id
where orders.order_date  >= '2026-01-01' and orders.order_date < '2026-02-01'
group by users.id;



