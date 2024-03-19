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
    try {
        const hotels = await Hotel.find() // thong tin lay tu body cua req
        res.status(200).json(hotels)
    } catch (err) {
        res.status(500).json(error)
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

