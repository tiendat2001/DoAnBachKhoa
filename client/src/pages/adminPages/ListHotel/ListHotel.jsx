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

const ListHotel = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const { data, loading, error, reFetch } = useFetch(
        `/hotels?ownerId=${user._id}`);
    // console.log(data)

    const handleDelete = (hotelId) => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure you want to delete this hotel?',
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
                                        <span className="siDistance">Distance: {item.distance}m from center</span>

                                        <span className="siFeatures">Address: {item.address}</span>

                                    </div>
                                    <div className="listHotel_btn">
                                        {/* <span className="siTaxOp">Cho {options.adult} người, {days} đêm</span> */}
                                        {/* <Link to={`/hotels/${item._id}`}>
                                            </Link> */}
                                        <Link to={`/admin/hotels/${item._id}`}>
                                            <button style={{ fontSize: '14px', backgroundColor: '#ccc', border: 'none', height: '40px' }}>THỐNG KÊ SỐ LIỆU</button>
                                        </Link>
                                        <Link to={`/admin/hotels/${item._id}`}>
                                            <button style={{ fontSize: '14px', backgroundColor: '#ccc', border: 'none', height: '40px' }}>CHỈNH SỬA THÔNG TIN KHÁCH SẠN</button>
                                        </Link>
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
