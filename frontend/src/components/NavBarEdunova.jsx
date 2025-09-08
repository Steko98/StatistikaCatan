import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, RouteNames } from "../constants";
import useAuth from "../hooks/useAuth";

export default function NavBarEdunova() {
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useAuth();

  function OpenSwaggerURL() {
    window.open(BACKEND_URL + "/swagger/index.html", "_blank");
  }

  return (
    <Navbar expand="lg" data-bs-theme="dark" bg="dark" >
      <Navbar.Brand
        className="ruka nav-brand"
        onClick={() => navigate(RouteNames.HOME)}
        style={{marginLeft: '20px'}}
      >
        CATAN
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {isLoggedIn ? (
            <>
                <Nav.Link onClick={() => navigate(RouteNames.TURNIR_PREGLED)}>
                  My Tournaments
                </Nav.Link >
                <Nav.Link  onClick={() => navigate(RouteNames.IGRACI_PREGLED)}>
                  Players
                </Nav.Link >
              <Nav.Link onClick={logout}>Sign out</Nav.Link>
            </>
          ) : (
            <>
            <Nav.Link onClick={() => navigate(RouteNames.LOGIN)}>Sign in</Nav.Link>
            <Nav.Link onClick={() => navigate(RouteNames.REGISTER)}>Sign up</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
