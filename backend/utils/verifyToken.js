import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

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
        console.log("dast")
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  };
  
  

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res,  (err) => {
         // trong req co thuoc tinh user chứa chua truong id va isAdmin
    if (req.user && req.user.isAdmin) {
        // console.log("dat")
      next(); // Allow admin to proceed
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

