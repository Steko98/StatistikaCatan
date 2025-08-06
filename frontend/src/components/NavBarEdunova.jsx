import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL, RouteNames } from '../constants';


export default function NavBarEdunova() {

    const navigate = useNavigate()

    function OpenSwaggerURL(){
      window.open(BACKEND_URL+"/swagger/index.html", "_blank")
    }

  return (
    <Navbar expand="lg" className="navbar-catan">
        <Navbar.Brand className='ruka nav-brand' onClick={()=>navigate(RouteNames.HOME)}>CATAN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

            <NavDropdown title={<span className="nav-tekst">Programi</span>} id="basic-nav-dropdown" className='nav-tekst'>
              <NavDropdown.Item onClick={()=>navigate(RouteNames.TURNIR_PREGLED)}>Turniri</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>navigate(RouteNames.IGRACI_PREGLED)}>Igrači</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>navigate(RouteNames.IGRE_PREGLED)}>Igre</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link onClick={()=>OpenSwaggerURL()} className='nav-tekst'>Swagger</Nav.Link>

          </Nav>
        </Navbar.Collapse>

    </Navbar>
  );
}