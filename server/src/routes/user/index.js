import express from "express";
import {
  getUser,
  updateUser,
  getAllUsers,
  follow,
  unfollow,
} from "../../controllers/user/index.js";
import authMiddleWare from "../../middleware/index.js";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", authMiddleWare, updateUser);
router.post("/", getAllUsers);
router.put("/:id/follow", authMiddleWare, follow);
router.put("/:id/unfollow", authMiddleWare, unfollow);

export default router;
