import { useState, useRef, useEffect } from "react";
import { Form, Col, Row, Button, Alert } from "react-bootstrap";
import classes from "./Project.module.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
const Project = (props) => {
  const [t, i18n] = useTranslation();
  const [formValidity, setFormValidity] = useState({
    pNumV: true,
    pNameV: true,
    customerV: true,
    groupV: true,
    memberV: true,
    statusV: true,
    startDateV: true,
  });
  const [crawlData, setCrawlData] = useState(false);
  const [projectNumberExist, setProjectNumberExist] = useState(false);
  const [alertMessage, setAlert] = useState("");
  const [projectData, setProjectData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [projectEmployeeData, setProjectEmployeeData] = useState([]);
  useEffect(() => {
    callGetAPI("Group");
    callGetAPI("Employee");
    callGetAPI("Project");
    callGetAPI("ProjectEmployee");
  }, [crawlData]);

  const projectNumberRef = useRef();
  const projectNameRef = useRef();
  const customerRef = useRef();
  const groupRef = useRef();
  const memberRef = useRef();
  const statusRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();

  const callDeleteAPI = async (ids, type) => {
    let dataString = ids.map((id) => `id=${id}&`).join("");
    dataString = dataString.substring(0, dataString.length - 1);
    console.log("data string", dataString);
    await axios
      .delete(`http://localhost:8200/api/${type}?${dataString}`)
      .then((res) => {
        console.log("Deletion was successful");
      });
  };

  const callGetAPI = async (flag) => {
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
          case "ProjectEmployee":
            setProjectEmployeeData(res.data);
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

  const formHandler = (event) => {
    event.preventDefault();
    // callGetAPI("Employee");
    // callGetAPI("Project");
    // callGetAPI("Group");
    setCrawlData(!crawlData);

    const enteredPNum = projectNumberRef.current.value.trim();
    const enteredPName = projectNameRef.current.value.trim();
    const enteredCustomer = customerRef.current.value.trim();
    const enteredGroup = groupRef.current.value.trim();
    const enteredMember = memberRef.current.value
      .split(",")
      .map((x) => x.trim());
    const enteredStatus = statusRef.current.value.trim();
    const enteredSDate = startDateRef.current.value;
    const enteredEDate = endDateRef.current.value;

    const pNumNotEmpty = !isNaN(enteredPNum) && enteredPNum.length !== 0;

    // console.log("projectData", projectData);
    // console.log("employeeData", employeeData);
    const pNameValid = enteredPName.length !== 0;
    const customerValid = enteredCustomer.length !== 0;
    const groupValid = enteredGroup.length !== 0;
    const memberValid = !enteredMember.some(
      (x) => !employeeData.map((rowData) => rowData.Visa).includes(x)
    );
    const statusValid = enteredStatus.length !== 0;
    const sDateValid = enteredSDate.length !== 0;
    // console.log("pNumNotEmpty", pNumNotEmpty);
    // console.log("projectNumberExist", projectNumberExist);
    // console.log("pNameValid", pNameValid);
    // console.log("customerValid", customerValid);
    // console.log("groupValid", groupValid);
    // console.log("memberValid", memberValid);
    // console.log("sDateValid", sDateValid);
    // console.log("statusValid", statusValid);

    setFormValidity({
      pNumV: pNumNotEmpty,
      pNameV: pNameValid,
      customerV: customerValid,
      groupV: groupValid,
      memberV: memberValid,
      statusV: statusValid,
      startDateV: sDateValid,
    });

    let formValid =
      pNumNotEmpty && pNameValid && customerValid && memberValid && sDateValid;
    if (
      projectData
        .map((rowData) => rowData.Project_number)
        .includes(+enteredPNum)
    ) {
      setProjectNumberExist(true);
      formValid = false;
    }
    if (!formValid) {
      //set error
      setAlert(t("new.project.error"));
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
      End_date: enteredEDate === "" ? null : enteredEDate,
      Version: 0,
    };
    if (props.update) {
      //Get records from ProjectEmployee for this project (ID, P_ID, E_ID)
      const currentPERecords = projectEmployeeData.filter(
        (x) => x.Project_number === enteredPNum
      );
      //ID for entered members
      const enteredVisa2ID = employeeData
        .filter((x) => enteredMember.includes(x.Visa))
        .map((x) => x.ID);
      //ProjectEmployee delete records that are not in this new update, ID is surrogate
      const IDToBeDeleted = currentPERecords
        .filter((x) => !enteredVisa2ID.includes(x.Employee_ID))
        .map((x) => x.ID);
      //ProjectEmployee add records that are in this new update, ID is E_ID
      const IDToBeAdded = enteredVisa2ID.filter(
        (x) => !currentPERecords.map((x) => x.Employee_ID).includes(x)
      );
      //Delete
      callDeleteAPI(IDToBeDeleted, "ProjectEmployee");
      //Add
      IDToBeAdded.map((x) =>
        axios
          .post("http://localhost:8200/api/ProjectEmployee", {
            Project_ID: enteredPNum,
            Employee_ID: x,
          })
          .then(() => {
            console.log("Successfully added an employee to the project");
          })
          .catch((error) => props.setModal(true))
      );

      props.chooseOption("ProjectList");
    }
    //Add the project first, project employee later
    axios
      .post("http://localhost:8200/api/Project", content)
      .then((res) => {
        console.log("Successfully added a project");
        //enteredMember
        const employeeForProject = employeeData
          .filter((x) => enteredMember.includes(x.Visa))
          .map((x) => x.ID);
        employeeForProject.map((x) =>{
          // const projectID = projectData.filter(x => x.Project_number === enteredPNum).ID;
          const projectID = res.data.ID;
          console.log("projectID", projectID);
          console.log("employeeID", x);
          axios
            .post("http://localhost:8200/api/ProjectEmployee", {
              Project_ID: projectID,
              Employee_ID: x,
            })
            .then(() => {
              console.log("Successfully added an employee to the project");
            })
            .catch((error) => props.setModal(true))}
        );
        props.chooseOption("ProjectList");
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

  return (
    <>
      <div style={{ borderBottom: "1px solid #0000003d" }}>
        <p className={classes.title}>
          {props.update ? t("new.project.title2") : t("new.project.title1")}
        </p>
      </div>
      <Form noValidate className={classes.form}>
        {alertMessage !== "" && alert}
        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="pNum">
            {t("new.project.pNum")} <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type="text"
              id="pNum"
              className={`${
                !props.update && formValidity.pNumV && !projectNumberExist
                  ? ""
                  : classes.invalid
              }`}
              ref={projectNumberRef}
              onFocus={() => setProjectNumberExist(false)}
              readOnly={props.update}
            />
          </Col>
          <Col sm={6} style={{ color: "red" }}>
            {projectNumberExist ? t("new.project.pNumError") : ""}
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="pName">
            {t("new.project.pName")} <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              id="pName"
              className={`${formValidity.pNameV ? "" : classes.invalid}`}
              onFocus={() => {
                let valid = { ...formValidity };
                valid.pNameV = true;
                setFormValidity(valid);
              }}
              ref={projectNameRef}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="cName">
            {t("new.project.customer")} <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              id="cName"
              className={`${formValidity.customerV ? "" : classes.invalid}`}
              onFocus={() => {
                let valid = { ...formValidity };
                valid.customerV = true;
                setFormValidity(valid);
              }}
              ref={customerRef}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="group">
            {t("new.project.group")} <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            <Form.Select
              id="group"
              className={`${formValidity.groupV ? "" : classes.invalid}`}
              onFocus={() => {
                let valid = { ...formValidity };
                valid.groupV = true;
                setFormValidity(valid);
              }}
              ref={groupRef}
            >
              <option value=""></option>
              {groupData.map((x) => (
                <option value={x.ID}>{x.ID}</option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} style={{ marginBottom: "2%" }}>
          <Form.Label column sm={2} htmlFor="member">
            {t("new.project.member")} <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              id="member"
              onFocus={() => {
                let valid = { ...formValidity };
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
            {t("new.project.status")} <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3}>
            <Form.Select
              id="status"
              onFocus={() => {
                let valid = { ...formValidity };
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
            {t("new.project.sDate")} <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Col sm={3} id="startDate">
            <Form.Control
              type="date"
              onFocus={() => {
                let valid = { ...formValidity };
                valid.startDateV = true;
                setFormValidity(valid);
              }}
              className={`${formValidity.startDateV ? "" : classes.invalid}`}
              ref={startDateRef}
            />
          </Col>
          <Form.Label column sm={2} htmlFor="endDate">
            {t("new.project.eDate")}
          </Form.Label>
          <Col sm={3} id="endDate">
            <Form.Control type="date" ref={endDateRef} />
          </Col>
        </Form.Group>

        <hr />
        <div style={{ textAlign: "center" }}>
          <Button
            variant="secondary"
            style={{ margin: "0% 1%" }}
            onClick={() => props.chooseOption("ProjectList")}
          >
            {t("new.project.cancelBtn")}
          </Button>
          <Button
            variant="primary"
            style={{ margin: "0% 1%" }}
            onClick={formHandler}
          >
            {props.update
              ? t("new.project.projectBtn2")
              : t("new.project.projectBtn1")}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Project;
