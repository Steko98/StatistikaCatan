import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';


export default function NavBarEdunova() {

    const navigate = useNavigate()

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className='ruka' onClick={()=>navigate(RouteNames.HOME)}>Statistika Catan</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={()=>navigate(RouteNames.HOME)}>Početna</Nav.Link>
            <NavDropdown title="Programi" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={()=>navigate(RouteNames.TURNIR_PREGLED)}>Turniri</NavDropdown.Item>
              <NavDropdown.Item onClick={()=>navigate(RouteNames.IGRACI_PREGLED)}>Igrači</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}