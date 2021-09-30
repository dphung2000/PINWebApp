import { Button, Col, Form, Pagination, Row, Table } from "react-bootstrap";
import classes from "./ProjectList.module.css";
import TrashImage from "../image/trash-alt-solid.svg";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

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

const ProjectList = (props) => {
  //const [selectStatus, setSelectStatus] = useState("");
  const [searched, setSearched] = useState(false);
  const optionRef = useRef();
  const inputRef = useRef();
  const [listProject, setListProject] = useState([]);
  const [listProjectEmployee, setListProjectEmployee] = useState([]);
  const [removeList, setRemoveList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [listProjectPerPage, setListProjectPerPage] = useState([]);
  const itemsPerPage = 5;

  const getRequestAPI = async () => {
    await axios
      .get(`http://localhost:8200/api/Project`)
      .then((res) => {
        console.log("Called API");
        setListProject(res.data);
        //setListProjectPerPage(res.data.slice(0, Math.min(itemsPerPage, res.data.length)));
      })
      .catch((error) => props.setModal(true));
    await axios
      .get(`http://localhost:8200/api/ProjectEmployee`)
      .then((res) => {
        console.log("Called API");
        setListProjectEmployee(res.data);
        //setListProjectPerPage(res.data.slice(0, Math.min(itemsPerPage, res.data.length)));
      })
      .catch((error) => props.setModal(true));
  };

  useEffect(() => {
    getRequestAPI();
  }, []);

  useEffect(() => {
    pageChangeHandler(1);
  }, [listProject]);

  const pageChangeHandler = (pageNum) => {
    // console.log("Current page",pageNum);
    setCurrentPage(pageNum);
    const startingIndex = (pageNum - 1) * itemsPerPage;
    // console.log("Number of items on this page",listProject.length,startingIndex,Math.min(itemsPerPage, listProject.length - startingIndex));
    // console.log("Items",listProject.slice(startingIndex, Math.min(startingIndex + itemsPerPage, listProject.length)));
    setListProjectPerPage(
      listProject.slice(
        startingIndex,
        Math.min(startingIndex + itemsPerPage, listProject.length)
      )
    );
  };

  const inputFilter = (data) => {
    const criteria = inputRef.current.value.trim();
    if (criteria === "") return data;
    return data.filter(
      (x) =>
        x.Project_number.toString().includes(criteria) ||
        x.Name.includes(criteria) ||
        x.Customer.includes(criteria)
    );
  };
  const optionFilter = (data) => {
    const criteria = optionRef.current.value;
    if (criteria === "") return data;
    return data.filter((x) => x.Status === criteria);
  };
  const searchHandler = () => {
    if (searched) {
      return;
    }
    console.log("inputRef", inputRef.current.value);
    console.log("optionRef", optionRef.current.value);
    setListProject(optionFilter(inputFilter(listProject)));
    setSearched(true);
  };

  const resetHandler = () => {
    inputRef.current.value = "";
    optionRef.current.value = "";
    setSearched(false);
    getRequestAPI();
  };

  const callDeleteAPI = async (ids, type) => {
    let dataString = ids.map((id) => `id=${id}&`).join("");
    dataString = dataString.substring(0, dataString.length - 1);
    console.log("data string", dataString);
    await axios
      .delete(`http://localhost:8200/api/${type}?${dataString}`)
      .then((res) => {
        console.log("Deletion was successful");
        setRemoveList(removeList.filter((x) => !ids.includes(x)));
        getRequestAPI();
      });
  };
  const projectDeleteHandler = (ids) => {
    console.log("ProjectEmployee", listProjectEmployee);
    const PEToBeDeleted = listProjectEmployee.filter(x => ids.includes(x.Project_ID)).map(x => x.ID);
    callDeleteAPI(PEToBeDeleted, "ProjectEmployee");
    callDeleteAPI(ids, "Project");
    // getRequestAPI();
  };
  const metaData = [
    "",
    props.t("projectlist.numberCol"),
    props.t("projectlist.nameCol"),
    props.t("projectlist.statusCol"),
    props.t("projectlist.customerCol"),
    props.t("projectlist.dateCol"),
    props.t("projectlist.deleteCol"),
  ];
  let pagination = [];
  for (var i = 1; i <= Math.ceil(listProject.length / itemsPerPage); i++) {
    //console.log("Added page",i);
    const pageNumberPH = i;
    pagination.push(
      <Pagination.Item
        key={i}
        active={pageNumberPH === currentPage}
        onClick={() => pageChangeHandler(pageNumberPH)}
      >
        {i}
      </Pagination.Item>
    );
  }
  pagination = <Pagination style={{ float: "right" }}>{pagination}</Pagination>;

  return (
    <>
      <h4>{props.t("projectlist.projectList")}</h4>
      <hr />
      <Form onSubmit={console.log}>
        <Row>
          <Col xs={4}>
            <Form.Control
              type="text"
              placeholder={props.t("projectlist.inputPH")}
              ref={inputRef}
            />
          </Col>
          <Col xs={2}>
            <Form.Select ref={optionRef}>
              <option value="">{props.t("projectlist.statPH")}</option>
              <option value="new">{props.t("projectlist.new")}</option>
              <option value="pla">{props.t("projectlist.pla")}</option>
              <option value="fin">{props.t("projectlist.fin")}</option>
              <option value="inp">{props.t("projectlist.inp")}</option>
            </Form.Select>
          </Col>
          <Col xs={6}>
            <Button
              className={classes["search-button"]}
              variant={"primary"}
              onClick={searchHandler}
            >
              {props.t("projectlist.searchBtn")}
            </Button>
            <Button
              className={"mb-2 " + classes["reset-button"]}
              onClick={resetHandler}
            >
              {props.t("projectlist.resetBtn")}
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
          {listProjectPerPage.map((rowData) => {
            return (
              <tr>
                <td className={classes.table} style={{ textAlign: "center" }}>
                  <Form.Check
                    checked={removeList.includes(rowData.ID)}
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
                  {props.t(`projectlist.${rowData.Status}`)}
                </td>
                <td className={classes.table}>{rowData.Customer}</td>
                <td className={classes.table}>
                  {dateMapper(rowData.Start_date)}
                </td>
                <td className={classes.table}>
                  {rowData.Status === "new" && (
                    <button
                      type="button"
                      className={classes["trash-bin"]}
                      onClick={() => {
                        projectDeleteHandler([rowData.ID]);
                        console.log("object deleted");
                      }}
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
                {removeList.length} items selected
              </td>
              <td style={{ borderLeft: "none" }}>
                <button
                  type="button"
                  className={classes["trash-bin"]}
                  onClick={() => {
                    projectDeleteHandler(removeList);
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
