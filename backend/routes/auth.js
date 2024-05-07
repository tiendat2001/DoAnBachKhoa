import express from "express"
import { register,login,logout,checkHasToken,checkHasAccessTokenAdministrator } from "../controllers/auth.js";
import { verifyAdmin,verifyUserModifyHotel,verifyToken } from "../utils/verifyToken.js";

const router = express.Router()

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
// check có access token ko
router.get("/checkHasAccessToken",verifyToken,checkHasToken);
// check có access token ko và token đấy phải có isAdmin là true
router.get("/checkHasAccessTokenAdministrator",verifyAdmin,checkHasAccessTokenAdministrator);

export default router