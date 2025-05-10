// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DigitalWallet {
    address public owner;  // The owner of the contract
    uint256 public spendingLimit;  // Daily spending limit for the owner
    uint256 public dailySpent;  // Amount spent in the current 24-hour period
    uint256 public lastResetTime;  // Timestamp for the last daily reset

    event Deposit(address indexed user, uint256 amount);  // Event for deposits
    event Withdraw(address indexed user, uint256 amount);  // Event for withdrawals
    event LimitSet(uint256 newLimit);  // Event for setting a new spending limit

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Constructor to accept Ether during deployment
    constructor() payable {
        require(msg.value > 0, "Deployment must include some Ether");
        owner = msg.sender;
        lastResetTime = block.timestamp;
        dailySpent = 0;
    }

    // Deposit Ether into the wallet
    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than zero");
        emit Deposit(msg.sender, msg.value);
    }

    // Set or update the spending limit for the owner
    function setSpendingLimit(uint256 limit) public onlyOwner {
        require(limit > 0, "Limit must be greater than zero");
        spendingLimit = limit;
        emit LimitSet(limit);
    }

    // Withdraw Ether with spending limit enforcement
    function withdraw(uint256 amount) public onlyOwner {
        _resetDailySpentIfNeeded();  // Reset daily spending if 24 hours have passed

        require(address(this).balance >= amount, "Insufficient contract balance");
        require(dailySpent + amount <= spendingLimit, "Exceeds daily limit");

        dailySpent += amount;  // Add to the daily spent amount
        payable(msg.sender).transfer(amount);  // Transfer Ether to the owner
        emit Withdraw(msg.sender, amount);
    }

    // Internal function to reset the daily spending limit if 24 hours have passed
    function _resetDailySpentIfNeeded() internal {
        if (block.timestamp - lastResetTime >= 1 days) {
            dailySpent = 0;
            lastResetTime = block.timestamp;
        }
    }

    // Get the contract balance (Ether held by the contract)
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Get the remaining spending limit for the owner for the day
    function getRemainingLimit() public view onlyOwner returns (uint256) {
        return spendingLimit - dailySpent;
    }
}
