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
import { createreward, getrewarddetails,setMarkClaimed } from "../../../src/utils/firebase";

const Rewards = () => {
  const [Amount, setAmount] = useState("");
  const [Coupan, setCoupan] = useState("");
  const [Data, setData] = useState({});
  const [showRewardData,setShowRewardData] = useState(false);
  const [Rewardarr, setRewardarr] = useState("");
  const getrewarddetial = async (Id) => {
    // getrewarddetails("852023");

    const data = await getrewarddetails(Id);
    // console.log(data.Id);
    // console.log(data.MobNo);
    setData(data);
    setShowRewardData(true);
    console.log(Data);
  };
  const [Docid, setDocid] = useState("");
  const addreward = () => {
    // let RewardId=Date.now();
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    let RewardId = `${date}${month}${year}`;
    console.log(RewardId);

    let Index = 0;
    // let RewardValue=Array(45,55,65);
    let isActive = true;
    let TimeStamp = Date();

    let array1 = Rewardarr.split(",");
    let arrayOfNumbers = array1.map(Number);

    let amt = parseInt(Amount);
    createreward(amt, RewardId, Index, arrayOfNumbers, isActive, TimeStamp);
    alert("Amount Added Sucessfully  ");
    setAmount("");
    setRewardarr("");
    console.log(Rewardarr);
    Index++;
  };

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  const RewardValue = () => {
    let x = 0;
    RewardValue[x] = document.getElementById("RewardValue").value;
    x++;
  };
  const markClaimed=()=>{
      setMarkClaimed(Data.Id);
  }
  // export default function BasicCard() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 20, ml: 70 }} color="black">
          Add Reward Amount
        </Typography>
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
              id="Amount"
              type="Number"
              label="Amount "
              style={{ width: 200, marginLeft: 380 }}
              variant="outlined"
              value={Amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextField
              id="Rewardval"
              label="Reward Value "
              style={{ width: 200 }}
              variant="outlined"
              value={Rewardarr}
              onChange={(e) => setRewardarr(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{ ml: "10px", mt: "15px" }}
              onClick={addreward}
            >
              Add Amount
            </Button>
          </Box>
        </Grid>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 20, ml: 70 }} color="black">
              Validate Amount
            </Typography>
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
                  label="Enter ID "
                  style={{ width: 200, marginLeft: 440 }}
                  variant="outlined"
                  value={Docid}
                  onChange={(e) => setDocid(e.target.value)}
                />

                <Button
                  onClick={() => getrewarddetial(Docid)}
                  variant="contained"
                  sx={{ ml: "10px", mt: "15px" }}
                >
                  Validate
                </Button>
              </Box>
            </Grid>
           {showRewardData? <div>
              <label
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginLeft: "500px",
                }}
              >
                User ID:
              </label>{" "}
              <label>{Data.Id}</label>
              <br />
              <label
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginLeft: "500px",
                }}
              >
                Name:
              </label>{" "}
              <label>{Data.UserName}</label>
              <br />
              <label
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginLeft: "500px",
                }}
              >
                Amount:
              </label>{" "}
              <label>{Data.Amount}</label>
              <br />
              <label
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginLeft: "500px",
                }}
              >
                Mobile Number:
              </label>{" "}
              <label>{Data.MobNo}</label>
              <br />
              <label
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  marginLeft: "500px",
                }}
              >
                Rewarded:
              </label>{" "}
              <label>{Data.RewardClaimed?"Yes":"No"}</label>
              <br />
              {Data.RewardClaimed?"":
              <Button variant="contained" sx={{ ml: "550px", mt: "20px" }} onClick={markClaimed}>
                Confirm Claim
              </Button>}
            </div>:""}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default Rewards;
