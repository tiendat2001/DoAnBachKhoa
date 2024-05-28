import React from 'react'
import './listReservation.css'
import { DataGrid } from "@mui/x-data-grid";
import { ReservationColumns } from '../../../datatablesource';
import useFetch from '../../../hooks/useFetch';
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { Link, useLocation } from "react-router-dom";
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { DateRange } from "react-date-range";
import { format, addDays, addYears, subYears } from "date-fns";
import { SearchContext } from '../../../context/SearchContext'
import { toast } from 'react-toastify';
import {
    faBed,
    faCalendarDays,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import Modal from 'react-modal';
import axios from 'axios';
const currentDate = new Date();
// để hiện tất cả reservations (khi người dùng chưa lọc theo ngày)
const INITIAL_STATE =
    [
        {
            startDate: subYears(currentDate, 100), // ngày từ 100 năm trước và sau 100 năm
            endDate: addYears(currentDate, 100),
            key: "selection",
        },
    ];


const ListReservation = () => {
    const { user } = useContext(AuthContext) // {user._id}
    // const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // const decodedToken = jwtDecode(token);
    const searchContext = useContext(SearchContext);
    const [dates, setDates] = useState(searchContext.dates);
    //date này để lọc trong API query
    const [datesToFilter, setDatesToFilter] = useState(INITIAL_STATE);
    const { data: reservationData, loading: reservationLoading, error: reservationError,
        reFetch: reservationReFetch } = useFetch(`/reservation/admin?startDay=${datesToFilter[0].startDate}&endDay=${datesToFilter[0].endDate}`);
    const [openDate, setOpenDate] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reasonCancel, setReasonCancel] = useState('');

    // đổi giá trị hiển thị trên lịch
    const handleDayChange = (item) => {
        const newSelection = { ...item.selection };
        const { startDate, endDate } = newSelection;
        startDate.setHours(14, 0, 0, 0);
        endDate.setHours(14, 0, 0, 0);
        // dates này để hiển thị lịch trên giao diện
        setDates([{ ...newSelection, startDate, endDate }]);
    };

    // khi bấm lọc mới lưu vào biến trong API query
    const filterByDates = () => {
        //date này để lọc trong API query
        setDatesToFilter(dates);
    }

    const cancelFilterByDates = () => {
        //date này để lọc trong API query
        setDatesToFilter(INITIAL_STATE);
    }

    // mở modal yêu cầu hủy
    const closeModalCancelRequest = () =>{
        setModalIsOpen(false)
    }
    const openRequestCancelModal = (canceledReservation) => {
        setModalIsOpen(true)
    }


    // khi admin bấm yêu cầu hủy đơn đặt
    const requestCancel = async (canceledReservation) => {
        // kiểm tra nếu thời gian nhận phòng đơn đấy đã qua hoặc đơn đấy ở status 0 là hủy thì ko đc 
        if (new Date() > new Date(canceledReservation.start) || !canceledReservation.status) {
            toast.error("Bạn không thể yêu cầu hủy đơn này!")
            return;
        }

        try {
            const res = await axios.put(`/reservation/email/sendEmailStatusReservation`, {
                userId: canceledReservation.userId, // gửi cho email của account khách - userId khách
                emailSubject: "THÔNG BÁO YÊU CẦU HỦY ĐƠN ĐẶT PHÒNG TỪ CHỦ CHỖ NGHỈ ",
                emailContent: `Đơn đặt phòng mã ${canceledReservation._id} của quý khách được chủ chỗ nghỉ yêu cầu hủy \n Lý do hủy: `
            });
        } catch (err) {
            console.log(err)
            return;
        }

    }
    // thêm cột xóa sửa
    const actionColumn = [
        {
            field: "action",
            headerName: "Yêu cầu hủy",
            minWidth: 120,
            headerAlign: 'center',

            renderCell: (params) => {
                return (
                    // css từ listRoom.css
                    <div className="cellRequestCancel">
                        <div className="viewButton wrap-content" onClick={() => openRequestCancelModal(params.row)}>
                            Yêu cầu hủy
                        </div>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="listAdmin">
            <Sidebar />
            {/* css từ adminHome css */}
            <div className="listContainerAdmin">
                <NavbarAdmin />

                {/* Modal */}
                



                <div className="ListReservationAdminContainer">
                {modalIsOpen && (
                    <div className="modalCancelRequest">
                        <div className="modal-content">
                            <span className="close" onClick={closeModalCancelRequest}>&times;</span>
                            <div className="modal_title">YÊU CẦU HỦY PHÒNG</div>
                            <textarea placeholder="Nhập lý do muốn hủy" type="text" value={reasonCancel} onChange={(e) => setReasonCancel(e.target.value)} />
                            <div className="modal_container-btn">
                                <button className="modal_btn" onClick={requestCancel}>Xác nhận</button>
                            </div>

                        </div>
                    </div>
                )}
                    <h2>Đặt phòng</h2>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: "10px", marginBottom: '10px', textAlign: 'center' }}>
                        {/* css từ listRoomCLient */}
                        <div style={{ width: '20%' }} className="headerSearchHotel">
                            <FontAwesomeIcon icon={faCalendarDays} className="headerIconHotel" />
                            <span onClick={() => setOpenDate(!openDate)}>{`${format(
                                dates[0].startDate,
                                "dd/MM/yyyy"
                            )} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}</span>
                            {openDate && (
                                <DateRange
                                    onChange={(item) => handleDayChange(item)}
                                    // minDate={new Date()}
                                    ranges={dates}
                                    moveRangeOnFirstSelection={false}
                                    editableDateInputs={true}
                                    className="date"
                                />
                            )}
                        </div>

                        <button onClick={filterByDates}>Lọc theo ngày</button>
                        <button onClick={cancelFilterByDates}>Hủy lọc</button>
                        <div style={{ fontStyle: 'italic' }}>(Lọc theo ngày được tính theo ngày check in của đơn, ví dụ nếu <br />để khoảng ngày 19 đến 20 sẽ lấy đơn có check in ngày 19 và 20)</div>
                    </div>




                    <DataGrid autoHeight
                        // className="datagrid"
                        rows={reservationData}
                        columns={ReservationColumns.concat(actionColumn)}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        // checkboxSelection
                        getRowId={(row) => row._id}
                        getRowHeight={(params) => params.length > 100 ? 100 : 70} // Xác định chiều cao hàng dựa trên chiều dài của mô tả

                    />
                </div>


            </div>
        </div>

    )
}

export default ListReservation
