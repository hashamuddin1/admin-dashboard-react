import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import fypLogo from "../assets/images/fypLogo.jpeg";
import { Container } from "@mui/material";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const changeEmailAddress = (event) => {
    setEmailAddress(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  const submitResult = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    try {
      if (emailAddress === "" || password === "") {
        setIsLoading(false);
        return simulateError("First Fill All The Fields");
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL_V1}/api/userSignIn`,
        {
          emailAddress,
          password,
        }
      );
      if (response.data.success === true) {
        const token = response.data.token;

        const checkToken = localStorage.getItem("token");
        if (checkToken) {
          localStorage.removeItem("token");
        }

        localStorage.setItem("token", token);
        setIsLoading(false);
        return showSuccessModal("Admin Login Successfully");
      }
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      setIsLoading(false);
      return simulateError(message);
    }
  };

  const showSuccessModal = (successMessage) => {
    setSuccess(successMessage);
    setTimeout(() => {
      setSuccess(null);
      navigate("/");
    }, 3000);
  };

  const simulateError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <>
      <Container>
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="filled" severity="success">
            {success}
          </Alert>
        )}
        <Grid
          container
          spacing={3}
          sx={{
            alignContent: "center",
            display: "flex",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Grid item xs={12} sm={12} lg={6} md={6}>
            <Box
              style={{
                marginTop: "2px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography component="h1" variant="h4">
                Sign In
              </Typography>
            </Box>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <TextField
                    required
                    fullWidth
                    id="emailAddress"
                    label="Email Address"
                    name="emailAddress"
                    value={emailAddress}
                    onChange={changeEmailAddress}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    autoComplete="off"
                    value={password}
                    onChange={changePassword}
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    className="submitBtn"
                    variant="contained"
                    onClick={submitResult}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={false} sm={false} lg={6} md={6}>
            <Box
              style={{
                backgroundImage: `url(${fypLogo})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
