import React, { useState } from 'react';
import queryString from "query-string"
import { Link } from "react-router-dom"
import Search from "../components/forms/Search"
```
import {searchListings} from "../actions/hotel";
```


const SearchResult = () => {
  //state 
  const [searchLoction, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchBed, setSearchBed] = useState("");   
  const [hotels, setHotels] = useState("");

  ///when component mounts, 
  //get search params from url and use to send search query
  ///dinhdung

  useEffect(() => {
    const {location,date,bed } = 
        queryString.parse(window.location.search);
        console.table({ location, date, bed });
  }
  ,[window.location.search]);



 return (
    <div className="container">
     <div className="row">show search result here</div>
     </div>
 );


}