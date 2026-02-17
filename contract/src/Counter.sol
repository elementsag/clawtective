// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract WithdrawFunds {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }

    function withdraw() public payable{
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
    }


}
