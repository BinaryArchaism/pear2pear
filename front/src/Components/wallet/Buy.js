import {Contract, ethers} from "ethers";
import detectEthereumProvider from "@metamask/detect-provider/dist/detect-provider";
import Pear2PearNoMediator from "./contracts/Pear2PearNoMediator.json"
//eslint-disable-next-line
import SessionId from "./EventCatch";
import axios from "axios";

const BuyCrypto = async (account, addressBuyer, amount, setSessionId) => {
    let provider = await detectEthereumProvider();
    if(!provider) {
        return
    }
    await provider.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(provider);
    const signer = provider.getSigner();
    const pear2PearNoMediator = new Contract(
        "0xD871A341fE03823D62E2f09f87eE54404Bd3484B",
        Pear2PearNoMediator.abi,
        signer
    );

    let tx = await pear2PearNoMediator.sendOffer(addressBuyer, {value: ethers.utils.parseEther(amount.toLocaleString())});
    tx = await tx.wait();

    //eslint-disable-next-line
    const event = tx.events.find(event => event.event === 'TradeOffer');
    setSessionId(event.args[2]);
    axios.post("http://localhost:8080/create_session",
        {
            "buy_suggestion": {
                "seller_address": account[0],
                "buyer_address": addressBuyer,
                "amount_suggestion": amount
            },
            "session_id": event.args[2]
        }
    ).then()
}
export default BuyCrypto;