import React, { Component } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import swal from "sweetalert";
import Box from "@material-ui/core/Box";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EventIcon from "@material-ui/icons/Event";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import WarningIcon from "@material-ui/icons/Warning";
import ipfs from "../ipfs";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ProtestsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: "",
      protestsDataURL: "",
      showList: "none",
      key: "",
      protestsList: [],
      openAlert: false,
      openLoadingCircle: false,
    };
  }

  componentDidMount = async () => {
    console.ignoredYellowBox = ["Warning: ..."];
    this.setState({ openLoadingCircle: true });

    axios.get("http://localhost:3000/get_public_keys").then(async (res) => {
      console.log(res);
      this.setState({
        key: res.data.bob_encrypting_key,
      });
      if (this.props.contract) this.handleShowInfo();
    });

    this.handleShowInfo = this.handleShowInfo.bind(this);
    this.handleClose = this.handleClose.bind(this);
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      openAlert: false,
    });
  };

  handleShowInfo = async () => {
    var protestsDataURL = "";
    try {
      try {
        protestsDataURL = await this.props.contract.methods
          .getData(this.state.key, 0)
          .call({ from: this.props.accounts[0] });
      } catch (e) {
        console.log(e);
        swal({
          title: "You're not in the verified protesters list!",
          icon: "error",
        });
      }

      console.log(protestsDataURL);
      const ipfs_link = "www.google.com"
      console.log(ipfs_link)
      this.setState({ protestsDataURL, link: ipfs_link });
      var protests = [];
      if (protestsDataURL !== undefined && protestsDataURL.length != 0) {
        var protestsQuery = await ipfs.files.cat(protestsDataURL);

        // protestsList = JSON.parse(protests);
        console.log(JSON.parse(protestsQuery));

        await axios
          .post("http://localhost:3000/retrieve_data", {
            retrieve_query: JSON.parse(protestsQuery),
          })
          .then((res) => {
            var protestsList = JSON.parse(res.data.protest_data);
            console.log(protestsList);
            const listItems = protestsList.map((protest) => (
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
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                  </p>
                  <hr />
                  <EventIcon style={{ fontSize: 20 }} color="primary" />
                  &nbsp;&nbsp;&nbsp;
                  <regular style={{ color: "#666666", fontSize: "12px" }}>
                    DATE AND TIME:{" "}
                  </regular>
                  {protest.protest_date} {protest.protest_time}
                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
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
          });
      }
    } catch (e) {
      console.log(e);
    }

    this.setState({ openLoadingCircle: false });
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
              display: this.state.showList,
            }}
          >
            <h1
              style={{
                fontSize: "20px",
                color: "Black",
                display: this.state.showList,
                height: "30px",
                fontFamily: "Lato",
              }}
            >
              Upcoming Protests
            </h1>

            <hr />

            <p>
              <regular style={{ color: "#666666", fontSize: "12px" }}>
                IPFS CID:{" "}
              </regular>
              <a href = {"https://gateway.ipfs.io/ipfs/"+this.state.protestsDataURL} target="_blank">
              {this.state.protestsDataURL}
              </a>
            </p>

            {this.state.protestsList}
          </Box>
          <div style={{ height: "20px" }}></div>

          <Dialog open={this.state.openLoadingCircle}>
            <DialogTitle id="alert-dialog-title">
              {"Verifying and getting upcoming protests..."}
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

export default ProtestsPage;
