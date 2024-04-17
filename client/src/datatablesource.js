import { format,addDays,subDays   } from "date-fns";
import React from 'react';

export const roomColumns = [
    { field: "_id", headerName: "ID", width: 100, hide:true },
    {
      field: "title",
      headerName: "Title",
      width: 280,
      align:'center',
      headerAlign:'center'
    },
    {
      field: "desc",
      headerName: "Description",
      width: 330,
      cellClassName: 'wrap-content', 
      align:'center',
      headerAlign:'center'
    },
    // {
    //   field: "hotelName",
    //   headerName: "Hotel",
    //   width: 200,
    // },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      align:'center',
      headerAlign:'center'

    },
    {
      field: "maxPeople",
      headerName: "Max People",
      width: 130,
      align:'center',
      headerAlign:'center'
    },
    {
      field: "roomCount",
      headerName: "Room Count",
      width: 150,
      align:'center',
      headerAlign:'center',
      renderCell: (params) => {
          const roomNumbers = params.row.roomNumbers || [];
          return roomNumbers.length;
      }
    }
    
  ];


// ------------------order
  const formatDate = (date) => {
    let dateFormat = subDays(new Date(date), 1)
    const [month, day, year] = dateFormat.toLocaleDateString().split('/');
    return `${day}/${month}/${year}`;
  };


  
  export const ReservationColumns = [
    { field: "username", headerName: "Tài khoản", width: 80 },
    {
      field: "start",
      headerName: "Check-in",
      width: 115,
      valueGetter: (params) => formatDate(params.value),
      headerAlign: 'center',
      align:'center'

    },
    {
      field: "end",
      headerName: "Check-out",
      width: 115,
      valueGetter: (params) => formatDate(params.value),
      headerAlign: 'center',
      align:'center'
    },
    { field: "hotelName", headerName: "Khách sạn", width: 180, headerAlign: 'center',  align:'center' },

    {
      field: "roomsDetail",
      headerName: "Phòng",
      width: 250,
      cellClassName: 'wrap-content', // xuống dòng khi nội dung dài
      headerAlign: 'center',
      align:'center',
      renderCell: (params) => {
        const roomDetails = params.value;
        return (
          <div className="wrap-content">
            {roomDetails}
          </div>
        );
      }
    },
    
    {
      field: "guest",
      headerName: "Số người",
      width: 150,
      cellClassName: 'wrap-content', // xuống dòng khi nội dung dài
      headerAlign: 'center',
      align:'center',
      renderCell: (params) => {
        const { adult, children } = params.row.guest;
        return `${adult} người lớn, ${children} trẻ em`;
      }
    },

    {
      field: "totalPrice",
      headerName: "Tổng giá",
      width: 100,
      headerAlign: 'center',
      align:'center'
    },
    {
      field: "createdAt",
      headerName: "Thời gian đặt",
      width: 115,
      valueGetter: (params) => new Date(params.value).toLocaleDateString('vi-VN'),
      headerAlign: 'center',
      align:'center'

    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 100,
      headerAlign: 'center',
      align:'center'
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 100,
      headerAlign: 'center',
      align:'center'
    },

  ];
  