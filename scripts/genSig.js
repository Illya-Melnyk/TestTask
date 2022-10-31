const { ethers } = require ('hardhat');

 async function generateSignature() {
    let privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    let address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    let premiumSum = 10;
    
    let wallet = new ethers.Wallet(privateKey);
    
    let data = ethers.utils.defaultAbiCoder.encode(["address", "uint"], [address, premiumSum]);
    
    let hashData = ethers.utils.keccak256(data);

    let signature = await wallet.signMessage(ethers.utils.arrayify(hashData));
    
    let sig = ethers.utils.splitSignature(signature);
    
    console.log("v:", sig.v, "r:", sig.r, "s:", sig.s);
    
    console.log("Recovered:", ethers.utils.verifyMessage(ethers.utils.arrayify(hashData), sig));
}

generateSignature();