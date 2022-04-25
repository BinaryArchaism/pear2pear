import React from "react";
import {Button, Table} from "react-bootstrap";
import BuyCrypto from "./Components/wallet/Buy";
import ApproveBuying from "./Components/wallet/ApproveBuying";
import ApproveSendmentByBuyer from "./Components/wallet/ApproveSendmentByBuyer";
import ApproveSeller from "./Components/wallet/ApproveSeller";
import CancelTrade from "./Components/wallet/CancelTrade";
import CallCourt from "./Components/wallet/CallCourt";

const styles = {
    margin: "1%"
}

export default function Sellers() {
    return (
        <div style={styles}>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Nickname</th>
                    <th>Max amount</th>
                    <th>Currency</th>
                    <th>Buy</th>
                </tr>
                </thead>
                <tbody>
                {getSellers()}
                </tbody>
            </Table>
        </div>
    );
}

function getSellers() {
    let sellers = [
        {id: 1, name: "random", amount: 1000, currency: 3700, address: "0x9ec60043d3466a31cadd2810fb15638125777376"},
        {id: 2, name: "test", amount: 90, currency: 3701},
        {id: 3, name: "lol", amount: 432, currency: 3690},
        {id: 4, name: "kek", amount: 23, currency: 3700},
    ]
    return (
        sellers.map(seller => {
            return (
                <tr>
                    <td>{seller.id}</td>
                    <td>{seller.name}</td>
                    <td>{seller.amount}</td>
                    <td>{seller.currency}</td>
                    <td>
                        <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() => BuyCrypto()}>Buy</Button>
                    </td>
                </tr>
            )
        })
    )
}