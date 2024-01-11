import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL_V1}/api/dashBoardKPI`,
          {
            headers: {
              "x-access-token": `${token}`,
            },
          }
        );
        console.log(response.data);
        if (response.data) {
          setData(response.data);
          console.log(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setError(error);
        setIsLoading(false);
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
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <Grid item key={item} xs={12} md={12} lg={4}>
                  <Card>
                    <Skeleton
                      variant="rectangular"
                      height={150}
                      animation="wave"
                    />
                    <CardContent>
                      <Typography variant="h5" component="div">
                        <Skeleton width="80%" animation="wave" />
                      </Typography>
                      <Typography>
                        <Skeleton width="60%" animation="wave" />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </>
    );
  }
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={4}>
              <Card sx={{ backgroundColor: "green", color: "white" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Total Users
                  </Typography>
                  <Typography sx={{ mb: 1.5 }}>{data.totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12} lg={4}>
              <Card sx={{ backgroundColor: "blue", color: "white" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Total Active List
                  </Typography>
                  <Typography sx={{ mb: 1.5 }}>
                    {data.totalActiveList}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <Card sx={{ backgroundColor: "purple", color: "white" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Total Pending List
                  </Typography>
                  <Typography sx={{ mb: 1.5 }}>
                    {data.totalPendingList}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <Card sx={{ backgroundColor: "red", color: "white" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Total Issues
                  </Typography>
                  <Typography sx={{ mb: 1.5 }}>{data.totalIssue}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <Card sx={{ backgroundColor: "#60698A", color: "white" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Total Roles
                  </Typography>
                  <Typography sx={{ mb: 1.5 }}>{data.totalRoles}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <Card sx={{ backgroundColor: "#900C3F", color: "white" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Total Turn Over
                  </Typography>
                  <Typography sx={{ mb: 1.5 }}>{data.totalTurnOver}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
