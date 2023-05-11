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
import { createPoll } from "../../../src/utils/firebase";
const Chat = () => {
  const [OptionA, setOptionA] = useState("");
  const [OptionB, setOptionB] = useState("");
  const [OptionC, setOptionC] = useState("");
  const [OptionD, setOptionD] = useState("");
  const [Question, setQuestion] = useState("");
  const addpoll = () => {
    createPoll(Question, OptionA, OptionB, OptionC, OptionD);
    alert("Poll has been Updated ");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setQuestion("");
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
        <Typography sx={{ fontSize: 20, ml: 70 }} color="text.secondary">
          Add Your Poll Here
        </Typography>
        <TextField
          id="outlined-multiline-static"
          label="Poll Question "
          multiline
          style={{ width: 1300, margin: 10 }}
          align="center"
          variant="outlined"
          value={Question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Grid container justify="flex">
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-multiline-static"
              label="Option A "
              style={{ width: 650 }}
              variant="outlined"
              value={OptionA}
              onChange={(e) => setOptionA(e.target.value)}
            />
            <TextField
              id="outlined-multiline-static"
              label="Option B "
              style={{ width: 640 }}
              variant="outlined"
              value={OptionB}
              onChange={(e) => setOptionB(e.target.value)}
            />
            <TextField
              id="outlined-multiline-static"
              label="Option C "
              style={{ width: 650 }}
              variant="outlined"
              value={OptionC}
              onChange={(e) => setOptionC(e.target.value)}
            />
            <TextField
              id="outlined-multiline-static"
              label="Option D "
              style={{ width: 640 }}
              variant="outlined"
              value={OptionD}
              onChange={(e) => setOptionD(e.target.value)}
            />
          </Box>
        </Grid>

        <Button
          variant="contained"
          sx={{ ml: "520px", mt: "25px" }}
          onClick={addpoll}
        >
          Submit
        </Button>
        {
          <Link to="/checkpoll">
            <Button variant="contained" sx={{ ml: "10px", mt: "25px" }}>
              Check Polls{" "}
            </Button>
          </Link>
        }
      </CardContent>
    </Card>
  );
};

export default Chat;
