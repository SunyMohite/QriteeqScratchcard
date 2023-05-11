import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Margin } from "@mui/icons-material";
import firebase from "firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
//  import "firebase/firestore";
import { createreward } from "../../../src/utils/firebase";
const Rewards = () => {
  const [Amount, setAmount] = useState("");
  const [Coupan, setCoupan] = useState("");
  //   const [OptionC, setOptionC] = useState("");
  //   const [OptionD, setOptionD] = useState("");
  //   const [Question, setQuestion] = useState("");
  const addreward = () => {
    createreward(Amount, Coupan);
    alert("Amount Added Sucessfully  ");
  };
  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  // export default function BasicCard() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 20, ml: 70 }} color="black">
          Polls
        </Typography>

        <Grid container justify="flex">
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          ></Box>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Rewards;
