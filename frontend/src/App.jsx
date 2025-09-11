import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Container } from "react-bootstrap";
import NavBarEdunova from "./components/NavBarEdunova";
import { Route, Routes } from "react-router-dom";
import { RouteNames } from "./constants";
import Pocetna from "./pages/Pocetna";
import TurniriPregled from "./pages/turniri/TurniriPregled";
import TurniriPromjeni from "./pages/turniri/TurniriPromjeni";
import TurnirPojedinacno from "./pages/turniri/TurnirPojedinacno";
import IgraciPregled from "./pages/igraci/IgraciPregled";
import IgraciPromjeni from "./pages/igraci/IgraciPromjeni";
import IgraPojedinacno from "./pages/igre/IgraPojedinacno";
import IgracPojedinacno from "./pages/igraci/IgracPojedinacno";

import useError from "./hooks/useError";
import ErrorModal from "./components/ErrorModal";
import LoadingSpinner from "./components/LoadingSpinner";
import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const { isLoggedIn } = useAuth();
  const { errors, prikaziErrorModal, sakrijError } = useError();

  function godina(){
    const pocetna = 2025;
    const trenutna = new Date().getFullYear();
    if(pocetna===trenutna){
      return trenutna;
    }
    return pocetna + ' - ' + trenutna;
  }

  return (
    <>
      <LoadingSpinner />
      <ErrorModal
        show={prikaziErrorModal}
        errors={errors}
        onHide={sakrijError}
      />
      <Container className="app">
        <NavBarEdunova />
        <br />
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />

          {isLoggedIn ? (
            <>
              <Route path={RouteNames.TURNIR_PREGLED} element={<TurniriPregled />}/>
              <Route path={RouteNames.TURNIR_PROMJENI} element={<TurniriPromjeni />}/>
              <Route path={RouteNames.TURNIR_DETALJI} element={<TurnirPojedinacno />}/>

              <Route path={RouteNames.IGRA_POJEDINACNO} element={<IgraPojedinacno />}/>

              <Route path={RouteNames.IGRACI_PREGLED} element={<IgraciPregled />} />
              <Route path={RouteNames.IGRAC_PROMJENI} element={<IgraciPromjeni />} />
              <Route path={RouteNames.IGRAC_POJEDINACNO} element={<IgracPojedinacno />}/>
            </>
          ) : (
            <>
              <Route path={RouteNames.LOGIN} element={<Login />} />
              <Route path={RouteNames.REGISTER} element={<Register/>}/>
            </>
          )}
        </Routes>


        
      </Container>
      <Container className="footer">
        <p className="tag sredina">ivan.steko5@gmail.com &copy; {godina()}</p>
      </Container>
    </>
  );
}

export default App;
