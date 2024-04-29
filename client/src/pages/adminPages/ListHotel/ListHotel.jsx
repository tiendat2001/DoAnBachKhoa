import React from 'react'
import { useContext } from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext'
import { Link } from 'react-router-dom';
import "./listHotel.css"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format, addDays, addYears, subYears } from "date-fns";
import { useNavigate } from 'react-router-dom';

const currentDate = new Date();
const endLessDate = addYears(currentDate, 1)

const ListHotel = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const { data, loading, error, reFetch } = useFetch(
        `/hotels?ownerId=${user._id}`);
    // lấy ra những đơn đặt phòng trong tương lai
    const { data: reservationData, loading: reservationLoading, error: reservationError,
        reFetch: reservationReFetch } = useFetch(`/reservation?idOwnerHotel=${user._id}&startDay=${currentDate}&endDay=${endLessDate}&status=true`);
    // console.log(reservationData)
    const navigate = useNavigate();
    const handleDelete = (hotelId) => {
        const hasMatchingHotelId = reservationData.some(item => item.hotelId === hotelId);

        // Nếu có phần tử nào có hotelId trùng khớp, thoát ra khỏi hàm
        if (hasMatchingHotelId) {
            toast.error("Chỗ nghỉ này đang có đơn đặt phòng sắp tới, không thể xóa!")
            return;
        }
        confirmAlert({
            title: 'Confirm',
            message: 'Bạn có chắc chắn muốn xóa chỗ nghỉ này?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        // Xác nhận xóa khách sạn
                        deleteHotel(hotelId);
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        // Không làm gì cả
                    }
                }
            ]
        });
    };
    // hàm chuyển hướng
    const handleEditHotel = (itemId) => {
        navigate(`/admin/hotels/${itemId}`, { state: { previousPath: '/admin/hotels' } });
      };
      const handleStatisticHotel = (itemId) => {
        navigate(`/admin/hotels/revenue/${itemId}`, { state: { previousPath: '/admin/hotels' } });
      };
    const deleteHotel = async (hotelId) => {
        try {
            // Gửi yêu cầu xóa khách sạn đến máy chủ

            const Success = await axios.delete(`/hotels/${hotelId}`, { data: { ownerId: user._id } });

            if (Success) {
                // Nếu xóa thành công, tải lại dữ liệu
                reFetch();
                toast.success('Hotel deleted successfully!');
            } else {
                toast.error('Failed to delete hotel. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting hotel:', error);
            toast.error('An error occurred while deleting hotel.');
        }
    };

    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="listHotelAdminContainer">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1>Your Hotels</h1>
                        <Link to={`/admin/hotels/new`}>
                            <button style={{ fontSize: '14px', backgroundColor: '#ccc', border: 'none', height: '40px' }}>THÊM CHỖ NGHỈ MỚI</button>

                        </Link>
                    </div>

                    {loading ? (
                        "loading"
                    ) : (
                        <>
                            {data.map((item) => (
                                <div className="listHotelAdmin" key={item._id}>
                                    <img src={item.photos[0]} alt="" className="siImg" />
                                    <div className="siDesc">
                                        <h1 className="siTitle">{item.name}</h1>
                                        <span className="siDistance">Khoảng cách đến trung tâm: {item.distance}m từ trung tâm</span>

                                        <span className="siFeatures">Địa chỉ chỗ nghỉ: {item.address}</span>

                                    </div>
                                    <div className="listHotel_btn">
                                        {/* <span className="siTaxOp">Cho {options.adult} người, {days} đêm</span> */}
                                        {/* <Link to={`/hotels/${item._id}`}>
                                            </Link> */}
                                         <button
                                            style={{ fontSize: '14px', backgroundColor: '#ccc', border: 'none', height: '40px' }}
                                            onClick={() => handleStatisticHotel(item._id)}
                                        >
                                            THỐNG KÊ SỐ LIỆU
                                        </button>
                                        <button
                                            style={{ fontSize: '14px', backgroundColor: '#ccc', border: 'none', height: '40px' }}
                                            onClick={() => handleEditHotel(item._id)}
                                        >
                                            CHỈNH SỬA THÔNG TIN KHÁCH SẠN
                                        </button>
                                        <button style={{ fontSize: '14px', backgroundColor: '#ccc', border: 'none', height: '40px' }} onClick={() => handleDelete(item._id)}>XÓA CHỖ NGHỈ</button>

                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>


            </div>
        </div>
    )
}

export default ListHotel
