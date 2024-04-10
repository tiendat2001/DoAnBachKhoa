export const roomColumns = [
    { field: "_id", headerName: "ID", width: 100 },
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
    },
    {
      field: "maxPeople",
      headerName: "Max People",
      width: 130,
    },
    {
      field: "roomCount",
      headerName: "Room Count",
      width: 150,
      renderCell: (params) => {
          const roomNumbers = params.row.roomNumbers || [];
          return roomNumbers.length;
      }
    }
    
  ];