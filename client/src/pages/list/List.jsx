import "./list.css";
import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
const List = () => {
  const location = useLocation();
  const searchContext = useContext(SearchContext);
  const [destination, setDestination] = useState(searchContext.destination);
  const [dates, setDates] = useState(searchContext.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(searchContext.options);
  const [min, setMin] = useState(100);
  const [max, setMax] = useState(10000);
  const [type, setType] = useState("");
  // console.log(dates)
  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}&type=${type}`
  );
  const { dispatch } = useContext(SearchContext);

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleChangeType = (event) => {
    setType(event.target.value);
  };
  const handleClick = () => {
    reFetch();
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
  };

  useEffect(() => {
    // console.log("Updated changes:", dates);
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
  }, [destination, dates, options]);


  const handleDayChange = (item) => {
    const newSelection = { ...item.selection };
    const { startDate, endDate } = newSelection;
    startDate.setHours(14, 0, 0, 0);
    endDate.setHours(14, 0, 0, 0);
    setDates([{ ...newSelection, startDate, endDate }]);
  };

  const handleOptionChange = (e, optionName) => {
    const value = e.target.value;
    setOptions(prevOptions => ({
      ...prevOptions,
      [optionName]: value
    }));
  };

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  const calculatePrice = (cheapestPrice) => {
    let totalPrice = 0;
    let totalPeople = parseInt(options.adult, 10) + parseFloat(options.children) * 0.5;

    // nếu số lượng phòng ng dùng chọn đã >= 
    if (options.room > Math.floor(totalPeople / cheapestPrice.people)) {
      totalPrice = cheapestPrice.price * options.room * days;
    }else
    // console.log(totalPeople)
    // nếu số người =1 hoặc quá ít 1/2=0
    if (Math.floor(totalPeople / cheapestPrice.people) == 0) {
      totalPrice = cheapestPrice.price * days;
    } else {
      //new Intl.NumberFormat('vi-VN').format(params.value*1000)
      totalPrice = cheapestPrice.price * Math.floor(totalPeople / cheapestPrice.people) * days;
    }
    return totalPrice
  };
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Địa điểm</label>
              <input placeholder={destination} value={destination} onChange={handleDestinationChange} type="text" />
            </div>
            <div className="lsItem">
              <label>Check-in</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "dd/MM/yyyy"
              )} đến ${format(dates[0].endDate, "dd/MM/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => handleDayChange(item)}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>

            {/* CHon loai cho nghi */}
            <div className="lsItem">
              <label>Chọn loại chỗ nghỉ</label>
              <select style={{ height: '25px' }}
                id='type'
                onChange={handleChangeType}
                value={type}
              >
                <option value="">Tất cả</option> {/* Option mặc định */}
                <option value="Khách sạn">Khách sạn</option> {/* Các option của dropdown */}
                <option value="Căn hộ">Căn hộ</option>
              </select>
            </div>


            <div className="lsItem">
              {/*  chinh gia tien */}
              <label>Khoảng giá </label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Thấp nhất <small></small>
                  </span>
                  <input
                    type="number"
                    placeholder={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Cao nhất <small></small>
                  </span>
                  <input
                    type="number"
                    placeholder={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Người lớn</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                    onChange={(e) => handleOptionChange(e, 'adult')}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Trẻ em</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                    onChange={(e) => handleOptionChange(e, 'children')}

                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Phòng</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                    onChange={(e) => handleOptionChange(e, 'room')}

                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Tìm kiếm</button>
          </div>
          <div className="listResult">
            {loading ? (
              "loading"
            ) : (
              <>
                {data.map((item) => {
                  const price = calculatePrice(item.cheapestPrice);
                  // đang lọc giá dạng số 100 là 100.000
                  // console.log(max)
                  if (price >= min && price <= max) {
                    return <SearchItem item={item} key={item._id} />;
                  }
                  return null;
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default List;