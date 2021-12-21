pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TTTToken is ERC20{
    address public owner;
    mapping(address => bool) private whitelist;
    mapping(address => bool) private admins;
    uint public ICOopeningTime;
    uint public ICOclosingTime;

    modifier restricted() {
        require(msg.sender == owner, "TTT: you are not owner");
        _;
    }

    modifier isWhitelisted_or_ICOclosed(address customer) {
        require(msg.sender == owner || whitelist[customer] || block.timestamp > ICOclosingTime , "TTT: you are not on the whitelist" );
        _;
    }

    modifier addressNotZero(address addressToVerify){
        require(addressToVerify != address(0), "TTT: addres is zero");
        _;
    }

    constructor(uint initialSupply) ERC20('TTTToken', 'TTT'){
        _mint(msg.sender, initialSupply*10**10);
        owner = msg.sender;

        ICOopeningTime = block.timestamp ;
        ICOclosingTime = ICOopeningTime + 4060800;
    }
    
    function transfer(address recipient, uint256 amount) public override isWhitelisted_or_ICOclosed(msg.sender) returns (bool) {
        super.transfer(recipient, amount);
        return true;
    }
    function addToWhitelist(address account) public restricted addressNotZero(account){
        whitelist[account] = true;
    }

    function addManyToWhitelist(address[] memory _beneficiaries) external restricted{
        for(uint256 i = 0; i< _beneficiaries.length; i++){
            whitelist[_beneficiaries[i]] = true;
        }
    }

    function removeFromWhitelist(address _beneficiary) external restricted addressNotZero(_beneficiary){
        whitelist[_beneficiary] = false;
    }
    function checkWhitelist(address _beneficiary) external view restricted addressNotZero(_beneficiary) returns(bool){
        return whitelist[_beneficiary];
    }
    function changeOwner(address newOwner) external restricted addressNotZero(newOwner){
        owner = newOwner;
    }

}