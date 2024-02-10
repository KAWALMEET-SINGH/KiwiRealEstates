import express from "express"
import { deleteUser, test, updateUser ,getUserListing,getUserInfo} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser)
router.get("/listings/:id",verifyToken,getUserListing)
router.delete("/delete/:id", verifyToken, deleteUser)
router.get("/:id",verifyToken,getUserInfo)


export default router;