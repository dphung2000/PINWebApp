import { useState } from "react";
import useInput from "./hooks/use-input";
import { Form, Col, Row, Button, Alert } from "react-bootstrap";
import classes from "./Project.module.css";
const validateProjectNumber = (value) => {
  return false;
};
const validateMember = (value) => {
  return false;
};
const Project = () => {
  const [update, setUpdate] = useState(false);
  const [alertMessage, setAlert] = useState(
    "Please enter all the mandatory fields (*)"
  );
  const {
    value: projectNumber,
    isValid: PNumberIsValid,
    hasError: PNumberHasError,
    valueChangeHandler: PNumberChangedHandler,
    inputBlurHandler: PNumberBlurHandler,
    reset: resetPNumber,
  } = useInput(validateProjectNumber);
  const {
    value: projectName,
    isValid: PNameIsValid,
    hasError: PNameHasError,
    valueChangeHandler: PNameChangedHandler,
    inputBlurHandler: PNameBlurHandler,
    reset: resetPName,
  } = useInput((value) => value.trim() !== "");
  const {
    value: customer,
    isValid: CIsValid,
    hasError: CHasError,
    valueChangeHandler: CChangedHandler,
    inputBlurHandler: CBlurHandler,
    reset: resetC,
  } = useInput((value) => value.trim() !== "");
  const {
    value: member,
    isValid: MIsValid,
    hasError: MHasError,
    valueChangeHandler: MChangedHandler,
    inputBlurHandler: MBlurHandler,
    reset: resetM,
  } = useInput(validateMember);
  const {
    value: startDate,
    isValid: SDIsValid,
    hasError: SDHasError,
    valueChangeHandler: SDChangedHandler,
    inputBlurHandler: SDBlurHandler,
    reset: resetSD,
  } = useInput((value) => value.trim() !== "");
  const alert = (
    <Row>
      <Col xs={8}>
        <Alert variant="danger" onClose={() => setAlert("")} dismissible>
          <p style={{ margin: "auto" }}>{alertMessage}</p>
        </Alert>
      </Col>
    </Row>
  );
  return (
    <>
      <div style={{ borderBottom: "1px solid #0000003d" }}>
        <p className={classes.title}>New Project</p>
      </div>
      <Form noValidate className={classes.form}>
        {alertMessage !== "" && alert}
        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2}>
            Project Number <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              onBlur={() => {
                console.log("SUCKKKKKKK");
              }}
              type="text"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2}>
            Project Name <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              className={PNameHasError && classes.invalid}
              onChange={PNumberChangedHandler}
              onBlur={PNameBlurHandler}
              value={projectName}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2}>
            Customer <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control type="text" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2}>
            Group <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            {" "}
            <Form.Select>
              <option value="New">New</option>
              <option value="Planned">Planned</option>
              <option value="Finished">Finished</option>
              <option value="In progress">In progress</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2}>
            Member <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control type="text" className={classes.invalid} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2}>
            Status <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            {" "}
            <Form.Select>
              <option value="New">New</option>
              <option value="Planned">Planned</option>
              <option value="Finished">Finished</option>
              <option value="In progress">In progress</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2}>
            Start Date <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            <Form.Control type="date" />
          </Col>
          <Form.Label column sm={2}>
            End Date
          </Form.Label>
          <Col sm={3}>
            <Form.Control type="date" />
          </Col>
        </Form.Group>

        <hr />
        <div style={{ textAlign: "center" }}>
          <Button variant="secondary" style={{ margin: "0% 1%" }}>
            Cancel
          </Button>
          <Button variant="primary" style={{ margin: "0% 1%" }} onClick={() => setAlert("Sumitted")} >
            Create Project
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Project;
