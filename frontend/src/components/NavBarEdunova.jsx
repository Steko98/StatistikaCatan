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
              <NavDropdown title={<span className="nav-tekst">Programi</span>} id="basic-nav-dropdown" className="nav-tekst">
                <NavDropdown.Item onClick={() => navigate(RouteNames.TURNIR_PREGLED)}>
                  Turniri
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate(RouteNames.IGRACI_PREGLED)}>
                  Igrači
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link onClick={() => OpenSwaggerURL()} className="nav-tekst">
                Swagger
              </Nav.Link>

              <Nav.Link onClick={()=>navigate(RouteNames.ERA)}>ERA dijagram</Nav.Link>

              <Nav.Link onClick={logout}>Odjava</Nav.Link>
            </>
          ) : (
            <Nav.Link onClick={() => navigate(RouteNames.LOGIN)}>Prijava</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
