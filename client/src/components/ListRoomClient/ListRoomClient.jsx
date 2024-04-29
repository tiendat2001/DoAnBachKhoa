import React from 'react'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import "./listRoomClient.css"
import { useContext, useState, useEffect } from "react";
import { SearchContext } from '../../context/SearchContext';
import { format, addDays, subDays } from "date-fns";
import { DateRange } from "react-date-range";
import {
  faBed,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ListRoomClient = ({ hotelId }) => {
  const { data, loading,error,reFetch } = useFetch(`/rooms/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const searchContext = useContext(SearchContext);
  const [dates, setDates] = useState(searchContext.dates);
  dates[0].startDate.setHours(14, 0, 0, 0);
  dates[0].endDate.setHours(14, 0, 0, 0);
  const [options, setOptions] = useState(searchContext.options);
  const [destination, setDestination] = useState(searchContext.destination);
  const [openDate, setOpenDate] = useState(false);
  // const [expandedPhotoIndex, setExpandedPhotoIndex] = useState(null); // State để lưu index của ảnh đang được phóng to
  const [openExpandPhoto, setOpenExpandPhoto] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const { dispatch } = useContext(SearchContext);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [key, setKey] = useState(Math.random());
  const selectedRoomDetais = [];
  const { user } = useContext(AuthContext)
  // console.log(dates)
  // var totalRoomQuantitySelected = 0;
  const navigate = useNavigate()

  useEffect(() => {
    // console.log("Updated changes:", dates);
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    // console.log("thay doi")
  }, [destination, dates, options]);


  const handleOpen = (i) => {
    // setSlideNumber(i);
    setOpenExpandPhoto(true);
  };
  // console.log("at")
  const handleMove = (direction, item) => { // item chính là thông tin từng room
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? (item.photos.length - 1) : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === (item.photos.length - 1) ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };
  // const toggleExpandedPhoto = (index) => {
  //   setExpandedPhotoIndex(index === expandedPhotoIndex ? null : index);
  // };

  const handleDayChange = (item) => {
    const newSelection = { ...item.selection };
    const { startDate, endDate } = newSelection;
    startDate.setHours(14, 0, 0, 0);
    endDate.setHours(14, 0, 0, 0);
    setDates([{ ...newSelection, startDate, endDate }]);
    setSelectedRoomIds([])
    setKey(Math.random()); // Bắt reload lại phần chọn phòng
    reFetch()
  };

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  // lấy roomNumber_id theo tích
  // const handleSelectCheckBox = (e) => {
  //   const checked = e.target.checked;
  //   const value = e.target.value;
  //   setSelectedRooms(
  //     checked
  //       ? [...selectedRooms, value]
  //       : selectedRooms.filter((item) => item !== value) // nếu bỏ tích thì bỏ phòng có value đấy ra mảng, giữ lại phòng kp value
  //   );
  // };
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date < end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  // lựa chọn của khach
  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);
  // alldates.forEach(timestamp => {
  //   const date = new Date(timestamp);
  //   console.log(date.toLocaleDateString());
  // });

  // từ front end đẩy xuống csdl bị lệch 1 ngày, ví dụ ở front 13 xuống csdl sẽ là 12, còn từ csdl lên front thì 12 sẽ bị lên thành 13
  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) => {
      const dateMinusOneDay = new Date(date).getTime(); // theem getTIme() hay ko cung v
      // console.log(new Date(dateMinusOneDay));
      return alldates.includes(dateMinusOneDay);
    });

    return !isFound;
  };

  // thay đổi số lượng
  const handleSelectChange = (event, roomNumbers) => {
    let roomQuantitySelected = 0;
    data.forEach((dataItem) => {
      // Lấy giá trị được chọn từ <select> tương ứng với item hiện tại
      const selectedValue = parseInt(document.getElementById(`select_${dataItem._id}`).value);
      roomQuantitySelected = roomQuantitySelected + selectedValue;
    });
    // console.log("Tổng Số lượng phòng đã chọn:", roomQuantitySelected);
    const updatedSelectedRooms = selectedRoomIds;

    let updatedSelectedRoomsCopy = [...updatedSelectedRooms];
    // Duyệt qua mỗi phần tử trong mảng roomNumbers
    roomNumbers.forEach(room => {
      // Kiểm tra xem _id của phần tử hiện tại có tồn tại trong mảng updatedSelectedRooms không
      const index = updatedSelectedRoomsCopy.findIndex(selectedRoom => selectedRoom === room._id);
      // Nếu có tồn tại, loại bỏ phần tử đó khỏi mảng updatedSelectedRoomsCopy
      if (index !== -1) {
        updatedSelectedRoomsCopy.splice(index, 1);
      }
    });

    roomNumbers.forEach((roomNumber) => {
      if (isAvailable(roomNumber) && updatedSelectedRoomsCopy.length < roomQuantitySelected) {
        updatedSelectedRoomsCopy.push(roomNumber._id);
      }
    });

    setSelectedRoomIds(updatedSelectedRoomsCopy);
  };
  // console.log("selectedRoomIds:", selectedRoomIds);

  // hàm nút đặt phòng
  const reserveRoom = async () => {
    //check xem đăng nhập chưa
    if(!user.username){
      navigate("/login")
      return;
    }

     // Lặp qua từng item trong data
    data.forEach((item) => {
    // Kiểm tra nếu số lượng phòng đã chọn khác 0
    const selectedValue = parseInt(document.getElementById(`select_${item._id}`).value);
    if (selectedValue !== 0) {
      // Thêm đối tượng vào mảng selectedRooms
      selectedRoomDetais.push({ roomTypeId:item._id, typeRoom:item.title, quantity: selectedValue });
    }

});
  
    if (selectedRoomIds.length > 0 && alldates.length >=1) {
      console.log(alldates.length)
      navigate("/reserve", { state: { selectedRoomIds, alldates, hotelId, startDate: dates[0].startDate, endDate: dates[0].endDate, 
        seletedRoomIdsReserved:selectedRoomDetais } });
        //seletedRoomIdsReserved là mảng để truyền vào reserve xử lý tìm id sau
    } else {
      toast.error('Bạn chưa chọn phòng muốn đặt hoặc ngày bạn chọn phải tối thiểu 1 đêm');
    }

  };

  

  return (
    <div className="RoomClientContainer">
      {/* tieu de va thanh search ngay */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <h1>Bạn muốn đặt phòng?</h1>
        {/* HIển thị ngày */}

        <div style={{ width: '30%' }} className="headerSearchHotel">

          <FontAwesomeIcon icon={faCalendarDays} className="headerIconHotel" />

          <span onClick={() => setOpenDate(!openDate)}>{`${format(
            dates[0].startDate,
            "MM/dd/yyyy"
          )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
          {openDate && (
            <DateRange
              onChange={(item) => handleDayChange(item)}
              // minDate={new Date()}
              ranges={dates}
              moveRangeOnFirstSelection={true}
              editableDateInputs={true}
              className="date"
            />

          )}



        </div>
        <div ><FontAwesomeIcon icon={faPerson} className="headerIconHotel" /> {options.adult} người lớn, {options.children} trẻ em</div>

      </div>



      {/* Phần đặt phòng gom nhieu flex_div */}
      {data.map((item, index) => (
        <div className="flex_div" style={{ border: '1px solid #7fc7af', }}>

          <div style={{ width: '50%' }} >
            <div className="rTitle">{item.title}</div>
            <div className="rDesc">Số lượng người: {item.maxPeople}</div>
            <div className="rMax">{item.desc}</div>
            <div className="rImages">
              {item.photos?.map((photo, i) => (
                <div className="rImgWrapper" key={i}>
                  <img
                    src={photo}
                    alt=""
                    className="roomImg"
                    onClick={() => handleOpen(i)}
                  />
                  {/* Kiểm tra nếu index của ảnh được click trùng với expandedPhotoIndex thì hiển thị ảnh phóng to */}
                  {openExpandPhoto && (
                    <div className="expandedPhotoWrapper">
                      {/* css dùng từ hotel */}
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="close"
                        onClick={() => setOpenExpandPhoto(false)}
                      />
                      <FontAwesomeIcon
                        icon={faCircleArrowLeft}
                        className="arrow"
                        onClick={() => handleMove("l", item)}
                      />
                      <div className="sliderWrapper">
                        <img
                          src={item.photos[slideNumber]}
                          alt=""
                          className="sliderImg"
                        />
                      </div>
                      <FontAwesomeIcon
                        icon={faCircleArrowRight}
                        className="arrow"
                        onClick={() => handleMove("r", item)}
                      />

                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/*  hiện giá */}
          <div>
            Giá phòng: {new Intl.NumberFormat('vi-VN').format(item.price*1000) } VND
            <br />
            (Mỗi đêm)
          </div>
          {/* chứa chỗ chọn phòng */}
          <div key={key} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end',width: '20%',alignItems:'center',gap:'10px' }}>

            <select style={{height:'20px'}}  id={`select_${item._id}`} onChange={(event) => handleSelectChange(event, item.roomNumbers)}>
              <option value={0}>0 phòng</option>
              {(() => {
                let roomIndex = 0; // Khởi tạo biến đếm
                return item.roomNumbers.map((roomNumber, index) => {
                  if (isAvailable(roomNumber)) {
                    roomIndex++; // Tăng giá trị biến đếm khi phòng thỏa mãn điều kiện
                    return (
                      <option key={roomNumber._id} value={roomIndex}>
                        {`${roomIndex} phòng`}
                      </option>
                    );
                  }
                  return null;
                });
              })()}
            </select>

            <div style={{ width: '30%', height: '100%', fontSize: '14px' }}>(Chọn số lượng phòng muốn đặt)</div>

          </div>
          {/*  hiện các ô room */}
          {/* <div className="rSelectRooms" style={{ width: '20%', height: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '50%', alignItems: 'center' }}>
              {item.roomNumbers.map((roomNumber) => (
                isAvailable(roomNumber) ? (
                  <div className="room" key={roomNumber._id}>
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={handleSelectCheckBox}
                    />
                  </div>
                ) : null
              ))}
            </div>

            <div style={{ width: '30%', height: '100%', fontSize: '14px' }}>(TÍch số lượng ô bằng với số lượng phòng muốn đặt)</div>

          </div> */}


        </div>
      ))}

      <h2>Bạn đã chọn {selectedRoomIds.length} phòng</h2>
      <button onClick={reserveRoom} className="rButton">
        Đi đến trang đặt phòng
      </button>
    

    </div>
  )
}

export default ListRoomClient