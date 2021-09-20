import { Form, Row, Col } from "react-bootstrap";
import classes from "./FormWrapper.module.css";

const FormWrapper = (props) => {
  let result = (
    <>
      <Form.Label column sm={String(props.labelWidth)}>
        {props.label} <span style={{ color: "red" }}>*</span>
      </Form.Label>
      <Col sm={String(props.inputWidth)}>
        {props.inputObj}
      </Col>
    </>
  );
  if (props.sameLine == false)
    result = (
      <Form.Group as={Row} style={{ marginBottom: "2%" }}>
        {result}
      </Form.Group>
    );

  return result;
};

export default FormWrapper;
