import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Adaugă importul pentru Link
import { useAuth } from '../AuthContext';


const NavBar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate(); // Adaugă importul pentru useHistory din 'react-router-dom'

  const handleLogout = () => {
    logout();
    navigate('/login'); // Realizează redirect către pagina de login
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            {isLoggedIn ? (
              <NavDropdown title="Properties">
                <NavDropdown.Item as={Link} to="/properties">All Properties</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-properties">My Properties</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/add_properties">Add Properties</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/tranzactions">Tranzactions</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/properties">All Properties</Nav.Link>
            )}
            {isLoggedIn ? (
              <NavDropdown title="My Account">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
