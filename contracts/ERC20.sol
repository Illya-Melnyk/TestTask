//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ERC20 {

    uint public decimals = 18;
    uint public totalSupply = 1000 ether;
    
    address public owner;
    
    string public name = "Test ERC20 Token";
    string public symbol = "TERC";

    mapping(address => uint256) balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() {
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function mint(address to, uint amount) external {
        totalSupply += amount;
        balances[to] += amount;
    }

    
}