import React, { Component } from "react";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import QRCode from "react-qr-code";

export default class Home extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      showKeys: false,
      keysStr: "",
      bob_encrypting_key: this.props.encrypting_key,
      bob_verifying_key: this.props.verifying_key,
      button_text: "Show Keys"
    };
    const keys = {
      enc: this.state.bob_encrypting_key,
      ver: this.state.bob_verifying_key,
    };
    this.setState({ keysStr: JSON.stringify(keys) });
    this.handleToggleKeys = this.handleToggleKeys.bind(this);
  }

  handleToggleKeys() {
    if(this.state.showKeys == false) {
      this.setState({ showKeys: true, button_text: "Hide Keys" });
    }
    else {
      this.setState({ showKeys: false, button_text: "Show Keys" });

    }
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "#eeeeee",
          textAlign: "center",
          height: "1500px",
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
                  }}
                >
                  Keys QR code
                </h1>
                <hr />
                <div style={{height: "15px"}}></div>

            <QRCode value={this.state.keysStr} style={{height:"100", width:"100"}} />
            <div style={{ height: "20px" }}></div>
            <Button
              variant="contained"
              color={"primary"}
              onClick={this.handleToggleKeys}
              display={!this.state.showKeys}
            >
              {this.state.button_text}
            </Button>
            <div style={{height: "15px"}}></div>
            { this.state.showKeys == true && 
              <div>
                <hr />

                <h1
                  style={{
                    fontSize: "20px",
                    color: "Black",
                    height: "30px",
                  }}
                >
                  Encrypting Key
                </h1>

                <p>{this.props.encrypting_key}</p>

                <div style={{ height: "15px" }}></div>

                <h1
                  style={{
                    fontSize: "20px",
                    color: "Black",
                    height: "30px",
                  }}
                >
                  Verifying Key
                </h1>

                <p>{this.props.verifying_key}</p>
                <div style={{ height: "50px" }}></div>

              </div>
            }
          </Box>
          <div style={{ height: "100px" }}></div>
        </React.Fragment>
      </div>
    );
  }
}

// export default withStyles(styles(theme))(Home)
