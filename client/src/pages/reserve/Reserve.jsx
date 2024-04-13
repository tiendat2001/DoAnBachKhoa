import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";

const Reserve = () => {
  const location = useLocation();
  const [selectedRooms, setSelectedRooms] = useState(location.state.selectedRooms);
  const [alldates, setAlldates] = useState(location.state.alldates);
  console.log(selectedRooms)
  alldates.forEach(timestamp => {
    const date = new Date(timestamp);
    console.log(date.toLocaleString()); // Hiển thị cả giờ và phút
  });



  return (
    <div>
      <Navbar />
      <Header type="list" />
      </div>
  );
};

export default Reserve;