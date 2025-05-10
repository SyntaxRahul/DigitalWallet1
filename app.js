let web3;
let contract;
let currentAccount;

const contractAddress = "0x428686Fe9DE77aA14efc704052bf0dacD797F3ef"; // Replace with your contract address
const contractABI = [
    {
        "inputs": [], "stateMutability": "payable", "type": "constructor"
    },
    {
        "inputs": [], "name": "getRemainingLimit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "limit", "type": "uint256" }], "name": "setSpendingLimit", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [], "name": "getContractBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function"
    }
];

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            currentAccount = accounts[0];
            document.getElementById("walletAddress").innerText = `Wallet: ${currentAccount}`;
            contract = new web3.eth.Contract(contractABI, contractAddress);
        } catch (error) {
            console.error("Error connecting wallet", error);
            alert("Connection failed! Please check MetaMask.");
        }
    } else {
        alert("MetaMask not found! Please install MetaMask.");
    }
}

async function deposit() {
    const depositAmount = document.getElementById("depositAmount").value;
    if (!depositAmount || isNaN(depositAmount)) {
        alert("Please enter a valid amount.");
        return;
    }

    const amountInWei = web3.utils.toWei(depositAmount, 'ether');
    try {
        await contract.methods.deposit().send({
            from: currentAccount,
            value: amountInWei
        });
        alert("Deposit successful!");
    } catch (error) {
        console.error("Error during deposit", error);
        alert("Deposit failed! Please try again.");
    }
}

async function setSpendingLimit() {
    const limitAmount = document.getElementById("spendingLimit").value;
    if (!limitAmount || isNaN(limitAmount)) {
        alert("Please enter a valid spending limit.");
        return;
    }

    const limitInWei = web3.utils.toWei(limitAmount, 'ether');
    try {
        await contract.methods.setSpendingLimit(limitInWei).send({ from: currentAccount });
        alert("Spending limit set successfully!");
    } catch (error) {
        console.error("Error setting spending limit", error);
        alert("Failed to set spending limit!");
    }
}

async function withdraw() {
    const withdrawAmount = document.getElementById("withdrawAmount").value;
    if (!withdrawAmount || isNaN(withdrawAmount)) {
        alert("Please enter a valid withdrawal amount.");
        return;
    }

    const amountInWei = web3.utils.toWei(withdrawAmount, 'ether');
    try {
        await contract.methods.withdraw(amountInWei).send({ from: currentAccount });
        alert("Withdrawal successful!");
    } catch (error) {
        console.error("Error during withdrawal", error);
        alert("Withdrawal failed! Please try again.");
    }
}

async function getRemainingLimit() {
    try {
        const remainingLimit = await contract.methods.getRemainingLimit().call({ from: currentAccount });
        document.getElementById("remainingLimit").innerText = `Remaining Limit: ${web3.utils.fromWei(remainingLimit, 'ether')} ETH`;
    } catch (error) {
        console.error("Error fetching remaining limit", error);
        alert("Failed to get remaining limit!");
    }
}

async function getContractBalance() {
    try {
        const contractBalance = await contract.methods.getContractBalance().call();
        document.getElementById("contractBalance").innerText = `Contract Balance: ${web3.utils.fromWei(contractBalance, 'ether')} ETH`;
    } catch (error) {
        console.error("Error fetching contract balance", error);
        alert("Failed to get contract balance!");
    }
}

document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
document.getElementById("depositBtn").addEventListener("click", deposit);
document.getElementById("setLimitBtn").addEventListener("click", setSpendingLimit);
document.getElementById("withdrawBtn").addEventListener("click", withdraw);
document.getElementById("getRemainingLimitBtn").addEventListener("click", getRemainingLimit);
document.getElementById("getContractBalanceBtn").addEventListener("click", getContractBalance);
