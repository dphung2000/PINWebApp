import { useState } from "react";
import { Container, Navbar, Nav} from "react-bootstrap";
import logo from "../image/elca.png";
import classes from "./Header.module.css";

const Header = (props) => {
  const [lang, setLang] = useState("EN");
  const toEN = () => {
    props.i18n.changeLanguage("en");
    console.log("Changed to EN");
    if (lang !== "EN") setLang("EN"); 
  }
  const toFR = () => {
    props.i18n.changeLanguage("fr");
    console.log("Changed to FR");
    if (lang !== "FR") setLang("FR");
  }
  // return <header>Project Information Management</header>
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container fluid>
        <Navbar.Brand href=".">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "200px", heigh: "200px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item className={classes["header-text"]}>
              <h3>{props.t("header.PIMTitle")}</h3>
            </Nav.Item>
          </Nav>
          <Nav.Item className={classes["header-text"]}>
              <button style={{color: lang === "EN" ? "#4ba1fd" : "black"}} onClick={toEN}>EN</button>
              <span>|</span>
              <button style={{color: lang === "FR" ? "#4ba1fd": "black"}} onClick={toFR}>FR</button>
              <button>{props.t("header.Help")}</button>
              <button>{props.t("header.Logout")}</button>
          </Nav.Item>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
