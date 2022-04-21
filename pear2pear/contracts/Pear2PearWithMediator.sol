//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Pear2PearWithMediator is Ownable {
    struct SessionStruct {
        uint startTime;
        address seller;
        address mediator;
        address buyer;
        uint assets;
        uint mediatorCollateral;
        bool tradeCompleted;
        address courtCalledBy;
        bool isUnderCourtControl;
        bool isEnded;
    }

    event TradeOffer(address indexed buyer, address indexed seller, uint sessionId);
    event EmitCourt(address indexed buyer, address indexed seller, address indexed mediator);

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

    function sendOffer(address buyer, address seller) external payable {
        uint assets = msg.value / 3;

        _offers[_sessionCounter] = SessionStruct(block.timestamp, seller, msg.sender, buyer, 0, 0, false, address(0), false, false);

        payable(address(this)).transfer(msg.value);

        _offers[_sessionCounter].mediatorCollateral = msg.value;
        _offers[_sessionCounter].assets = assets;

        emit TradeOffer(msg.sender, buyer, _sessionCounter);

        _sessionCounter += 1;
    }
    /*
    function readyBuyer(uint sessionId) external {
        require(msg.sender == _offers[sessionId].buyer);
        require(_offers[sessionId].buyerReady == false);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].isUnderCourtControl == false);

        _offers[sessionId].buyerReady = true;
        if (_offers[sessionId].sellerReady) {
            _offers[sessionId].tradeStarted = true;
        }
    }

    function readySeller(uint sessionId) external {
        require(msg.sender == _offers[sessionId].seller);
        require(_offers[sessionId].sellerReady == false);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].isUnderCourtControl == false);

        _offers[sessionId].sellerReady = true;
        if (_offers[sessionId].buyerReady) {
            _offers[sessionId].tradeStarted = true;
        }
    }

    function approveBuyer(uint sessionId) external {
        require(msg.sender == _offers[sessionId].buyer);
        require(_offers[sessionId].buyerApproved == false);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].isUnderCourtControl == false);
        require(_offers[sessionId].tradeStarted == true);

        _offers[sessionId].buyerApproved = true;

        if (_offers[sessionId].sellerApproved) {
            _offers[sessionId].isEnded = true;
            payable(_offers[sessionId].mediator).transfer(_offers[sessionId].mediatorCollateral);
        }
    }

    function approveSeller(uint sessionId) external {
        require(msg.sender == _offers[sessionId].seller);
        require(_offers[sessionId].sellerApproved == false);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].isUnderCourtControl == false);  
        require(_offers[sessionId].tradeStarted == true);   

        _offers[sessionId].sellerApproved = true;

        if (_offers[sessionId].buyerApproved) {
            _offers[sessionId].isEnded = true;
            payable(_offers[sessionId].mediator).transfer(_offers[sessionId].mediatorCollateral);
        }
    }
    */
    function finishTrade(uint sessionId) external {
        require(msg.sender == _offers[sessionId].mediator);
        require(block.timestamp >= _offers[sessionId].startTime + _expireTime);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].isUnderCourtControl == false);

        payable(_offers[sessionId].mediator).transfer(_offers[sessionId].mediatorCollateral);

        _offers[sessionId].isEnded = true;
    }

    function callTheCourt(uint sessionId) external payable {
        require(msg.sender == _offers[sessionId].seller || msg.sender == _offers[sessionId].buyer);
        require(_offers[sessionId].isEnded == false);
        require(_offers[sessionId].isUnderCourtControl == false);
        require(msg.value == _offers[sessionId].assets);

        _offers[sessionId].isUnderCourtControl = true;
        _offers[sessionId].courtCalledBy = msg.sender;

        
        emit EmitCourt(_offers[sessionId].buyer, _offers[sessionId].seller, _offers[sessionId].mediator);

    }

    function transferMoney(uint sessionId, uint option) external {
        require(msg.sender == courtContract);
        require(_offers[sessionId].isUnderCourtControl == true);
        require(_offers[sessionId].isEnded == false);
        require(option == 1 || option == 2 || option == 3 || option == 4);

        uint courtPrice = _offers[sessionId].assets;

        if (option == 1) {
            // seller is cheated
            payable(_offers[sessionId].seller).transfer(_offers[sessionId].assets);
            payable(_offers[sessionId].courtCalledBy).transfer(courtPrice * 2);
        }
        else if (option == 2) {
            // buyer is cheated
            payable(_offers[sessionId].buyer).transfer(_offers[sessionId].assets);
            payable(_offers[sessionId].courtCalledBy).transfer(courtPrice * 2);
        }
        else if (option == 3) {
            // both are cheated
            payable(_offers[sessionId].seller).transfer(_offers[sessionId].assets);
            payable(_offers[sessionId].buyer).transfer(_offers[sessionId].assets);
            payable(_offers[sessionId].courtCalledBy).transfer(courtPrice);
        }
        else if (option == 4) {
            // nobody cheated
            payable(_offers[sessionId].mediator).transfer(_offers[sessionId].mediatorCollateral);
        }
        payable(courtContract).transfer(courtPrice);

        _offers[sessionId].isEnded = true;
    } 


}
