const { expect } = require("chai");
const { ethers } = require("hardhat");

const ONE_ETH = ethers.utils.parseEther('1.0');

describe("Pear2PearNoMediator", function () {
  let owner, buyer, seller, court, user;
  let Contract, contract;
  let initialSellerBalance, initialBuyerBalance, initialCourtBalance
  let rc, rs;

  beforeEach(async function () {
    [owner, buyer, seller, court, user] = await ethers.getSigners();
    initialSellerBalance = await seller.getBalance();
    initialBuyerBalance = await buyer.getBalance();
    initialCourtBalance = await court.getBalance();

    Contract = await ethers.getContractFactory("Pear2PearNoMediator", owner);
    contract = await Contract.deploy(court.address, 60);
    await contract.deployed();
  });

  it("Good scenario", async function() {
    rs = await contract.connect(seller).sendOffer(buyer.address, {value: ONE_ETH.mul(2)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    rs = await contract.connect(buyer).acceptOffer(sessionId, {value: ONE_ETH});
    rc = await rs.wait();
    const acceptOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    // *seller tries to cancel offer*
    await expect(contract.connect(seller).cancelTrade(sessionId)).to.be.reverted;

    // *buyer sends money*
    rs = await contract.connect(buyer).approveBuyer(sessionId);
    rc = await rs.wait();
    const approveBuyerGasPrice = rs.gasPrice.mul(rc.gasUsed)
    // *seller gets money*
    rs = await contract.connect(seller).approveSeller(sessionId);
    rc = await rs.wait();
    const approveSellerGasPrice = rs.gasPrice.mul(rc.gasUsed)
    
    expect(await buyer.getBalance()).to.equal(initialBuyerBalance.add(ONE_ETH).sub(acceptOfferGasPrice).sub(approveBuyerGasPrice));
    expect(await seller.getBalance()).to.equal(initialSellerBalance.sub(ONE_ETH).sub(sendOfferGasPrice).sub(approveSellerGasPrice));
  });
  it("Timeout scenario", async function() {
    rs = await contract.connect(seller).sendOffer(buyer.address, {value: ONE_ETH.mul(2)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    rs = await contract.connect(buyer).acceptOffer(sessionId, {value: ONE_ETH});
    rc = await rs.wait();
    const acceptOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    // *cant call the court*
    await expect(contract.connect(seller).callTheCourt(sessionId)).to.be.reverted;

    // *wait for 1 minute and no result*
    await contract._changeExpireTime(0);

    // *cant call the court*
    await expect(contract.connect(seller).callTheCourt(sessionId)).to.be.reverted;

    // *seller cancels offer*
    rs = await contract.connect(seller).cancelTrade(sessionId);
    rc = await rs.wait();
    const cancelOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)
    
    expect(await buyer.getBalance()).to.equal(initialBuyerBalance.sub(acceptOfferGasPrice));
    expect(await seller.getBalance()).to.equal(initialSellerBalance.sub(sendOfferGasPrice).sub(cancelOfferGasPrice));
  });
  it("Buyer calls the court scenario", async function() {
    rs = await contract.connect(seller).sendOffer(buyer.address, {value: ONE_ETH.mul(2)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    rs = await contract.connect(buyer).acceptOffer(sessionId, {value: ONE_ETH});
    rc = await rs.wait();
    const acceptOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    // *buyer sends money*
    rs = await contract.connect(buyer).approveBuyer(sessionId);
    rc = await rs.wait();
    const approveBuyerGasPrice = rs.gasPrice.mul(rc.gasUsed)
    // *seller doesn't get money*
    // *seller wait 1 minute and tries to cancel trade but no result*
    await contract._changeExpireTime(0);
    await expect(contract.connect(seller).cancelTrade(sessionId)).to.be.reverted;
    // *buyer decides to call the court*
    rs = await contract.connect(buyer).callTheCourt(sessionId);
    rc = await rs.wait();
    const callTheCourtGasPrice = rs.gasPrice.mul(rc.gasUsed)
    // *nobody can do any actions*
    await expect(contract.connect(seller).cancelTrade(sessionId)).to.be.reverted;
    await expect(contract.connect(buyer).callTheCourt(sessionId)).to.be.reverted;
    await expect(contract.connect(buyer).cancelTrade(sessionId)).to.be.reverted;
    await expect(contract.connect(seller).approveSeller(sessionId)).to.be.reverted;

    // *court gets the rule and send money to buyer and gets its own interest*
    rs = await contract.connect(court).transferMoneyTo(sessionId, buyer.address);
    rc = await rs.wait();
    const transferMoneyToGasPrice = rs.gasPrice.mul(rc.gasUsed)
    
    expect(await buyer.getBalance()).to.equal(initialBuyerBalance
      .add(ONE_ETH)
      .sub(approveBuyerGasPrice)
      .sub(acceptOfferGasPrice)
      .sub(callTheCourtGasPrice));
    expect(await seller.getBalance()).to.equal(initialSellerBalance.sub(ONE_ETH.mul(2)).sub(sendOfferGasPrice));
    expect(await court.getBalance()).to.equal(initialCourtBalance.add(ONE_ETH).sub(transferMoneyToGasPrice));
  });
  it("Seller calls the court scenario", async function() {
    rs = await contract.connect(seller).sendOffer(buyer.address, {value: ONE_ETH.mul(2)});
    rc = await rs.wait();
    const sendOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    const event = rc.events.find(event => event.event === 'TradeOffer');
    const [from, to, sessionId] = event.args;

    rs = await contract.connect(buyer).acceptOffer(sessionId, {value: ONE_ETH});
    rc = await rs.wait();
    const acceptOfferGasPrice = rs.gasPrice.mul(rc.gasUsed)

    // *buyer says he sended money*
    rs = await contract.connect(buyer).approveBuyer(sessionId);
    rc = await rs.wait();
    const approveBuyerGasPrice = rs.gasPrice.mul(rc.gasUsed)
    // *seller doesn't get money*
    // *seller tries to call the court earlier*
    await expect(contract.connect(seller).callTheCourt(sessionId)).to.be.reverted;
    // *seller wait 1 minute and tries to cancel trade but no result*
    await contract._changeExpireTime(0);
    // *seller decides to call the court*
    rs = await contract.connect(seller).callTheCourt(sessionId);
    rc = await rs.wait();
    const callTheCourtGasPrice = rs.gasPrice.mul(rc.gasUsed)
    // *nobody can do any actions*
    await expect(contract.connect(seller).cancelTrade(sessionId)).to.be.reverted;
    await expect(contract.connect(buyer).callTheCourt(sessionId)).to.be.reverted;
    await expect(contract.connect(buyer).cancelTrade(sessionId)).to.be.reverted;
    await expect(contract.connect(seller).approveSeller(sessionId)).to.be.reverted;

    // *court gets the rule and send money to buyer and gets its own interest*
    rs = await contract.connect(court).transferMoneyTo(sessionId, seller.address);
    rc = await rs.wait();
    const transferMoneyToGasPrice = rs.gasPrice.mul(rc.gasUsed)
    
    expect(await buyer.getBalance()).to.equal(initialBuyerBalance.sub(ONE_ETH).sub(approveBuyerGasPrice).sub(acceptOfferGasPrice));
    expect(await seller.getBalance()).to.equal(initialSellerBalance.sub(sendOfferGasPrice).sub(callTheCourtGasPrice));
    expect(await court.getBalance()).to.equal(initialCourtBalance.add(ONE_ETH).sub(transferMoneyToGasPrice));
  });
});
