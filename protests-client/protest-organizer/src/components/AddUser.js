import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import AddSharpIcon from "@material-ui/icons/AddSharp";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";
import ipfs from "../ipfs";
import { Buffer } from "buffer";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class EnterProtester extends Component {
  constructor(props) {
    super(props);
    this.state = {
      encrypting_key: "",
      disableButton: false,
      //   openAlert: false,
    };
  }

  componentDidMount = async() => {

    if(this.props.contract)
    {
      console.log("hey")
      const users = await this.props.contract.methods
        .totalUsers
        .call({ from: this.props.accounts[0] });
        ;
      console.log(users);
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("entering new protester");
    this.setState({
      disableButton: true,
    });

    try {
      const protestsDataURL = await this.props.contract.methods
        .getProtestDataIpfsUrl()
        .call({ from: this.props.accounts[0] });
      console.log(protestsDataURL);
      var protests = [];
      var protestsList;
      if (protestsDataURL.length != 0) {
        protests = await ipfs.files.cat(protestsDataURL);
        protestsList = JSON.parse(protests);

        var res = await axios.post(
          "http://127.0.0.1:3000/grant_access_to_protest_info",
          {
            encrypting_key: this.state.encrypting_key,
            verifying_key: this.state.verifying_key,
            protests: protestsList,
          }
        );
        console.log(res.data);
        const resURL = await ipfs.files.add(
          Buffer.from(JSON.stringify(res.data))
        );

        console.log(resURL[0].hash)
        const userid = await this.props.contract.methods
          .addUser(this.state.encrypting_key, this.state.verifying_key, resURL[0].hash)
          .call({ from: this.props.accounts[0] })
          console.log(userid)
        await this.props.contract.methods
          .addUser(this.state.encrypting_key, this.state.verifying_key, resURL[0].hash)
          .send({ from: this.props.accounts[0] })
          .then((res) => {
            console.log(res);
            swal({
              title: "Protester's public keys added!",
              icon: "success",
            });
            this.setState({
              key: "",
              disableButton: false,
              // openAlert: true,
            });
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      //   openAlert: false,
    });
  };

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
                paddingBottom: "10px",
              }}
            >
              Enter Public Keys
            </h1>

            <form>
              {/* <InputLabel htmlFor="protester-name" style={{ fontSize: "13px" }}>
            
          </InputLabel> */}
              <TextField
                id="protester-id"
                value={this.state.key}
                label="Protester's Encrypting Key"
                variant="outlined"
                style={{ width: "250px", paddingRight: "50px" }}
                onChange={(e) =>
                  this.setState({ encrypting_key: e.target.value })
                }
              />

              <TextField
                id="protester-id"
                value={this.state.key}
                label="Protester's Verifying Key"
                variant="outlined"
                style={{ width: "250px" }}
                onChange={(e) =>
                  this.setState({ verifying_key: e.target.value })
                }
              />

              <div style={{ height: "20px" }}></div>
              <Button
                variant="contained"
                color={"primary"}
                startIcon={<AddSharpIcon />}
                onClick={this.handleSubmit}
                disabled={this.state.disableButton}
              >
                Add
              </Button>
            </form>

            <div style={{ height: "20px" }}></div>
          </Box>

          {/* <Snackbar
        anchorOrigin={{ vertical, horizontal }}          
          open={this.state.openAlert}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <Alert onClose={this.handleClose} severity="success">
            Protester's public key added!
          </Alert>
        </Snackbar> */}
        </React.Fragment>
        <div style={{ height: "20px" }}></div>
      </div>
    );
  }
}

export default EnterProtester;
