import { Form, Col, Row, Button } from "react-bootstrap";
import FormWrapper from "../UI/FormWrapper";
import classes from "./Project.module.css";
const Project = () => {
  return (
    <>
      <div className={classes.break}>
        <p className={classes.title}>New Project</p>
      </div>
      <Form className={classes.form}>
        <FormWrapper
          labelWidth={2}
          inputWidth={3}
          label={"Project Number"}
          sameLine={false}
          inputObj={<Form.Control type="text" />}
        />
        <FormWrapper
          labelWidth={2}
          inputWidth={9}
          label={"Project Name"}
          sameLine={false}
          inputObj={<Form.Control type="text" />}
        />
        <FormWrapper
          labelWidth={2}
          inputWidth={9}
          label={"Customer"}
          sameLine={false}
          inputObj={<Form.Control type="text" />}
        />
        <FormWrapper
          labelWidth={2}
          inputWidth={3}
          label={"Group"}
          sameLine={false}
          inputObj={
            <Form.Select>
              <option value="New">New</option>
              <option value="Planned">Planned</option>
              <option value="Finished">Finished</option>
              <option value="In progress">In progress</option>
            </Form.Select>
          }
        />
        <FormWrapper
          labelWidth={2}
          inputWidth={9}
          label={"Member"}
          sameLine={false}
          inputObj={<Form.Control type="text" />}
        />
        <FormWrapper
          labelWidth={2}
          inputWidth={3}
          label={"Status"}
          sameLine={false}
          inputObj={
            <Form.Select>
              <option value="New">New</option>
              <option value="Planned">Planned</option>
              <option value="Finished">Finished</option>
              <option value="In progress">In progress</option>
            </Form.Select>
          }
        />
        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <FormWrapper
            labelWidth={2}
            inputWidth={3}
            label={"Start Date"}
            sameLine={true}
            inputObj={<Form.Control type="date" />}
          />
          <FormWrapper
            labelWidth={2}
            inputWidth={3}
            label={"End Date"}
            sameLine={true}
            inputObj={<Form.Control type="date" />}
          />
        </Form.Group>
        <hr/>
        <div style={{ textAlign: "center" }}>
          <Button variant="secondary" style={{margin: "0% 1%"}}>Cancel</Button>
          <Button variant="primary" style={{margin: "0% 1%"}}>Create Project</Button>
        </div>
      </Form>
    </>
  );
};

export default Project;
