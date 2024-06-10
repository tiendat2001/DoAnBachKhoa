import React from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import "./listRoom.css"
import { DataGrid } from "@mui/x-data-grid";
import { roomColumns } from '../../../datatablesource';
import useFetch from '../../../hooks/useFetch';
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { addYears } from "date-fns";
const currentDate = new Date();
const endLessDate = addYears(currentDate, 10)
const ListRoom = () => {
    // const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // const decodedToken = jwtDecode(token);
    const { user } = useContext(AuthContext) // {user._id}
    const { data: hotelData, loading: hotelLoading, error: hotelError, reFetch: hotelReFetch } = useFetch(`/hotels/getByAdmin`);
    const [hotelId, setHotelId] = useState(hotelData.length > 0 ? hotelData[0]._id : null);
    const { data: roomData, loading: roomLoading, error: roomError, reFetch: roomReFetch } = useFetch(`/rooms/${hotelId}`);
    // lấy ra những đơn đặt phòng thành công trong tương lai 
    const { data: reservationDataFuture, loading: reservationLoading, error: reservationError,
        reFetch: reservationReFetch } = useFetch(`/reservation/admin/?startDay=${currentDate}&endDay=${endLessDate}&status=1`);
    const navigate = useNavigate()
    const location = useLocation();
    // lấy hotel id nếu người dùng vừa tạo phòng hoặc chỉnh phòng xong
    const hotelIdFromAddModifyRoom = location.state?.hotelIdFromAddModifyRoom;
    const handleHotelChange = (e) => {
        setHotelId(e.target.value);
    };
    useEffect(() => {
        // setHotelId(hotelData[0]?._id)
         setHotelId(hotelIdFromAddModifyRoom)
    }, [hotelData]);
    // console.log(roomData)

    // chuyển hướng
    const handleNavigation = (path) => {
        navigate(path, { state: { previousPath: '/admin/rooms', hotelIdFromListRoom:hotelId } });
    };
    const handleDelete = (typeRoomId) => {
        // // Kiểm tra xem phòng đấy có đơn sắp tới ko
        const hasMatchingTypeRoomId = reservationDataFuture.some(reservation => {
            // Kiểm tra xem reservation có thuộc tính roomTypeIdsReserved không
            if (reservation.roomTypeIdsReserved) {
                // Duyệt qua mỗi phần tử trong roomTypeIdsReserved để kiểm tra roomTypeId
                return reservation.roomTypeIdsReserved.some(({ roomTypeId }) => roomTypeId === typeRoomId);
            }
            return false; // Nếu không có roomTypeIdsReserved, không thỏa mãn điều kiện
        });

        // Nếu có phần tử thỏa mãn điều kiện, hiển thị thông báo lỗi
        if (hasMatchingTypeRoomId) {
            toast.error("Loại phòng này sắp có đơn đặt sắp tới")
            return; // Dừng hàm
        }
        // xacs nhan xoa
        confirmAlert({
            title: 'Confirm',
            message: 'Bạn có chắc chắn muốn xóa loại phòng này?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        // Xác nhận xóa khách sạn
                        deleteRoom(typeRoomId);
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

    }

    const deleteRoom = async (typeRoomId) => {

        try {
            const Success = await axios.delete(`/rooms/${typeRoomId}`);

            if (Success) {
                // Nếu xóa thành công, tải lại dữ liệu
                roomReFetch();
                toast.success('Xóa phòng thành công');
            } else {
                toast.error('Có lỗi xảy ra. Vui lòng thử lại');
            }
        } catch (error) {
            console.error('Error deleting hotel:', error);
            toast.error('An error occurred while deleting hotel.');
        }
    }
    // thêm cột xóa sửa
    const actionColumn = [
        {
            field: "action",
            headerName: "Hành động",
            width: 270,
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <div className="viewButton wrap-content" onClick={() => handleNavigation(`/admin/rooms/${params.row._id}`)}>
                            Chỉnh thông tin
                        </div>
                        <div className="viewButton wrap-content" onClick={() => handleNavigation(`/admin/rooms/smallRoomDetails/${params.row._id}`)}>
                            Chỉnh số lượng
                        </div>
                        <div
                            className="deleteButton wrap-content"
                            onClick={() => handleDelete(params.row._id)}
                        >
                            Xóa loại phòng
                        </div>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="ListRoomAdminContainer">
                    <h2>Phòng của bạn</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        <div className="hotelSelectBox">
                            {/* <label>Choose a hotel</label> */}
                            <select
                                id="hotelId"
                                value={hotelId}
                                onChange={handleHotelChange}
                            >
                                <option value="d" disabled selected>Chọn chỗ nghỉ</option>
                                {hotelLoading
                                    ? "loading"
                                    : hotelData &&
                                    hotelData.map((hotel) => (
                                        <option key={hotel._id} value={hotel._id}>
                                            {hotel.name}
                                        </option>
                                    ))}
                            </select>

                        </div>

                       
                            <button onClick={() => handleNavigation(`/admin/rooms/new`)} style={{ fontSize: '14px', backgroundColor: '#5bf800', border: 'none', 
                            height: '40px',color:'white',fontWeight:'bold',borderRadius:'5px' }}>Thêm loại phòng (loại chỗ ở)</button>
                    </div>


                </div>


                <DataGrid autoHeight
                    className="datagrid"
                    rows={roomData}
                    columns={roomColumns.concat(actionColumn)}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    // checkboxSelection
                    getRowId={(row) => row._id}
                    localeText={{
                        noRowsLabel: <span style={{ color: 'red' }}>Bạn chưa chọn chỗ nghỉ hoặc chỗ nghỉ này chưa có phòng</span>,
                    }}
                />




            </div>
        </div>

    )
}

export default ListRoom
