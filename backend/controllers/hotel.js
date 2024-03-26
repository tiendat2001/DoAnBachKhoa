import Hotel from "../models/Hotel.js"
// import Room from "../models/RoomType.js"

// viet xu ly khi goi api
export const createHotel = async (req,res,next)=>{
    const newHotel = new Hotel(req.body)
    
    try {
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    } catch (err) {
        next(err)
    }
}

export const updateHotel = async (req,res,next)=>{
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json(updatedHotel)
    } catch (err) {
        next(err)
    }
}
export const deleteHotel = async (req,res,next)=>{
    try {
        await Hotel.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json("Hotel has been deleted.")
    } catch (err) {
        next(err)
    }
}
export const getHotels = async (req,res,next)=>{
    const {min, max, name, city, ...others } = req.query;
    try {
      const query = {
        ...others,
        cheapestPrice: { $gte: min || 1, $lte: max || 999 },
      };

      if (name && name !== '') {
        query.name = { $regex: name, $options: 'i' };
      }

      if (city && city !== '') {
        query.city = { $regex: city, $options: 'i' };
      }
      const hotels = await Hotel.find(query).limit(req.query.limit);
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }

}

export const getHotelById = async (req,res,next)=>{
    try {
        const hotelById = await Hotel.findById(req.params.id) // thong tin lay tu body cua req
        res.status(200).json(hotelById)
    } catch (err) {
        res.status(500).json(error)
    }
}

export const countByCity = async (req,res,next)=>{
    // truy cap vao param trong api, dung req.query, trừ khi api đc định nghĩa tham số sẵn, kiểu :id, thì dùng req.params
    const cities = req.query.cities.split(",")
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({city:city})
        }))
        res.status(200).json(list);
    } catch (err) {
        next(err)
    }
}

export const countByType = async (req, res, next) => {
    try {
      const hotelCount = await Hotel.countDocuments({ type: "hotel" });
      const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
      const resortCount = await Hotel.countDocuments({ type: "resort" });
      const villaCount = await Hotel.countDocuments({ type: "villa" });
      const cabinCount = await Hotel.countDocuments({ type: "cabin" });
  
      res.status(200).json([
        { type: "hotel", count: hotelCount },
        { type: "apartments", count: apartmentCount },
        { type: "resorts", count: resortCount },
        { type: "villas", count: villaCount },
        { type: "cabins", count: cabinCount },
      ]);
    } catch (err) {
      next(err);
    }
};

