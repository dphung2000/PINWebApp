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
import { useTranslation } from "react-i18next";

function App() {
  const [option, setOption] = useState("ProjectList");
  const [isError, setModal] = useState(false);
  const [t, i18n] = useTranslation();
  const content = (
    <>
      <Options chooseOption={setOption} t={t} />
      <Col xs={11} style={{ paddingLeft: "2%", paddingTop: "1%" }}>
        {option === "ProjectList" && (
          <ProjectList chooseOption={setOption} setModal={setModal} t={t} />
        )}
        {option === "Customer" && <Customer t={t} />}
        {option === "Project" && (
          <Project
            update={false}
            chooseOption={setOption}
            setModal={setModal}
            t={t}
          />
        )}
        {option === "Supplier" && <Supplier t={t} />}
      </Col>
    </>
  );
  return (
    <>
      <Header t={t} i18n={i18n} />
      <Container fluid style={{ borderTop: "1px solid #0000003d" }}>
        <Row className="justify-content-md-center">
          {!isError && content}
          {isError && (
            <ErrorPage setOption={setOption} setModal={setModal} t={t} />
          )}
        </Row>
      </Container>
    </>
  );
}

export default App;
