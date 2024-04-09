import React from 'react'
import "./listBooking.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
import { useState, useContext } from "react";
import axios from 'axios';
import useFetch from '../../hooks/useFetch';
const ListBooking = () => {

    
  return (
    <div>
    <Navbar />
      <Header type="list" />
    </div>
  )
}

export default ListBooking
