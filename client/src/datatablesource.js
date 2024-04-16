export const roomColumns = [
    { field: "_id", headerName: "ID", width: 100, hide:true },
    {
      field: "title",
      headerName: "Title",
      width: 230,
    },
    {
      field: "desc",
      headerName: "Description",
      width: 300,
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
      align:'center'

    },
    {
      field: "maxPeople",
      headerName: "Max People",
      width: 130,
      align:'center'
    },
    {
      field: "roomCount",
      headerName: "Room Count",
      width: 150,
      align:'center',
      renderCell: (params) => {
          const roomNumbers = params.row.roomNumbers || [];
          return roomNumbers.length;
      }
    }
    
  ];

  // order
  export const ReservationColumns = [
    { field: "username", headerName: "Tài khoản", width: 230 },
    {
      field: "start",
      headerName: "Check-in",
      width: 115,
    },
    {
      field: "end",
      headerName: "Check-out",
      width: 115,
    },
    { field: "hotelName", headerName: "Khách sạn", width: 230 },
  
    {
      field: "totalPrice",
      headerName: "Tổng giá",
      width: 100,
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 100,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 100,
    },

  ];
  