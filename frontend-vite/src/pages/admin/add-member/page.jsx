"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  InputLabel,
  FormControl,
  Avatar,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Upload, PersonAdd } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export default function AdminAddMember() {
  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    guardian: "",
    occupationType: "",
    employerName: "",
    monthlyIncomeRange: "",
    permanentAddress: "",
    joiningDate: "",
    societyNumber: "",
    role: "member",
    status: "active",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files?.[0];
      if (!file) return;
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value);
      }
    });

    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/members/add`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessOpen(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        guardian: "",
        occupationType: "",
        employerName: "",
        monthlyIncomeRange: "",
        permanentAddress: "",
        joiningDate: "",
        societyNumber: "",
        role: "member",
        status: "active",
        photo: null,
      });
      setPreview(null);
    } catch (err) {
      console.error(err);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 1000,
          mx: "auto",
          mt: 4,
          p: 4,
          background: "#f8fafc",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          display="flex"
          alignItems="center"
          gap={1}
          color="#1e293b"
        >
          <PersonAdd /> Add Member
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* BASIC INFO */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  label="Gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Guardian / Spouse"
                name="guardian"
                value={formData.guardian}
                onChange={handleChange}
              />
            </Grid>

            {/* OCCUPATION */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Occupation Type</InputLabel>
                <Select
                  name="occupationType"
                  label="Occupation Type"
                  value={formData.occupationType}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Government">Government</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Farmer">Farmer</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Employer / Business Name"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Monthly Income</InputLabel>
                <Select
                  name="monthlyIncomeRange"
                  label="Monthly Income"
                  value={formData.monthlyIncomeRange}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Below 10,000">Below ₹10,000</MenuItem>
                  <MenuItem value="10,000 - 25,000">₹10,000 - ₹25,000</MenuItem>
                  <MenuItem value="25,000 - 50,000">₹25,000 - ₹50,000</MenuItem>
                  <MenuItem value="Above 50,000">Above ₹50,000</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* ADDRESS */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Permanent Address"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
              />
            </Grid>

            {/* SOCIETY */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Society Number"
                name="societyNumber"
                value={formData.societyNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Joining Date"
                name="joiningDate"
                value={formData.joiningDate}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* PHOTO */}
            <Grid size={{ xs: 12 }} display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
              >
                Upload Photo
                <input
                  hidden
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </Button>

              {preview && (
                <Avatar src={preview} sx={{ width: 56, height: 56 }} />
              )}
            </Grid>

            {/* SUBMIT */}
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: "bold",
                  ":hover": { background: "#1d4ed8" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Add Member"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* SUCCESS MESSAGE */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success" variant="filled">
          ✅ Member added successfully
        </Alert>
      </Snackbar>

      {/* ERROR MESSAGE */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
      >
        <Alert severity="error" variant="filled">
          ❌ Failed to add member
        </Alert>
      </Snackbar>
    </>
  );
}
