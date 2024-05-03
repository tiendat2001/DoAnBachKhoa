import React from 'react'
import { useEffect,useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { Link } from "react-router-dom";
import './recentSeenHotel.css'

const RecentSeenHotel = () => {
    const [mostViewedCity, setMostViewedCity] = useState('');
    const { data:allHotelData, loading, error, reFetch } = useFetch(
        `/hotels`
      );
      const { data: suggestedHotel, loadingSuggestedHotel, errorSuggestedHotel, reFetchSuggestedHotel } = useFetch(
        `/hotels?city=${mostViewedCity}`
      );
   
    useEffect(() => {
        // console.log(allHotelData)
        //Lấy danh sách ID khách sạn đã xem từ localStorage
        const idHotelSeenString = localStorage.getItem('idHotelSeen');
        const idHotelSeen = idHotelSeenString ? JSON.parse(idHotelSeenString) : [];
        // console.log(idHotelSeen)
        //Tạo một đối tượng để đếm số lần xuất hiện của mỗi thành phố
        const cityCount = {};
        idHotelSeen.forEach(id => {
          const hotel = allHotelData?.find(hotel => hotel._id == id);
          if (hotel) {
            cityCount[hotel.city] = (cityCount[hotel.city] || 0) + 1;
          }
        });
    
        // Tìm thành phố có số lần xuất hiện nhiều nhất
        let maxCount = 0;
        let mostViewedCity = '';
        for (const city in cityCount) {
          if (cityCount[city] > maxCount) {
            maxCount = cityCount[city];
            mostViewedCity = city;
          }
        }
    
        // Cập nhật thành phố được xem nhiều nhất vào state
        setMostViewedCity(mostViewedCity);
      }, [allHotelData]);
    //   console.log(mostViewedCity)
    //   console.log(suggestedHotel)
  return (
    <div className="fp">
    {loading ? (
      "Loading"
    ) : (
      <>
        {suggestedHotel.map((item) => (
          <div className="fpItem" key={item._id}>
            <Link to={`hotels/${item._id}`}>
      <img src={item.photos[0]} alt="" className="fpImg" />
    </Link>
            <span className="fpName">{item.name}</span>
            <span className="fpCity">{item.city}</span>
            <span className="fpPrice">Giá chỉ từ  ${item.cheapestPrice.price} cho 1 phòng mỗi đêm</span>
            {item.rating && <div className="fpRating">
              {/* <button>{item.rating}</button> */}
            </div>}
          </div>
        ))}
      </>
    )}
  </div>
  )
}

export default RecentSeenHotel
