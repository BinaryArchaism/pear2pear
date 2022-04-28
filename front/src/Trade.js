import React from "react";
import {Button} from "react-bootstrap";
import ApproveBuying from "./Components/wallet/ApproveBuying";
import ApproveSendmentByBuyer from "./Components/wallet/ApproveSendmentByBuyer";
import CancelTrade from "./Components/wallet/CancelTrade";
import CallCourt from "./Components/wallet/CallCourt";
import ApproveSeller from "./Components/wallet/ApproveSeller";
import axios from "axios";

const Trade = ({account, isBuyer, suggestion, sessionId, setSessionId}) => {
    if (isBuyer) {
        axios.post(`http://localhost:8080/get_session_id`, {
            "seller_address": suggestion.seller_address,
            "buyer_address": suggestion.buyer_address,
            "amount_suggestion": suggestion.amount_suggestion
        })
            .then(res => {
                setSessionId(res.data);
            });
    }

    function showForBuyer() {
        return (
            <div className={"row mt-4"}>
                <div className={"col-sm d-flex justify-content-around"}>
                    <Button variant={"success"} onClick={() => ApproveBuying(sessionId, suggestion.amount_suggestion)}>Approve trade</Button>
                    <Button variant={"success"} onClick={() => ApproveSendmentByBuyer(sessionId)}>Approve sending</Button>
                </div>
                <div className={"col-sm d-flex justify-content-around"}>
                    <Button variant={"danger"} onClick={() => CancelTrade(sessionId)}>Cancel trade</Button>
                    <Button variant={"danger"} onClick={() => CallCourt(sessionId)}>Call the court</Button>
                </div>
            </div>
        );
    }

    function showForSeller() {
        return (
            <div>
                <div className={"col-sm"}>
                    <Button style={{marginRight: "5px"}} variant={"success"} onClick={() => ApproveSeller(sessionId)}>Approve receipt</Button>
                </div>
                <div className={"col-sm"}>
                    <Button style={{marginRight: "5px"}} variant={"danger"} onClick={() => CancelTrade(sessionId)}>Cancel trade</Button>
                    <Button style={{marginRight: "5px"}} variant={"danger"} onClick={() => CallCourt(sessionId)}>Call the court</Button>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className={"m-4"}>
            <h3 className={"mb-3"}>Trade information</h3>
            <p>Address of seller: {suggestion.seller_address}</p>
            <p>Address of buyer: {suggestion.buyer_address}</p>
            <p>Transaction amount: {suggestion.amount_suggestion}</p>
            <h4 className={"mt-5 m-2"}>Control buttons</h4>
        </div>
        <div>
            {isBuyer ? (
                showForBuyer()
            ) : (
                showForSeller()
            )}
        </div>
        </>
    );
}

export default Trade;