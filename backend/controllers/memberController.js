import Member from "../models/memberModel.js";
import cloudinary from "../config/cloudinary.js";
import { clerkClient } from "@clerk/express";

// -------------------- ADD MEMBER --------------------
export const addMember = async (req, res) => {
  try {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "societyNumber",
      "joiningDate",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Create Clerk user
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [req.body.email],
      publicMetadata: { role: req.body.role || "member" },
    });

    const member = new Member({
      ...req.body,
      clerkId: clerkUser.id,
      photo: req.file?.cloudinaryUrl || null,
      status: req.body.resignDate ? "closed" : req.body.status || "active",
    });

    await member.save();

    res.status(201).json(member);
  } catch (err) {
    console.error("Add Member Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------- GET MEMBERS --------------------
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Helper function
const findMemberByIdOrClerk = async (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    const member = await Member.findById(id);
    if (member) return member;
  }
  return await Member.findOne({ clerkId: id });
};

// -------------------- GET SINGLE MEMBER --------------------
export const getMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await findMemberByIdOrClerk(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    console.error("Get Member Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      email,
      role,
      joiningDate,
      resignDate,
      societyNumber,
      status,
      ...rest
    } = req.body;

    const member = await findMemberByIdOrClerk(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const userId = member.clerkId;

    // ---------- EMAIL UPDATE ----------
    if (email && email !== member.email) {
      const newEmail = await clerkClient.emailAddresses.createEmailAddress({
        userId,
        emailAddress: email,
        verified: true,
        primary: true,
      });

      const clerkUser = await clerkClient.users.getUser(userId);
      const oldEmail = clerkUser.emailAddresses.find(
        (e) => e.emailAddress === member.email
      );

      if (oldEmail) {
        await clerkClient.emailAddresses.deleteEmailAddress(oldEmail.id);
      }

      member.email = email;
    }

    // ---------- ROLE UPDATE ----------
    if (role && role !== member.role) {
      const allowedRoles = ["member", "secretary", "treasurer", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      await clerkClient.users.updateUser(userId, {
        publicMetadata: { role },
      });

      member.role = role;
    }

    // ---------- PHOTO UPDATE ----------
    if (req.file?.cloudinaryUrl) {
      if (member.photo) {
        const publicId = member.photo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`kpt society users/${publicId}`);
      }
      member.photo = req.file.cloudinaryUrl;
    }

    // ---------- OTHER FIELDS ----------
    if (joiningDate) member.joiningDate = joiningDate;
    if (societyNumber) member.societyNumber = societyNumber;

    if (resignDate) {
      member.resignDate = resignDate;
      member.status = "closed";
    } else if (status) {
      member.status = status;
    }

    Object.assign(member, rest);

    await member.save();

    res.json({
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    console.error("Update Member Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// -------------------- DELETE MEMBER --------------------
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await findMemberByIdOrClerk(id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (member.clerkId) {
      await clerkClient.users.deleteUser(member.clerkId);
    }

    if (member.photo) {
      const publicId = member.photo.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`kpt society users/${publicId}`);
    }

    await member.deleteOne();
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Delete Member Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
