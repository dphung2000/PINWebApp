import { Col } from "react-bootstrap";
import xCircle from "../image/times-circle-solid.svg";
import classes from "./ErrorPage.module.css";

const ErrorPage = (props) => {
  return (
    <>
      <Col xs={4} className={classes.middle}>
        <span className={classes.xIcon}>
          <img src={xCircle} />
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
        <p>Unexpected error occurred</p>
        <p>
          Please <span style={{ color: "red" }}>contact your administator</span>
        </p>
        <p>
          Or{" "}
          <span
            onClick={() => {
              props.setModal(false);
              props.setOption("ProjectList");
            }}
            style={{ color: "#4ba1fd", cursor: "pointer" }}
          >
            back to search project
          </span>
        </p>
      </Col>
    </>
  );
};

export default ErrorPage;
