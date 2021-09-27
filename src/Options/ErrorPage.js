import { Col } from "react-bootstrap";
import xCircle from "../image/times-circle-solid.svg";
import classes from "./ErrorPage.module.css";

const ErrorPage = (props) => {
  return (
    <>
      <Col xs={4} className={classes.middle}>
        <span className={classes.xIcon}>
          <img src={xCircle} alt="big X"/>
        </span>
      </Col>
      <Col
        xs={8}
        md="auto"
        style={{
          margin: "auto 0",
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>{props.t("error.line1")}</p>
        <p>
        {props.t("error.line2.1")}<span style={{ color: "red" }}>{props.t("error.line2.2")}</span>
        </p>
        <p>
        {props.t("error.line3.1")}
          <span
            onClick={() => {
              props.setModal(false);
              props.setOption("ProjectList");
            }}
            style={{ color: "#4ba1fd", cursor: "pointer" }}
          >
            {props.t("error.line3.2")}
          </span>
        </p>
      </Col>
    </>
  );
};

export default ErrorPage;
