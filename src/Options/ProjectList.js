import { Button, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import classes from "./ProjectList.module.css";
import TrashImage from "../image/trash-alt-solid.svg";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const statusMapper = (stat) => {
  return (
    (stat === "pla" && "Planned") ||
    (stat === "fin" && "Finished") ||
    (stat === "new" && "New") ||
    (stat === "inp" && "In progress")
  );
};
const dateMapper = (date) => {
  const properDate = new Date(date);
  return (
    ("0" + properDate.getDate()).slice(-2) +
    "." +
    ("0" + (properDate.getMonth() + 1)).slice(-2) +
    "." +
    properDate.getFullYear()
  );
};
const callDeleteProjects = async (ids) => {
  let dataString = ids.map(id => `id=${id}&`).join("");
  dataString = dataString.substring(0, dataString.length - 1);
  console.log("data string",dataString);
  await axios
  .delete(`http://localhost:8200/api/Project?${dataString}`)
  .then(res => {
    console.log(res);
    console.log(res.data);
  })
}
const ProjectList = (props) => {
  const [selectStatus, setSelectStatus] = useState("");
  const [listProject, setListProject] = useState([]);
  const [removeList, setRemoveList] = useState([]);
  const getRequestAPI = useCallback(async () => {
    await axios
      .get(`http://localhost:8200/api/Project`)
      .then((res) => {
        console.log("Called API");
        setListProject(res.data);
      })
      .catch((error) => props.setModal(true));
  });
  useEffect(() => {
    getRequestAPI();
  }, []);
  console.log("res get Project", listProject);
  const selectHandler = (event) => {
    setSelectStatus(event.target.value);
  };

  const metaData = [
    "",
    "Number",
    "Name",
    "Status",
    "Customer",
    "Start Date",
    "Delete",
  ];
  // const tempData = [
  //   {
  //     key: 3116,
  //     name: "Facturation/ Encaissements",
  //     status: "New",
  //     customer: "Les Retaites Populaires",
  //     "start-date": "25.02.2004",
  //   },
  //   {
  //     key: 3118,
  //     name: "GKBWEB",
  //     status: "Finished",
  //     customer: "GKB",
  //     "start-date": "10.10.2002",
  //   },
  // ];
  let pagination = [];
  for (var i = 1; i < 5; i++)
    pagination.push(
      <Pagination.Item key={i} active={i === 1}>
        {i}
      </Pagination.Item>
    );
  pagination = <Pagination style={{ float: "right" }}>{pagination}</Pagination>;

  return (
    <>
      <h4>Project List</h4>
      <hr />
      <Form onSubmit={console.log}>
        <Row>
          <Col xs={4}>
            <Form.Control
              type="text"
              placeholder="Project number, name, customer name"
            />
          </Col>
          <Col xs={2}>
            <Form.Select value={selectStatus} onChange={selectHandler}>
              <option disabled value="">
                Project Status
              </option>
              <option value="New">New</option>
              <option value="Planned">Planned</option>
              <option value="Finished">Finished</option>
              <option value="In progress">In progress</option>
            </Form.Select>
          </Col>
          <Col xs={6}>
            <Button className={classes["search-button"]} variant={"primary"}>
              Search Project
            </Button>
            <Button className={"mb-2 " + classes["reset-button"]}>
              Reset Search
            </Button>
          </Col>
        </Row>
      </Form>
      <Table responsive="sm" hover bordered style={{ marginTop: "2%" }}>
        <thead>
          <tr>
            {metaData.map((colName) => {
              return <td className={classes.table}>{colName}</td>;
            })}
          </tr>
        </thead>
        <tbody>
          {listProject.map((rowData) => {
            return (
              <tr>
                <td className={classes.table} style={{ textAlign: "center" }}>
                  <Form.Check
                    disabled={rowData.Status !== "new"}
                    onChange={(event) => {
                      console.log("event checkbox", event.target.checked);
                      if (event.target.checked === true)
                        setRemoveList([...removeList, rowData.ID]);
                      else if (event.target.checked === false) {
                        let x = removeList.filter((a) => a !== rowData.ID);
                        console.log("length of array", x.length);
                        setRemoveList(x);
                      }
                    }}
                  />
                </td>
                <td className={classes.table}>{rowData.Project_number}</td>
                <td className={classes.table}>{rowData.Name}</td>
                <td className={classes.table}>
                  {statusMapper(rowData.Status)}
                </td>
                <td className={classes.table}>{rowData.Customer}</td>
                <td className={classes.table}>
                  {dateMapper(rowData.Start_date)}
                </td>
                <td className={classes.table}>
                  {statusMapper(rowData.Status) === "New" && (
                    <button
                      type="button"
                      className={classes["trash-bin"]}
                      onClick={() => callDeleteProjects([rowData.ID])}
                    >
                      <img src={TrashImage} alt="delete button" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {removeList.length !== 0 && (
            <tr>
              <td colSpan={6} style={{ borderRight: "none" }}>
                Suck my {removeList.length} inches dick
              </td>
              <td style={{ borderLeft: "none" }}>
                <button
                  type="button"
                  className={classes["trash-bin"]}
                  onClick={() => {
                    callDeleteProjects(removeList);
                    getRequestAPI();
                  }}
                >
                  <img src={TrashImage} alt="delete button" />
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {pagination}
    </>
  );
};

export default ProjectList;
