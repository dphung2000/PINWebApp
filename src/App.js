import Header from "./UI/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import Options from "./UI/Options";
import { useState } from "react";
import Customer from "./Options/Customer";
import Project from "./Options/Project";
import Supplier from "./Options/Supplier";
import ProjectList from "./Options/ProjectList";
import ErrorPage from "./Options/ErrorPage";

function App() {
  const [option, setOption] = useState("ProjectList");
  const [isError, setModal] = useState(false);

  const content = (
    <>
      <Options chooseOption={setOption} />
      <Col xs={11} style={{ paddingLeft: "2%", paddingTop: "1%" }}>
        {option === "ProjectList" && <ProjectList setModal={setModal}/>}
        {option === "Customer" && <Customer />}
        {option === "Project" && <Project />}
        {option === "Supplier" && <Supplier />}
      </Col>
    </>
  );
  return (
    <>
      <Header />
      <Container fluid style={{ borderTop: "1px solid #0000003d" }}>
        <Row className="justify-content-md-center">
          {!isError && content}
          {isError && <ErrorPage setOption={setOption} setModal={setModal}/>}
        </Row>
      </Container>
    </>
  );
}

export default App;
