import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import { useState, useContext } from 'react';
import UserContext from '../UserContext';

export default function AppNavbar() {
	// State to store the user information stored in the login page.
	const { user } = useContext(UserContext);
	console.log(user); 
	// Checking if we received the login token

	return (
			<Navbar bg="light" expand="lg">
			    <Container fluid>
			        <Navbar.Brand as={Link} to="/">Zuitt Booking</Navbar.Brand>
			        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
			        <Navbar.Collapse id="basic-navbar-nav">
			            <Nav className="ms-auto">
				            <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
				            <Nav.Link as={NavLink} to="/products" exact="true">Product</Nav.Link>
				            {(user.id !== null) ?
				            
					            user.isAdmin
					            ?
						            <>
						            	<Nav.Link as ={Link} to ="/addProduct">Add Product </Nav.Link>
						            	<Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
						            </>
					            :
						            <>
						            	<Nav.Link as={NavLink} to="/profile" exact="true">Profile</Nav.Link>
						            	<Nav.Link as={NavLink} to="/logout" exact="true">Logout</Nav.Link>
						            </>
				         	:
					            <>
						            <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
						            <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
					            </>
				            }
			            </Nav>
			        </Navbar.Collapse>
			    </Container>
			</Navbar>
		)
}