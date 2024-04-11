import React from 'react'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import "./listRoomClient.css"
import { useContext, useState } from "react";
import { SearchContext } from '../../context/SearchContext';
import { format } from "date-fns";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ListRoomClient = ({ hotelId }) => {

  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const searchContext = useContext(SearchContext);
  const [dates, setDates] = useState(searchContext.dates);
  const [openDate, setOpenDate] = useState(false);
  // const [expandedPhotoIndex, setExpandedPhotoIndex] = useState(null); // State để lưu index của ảnh đang được phóng to
  const [openExpandPhoto, setOpenExpandPhoto] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);

  const handleOpen = (i) => {
    // setSlideNumber(i);
    setOpenExpandPhoto(true);
  };

  const handleMove = (direction,item) => { // item chính là thông tin từng room
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? (item.photos.length-1) : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === (item.photos.length-1) ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };
  // const toggleExpandedPhoto = (index) => {
  //   setExpandedPhotoIndex(index === expandedPhotoIndex ? null : index);
  // };

  const handleDayChange = (item) => {
    setDates([item.selection])
  };

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  // console.log(days)
  // lấy roomNumber_id theo tích
  const handleSelectCheckBox = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value) // nếu bỏ tích thì bỏ phòng có value đấy ra mảng, giữ lại phòng kp value
    );
  };
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
    return false
  };

  // hàm nút đặt phòng
  const reserveRoom = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );

     
    } catch (err) {}
  };

  return (
    <div className="RoomClientContainer">
      {/* tieu de va thanh search ngay */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <h1>Bạn muốn đặt phòng?</h1>

        <div style={{ width: '30%' }} className="headerSearchHotel">

          <FontAwesomeIcon icon={faCalendarDays} className="headerIconHotel" />

          <span onClick={() => setOpenDate(!openDate)}>{`${format(
            dates[0].startDate,
            "MM/dd/yyyy"
          )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
          {openDate && (
            <DateRange
              onChange={(item) => handleDayChange(item)}
              minDate={new Date()}
              ranges={dates}
              moveRangeOnFirstSelection={false}
              editableDateInputs={true}
              className="date"
            />

          )}



        </div>
      </div>

      {/* HIển thị ngày */}


      {/* Phần đặt phòng gom nhieu flex_div */}
      {data.map((item) => (
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
                        onClick={() => handleMove("l",item)}
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
                        onClick={() => handleMove("r",item)}
                      />

                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/*  hiện giá */}
          <div>
            Giá phòng: {item.price}
            <br />
            (Mỗi đêm)
          </div>

          {/* <div style={{ marginBottom: '10px' }}>
            <select>
              <option value="1">1 phòng</option>
              <option value="2">2 phòng</option>
              <option value="3">3 phòng</option>
            </select>
          </div> */}
          {/*  hiện các ô room */}
          <div className="rSelectRooms" style={{ width: '20%', height: '100%' }}>
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

            {/* <label htmlFor="checkbox"></label> */}
          </div>


        </div>
      ))}

      <h2>Bạn đã chọn {selectedRooms.length} phòng</h2>
      <button onClick={reserveRoom} className="rButton">
          Đi đến trang đặt phòng
        </button>

     
    </div>
  )
}

export default ListRoomClient
