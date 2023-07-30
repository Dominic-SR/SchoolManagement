import { Container, Grid, Box, TextField, Button } from "@mui/material";
import React from "react";
import Loginimg from "../assests/Images/Loginpageimg.jpg";
import { Link } from "react-router-dom";
export default function Login() {
  return (
    <>
      <div className="Login-container">
        <Container
          maxWidth={false}
          className="shadow-box "
          sx={{
            padding: "200px",
            width: "1100px",
            borderRadius: "15px",
          }}
        >
          <Grid container spacing={0} sx={{ marginTop: "70px" }}>
            <Grid item xs={6}>
              <img src={Loginimg} style={{ width: "100%" }} />
            </Grid>

            <Grid item xs={6} sx={{ paddingLeft: "50px" }}>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  width: "100%",
                }}
              >
                <h1>Login</h1>
                <TextField
                  label="Username"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  required
                  fullWidth
                />
                <Link to='/home'>
                <Button
                  variant="contained"
                  type="submit"
                  className="btn-main"
                  sx={{
                    width: "130px",
                    paddingY: "13px",
                  }}
                >
                  Login
                </Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}
