import {Contract, ethers} from "ethers";
import detectEthereumProvider from "@metamask/detect-provider/dist/detect-provider";
import Pear2PearNoMediator from "./contracts/Pear2PearNoMediator.json"
import SessionId from "./EventCatch";

const ApproveSeller = async () => {
    console.log("lets ApproveSendmentByBuyer")
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
    console.log(SessionId.sessionId);

    let tx = await pear2PearNoMediator.approveSeller(SessionId.sessionId);
    await tx.wait();
}
export default ApproveSeller;