import { useState } from "react";

import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";
import { resetStage } from "../features/canvas/stageSlice";
import { resetCanvas } from "../features/canvas/canvasSlice";

const Navbar = () => {
  const userData = useSelector(selectCurrentUser);
  const [logoutFromUevent] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(resetStage());
    dispatch(resetCanvas());
    navigate("/edit");
    try {
      await logoutFromUevent().unwrap();
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{ background: "linear-gradient(to right, #3f51b5, #f50057)" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          component={Link}
          to="/"
          sx={{
            whiteSpace: "nowrap",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          WEBSTER
        </Typography>
        <Stack direction="row" spacing={2}>
          {userData ? (
            <>
              <Button
                onClick={() => navigate("/canvases")}
                color="info"
                variant="contained"
              >
                All Canvases
              </Button>
              <Button
                onClick={handleLogout}
                color="warning"
                variant="contained"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/signup")}
                color="info"
                variant="contained"
              >
                Sign Up
              </Button>
              <Button
                onClick={() => navigate("/login")}
                color="info"
                variant="contained"
              >
                Login
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
