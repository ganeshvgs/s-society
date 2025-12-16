import express from "express";
import { addMember, getMembers, getMember, updateMember, deleteMember } from "../controllers/memberController.js";
import { uploadSingleImage } from "../middlewares/upload.js";
import { requireAuthWithRole } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", requireAuthWithRole(["admin"]), uploadSingleImage, addMember);
router.get("/", requireAuthWithRole(["admin"]), getMembers);
router.get("/:id", requireAuthWithRole(["admin", "member"]), getMember);
router.put("/:id", requireAuthWithRole(["admin"]), uploadSingleImage, updateMember);
router.delete("/:id", requireAuthWithRole(["admin"]), deleteMember);

export default router;
