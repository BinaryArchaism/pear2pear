import {Contract, ethers} from "ethers";
import detectEthereumProvider from "@metamask/detect-provider/dist/detect-provider";
import Pear2PearNoMediator from "./contracts/Pear2PearNoMediator.json"
//eslint-disable-next-line
import SessionId from "./EventCatch";

const BuyCrypto = async () => {
    SessionId.sessionId = -1;
    console.log("lets sell")
    let provider = await detectEthereumProvider();
    if(!provider) {
        return
    }
    await provider.request({ method: 'eth_requestAccounts' });
    //const networkId = await provider.request({ method: 'net_version' })
    provider = new ethers.providers.Web3Provider(provider);
    const signer = provider.getSigner();
    const pear2PearNoMediator = new Contract(
        "0xD871A341fE03823D62E2f09f87eE54404Bd3484B",
        Pear2PearNoMediator.abi,
        signer
    );

    let tx = await pear2PearNoMediator.sendOffer("0xD4Badf85219EebaFE0964f6D69727887382F57AF", {value: ethers.utils.parseEther("0.1")});
    tx = await tx.wait();

    //eslint-disable-next-line
    const event = tx.events.find(event => event.event === 'TradeOffer');
    //SessionId.sessionId = event.args[2];
    console.log(SessionId.sessionId);

}
export default BuyCrypto;