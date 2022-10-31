    //SPDX-License-Identifier: MIT

    pragma solidity ^0.8.0;

    interface IERC20 {
        function transfer(address to, uint256 amount) external;
    }

    contract Verifier {

        address ERC20 = 0x8f545A4119bEb3C2c80b25E2331a235ED3dfe91F;
        
        IERC20 token = IERC20(ERC20);
        
        mapping (address => uint) public nonce;
        
        mapping (address => bytes32) public hash;

        bool public paused;

        event pay(address indexed _to, uint _premium);

        function verifyString(uint _premiumSum, uint8 _v, bytes32 _r, bytes32 _s) public {
        
        require(!paused, "Paused!");
        
        address to = msg.sender;

        bytes32 hashData = keccak256(abi.encode(to, _premiumSum));

        string memory header = "\x19Ethereum Signed Message:\n32";
        
        bytes32 check = keccak256(abi.encodePacked(header, hashData));
        
        require(check != hash[msg.sender], "Hash already exists");
        
        hash[msg.sender] = check;

        address signer = ecrecover(check, _v, _r, _s);

        require(signer == to, "Wrong signer");
        
        token.transfer(to, _premiumSum);
        nonce[msg.sender]++;

        emit pay(to, _premiumSum);
    }

        function changeToken (address tokenContract) external {
            ERC20 = tokenContract;
        }

        function pause() external {
          paused = true;
        }

        function unpause() external {
          paused = false;
        }
}