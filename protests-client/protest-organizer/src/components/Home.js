import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddSharpIcon from "@material-ui/icons/AddSharp";
import swal from "sweetalert";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EventIcon from "@material-ui/icons/Event";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import WarningIcon from "@material-ui/icons/Warning";
import ipfs from "../ipfs";
import { Buffer } from "buffer";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: "#dedede",
      backgroundColor: "#dedede",
      height: 0.5,
      borderColor: "#dedede",
    }}
  />
);

export default class Home extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      protests: [],
      protestsList: [],
      showList: "hidden",
      openModal: false,
      location: "",
      datetime: "2017-05-24T10:30",
      openLoadingCircle: true,
      instructions: "",
      locationURL: "",
      policy_encrypting_key: "",
      disableButton: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getProtests = this.getProtests.bind(this);
    
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
    console.log(this.state);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submitting new protest");
    this.setState({
      disableButton: true,
    });
    var protests = null;
    var protestsList = [];

    const protestsDataURL = await this.props.contract.methods
      .getProtestDataIpfsUrl()
      .call({ from: this.props.accounts[0] });
    console.log(protestsDataURL);
    if (protestsDataURL.length != 0) {
      protests = await ipfs.files.cat(protestsDataURL);
      protestsList = JSON.parse(protests);
    } else protests = [];

    var protestsdata = protestsList || [];
    var newItem = {
      _key: Date.now(),
      protest_location: this.state.location,
      protest_date: this.state.datetime.split("T")[0],
      protest_time: this.state.datetime.split("T")[1],
      locationURL: this.state.locationURL,
      instructions: this.state.instructions,
    };
    protestsdata.push(newItem);
    console.log(protestsdata);
    const res = await ipfs.files.add(Buffer.from(JSON.stringify(protestsdata)));
    console.log(res[0].hash);

    this.setState({ protestsDataURL: res[0].hash });
    var tx = await this.props.contract.methods
      .addProtests(res[0].hash)
      .send({ from: this.props.accounts[0] });

    console.log(tx)
    
    this.getProtests().then(() => {
      console.log(this.state.protestsList);
    });
    this.setState(this.initialState);
    swal({
      title: "Protest created!",
      icon: "success",
    });
    this.handleClose();
  };

  handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      disableButton: false,
    });
  };

  getProtests = async () => {
    console.log(this.props.contract)
    const protestsDataURL = await this.props.contract.methods
      .getProtestDataIpfsUrl()
      .call({ from: this.props.accounts[0] });
    console.log(protestsDataURL);
    var protests = [];
    var protestsList;
    if (protestsDataURL!==undefined && protestsDataURL.length != 0) {
      protests = await ipfs.files.cat(protestsDataURL);
      protestsList = JSON.parse(protests);
      console.log(protestsList)
      const listItems = await protestsList.map((protest) => (
        <ListItem key={protest._key} style={{ display: "block" }}>
          <Paper
            elevation={3}
            style={{ textAlign: "left", margin: "2%", padding: "2%" }}
          >
            <div style={{ height: "10px" }}></div>
            <p>
              <regular style={{ color: "#666666", fontSize: "12px" }}>
                PROTEST ID:{" "}
              </regular>
              {protest._key}
            </p>
            <hr />
            <EventIcon style={{ fontSize: 20 }} color="primary" />
            &nbsp;&nbsp;&nbsp;
            <regular style={{ color: "#666666", fontSize: "12px" }}>
              DATE AND TIME:{" "}
            </regular>
            {protest.protest_date} {protest.protest_time}
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <LocationOnIcon style={{ fontSize: 20 }} color="primary" />
            &nbsp;&nbsp;&nbsp;
            <regular style={{ color: "#666666", fontSize: "12px" }}>
              LOCATION:{" "}
            </regular>
            {protest.protest_location}&nbsp;&nbsp;&nbsp;
            <a href={protest.locationURL} target="_blank">
              <OpenInNewIcon style={{ fontSize: 20 }} color="primary" />
            </a>
            <div style={{ height: "10px" }}></div>
            <WarningIcon style={{ fontSize: 20 }} color="primary" />
            &nbsp;&nbsp;&nbsp;
            <regular style={{ color: "#666666", fontSize: "12px" }}>
              INSTRUCTIONS:{" "}
            </regular>
            {protest.instructions}
            <div style={{ height: "10px" }}></div>
          </Paper>
        </ListItem>
      ));
      this.setState({
        protestsList: listItems,
        showList: "block",
        openLoadingCircle: false,
      });
      console.log(this.state.protestsList);
    } else {
      console.log("No data yet");
      this.setState({ openLoadingCircle: false });
    }
  };


  componentDidMount= async() => {
    axios.get("http://127.0.0.1:3000/get_policy_key").then( (res) => {
      const policy_encrypting_key = res.data.policy_encrypting_key;
      this.setState({
        policy_encrypting_key: policy_encrypting_key,
      });
      console.log(this.state.policy_encrypting_key);
    });
    this.setState({ openLoadingCircle: true});
    if(this.props.contract)
      this.getProtests()
  }

  handleOpen() {
    this.setState({
      openModal: true,
    });
    console.log(this.state.openModal);
  }

  handleClose() {
    this.setState({
      openModal: false,
    });
    console.log(this.state.openModal);
  }

  render() {
    
    const vertical = "top";
    const horizontal = "right";

    return (
      <div
        style={{
          backgroundColor: "#eeeeee",
          textAlign: "center",
          height: "1000px",
        }}
      >
        <React.Fragment>
          <Dialog
            open={this.state.openModal}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Create Protest</DialogTitle>
            <DialogContent>
              <InputLabel htmlFor="location" style={{ fontSize: "13px" }}>
                Location:
              </InputLabel>
              <Input
                id="location"
                value={this.state.location}
                onChange={(e) => this.setState({ location: e.target.value })}
                style={{ width: "250px" }}
              />

              <div style={{ height: "10px" }}></div>

              <InputLabel htmlFor="locationURL" style={{ fontSize: "13px" }}>
                Location URL:
              </InputLabel>
              <Input
                id="locationURL"
                value={this.state.locationURL}
                onChange={(e) => this.setState({ locationURL: e.target.value })}
                style={{ width: "250px" }}
              />

              <div style={{ height: "10px" }}></div>

              <TextField
                id="datetime"
                value={this.state.datetime}
                label="Date Time"
                type="datetime-local"
                // defaultValue="2017-05-24T10:30"
                onChange={(e) => this.setState({ datetime: e.target.value })}
                // className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div style={{ height: "10px" }}></div>

              <InputLabel htmlFor="instructions" style={{ fontSize: "13px" }}>
                Special Instructions:
              </InputLabel>
              <Input
                id="location"
                value={this.state.instructions}
                onChange={(e) =>
                  this.setState({ instructions: e.target.value })
                }
                style={{ width: "250px" }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={this.handleSubmit}
                disabled={this.state.disableButton}
                color="primary"
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>

          <div style={{ height: "20px" }}></div>
          <Box
            style={{
              padding: "20px",
              margin: "auto",
              borderRadius: "5px",
              backgroundColor: "white",
              width: "80%",
              display: this.state.showQueries,
            }}
          >
            <h1
              style={{
                fontSize: "20px",
                color: "Black",
                height: "30px",
                fontFamily: "Lato",
              }}
            >
              UPCOMING PROTESTS
            </h1>

            <hr />

            {this.state.protestsList}
          </Box>

          <div style={{ height: "20px" }}></div>

          <Button
            variant="contained"
            color={"primary"}
            startIcon={<AddSharpIcon />}
            onClick={this.handleOpen}
          >
            Create Protest
          </Button> 
          {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}

          {/* <Button 
            variant="contained"
            color={"primary"}
            startIcon={<AddSharpIcon />}
            onClick={this.handleOpen}
          >
            Create Notif
          </Button> */}

          <div style={{ height: "20px" }}></div>
          {/* <p>Policy Encrypting Key: {this.state.policy_encrypting_key}</p>
      <div style={{ height: "50px" }}></div> */}

          {/* 
        <Snackbar 
        anchorOrigin={{ vertical, horizontal }}          
        open={this.state.openAlert} autoHideDuration={6000} onClose={this.handleCloseAlert}>
                <Alert onClose={this.handleCloseAlert} severity="success">
                    New protest event created!
                </Alert>
            </Snackbar> */}

          <Dialog open={this.state.openLoadingCircle}>
            <DialogTitle id="alert-dialog-title">
              {"Getting Upcoming Protests..."}
            </DialogTitle>
            <DialogContent style={{ textAlign: "center" }}>
              <CircularProgress color="inherit" />
              <div style={{ height: "10px" }}></div>
            </DialogContent>
          </Dialog>
        </React.Fragment>
      </div>
    );
  }
}

// export default withStyles(styles(theme))(Home)
