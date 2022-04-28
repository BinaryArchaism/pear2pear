import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap'

const SellModal = ({account, setCurrentPage}) => {
    const isConnected = Boolean(account[0]);

    const handleClose = () => setCurrentPage('Home');

    function showIfNotConnected() {
        return (
            <Modal show={!isConnected} onHide={handleClose}>
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
            <Modal show={isConnected} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add your suggestion to platform</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Amount of eth:
                            <input type="text" name="amount" onChange={handleChangeAmount} />
                        </label>
                        <label>
                            Currency of eth:
                            <input type="text" name="currency" onChange={handleChangeCurrency} />
                        </label>
                        <Button type="submit" variant="primary" >
                            Publish
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCurrentPage('Sellers')}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
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