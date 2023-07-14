import {Nav, Navbar} from 'react-bootstrap'
import {Link} from 'react-router-dom'

function Header()
{
    return (
        <div>
           <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">SES What</Navbar.Brand>
          <Nav className="me-auto navbar_wrapper">
            <Link to="/about-us">About Us</Link>
            <Link to="/demo">Demo</Link>
            <Link to="/contact-us">Contact Us</Link>

          </Nav>
      </Navbar>
        </div>
    )
}

export default Header