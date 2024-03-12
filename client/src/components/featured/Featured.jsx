import useFetch from "../../hooks/useFetch";
import { DateRange } from "react-date-range";
import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "./featured.css";
import React from "react";
import { SearchContext } from "../../context/SearchContext";
const Featured = () => {
  const { data, loading, error } = useFetch(
    "/hotels/countByCity?cities=Hà Nội,Ninh Bình,Đà Nẵng"
  );
  const [destination, setDestination] = useState("");

  const [openDate, setOpenDate] = useState(false);
  const [dates, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
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

    navigate("/hotels", { state: { destination, dates, options } });
    // console.log("dfasfa");
  }
  return (
    <div className="featured">
      {loading ? (
        "Loading please wait"
      ) : (
        <>
          <div
            className="featuredItem"
            onClick={() => handleSearch("Ninh Bình")}
          >
            <img
              src="https://cdn.tgdd.vn/Files/2022/03/28/1422795/kinh-nghiem-du-lich-chua-bai-dinh-ninh-binh-day-du-tu-a-z-202203282349275615.jpg"
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Ninh Binh</h1>
              <h2>{data[1]} hotels</h2>
            </div>
          </div>

          <div className="featuredItem">
            <img
              src="https://ik.imagekit.io/tvlk/blog/2023/09/ho-guom-1.jpg?tr=dpr-2,w-675"
              alt=""
              className="featuredImg"
            />
            <div
              className="featuredTitles"
              onClick={() => handleSearch("Hà Nội")}
            >
              <h1>Ha Noi</h1>
              <h2>{data[0]} hotels</h2>
            </div>
          </div>
          <div className="featuredItem">
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
              alt=""
              className="featuredImg"
            />
            <div
              className="featuredTitles"
              onClick={() => handleSearch("Đà Nẵng")}
            >
              <h1>Da Nang</h1>
              <h2>{data[2]} hotels</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
