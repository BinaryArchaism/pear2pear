import React from 'react';
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

    function sell() {
        return (
            <Modal show={isConnected} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add your suggestion to platform</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>How much ethers you want to sell? </p>
                    <p>What's currency of yours ethers? </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setCurrentPage('Sellers')}>
                        Publish
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
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