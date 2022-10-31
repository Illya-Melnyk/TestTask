async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contract with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Contract = await ethers.getContractFactory("Verifier");
    const contract = await Contract.deploy();
  
    console.log("Contract address:", contract.address);
  }
  
  main()