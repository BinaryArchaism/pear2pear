//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Pear2PearNoMediator is Ownable {
    struct SessionStruct {
        uint startTime;
        address seller;
        address buyer;
        uint assets;
        uint sellerCollateral;
        bool isAccepted;
        uint buyerCollateral;
        bool buyerApproved;
        bool sellerApproved;
        bool isUnderCourtControl;
        bool isEnded;
    }

    event TradeOffer(address indexed sender, address indexed partner, uint sessionId);
    event EmitCourt(address indexed sender, address indexed partner, uint assets);

    mapping(uint => SessionStruct) _offers;

    uint _sessionCounter;
    
    uint _expireTime;

    address public courtContract;

    constructor(address courtContract_, uint expireTime) {
        courtContract = courtContract_;
        _expireTime = expireTime;
    }

    receive() payable external {}

    function _changeExpireTime(uint newTime) external onlyOwner {
        _expireTime = newTime;
    }

    function sendOffer(address buyer) external payable {
        uint assets = msg.value / 2;

        _offers[_sessionCounter] = SessionStruct(block.timestamp, msg.sender, buyer, 0, 0, false, 0, false, false, false, false);

        payable(address(this)).transfer(msg.value);

        _offers[_sessionCounter].sellerCollateral = msg.value;
        _offers[_sessionCounter].assets = assets;

        emit TradeOffer(msg.sender, buyer, _sessionCounter);

        _sessionCounter += 1;
    }

    function acceptOffer(uint sessionId) external payable {
        require(msg.sender == _offers[sessionId].buyer);
        require(_offers[sessionId].isAccepted == false);
        require(msg.value >= _offers[sessionId].assets);

         _offers[sessionId].isAccepted = true;
         _offers[sessionId].buyerCollateral = msg.value;

    }

    function approveBuyer(uint sessionId) external {
        require(msg.sender == _offers[sessionId].buyer);
        require(_offers[sessionId].buyerApproved == false);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].isAccepted == true);
        require(_offers[sessionId].isUnderCourtControl == false);

        _offers[sessionId].buyerApproved = true;
    }

    function approveSeller(uint sessionId) external {
        require(msg.sender == _offers[sessionId].seller);
        require(_offers[sessionId].buyerApproved == true);
        require(_offers[sessionId].isUnderCourtControl == false);     

        _offers[sessionId].sellerApproved = true;

        payable(_offers[sessionId].buyer).transfer(_offers[sessionId].assets + _offers[sessionId].buyerCollateral);
        
        // return rest collateral if exists
        uint restCollateral = _offers[sessionId].sellerCollateral - _offers[sessionId].assets;
        if (restCollateral != 0) {
            payable(_offers[sessionId].seller).transfer(restCollateral);
        }

        _offers[sessionId].isEnded = true;
    }

    function cancelTrade(uint sessionId) external {
        require(msg.sender == _offers[sessionId].seller || msg.sender == _offers[sessionId].buyer);
        require(_offers[sessionId].buyerApproved == false);
        require(block.timestamp >= _offers[sessionId].startTime + _expireTime);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].isUnderCourtControl == false);

        payable(_offers[sessionId].seller).transfer(_offers[sessionId].sellerCollateral);

        if (_offers[sessionId].isAccepted) {
            payable(_offers[sessionId].buyer).transfer(_offers[sessionId].buyerCollateral);
        }
        _offers[sessionId].isEnded = true;
    }

    function callTheCourt(uint sessionId) external {
        require(msg.sender == _offers[sessionId].seller || msg.sender == _offers[sessionId].buyer);
        require(block.timestamp >= _offers[sessionId].startTime + _expireTime);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].buyerApproved == true);
        require(_offers[sessionId].isUnderCourtControl == false);

        _offers[sessionId].isUnderCourtControl = true;
        
        emit EmitCourt(msg.sender, 
                       msg.sender == _offers[sessionId].seller ? _offers[sessionId].buyer : _offers[sessionId].seller,
                       _offers[sessionId].assets);

    }

    function transferMoneyTo(uint sessionId, address to) external {
        require(msg.sender == courtContract);
        require(_offers[sessionId].isUnderCourtControl == true);
        require(_offers[sessionId].isEnded == false);
        require(to == _offers[sessionId].buyer || _offers[sessionId].seller == to);

        uint courtPrice = _offers[sessionId].assets;

        payable(to).transfer(_offers[sessionId].sellerCollateral + _offers[sessionId].buyerCollateral - courtPrice);
        payable(courtContract).transfer(courtPrice);

        _offers[sessionId].isEnded = true;
    } 


}
