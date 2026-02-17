// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract WithdrawFunds {
    address public owner;
    
    event Deposit(address indexed from, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        require(msg.value > 0, "Must send BNB");
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public payable {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
