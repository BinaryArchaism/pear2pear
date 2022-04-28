import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navibar from "./Navibar";
import {Button, Container, Modal} from "react-bootstrap";
import Sellers from "./Sellers";
import Home from "./Home";
import SellModal from './SellModal';
import axios from "axios";
import Trade from "./Trade";
import BuyCrypto from "./Components/wallet/Buy";

const App = () => {
    const [account, setAccount] = useState([]);
    const [currentPage, setCurrentPage] = useState('');
    const [isBuyer, setIsBuyer] = useState(false);
    const [sessionId, setSessionId] = useState();

    const [suggestion, setSuggestion] = useState(undefined);
    useEffect(() => {
        const interval = setInterval(() => {
            if (currentPage !== 'Trade') {
                axios.post(`http://localhost:8080/check_if_suggestion`, {"address": account[0], "is_buyer": isBuyer}, )
                    .then(res => {
                        setSuggestion({
                            "seller_address": res.data.seller_address,
                            "buyer_address": res.data.buyer_address,
                            "amount_suggestion": res.data.amount_suggestion
                        });
                        if (res.data.buyer_address === account[0]) {
                            setIsBuyer(true)
                        }
                        if (res.data.buyer_address !== account[0]) {
                            setClose(suggestion === undefined)
                            setIsBuyer(false)
                        }
                    });
                console.log(isBuyer)
            }
        }, 5000);
        return () => clearInterval(interval);
    });
    useEffect(() => {
        if (isBuyer) setCurrentPage("Trade")
    })
    const [close, setClose] = useState(false)
    const handleClose = () => setClose(false);
    function showSuggestion() {
        if (!suggestion) return <></>
        return (
            <Modal show={close} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Suggestion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>From: {suggestion.buyer_address}</p>
                    <p>Amount: {suggestion.amount_suggestion}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                            setCurrentPage('Trade');
                            BuyCrypto(account, suggestion.buyer_address, suggestion.amount_suggestion, setSessionId);
                            handleClose();
                        }
                    }>
                        Apply
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function showPageToRender() {
        switch(currentPage) {
            case 'Home':
                return <Home account={account} setAccount={setAccount}/>;
            case 'Sellers':
                return <Sellers account={account}/>;
            case 'Sell':
                return <SellModal account={account} setCurrentPage={setCurrentPage}/>;
            case 'Trade':
                return <Trade account={account} isBuyer={isBuyer} suggestion={suggestion} sessionId={sessionId} setSessionId={setSessionId}/>;
            default:
                return <Home />;
        }
    }

    return (
        <Container>
            <Navibar account={account} setAccount={setAccount} setCurrentPage={setCurrentPage}/>
            {showPageToRender()}
            {showSuggestion()}
        </Container>
    );
}

export default App;
