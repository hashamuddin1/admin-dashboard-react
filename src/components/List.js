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

export default function List() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const columns = [
    {
      field: "userId",
      headerName: "Full name",
      width: 150,
      renderCell: (params) => params.row.userId.fullName,
    },
    { field: "description", headerName: "Description", width: 150 },
    { field: "baseCity", headerName: "Base City", width: 150 },
    { field: "destinationCity", headerName: "Destination City", width: 150 },
    { field: "receivingDate", headerName: "Receiving Date", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
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
          `${process.env.REACT_APP_BASE_URL_V1}/api/fetchAllList`,
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

  const rowsWithIds = data.map(
    ({
      _id,
      userId,
      description,
      baseCity,
      destinationCity,
      receivingDate,
      price,
    }) => ({
      userId,
      description,
      baseCity,
      destinationCity,
      receivingDate,
      price,
      id: _id,
    })
  );

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
          <h3>All Lists</h3>
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
