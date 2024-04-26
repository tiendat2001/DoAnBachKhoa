import useFetch from "../../hooks/useFetch";
import { DateRange } from "react-date-range";
import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format,addDays } from "date-fns";
import "./featured.css";
import React from "react";
import { SearchContext } from "../../context/SearchContext";
const Featured = () => {
  const { data, loading, error } = useFetch(
    "/hotels/countByCity"
  );
  const [destination, setDestination] = useState("");

  const [openDate, setOpenDate] = useState(false);
  const [dates, setDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  

  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);

  function handleSearch(destination) {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    navigate("/hotels", );
    // console.log("dfasfa");
  }
  return (
    <div className="featured">
      {loading ? (
        "Loading please wait"
      ) : (
        // dấu <> thay cho react fragment - = với việc tạo 1 div lồng ra ngoài
        <> 
          <div
            className="featuredItem"
            onClick={() => handleSearch(data[0].city)}
          >
            <img
              src="https://cdn.tgdd.vn/Files/2022/03/28/1422795/kinh-nghiem-du-lich-chua-bai-dinh-ninh-binh-day-du-tu-a-z-202203282349275615.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
            <h1>{data[0]?.city}</h1>
              <h2>{data[0]?.quantity} chỗ nghỉ</h2>
            </div>
          </div>

          <div className="featuredItem"  onClick={() => handleSearch(data[1].city)}>
            <img
              src="https://ik.imagekit.io/tvlk/blog/2023/09/ho-guom-1.jpg?tr=dpr-2,w-675"
              alt=""
              className="featuredImg"
            />
            <div
              className="featuredTitles"
             
            >
               <h1>{data[1]?.city}</h1>
              <h2>{data[1]?.quantity} chỗ nghỉ</h2>
            </div>
          </div>
          <div className="featuredItem"  onClick={() => handleSearch(data[2].city)}>
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
              alt=""
              className="featuredImg"
            />
            <div
              className="featuredTitles"
             
            >
                <h1>{data[2]?.city}</h1>
              <h2>{data[2]?.quantity} chỗ nghỉ</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
