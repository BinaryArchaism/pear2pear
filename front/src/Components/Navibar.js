import {Nav, Navbar} from "react-bootstrap";
import Wallet from "./wallet/Connection";

const styles = {
    border: "1px solid black",
    backgroundColor: "#b9ffc8"
}

export default function Navibar() {
    return (
        <div style={{margin: "1%"}}>
            <Navbar style={styles} className={"p-3"}>
                <Navbar.Brand>Pear2Pear</Navbar.Brand>
                <Navbar.Toggle aria-controls={"responsive-navber-nav"} />
                <Navbar.Collapse id={"responsive-navber-nav"}>
                    <Nav className={"mr-auto"}>
                        <Nav.Link>Home</Nav.Link>
                        <Nav.Link>Buy Crypto</Nav.Link>
                        <Nav.Link>Sell Crypto</Nav.Link>
                    </Nav>
                    <Nav className={"ms-auto"}>
                        <Wallet />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}