import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import literature from './literature.png'

import './graphic.css';

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand="lg" bg="warning" variant="light">
            <Container>
                <Navbar.Brand href="/">
                    <img src={literature} width="40" height="40" className="" alt="" />
                    &nbsp; <span class="navtext">Place of Mind</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/"><span class="navbartext">Home</span></Nav.Link>
                        <Nav.Link as={Link} to="/create"><span class="navbartext">Create</span></Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items"><span class="navbartext">My Listed Items</span></Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases"><span class="navbartext">My Purchases</span></Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-primary">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-primary">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;