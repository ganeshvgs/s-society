import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },

    name: { type: String, required: true },
    photo: String,

    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: String,
    dob: Date,
    guardian: String,

    occupationType: String,
    employerName: String,
    monthlyIncomeRange: String,

    permanentAddress: String,

    societyNumber: { type: String, unique: true, required: true },
    joiningDate: { type: Date, required: true },
    resignDate: Date,

    role: { type: String, default: "member" },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
