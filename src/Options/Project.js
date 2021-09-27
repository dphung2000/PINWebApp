import { useState, useRef, useEffect, cloneElement } from "react";
import { Form, Col, Row, Button, Alert } from "react-bootstrap";
import classes from "./Project.module.css";
import axios from "axios";

const Project = (props) => {
  const [formValidity, setFormValidity] = useState({
    pNumV: true,
    pNameV: true,
    customerV: true,
    groupV: true,
    memberV: true,
    statusV: true,
    startDateV: true,
  });
  const [projectNumberExist, setProjectNumberExist] = useState(false);
  const [update, setUpdate] = useState(false);
  const [alertMessage, setAlert] = useState("");
  const [projectData, setProjectData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [groupData, setGroupData] = useState([]);

  const projectNumberRef = useRef();
  const projectNameRef = useRef();
  const customerRef = useRef();
  const groupRef = useRef();
  const memberRef = useRef();
  const statusRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();

  const requestGetAPI = async (flag) => {
    await axios
      .get(`http://localhost:8200/api/${flag}`)
      .then((res) => {
        console.log(`Called API ${flag}`);
        //return res.data;
        switch (flag) {
          case "Employee":
            setEmployeeData(res.data);
            break;
          case "Project":
            setProjectData(res.data);
            break;
          case "Group":
            setGroupData(res.data);
            break;
          default:
            props.setModal(true);
        }
      })
      .catch((error) => {
        console.log(`Error calling ${flag}`);
        props.setModal(true);
      });
  };

  const formHandler = async (event) => {
    event.preventDefault();
    await requestGetAPI("Employee");
    await requestGetAPI("Project");

    const enteredPNum = projectNumberRef.current.value.trim();
    const enteredPName = projectNameRef.current.value.trim();
    const enteredCustomer = customerRef.current.value.trim();
    const enteredGroup = groupRef.current.value.trim();
    const enteredMember = memberRef.current.value.trim();
    const enteredStatus = statusRef.current.value.trim();
    const enteredSDate = startDateRef.current.value;
    const enteredEDate = endDateRef.current.value;
    console.log("enteredE", enteredEDate);
    const pNumNotEmpty = !isNaN(enteredPNum) && enteredPNum.length != 0;
    if (
      projectData
        .map((rowData) => rowData.Project_number)
        .includes(+enteredPNum)
    ) {
      setProjectNumberExist(true);
    }
    console.log("projectData", projectData);
    console.log("employeeData", employeeData);
    const pNameValid = enteredPName.length != 0;
    const customerValid = enteredCustomer.length != 0;
    const groupValid = enteredGroup.length != 0;
    const memberValid = employeeData
      .map((rowData) => rowData.Visa)
      .includes(enteredMember);
    const statusValid = enteredStatus.length != 0;
    const sDateValid = enteredSDate.length != 0;
    console.log("pNumNotEmpty", pNumNotEmpty);
    console.log("pNameValid", pNameValid);
    console.log("customerValid", customerValid);
    console.log("groupValid", groupValid);
    console.log("memberValid", memberValid);
    console.log("sDateValid", sDateValid);
    console.log("statusValid", statusValid);

    setFormValidity({
      pNumV: pNumNotEmpty,
      pNameV: pNameValid,
      customerV: customerValid,
      groupV: groupValid,
      memberV: memberValid,
      statusV: statusValid,
      startDateV: sDateValid,
    });

    const formValid =
      pNumNotEmpty && pNameValid && customerValid && memberValid && sDateValid;
    if (!formValid) {
      //set error
      // props.setModal(true);
      setAlert("Please enter all the mandatory fields (*)");
      console.log("Form error");
      return;
    }
    // put and post
    const content = {
      Group_ID: enteredGroup,
      Project_number: enteredPNum,
      Name: enteredPName,
      Customer: enteredCustomer,
      Status: enteredStatus,
      Start_date: enteredSDate,
      End_date: enteredEDate == "" ? null : enteredEDate,
      Version: 0,
    };
    axios
      .post("http://localhost:8200/api/Project", content)
      .then(() => {
        console.log("Successfully added a project");
      })
      .catch((error) => props.setModal(true));
  };

  const alert = (
    <Row>
      <Col xs={8}>
        <Alert variant="danger" onClose={() => setAlert("")} dismissible>
          <p style={{ margin: "auto" }}>{alertMessage}</p>
        </Alert>
      </Col>
    </Row>
  );
  useEffect(() => requestGetAPI("Group"), []);

  return (
    <>
      <div style={{ borderBottom: "1px solid #0000003d" }}>
        <p className={classes.title}>New Project</p>
      </div>
      <Form noValidate className={classes.form}>
        {alertMessage !== "" && alert}
        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="pNum">
            Project Number <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type="text"
              id="pNum"
              className={`${
                !update && formValidity.pNumV && ! projectNumberExist
                  ? ""
                  : classes.invalid
              }`}
              ref={projectNumberRef}
              onFocus={() => setProjectNumberExist(false)}
              readOnly={update}
            />
          </Col>
          <Col sm={6} style={{ color: "red" }}>
            {projectNumberExist
              ? "The project number already existed. Please select a different project number"
              : ""}
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="pName">
            Project Name <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              id="pName"
              className={`${formValidity.pNameV ? "" : classes.invalid}`}
              onFocus={() => {
                let valid = {...formValidity};
                valid.pNameV = true;
                setFormValidity(valid);
              }}
              ref={projectNameRef}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="cName">
            Customer <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              id="cName"
              className={`${formValidity.customerV ? "" : classes.invalid}`}
              onFocus={() => {
                let valid = {...formValidity};
                valid.customerV = true;
                setFormValidity(valid);
              }}
              ref={customerRef}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="group">
            Group <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            <Form.Select
              id="group"
              className={`${formValidity.groupV ? "" : classes.invalid}`}
              onFocus={() => {
                let valid = {...formValidity};
                valid.groupV = true;
                setFormValidity(valid);
              }}
              ref={groupRef}
            >
              <option value=""></option>
              {groupData.map((x) => (
                <option value={x.Group_Leader_ID}>{x.Group_Leader_ID}</option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="member">
            Member <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              id="member"
              onFocus={() => {
                let valid = {...formValidity};
                valid.memberV = true;
                setFormValidity(valid);
              }}
              className={`${formValidity.memberV ? "" : classes.invalid}`}
              ref={memberRef}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="status">
            Status <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            <Form.Select
              id="status"
              onFocus={() => {
                let valid = {...formValidity};
                valid.statusV = true;
                setFormValidity(valid);
              }}
              className={`${formValidity.statusV ? "" : classes.invalid}`}
              ref={statusRef}
            >
              <option value=""></option>
              <option value="new">New</option>
              <option value="pla">Planned</option>
              <option value="fin">Finished</option>
              <option value="inp">In progress</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="startDate">
            Start Date <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3} id="startDate">
            <Form.Control
              type="date"
              onFocus={() => {
                let valid = {...formValidity};
                valid.startDateV = true;
                setFormValidity(valid);
              }}
              className={`${formValidity.startDateV ? "" : classes.invalid}`}
              ref={startDateRef}
            />
          </Col>
          <Form.Label column sm={2} htmlFor="endDate">
            End Date
          </Form.Label>
          <Col sm={3} id="endDate">
            <Form.Control type="date" ref={endDateRef}/>
          </Col>
        </Form.Group>

        <hr />
        <div style={{ textAlign: "center" }}>
          <Button variant="secondary" style={{ margin: "0% 1%" }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            style={{ margin: "0% 1%" }}
            onClick={formHandler}
          >
            Create Project
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Project;
