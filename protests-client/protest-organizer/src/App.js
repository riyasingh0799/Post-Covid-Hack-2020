import React, { Component } from "react";
import Protest from './build/contracts/Protest.json';
import getWeb3 from "./getWeb3";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link, Route, BrowserRouter, Switch } from "react-router-dom";
import Home from "./components/Home";
import AddUser from "./components/AddUser";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import IconButton from "@material-ui/core/IconButton";
import GitHubIcon from "@material-ui/icons/GitHub";
import InfoIcon from "@material-ui/icons/Info";
import logo from "./assets/protest.png";
import "./App.css";
import getContractInstance from './getContractInstance';
import axios from "axios"

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    axios.get("http://127.0.0.1:3000/get_policy_key").then((res) => {
      const policy_encrypting_key = res.data.policy_encrypting_key;
      this.setState({
        policy_encrypting_key: policy_encrypting_key,
      });
      console.log(this.state.policy_encrypting_key);
    });

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId)
      const contract = await getContractInstance(web3, Protest, networkId);
      const protestsDataURL = await contract.methods.getProtestDataIpfsUrl().call({from: accounts[0]})
      console.log(protestsDataURL)
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract, protestsDataURL });
      console.log(this.state.accounts[0])

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleUpdateProtestsList = (newURL) => {
    this.setState({ protestsDataURL: newURL });
  };

  render() {
    return (
      <div className="App">
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@900&display=swap"
          rel="stylesheet"
        />

        <BrowserRouter>
          <AppBar position="static" color="primary">
            <div style={{ height: "5px" }}></div>
            {/* <img src="./assets/protest.png" style={{float: "left", height: "30px", width: "30px"}}></img> */}

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
                Organizer
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
              <a href="/add_user">
                <IconButton
                  color="white"
                  component="span"
                  style={{ marginTop: "20px" }}
                >
                  <PersonAddIcon style={{ color: "#ffffff" }} />
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
              component={() => (
                <Home
                  contract={this.state.contract}
                  web3={this.state.web3}
                  accounts={this.state.accounts}
                />
              )}
            />
            <Route path="/add_user" component={() => (
              <AddUser
              contract={this.state.contract}
              web3={this.state.web3}
              accounts={this.state.accounts}/>
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
