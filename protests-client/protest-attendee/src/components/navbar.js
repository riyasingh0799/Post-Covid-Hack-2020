import React, { Component } from "react";
import {
  Badge,
  Breadcrumb,
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Popover,
  OverlayTrigger,
  Container,
  Row,
  Col
} from "react-bootstrap";
import Box from "@material-ui/core/Box";

export class NavBar extends Component {
  render() {
    return (
      <div>
          <Container style={{height: "100px", width: "100%" }}>
              <Row>
                  <Col xs={6}>
                  <a href="/home">
            <img
              style={{ float: "left", height: "100px", width: "100px" }}
              src={require("../assets/protest.png")}
              alt="Protest"
            />
          </a></Col>
            <Col xs={3}>
            <a href={"/home"}>Home</a>

            </Col>
            <Col xs={3}>
            <a href={"/protests"}>Show Protests</a>

            </Col>

              </Row>
          </Container>
</div>
    );
  }
}

export default NavBar;
