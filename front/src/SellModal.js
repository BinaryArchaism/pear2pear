import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap'
import "./SellModal.css"

const styles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
}

const SellModal = ({account, setCurrentPage}) => {
    const isConnected = Boolean(account[0]);

    const handleClose = () => setCurrentPage('Home');

    function showIfNotConnected() {
        return (
            <Modal show={!isConnected} onHide={handleClose} style={styles} centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>You must be connected to the wallet to sell crypto</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const [amount, setAmount] = useState()
    const [currency, setCurrency] = useState()

    const handleChangeAmount = (event) => setAmount(event.target.value);
    const handleChangeCurrency = (event) => setCurrency(event.target.value);

    function handleSubmit(event) {
        event.preventDefault();
        const seller = {
            address: account[0],
            total_amount: parseFloat(amount),
            currency: parseFloat(currency),
        };
        fetch("http://localhost:8080/add_seller_to_queue",
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(seller)
            })
            .then((response
            ) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            });
    }

    function sell() {
        return (
            <div className={"modals"}>
                <Modal show={isConnected} onHide={handleClose} centered={true} autoFocus={true}>
                    <Modal.Header closeButton>
                        <Modal.Title className={"modal-content"}>Trade offer</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleSubmit} className={"m-2"}>
                        <Modal.Body className={"modal-body"}>

                            <div className={"px-2"}>
                                <label>
                                    Amount of eth:
                                    <input type="text" name="amount" onChange={handleChangeAmount} />
                                </label>
                            </div>
                            <div className={"px-2"}>
                                <label>
                                    Price per eth:
                                    <input type="text" name="currency" onChange={handleChangeCurrency} />
                                </label>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className={"px-2"} type="submit" variant="primary" >
                                Publish
                            </Button>
                            <Button variant="secondary" onClick={() => setCurrentPage('Sellers')}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }

    return (
        <div>
            {isConnected ? (
                sell()
            ): (
                showIfNotConnected()
            )}
        </div>
    );
}

export default SellModal;