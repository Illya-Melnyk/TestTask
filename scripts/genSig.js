const { ethers, hardhatArguments } = require ('hardhat');

module.exports = {
    generateSignature: async function (userAddress) {

    const contractAddress = "0xfD41E4074F06686C50613db5Aa50894C90c71260";

    const verifierABI = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "_signature",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_premium",
            "type": "uint256"
          }
        ],
        "name": "Pay",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenContract",
            "type": "address"
          }
        ],
        "name": "changeToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getNonce",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "premiumSum",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "name": "getSigner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "nonce",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "paid",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "paused",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "sigHash",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "premiumSum",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          }
        ],
        "name": "verifyString",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    const provider = new ethers.providers.JsonRpcProvider();

    const privateKey = "7d7e2ba9e196f03be367b1416450700979a11079a911b220e2f4031c29b32983"

    let wallet = new ethers.Wallet(privateKey, provider);

    const verifier = new ethers.Contract(contractAddress, verifierABI, wallet);
    
    const premiumSum = 10;
    
    let nonce = await verifier.getNonce(userAddress);
    
    let data = ethers.utils.defaultAbiCoder.encode(["address", "uint", "uint"], [userAddress, premiumSum, nonce]);
    
    let hashData = ethers.utils.keccak256(data);

    let signature = await wallet.signMessage(ethers.utils.arrayify(hashData));
    
    let sig = ethers.utils.splitSignature(signature);
    
    console.log("v:", sig.v, "r:", sig.r, "s:", sig.s);
    
    console.log("Recovered:", ethers.utils.verifyMessage(ethers.utils.arrayify(hashData), sig));
}
}