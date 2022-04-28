import React, {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import axios from "axios";

const styles = {
    margin: "1%"
}

export default function Sellers({account}) {
    const [sellers, setSellers] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:8080/get_sellers_queue`)
            .then(res => {
                const data = res.data.map(obj => ({
                    name: obj.address,
                    amount: obj.total_amount,
                    currency: obj.currency
                }));
                setSellers(data);
            });
    }, [])

    const SendSuggestion = (addressSeller, addressBuyer, amount) => {
        axios.post("http://localhost:8080/send_buy_suggestion",
            {
                'seller_address': addressSeller,
                'buyer_address': addressBuyer,
                'amount_suggestion': amount
            }
        ).then()

     }

    const showSellers = () => {
        if (!sellers) return (<></>);
        return (
            sellers.map(seller => {
                return (
                    <tr key={seller.id}>
                        <td>{seller.name}</td>
                        <td>{seller.amount}</td>
                        <td>{seller.currency}</td>
                        <td>
                            <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() =>{SendSuggestion(seller.name, account[0], seller.amount)}}>Buy</Button>
                        </td>
                    </tr>
                )
            })
        );
    }

    return (
        <div style={styles}>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Address</th>
                    <th>Max amount</th>
                    <th>Currency</th>
                    <th>Buy</th>
                </tr>
                </thead>
                <tbody>
                {showSellers()}
                </tbody>
            </Table>
        </div>
    );
}