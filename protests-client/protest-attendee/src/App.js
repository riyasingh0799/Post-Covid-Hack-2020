import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import { Link, Route, BrowserRouter, Switch } from "react-router-dom";
import Home from "./components/Home";
import ProtestsPage from "./components/protests";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import GitHubIcon from "@material-ui/icons/GitHub";
import EventNoteIcon from "@material-ui/icons/EventNote";
import InfoIcon from "@material-ui/icons/Info";
import logo from "./assets/protest.png";
import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import axios from "axios";
import Protest from './build/contracts/Protest.json';
import getContractInstance from './getContractInstance';

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {

    var public_keys = await axios.get("http://localhost:3000/get_public_keys")
    .then((res) => {
      console.log(res);
     this.setState({
        id: 1,
        encrypting_key: res.data.bob_encrypting_key,
        verifying_key: res.data.bob_verifying_key
      })
    });

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const contract = await getContractInstance(web3, Protest, networkId);

      const protestsDataURL = null;
      const access_allowed = await contract.methods.usersMapping(this.state.id).call({from: accounts[0]}).access_allowed;
      if (access_allowed) {
        protestsDataURL = await contract.methods.getData(this.state.encrypting_key).call({from: accounts[0]})
      }

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract, protestsDataURL });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@900&display=swap"
          rel="stylesheet"
        />
        <BrowserRouter>
          <AppBar position="static" color="primary">
            <div style={{ height: "5px" }}></div>

            <Typography
              variant="h6"
              color="inherit"
              style={{ fontFamily: "Lato", fontSize: "30px" }}
              noWrap
            >
              <img
                src={logo}
                style={{ height: "40px", width: "40px" }}
                alt=" "
              ></img>
              &nbsp;&nbsp;&nbsp;PRIVATE PROTESTS
            </Typography>
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              style={{ alignItems: "right" }}
            >
              <p
                style={{
                  fontFamily: "Lato",
                  paddingLeft: "20px",
                  paddingRight: "420px",
                  fontSize: "20px",
                }}
              >
                Cause: Black Lives Matter{" "}
              </p>
              <p
                style={{
                  fontFamily: "Lato",
                  paddingRight: "470px",
                  fontSize: "20px",
                }}
              >
                Attendee
              </p>
              <a href="/home">
                <IconButton
                  color="white"
                  component="span"
                  style={{ marginTop: "20px" }}
                >
                  <HomeIcon style={{ color: "#ffffff" }} />
                </IconButton>
              </a>
              <a href="/protests">
                <IconButton
                  color="white"
                  style={{ color: "white" }}
                  component="span"
                  style={{ marginTop: "20px" }}
                >
                  <EventNoteIcon style={{ color: "#ffffff" }} />
                </IconButton>
              </a>
              <a href="https://github.com/riyasingh0799/PCH-Private-Protests">
                <IconButton
                  color="white"
                  component="span"
                  style={{ marginTop: "20px" }}
                >
                  <GitHubIcon style={{ color: "#ffffff" }} />
                </IconButton>
              </a>
              <a href="/">
                <IconButton
                  color="white"
                  component="span"
                  style={{ marginTop: "20px" }}
                >
                  <InfoIcon style={{ color: "#ffffff" }} />
                </IconButton>
              </a>
            </Tabs>
          </AppBar>

          <Switch>
            <Route
              path="/home"
              component={() => <Home encrypting_key = {this.state.encrypting_key} verifying_key = {this.state.verifying_key}/>}
            />
            <Route
              path="/protests"
              component={() => <ProtestsPage contract={this.state.contract} accounts={this.state.accounts} />}
            />
          </Switch>
        </BrowserRouter>


      </div>
    );
  }
}


export default App;
