import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import "../App.css";

export default function Issue() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const columns = [
    {
      field: "userIdName",
      headerName: "User Name",
      width: 150,
      renderCell: (params) => params.row.userId.fullName,
    },
    {
      field: "userIdEmail",
      headerName: "User Email",
      width: 150,
      renderCell: (params) => params.row.userId.emailAddress,
    },
    { field: "subject", headerName: "Subject", width: 150 },
    { field: "complain", headerName: "Complain", width: 300 },
  ];

  const SkeletonTable = () => (
    <div style={{ height: 450, width: "100%" }}>
      {[...Array(10)].map((_, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <Skeleton variant="rectangular" height={30} animation="wave" />
        </div>
      ))}
    </div>
  );

  const showSuccessModal = (successMessage) => {
    setSuccess(successMessage);
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
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
          `${process.env.REACT_APP_BASE_URL_V1}/api/fetchIssue`,
          {
            headers: {
              "x-access-token": `${token}`,
            },
          }
        );
        if (response.data.data) {
          setData(response.data.data);
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

  const rowsWithIds = data.map(({ _id, userId, subject, complain }) => ({
    userId,
    userId,
    subject,
    complain,
    id: _id,
  }));

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {success && (
            <Alert variant="filled" severity="success">
              {success}
            </Alert>
          )}
          <h3>All Issues</h3>
          <div style={{ height: 450, width: "100%" }}>
            <DataGrid
              rows={rowsWithIds}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[2, 5, 10]}
              checkboxSelection={false}
            />
          </div>
        </Box>
      </Box>
    </>
  );
}
