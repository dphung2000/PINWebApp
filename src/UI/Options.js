import { Col, Row, Collapse, Button } from "react-bootstrap";
import classes from "./Options.module.css";
import { useState } from "react";

const Options = (props) => {
  const [open, setOpen] = useState(false);
  const chooseProjectList = () => {props.chooseOption("ProjectList")}
  const chooseProject = () => {props.chooseOption("Project")}
  const chooseCustomer = () => {props.chooseOption("Customer")}
  const chooseSupplier = () => {props.chooseOption("Supplier")}
  return (
      <Col xs={1} className={classes.button}>
        <div style={{ listStyle: "none", paddingLeft: 0, textAlign: "center" }}>
          <Button
            variant="light"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={chooseProjectList}
          >
            Project List
          </Button>
          <Button
            variant="light"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={() => setOpen(!open)}
          >
            New
          </Button>
          <Collapse in={open}>
            <div id="collapseExample" className={classes.collapseButton}>
              <Button variant="light" onClick={chooseProject}>Project</Button>
              <Button variant="light" onClick={chooseCustomer}>Customer</Button>
              <Button variant="light" onClick={chooseSupplier}>Supplier</Button>
            </div>
          </Collapse>
        </div>
      </Col>

  );
};

export default Options;
