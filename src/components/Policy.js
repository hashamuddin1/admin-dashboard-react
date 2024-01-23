import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import "../App.css";

const SkeletonTable = () => (
  <div style={{ height: 450, width: "100%" }}>
    {[...Array(10)].map((_, index) => (
      <div key={index} style={{ marginBottom: 10 }}>
        <Skeleton variant="rectangular" height={30} animation="wave" />
      </div>
    ))}
  </div>
);

export default function Policy() {
  const [policy, setPolicy] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const changePolicy = (value) => {
    setPolicy(value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL_V1}/api/getTermsAndCondition`,
          {
            headers: {
              authorization: `${token}`,
            },
            params: {
              policyType: "privacyPolicy",
            },
          }
        );
        if (response.data.data) {
          setPolicy(response.data.data.content);
          console.log(response.data.data);
          setIsLoading(false);
        }
      } catch (error) {
        setError(error);
        setIsLoading(false);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (isLoading) {
    return (
      <>
        <Box sx={{ display: "flex" }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <SkeletonTable />
          </Box>
        </Box>
      </>
    );
  }

  const submitResult = async (event) => {
    event.preventDefault();

    try {
      setIsCreateLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL_V1}/api/createTermsAndCondition`,
        {
          content: policy,
        },
        {
          headers: {
            "x-access-token": `${token}`,
          },
        }
      );
      console.log(response);
      setIsCreateLoading(false);
      return showSuccessModal(response.data.message);
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      setCreateError(message);
      setIsCreateLoading(false);
      return simulateError(message);
    }
  };

  const showSuccessModal = (successMessage) => {
    setSuccess(successMessage);
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const simulateError = (errorMessage) => {
    setCreateError(errorMessage);
    setTimeout(() => {
      setCreateError(null);
    }, 3000);
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {createError && (
            <Alert variant="filled" severity="error">
              {createError}
            </Alert>
          )}

          {success && (
            <Alert variant="filled" severity="success">
              {success}
            </Alert>
          )}
          <h3>Create Policy</h3>
          <ReactQuill theme="snow" value={policy} onChange={changePolicy} />
          <Button
            sx={{ mt: 2, mb: 4 }}
            variant="contained"
            onClick={submitResult}
            className="submitBtn"
          >
            {isCreateLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </Box>
    </>
  );
}
