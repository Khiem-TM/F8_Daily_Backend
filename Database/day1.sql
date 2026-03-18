select khach_hang.makh, TenKH, DiaChi, SoDT
from khach_hang
inner join dat_phong
on dat_phong.makh = khach_hang.makh
where khach_hang.diachi = 'Hoa xuan';


select p.maphong, p.loaiphong, p.sokhachtoida, p.giaphong,count(dp.maphong) as solandat
from phong as p
join dat_phong as dp
on dp.maphong = p.maphong
where dp.trangthaidat = 'dadat'
group by
    p.maphong, p.loaiphong, p.sokhachtoida, p.giaphong
having count(dp.maphong) > 2;

select khach_hang.tenkh from khach_hang
where length(khach_hang.tenkh) < 21 and (
    khach_hang.tenkh like 'H%' or
    khach_hang.tenkh like 'N%' or
    khach_hang.tenkh like 'M%'
    );


select distinct tenkh from khach_hang;


select madv,tendv,donvitinh,dongia from dich_vu_di_kem
where (donvitinh = 'lon' and dongia > 10000) or (donvitinh = 'cai' and dongia < 5000);

select dp.MaDatPhong, dp.MaPhong, p.LoaiPhong, p.SoKhachToiDa, p.GiaPhong, dp.MaKH, TenKH, SoDT, dp.NgayDat, dp.GioBatDau, dp.GioKetThuc, ctdv.madv, SoLuong, dvdk.dongia
from dat_phong as dp
join phong as p on p.maphong = dp.maphong
join khach_hang as kh on kh.makh = dp.makh
join chi_tiet_su_dung_dv as ctdv on ctdv.madatphong = dp.madatphong
join dich_vu_di_kem as dvdk on dvdk.madv = ctdv.madv
where extract(year from dp.ngaydat) in (2016,2017)
  and p.giaphong > 50000



