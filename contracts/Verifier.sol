//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external;
}

/// @title Verifier for a signed message
/// @author Illya Melnyk
/// @notice You can use this contract for checking of the signed message on server to claim tokens from contract
contract Verifier {
    address ERC20 = 0x1a7c57634DB85F84684350C7b74A73169B7c908C;
    IERC20 token = IERC20(ERC20);

    mapping(address => uint) public nonce;
    mapping(bytes32 => address) public sigHash;
    mapping(bytes32 => bool) public paid;

    bool public paused;
    address public owner;

    event Pay(
        address indexed _to, 
        bytes32 indexed _signature, 
        uint _premium
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not an owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Change the token that currently used for payments
    /// @param tokenContract Address of token contract used for payments
    function changeToken(address tokenContract) external onlyOwner {
        ERC20 = tokenContract;
    }

    /// @notice Set pause for contract
    /// @dev Sets bool option for paused variable to true
    function pause() external onlyOwner {
        paused = true;
    }
    /// @notice Unset pause for contract
    /// @dev Sets bool option for paused variable to false
    function unpause() external onlyOwner {
        paused = false;
    }

    /// @notice Returns nonce of user stored in contract
    /// @param user Address of user whose nonce will be returned
    /// @dev Needed for sign generation algorithm
    function getNonce(address user) external view returns(uint) {
        return nonce[user];
    }

    /// @notice Converts inputed arguments into hash and compares address from retrieved data with address who called function
    /// and if addresses matches transfers specified amount of tokens
    /// @param premiumSum Amount of tokens that will be payed
    /// @param v Value for the signature
    /// @param r Value for the signature
    /// @param s Value for the signature
    /// @dev Additionally address of token contract needed for function's proper work
    function verifyString(
        uint premiumSum, 
        uint8 v, 
        bytes32 r, 
        bytes32 s
    ) 
        public 
    {
        require(!paused, "Paused!");
        address to = msg.sender;
        bytes32 hashData = keccak256(abi.encode(to, premiumSum, nonce[msg.sender]));
        string memory header = "\x19Ethereum Signed Message:\n32";
        bytes32 check = keccak256(abi.encodePacked(header, hashData));

        require(sigHash[check]!= msg.sender, "Hash already exists");

        sigHash[check] = msg.sender;
        address signer = ecrecover(check, v, r, s);

        require(signer == owner, "Wrong signer");
        
        token.transfer(to, premiumSum);
        nonce[msg.sender]++;
        paid[check] = true;

        emit Pay(
            to, 
            check, 
            premiumSum
        );
    }
}