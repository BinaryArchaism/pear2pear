import { useState } from "react";
import {Nav, Navbar, Button} from "react-bootstrap";
import { ethers } from 'ethers';

const styles = {
    border: "1px solid black",
    backgroundColor: "#b9ffc8"
}

const Navibar = ({account, setAccount, setCurrentPage}) => {
    const isConnected = Boolean(account[0]);


    const [balance, setBalance] = useState([]);

    async function connectAccount() {
        if (window.ethereum) {
            const account = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            setAccount(account);
        }
    }

    function showAccount() {
        getBalance();
        const shortAccount = account[0].substr(0,6) + "..." + account[0].substr(account[0].length-4, account[0].length);
        return(
            <div>
                <strong>Account: </strong>{shortAccount}
                
                <strong style={{marginLeft: "5px"}}>Balance: </strong>{Math.round(balance * 1000) / 1000}<strong style={{marginLeft: "5px"}}>ETH</strong>
            </div>
        );
    }

    async function getBalance() {
        const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [account[0], "latest"]
        });
        setBalance(ethers.utils.formatEther(balance));
    }

    return (
        <div style={{margin: "1%"}}>
            <Navbar style={styles} className={"p-3"}>
                <Navbar.Brand>Pear2Pear</Navbar.Brand>
                <Navbar.Toggle aria-controls={"responsive-navber-nav"} />
                <Navbar.Collapse id={"responsive-navber-nav"}>
                    <Nav className={"mr-auto"}>
                        <Nav.Link onClick={() => {setCurrentPage('Home');}}>Home</Nav.Link>
                        <Nav.Link onClick={() => {setCurrentPage('Sellers');}}>Buy Crypto</Nav.Link>
                        <Nav.Link onClick={() => {setCurrentPage('Sell');}}>Sell Crypto</Nav.Link>
                    </Nav>
                    <Nav className={"ms-auto"}>
                        {isConnected ? (
                            showAccount()
                        ): (
                            <Button onClick={connectAccount} variant={"outline-secondary"}>Connect wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default Navibar;