import "./hotel.css";
import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import MailList from "../../components/MailList/MailList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../reserve/Reserve";
import { format, } from "date-fns";
import ListRoomClient from "../../components/ListRoomClient/ListRoomClient";
import {
  faBed,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
// PAGE THONG TIN TUNG HOTEL
const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2]; // lay hotel id
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // lay thong tin cua hotel theo id hotel
  const { data, loading, error } = useFetch(`/hotels/find/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // CONTEXT
  const searchContext = useContext(SearchContext);
  const { destination, dates, options } = useContext(SearchContext);
  // console.log(searchContext)

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  // console.log(data.cheapestPrice)
  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? (data.photos.length - 1) : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === (data.photos.length - 1) ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
    // console.log(newSlideNumber)
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };
  return (
    <div>
      <Navbar />
      <Header type="list" />

      {/* phần hiển thị thông tin chọn từ trc */}
      {/* <div className="headerSearchHotel">
              <div className="headerSearchItemHotel">
                <FontAwesomeIcon icon={faBed} className="headerIconHotel" />
                <input
                  type="text"
                  placeholder={destination}
                  className="headerSearchInputHotel "
                />
              </div>
              <div className="headerSearchItemHotel">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIconHotel" />

                <span className="headerSearchTextHotel"
                >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}</span>
              </div>

              <div className="headerSearchItemHotel">
                <FontAwesomeIcon icon={faPerson} className="headerIconHotel" /> 
                <span
                  className="headerSearchTextHotel"
                >{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span> 
              </div>  
    </div>  */}



      {loading ? (
        "loading"
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>
            <span className="hotelDistance">
              Excellent location – {data.distance}m from center
            </span>
            {/* <span className="hotelPriceHighlight">
              Book a stay over ${data.cheapestPrice} at this property and get a
              free airport taxi
            </span> */}
            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                // ảnh dài quá thì cho nhỏ lại tối đa chỉ 3 rows
                <div style={{ width: `${data.photos.length >= 9 ? (100 / Math.ceil(data.photos.length / 3)) + '%' : '33%'}` }} className="hotelImgWrapper" key={i}>

                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.desc}</p>
              </div>
              <div className="hotelDetailsPrice">
                {/* {days !== 0 && <h1>Perfect for a {days}-night stay!</h1>} */}
                <span>
                  Located in the {data.address}, this property has an
                  excellent location!
                </span>

                <h2>
                  <b>Price only from ${data.cheapestPrice?.price ?? 'N/A'} per night</b>

                </h2>

                {/* <button onClick={handleClick}>Reserve or Book Now!</button> */}
              </div>
            </div>
          </div>
          <ListRoomClient hotelId={id} />

          <MailList />
          <Footer />
        </div>
      )}
      {/* {openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>} */}
    </div>
  );
};

export default Hotel;