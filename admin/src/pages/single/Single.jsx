import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Single = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  console.log(path);
  const [list, setList] = useState();
  const { data, loading, error } = useFetch(`${path}`);
  const [inputs, setInputs] = useState({});
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const Success = await axios.put(`/hotels/${path}`, inputs);
      if (Success) alert("update hotel successfully");
      else alert("Lost connection");
    } catch (err) {
      console.log(err);
    }
  };
  console.log(inputs);
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {data && (
          <>
            <div className="container">
              <h2>{data.name}</h2>
              <p>Type: {data.type}</p>
              <p>City: {data.city}</p>
              <p>Address: {data.address}</p>
              <p>Distance: {data.distance}</p>
              <h3>Description</h3>
              <p>{data.desc}</p>
              <h3>Rooms</h3>
              {data.rooms && data.rooms.length > 0 ? (
                <ul>
                  {data.rooms.map((roomId, index) => (
                    <li key={index}>{roomId}</li>
                  ))}
                </ul>
              ) : (
                <p>No rooms available.</p>
              )}
              <h3>Cheapest Price</h3>
              <p>{data.cheapestPrice} USD</p>
              {data.featured && <p>Featured Hotel</p>}
              <h3>Photos</h3>
              {data.photos && data.photos.length > 0 ? (
                <div className="photo-container">
                  {data.photos.map((photo, index) => (
                    <img key={index} src={photo} alt={`Photo ${index + 1}`} />
                  ))}
                </div>
              ) : (
                <p>No photos available.</p>
              )}
            </div>
            <div className="productBottom">
              <form className="productForm">
                <div className="productFormLeft">
                  <label>Hotel Name </label>
                  <input
                    name="name"
                    type="text"
                    placeholder={data.name}
                    onChange={handleChange}
                  />
                  <label>Hotel Type </label>
                  <input
                    name="type"
                    type="text"
                    placeholder={data.type}
                    onChange={handleChange}
                  />
                  <label>Hotel City </label>
                  <input
                    name="city"
                    type="text"
                    placeholder={data.city}
                    onChange={handleChange}
                  />
                  <label>Hotel Distance (meter) </label>
                  <input
                    name="distance"
                    type="number"
                    placeholder={data.distance}
                    onChange={handleChange}
                  />
                  <label>Hotel Description</label>
                  <input
                    name="desc"
                    type="text"
                    placeholder="Enter description"
                    onChange={handleChange}
                  />
                  <label>Price</label>
                  <input
                    name="cheapestPrice"
                    type="number"
                    placeholder={data.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="productFormRight">
                  <div className="productUpload">
                    {data.photos && data.photos.length > 0 ? (
                      <div className="photo-container">
                        <img
                          src={data?.photos[0]}
                          alt=""
                          className="productUploadImg"
                        />
                      </div>
                    ) : (
                      <p>No photos available.</p>
                    )}

                    <label for="file"></label>
                    <input type="file" id="file" style={{ display: "none" }} />
                  </div>
                  <button className="productButton" onClick={handleClick}>
                    Update
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Single;
