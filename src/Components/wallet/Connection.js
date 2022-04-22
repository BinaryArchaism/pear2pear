import React from 'react'
import { ethers } from 'ethers';
import {Button} from "react-bootstrap";

export default class Wallet extends React.Component {
    constructor(props) {
        super(props);
        this.connectionButton = this.connectionButton.bind(this)
        this.state = {
            address: "",
            Balance: null,
        }
    }

    connectionButton = () => {
        // Asking if metamask is already present or not
        if (window.ethereum) {

            // res[0] for fetching a first wallet
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((res) => this.accountChangeHandler(res[0]));
        } else {
            alert("install metamask extension!!");
        }

        //ДОБАВИТЬ КОНТРАКТ с ефириум пактеа
    };

    // Function for getting handling all events
    accountChangeHandler = (account) => {
        // Setting an address data
        this.setState({
            address: account,
        });
        // Setting a balance
        this.getBalance(account);
    };

    // getbalance function for getting a balance in
    // a right format with help of ethers
    getBalance = (address) => {
        // Requesting balance method
        window.ethereum
            .request({
                method: "eth_getBalance",
                params: [address, "latest"]
            })
            .then((balance) => {
                // Setting balance
                this.setState({
                    Balance: ethers.utils.formatEther(balance),
                });
            });
    };

    getCard = () => {
        return(
            <div>
                <strong>Address: </strong>
                {this.state.address}
                <strong> Balance: </strong>
                {this.state.Balance}
            </div>
        );
    }

    render() {
        let printed;
        if (this.state.address === "") {
            printed = <Button onClick={this.connectionButton} variant="outline-secondary">Connect to wallet</Button>
        } else {
            printed = this.getCard()
        }
        return(
            <div>{printed}</div>
        );
    }
}

// const getBlockchain = () =>
//     new Promise( async (resolve, reject) => {
//         let provider = await detectEthereumProvider();
//         if(provider) {
//             await provider.request({ method: 'eth_requestAccounts' });
//             await provider.request({ method: 'net_version' });
//             provider = new ethers.providers.Web3Provider(provider);
//             const signer = provider.getSigner();
//             const pear2PearNoMediator = new Contract(
//                 Pear2PearNoMediator.contractName,
//                 Pear2PearNoMediator.abi,
//                 signer
//             );
//             resolve({pear2PearNoMediator});
//             return;
//         }
//         reject('Install Metamask');
//     });