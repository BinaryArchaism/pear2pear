const { expect } = require("chai");
const { ethers } = require("hardhat");

const ONE_ETH = ethers.utils.parseEther('1.0');

describe("Pear2PearWithMediator", function () {
  let owner, buyer, seller, court, mediator;
  let Contract, contract;
  let initialSellerBalance, initialBuyerBalance, initialCourtBalance, initialMediatorBalance
  let rc, rs;

  beforeEach(async function () {
    [owner, buyer, seller, court, mediator] = await ethers.getSigners();
    initialSellerBalance = await seller.getBalance();
    initialBuyerBalance = await buyer.getBalance();
    initialCourtBalance = await court.getBalance();
    initialMediatorBalance = await mediator.getBalance();

    Contract = await ethers.getContractFactory("Pear2PearWithMediator", owner);
    contract = await Contract.deploy(court.address, 60);
    await contract.deployed();
  });

  it("Good scenario", async function() {
    rs = await contract.connect(mediator).sendOffer(buyer.address, seller.address, {value: ONE_ETH.mul(3)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    // ** men trade money and the mediator cheats nobody **

    // *time is out and nobody called for the court*
    await contract._changeExpireTime(0);

    // *mediator withdraw his collateral*
    rs = await contract.connect(mediator).finishTrade(sessionId);
    rc = await rs.wait();
    const finishTradeGasPrice = rs.gasPrice.mul(rc.gasUsed)
    
    // *seller tries to call for the court, but its too late*
    await expect(contract.connect(seller).callTheCourt(sessionId)).to.be.reverted;

    expect(await mediator.getBalance()).to.equal(initialMediatorBalance.sub(sendOfferGasPrice).sub(finishTradeGasPrice));
  });
  it("Buyer calls the court scenario but seller is cheated", async function() {
    rs = await contract.connect(mediator).sendOffer(buyer.address, seller.address, {value: ONE_ETH.mul(3)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    // ** men trade money and the mediator cheats seller **
    // *mediator can't withdraw his money*
    await expect(contract.connect(mediator).finishTrade(sessionId)).to.be.reverted;
    // *buyer calls for court*
    rs = await contract.connect(buyer).callTheCourt(sessionId, {value: ONE_ETH})
    rc = await rs.wait();
    const callTheCourtGasPrice = rs.gasPrice.mul(rc.gasUsed);

    // *mediator can't withdraw his collateral now*
    await expect(contract.connect(mediator).finishTrade(sessionId)).to.be.reverted;
    
    // *caller decide to choose scenario 1 (seller is cheated)*
    rs = await contract.connect(court).transferMoney(sessionId, 1);
    rc = await rs.wait();
    const transMoneyGasPrice = rs.gasPrice.mul(rc.gasUsed);

    expect(await mediator.getBalance()).to.equal(initialMediatorBalance.sub(ONE_ETH.mul(3)).sub(sendOfferGasPrice));
    expect(await seller.getBalance()).to.equal(initialSellerBalance.add(ONE_ETH));
    expect(await buyer.getBalance()).to.equal(initialBuyerBalance.add(ONE_ETH).sub(callTheCourtGasPrice));
    expect(await court.getBalance()).to.equal(initialCourtBalance.add(ONE_ETH).sub(transMoneyGasPrice));

  });
  it("Buyer calls the court scenario and buyer is cheated", async function() {
    rs = await contract.connect(mediator).sendOffer(buyer.address, seller.address, {value: ONE_ETH.mul(3)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    // ** men trade money and the mediator cheats buyer **
    // *mediator can't withdraw his money*
    await expect(contract.connect(mediator).finishTrade(sessionId)).to.be.reverted;

    // *buyer calls for court*
    rs = await contract.connect(buyer).callTheCourt(sessionId, {value: ONE_ETH})
    rc = await rs.wait();
    const callTheCourtGasPrice = rs.gasPrice.mul(rc.gasUsed);

    // *mediator can't withdraw his collateral now*
    await expect(contract.connect(mediator).finishTrade(sessionId)).to.be.reverted;
    
    // *caller decide to choose scenario 2 (buyer is cheated)*
    rs = await contract.connect(court).transferMoney(sessionId, 2);
    rc = await rs.wait();
    const transMoneyGasPrice = rs.gasPrice.mul(rc.gasUsed);

    expect(await mediator.getBalance()).to.equal(initialMediatorBalance.sub(ONE_ETH.mul(3)).sub(sendOfferGasPrice));
    expect(await seller.getBalance()).to.equal(initialSellerBalance);
    expect(await buyer.getBalance()).to.equal(initialBuyerBalance.add(ONE_ETH.mul(2)).sub(callTheCourtGasPrice));
    expect(await court.getBalance()).to.equal(initialCourtBalance.add(ONE_ETH).sub(transMoneyGasPrice));
  });
  it("Buyer calls the court scenario but both cheated", async function() {
    rs = await contract.connect(mediator).sendOffer(buyer.address, seller.address, {value: ONE_ETH.mul(3)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    // ** men trade money and the mediator cheats buyer **
    // *mediator can't withdraw his money*
    await expect(contract.connect(mediator).finishTrade(sessionId)).to.be.reverted;

    // *buyer calls for court*
    rs = await contract.connect(buyer).callTheCourt(sessionId, {value: ONE_ETH})
    rc = await rs.wait();
    const callTheCourtGasPrice = rs.gasPrice.mul(rc.gasUsed);

    // *mediator can't withdraw his collateral now*
    await expect(contract.connect(mediator).finishTrade(sessionId)).to.be.reverted;
    
    // *caller decide to choose scenario 2 (buyer is cheated)*
    rs = await contract.connect(court).transferMoney(sessionId, 3);
    rc = await rs.wait();
    const transMoneyGasPrice = rs.gasPrice.mul(rc.gasUsed);

    expect(await mediator.getBalance()).to.equal(initialMediatorBalance.sub(ONE_ETH.mul(3)).sub(sendOfferGasPrice));
    expect(await seller.getBalance()).to.equal(initialSellerBalance.add(ONE_ETH));
    expect(await buyer.getBalance()).to.equal(initialBuyerBalance.add(ONE_ETH).sub(callTheCourtGasPrice));
    expect(await court.getBalance()).to.equal(initialCourtBalance.add(ONE_ETH).sub(transMoneyGasPrice));
  });
  it("Seller calls the court scenario but nobody", async function() {
    rs = await contract.connect(mediator).sendOffer(buyer.address, seller.address, {value: ONE_ETH.mul(3)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    // ** men trade money and the mediator cheats buyer **
    // *mediator can't withdraw his money*
    await expect(contract.connect(mediator).finishTrade(sessionId)).to.be.reverted;

    // *buyer calls for court*
    rs = await contract.connect(seller).callTheCourt(sessionId, {value: ONE_ETH})
    rc = await rs.wait();
    const callTheCourtGasPrice = rs.gasPrice.mul(rc.gasUsed);

    // *mediator can't withdraw his collateral now*
    await expect(contract.connect(mediator).finishTrade(sessionId)).to.be.reverted;
    
    // *caller decide to choose scenario 2 (buyer is cheated)*
    rs = await contract.connect(court).transferMoney(sessionId, 4);
    rc = await rs.wait();
    const transMoneyGasPrice = rs.gasPrice.mul(rc.gasUsed);

    expect(await mediator.getBalance()).to.equal(initialMediatorBalance.sub(sendOfferGasPrice));
    expect(await seller.getBalance()).to.equal(initialSellerBalance.sub(ONE_ETH).sub(callTheCourtGasPrice));
    expect(await buyer.getBalance()).to.equal(initialBuyerBalance);
    expect(await court.getBalance()).to.equal(initialCourtBalance.add(ONE_ETH).sub(transMoneyGasPrice));
  });
});
