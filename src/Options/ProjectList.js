import { Button, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import classes from "./ProjectList.module.css";
import TrashImage from "../image/trash-alt-solid.svg";
import { useState } from "react";

const ProjectList = () => {
  const [selectStatus, setSelectStatus] = useState("");
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
  const tempData = [
    {
      number: 3116,
      name: "Facturation/ Encaissements",
      status: "New",
      customer: "Les Retaites Populaires",
      "start-date": "25.02.2004",
    },
    {
      number: 3118,
      name: "GKBWEB",
      status: "Finished",
      customer: "GKB",
      "start-date": "10.10.2002",
    },
  ];
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
          {tempData.map((rowData) => {
            return (
              <tr>
                <td className={classes.table}></td>
                <td className={classes.table}>{rowData.number}</td>
                <td className={classes.table}>{rowData.name}</td>
                <td className={classes.table}>{rowData.status}</td>
                <td className={classes.table}>{rowData.customer}</td>
                <td className={classes.table}>{rowData["start-date"]}</td>
                <td className={classes.table}>
                  {rowData.status === "New" && (
                    <button type="button" className={classes["trash-bin"]}>
                      <img src={TrashImage} alt="delete button" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {pagination}
    </>
  );
};

export default ProjectList;
