const { ethers, hardhatArguments } = require ('hardhat');

module.exports = {
    generateSignature: async function (privateKey, userAddress) {

    const contractAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";

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
          "name": "pay",
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
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "hash",
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
              "name": "_premiumSum",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "_v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "_r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "_s",
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

    let wallet = new ethers.Wallet(privateKey, provider);

    const verifier = new ethers.Contract(contractAddress, verifierABI, wallet);
    
    // let userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    
    let premiumSum = 10;
    
    let nonce = await verifier.getNonce(userAddress);
    
    let data = ethers.utils.defaultAbiCoder.encode(["address", "uint", "uint"], [userAddress, premiumSum, nonce]);
    
    let hashData = ethers.utils.keccak256(data);

    let signature = await wallet.signMessage(ethers.utils.arrayify(hashData));
    
    let sig = ethers.utils.splitSignature(signature);
    
    console.log("v:", sig.v, "r:", sig.r, "s:", sig.s);
    
    console.log("Recovered:", ethers.utils.verifyMessage(ethers.utils.arrayify(hashData), sig));
}
}