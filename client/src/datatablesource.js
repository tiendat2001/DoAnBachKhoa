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
      valueFormatter: (params) => {
            const formattedValue = new Intl.NumberFormat('vi-VN').format(params.value*1000)
            return `${formattedValue}`;
    },
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
    // const [month, day, year] = dateFormat.toLocaleDateString().split('/');
    return dateFormat.toLocaleDateString('vi-VN');
  };


  // cột danh sách reservations
  export const ReservationColumns = [
    { field: "username", headerName: "Tài khoản", width: 80 },
    {
      field: "start",
      headerName: "Check-in",
      width: 115,
      valueFormatter: (params) => formatDate(params.value),
      headerAlign: 'center',
      align:'center',
      comparator: (a, b) => new Date(a).getTime() - new Date(b).getTime()

    },
    {
      field: "end",
      headerName: "Check-out",
      width: 115,
      valueFormatter: (params) => formatDate(params.value),
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
      valueFormatter: (params) => {
        if (params.value !== null) {
            const formattedValue = new Intl.NumberFormat('vi-VN').format(params.value*1000)
            return `${formattedValue}`;
        }
        return null; // Trả về null nếu giá trị là null
    },
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
  
  export const RenenueAllHotelColumn =
  // cột ds hotel revenue
  [
    {
      field: "hotelName",
      headerName: "Tên chỗ nghỉ",
      width: 350,
      headerAlign: 'center',
      align:'center'
    },
    {
      field: "userOwner",
      headerName: "Email tài khoản chủ",
      width: 350,
      headerAlign: 'center',
      align:'center'
    },
    {
      field: "createdAt",
      headerName: "Ngày hoạt động",
      // renderHeader: () => (
      //   <div style={{whiteSpace:'normal'}} className="wrap-Headercontent">
      //     Ngày bắt đầu hoạt động
      //   </div>
      // ),
      width: 115,
      valueGetter: (params) => new Date(params.value).toLocaleDateString('vi-VN'),
      headerAlign: 'center',
      align:'center'

    },
    {
      field: "totalRevenue",
      headerName: "Tổng doanh thu",
      width: 250,
      valueFormatter: (params) => {
        const multipliedValue = params.value * 1000;
        // Định dạng giá trị thành số nguyên
        const formattedValue = new Intl.NumberFormat('vi-VN').format(multipliedValue);
        return `${formattedValue} VND`;
    },
      headerAlign: 'center',
      align:'center'
    },

    {
      field: "commission",
      headerName: "Tiền hoa hồng",
      width: 150,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => {
          // Lấy giá trị của trường "Tổng doanh thu" từ params.row
          const totalRevenue = params.row.totalRevenue;
          if (totalRevenue !== undefined && totalRevenue !== null) {
              return totalRevenue * 0.1*1000; // 15% của giá trị "totalRevenue"
          }
          return null; 
      },
      valueFormatter: (params) => {
          if (params.value !== null) {
              const formattedValue = new Intl.NumberFormat('vi-VN').format(params.value)
              return `${formattedValue} VND`;
          }
          return null; // Trả về null nếu giá trị là null
      }
  }
  
  ]