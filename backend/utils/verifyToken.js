import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// khi login sẽ có 1 token trong cookie, lấy token đó để check
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
      // user chứa chua truong id va isAdmin
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};
export const verifyUser = (req, res, next) => {
    verifyToken(req, res,  () => {
           // req.user chứa chua truong id va isAdmin
      if (req.user.id === req.params.id) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  };

export const verifyUserModifyHotel = (req, res, next) => {
    verifyToken(req, res,  () => {
      // kiểm tra ownerId đẩy lên có giống vs token chứa _id trong cookie kko khi trong API co truong ownerId
      if (req.body.ownerId && req.user.id == req.body.ownerId) {
        next();
      } else {
        return next(createError(403, "Your token not match with ownerId body API or not onwerId in body API"));
      }
    });
  };
  
  

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res,  (err) => {
         // trong req co thuoc tinh user chứa chua truong id va isAdmin
    if (req.user && req.user.isAdmin) {
        // console.log("dat")
      next(); // phải có chữ next
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};


