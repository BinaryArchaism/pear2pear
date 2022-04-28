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

    return (
        <div>
            <p>{suggestion.seller_address}</p>
            <p>{suggestion.buyer_address}</p>
            <p>{suggestion.amount_suggestion}</p>
            {isBuyer ? (
                    <div>
                        <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() => ApproveBuying(sessionId, suggestion.amount_suggestion)}>ApproveBuying</Button>
                        <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() => ApproveSendmentByBuyer(sessionId)}>ApproveSendmentByBuyer</Button>
                        <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() => CancelTrade(sessionId)}>CancelTrade</Button>
                        <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() => CallCourt(sessionId)}>CallCourt</Button>
                    </div>
            ) : (
                <div>
                    <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() => ApproveSeller(sessionId)}>ApproveSeller</Button>
                    <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() => CancelTrade(sessionId)}>CancelTrade</Button>
                    <Button style={{marginRight: "5px"}} variant={"secondary"} onClick={() => CallCourt(sessionId)}>CallCourt</Button>
                </div>
            )}
        </div>
    );
}

export default Trade;