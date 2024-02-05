import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import "../App.css";

export default function User() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const columns = [
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "emailAddress", headerName: "Email Address", width: 250 },
    { field: "phoneNumber", headerName: "Phone Number", width: 200 },
    { field: "state", headerName: "State", width: 200 },
    { field: "city", headerName: "City", width: 200 },
    {
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(params.row.id);
          }}
          className="deletedBtn"
          variant="contained"
          sx={{ backgroundColor: "red" }}
        >
          Delete
        </Button>
      ),
    },
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

  const handleDeleteClick = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL_V1}/api/deleteUser`,
        { headers: { "x-access-token": `${token}` }, params: { userId } }
      );

      if (response.data) {
        setData((prevData) => prevData.filter((user) => user._id !== userId));
        showSuccessModal(response.data.message);
      }
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

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
          `${process.env.REACT_APP_BASE_URL_V1}/api/fetchAllUser`,
          {
            headers: {
              "x-access-token": `${token}`,
            },
          }
        );
        if (response.data) {
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

  const rowsWithIds = data.map(
    ({ _id, fullName, emailAddress, phoneNumber, state, city }) => ({
      fullName,
      emailAddress,
      phoneNumber,
      state,
      city,
      id: _id,
    })
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
          <h3>All Users</h3>
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
              autoHeight
              autoHeightSizeMode="fullWidth"
            />
          </div>
        </Box>
      </Box>
    </>
  );
}
