pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TTT.sol";

contract TTTCrowdsale {
    using SafeMath for uint256;
    address public owner;
    TTTToken public token;
    uint256 public weiRaised;
    uint256 public openingTime;
    uint256 public closingTime;
    address public contractAddress = address(this);

    constructor(TTTToken _token) {
        require(address(_token) != address(0));
        
        owner = msg.sender;
        token = _token;

        openingTime = token.ICOopeningTime(); 
        closingTime = token.ICOclosingTime();
    }

    modifier restricted() {
        require(msg.sender == owner, "CrowdsaleTTT: you are not owner");
        _;
    }

    modifier isOpen(){
        require(block.timestamp > openingTime && block.timestamp < closingTime,"CrowdsaleTTT: crowdsale closed");
        _;
    }
    modifier addressNotZero(address addressToVerify){
        require(addressToVerify != address(0), "CrowdsaleTTT: addres is zero");
        _;
    }

    function buyTokens() public payable isOpen{
        
        uint256 weiAmount = msg.value;
        weiRaised = weiRaised.add(weiAmount);

        uint256 tokens = _getTokenAmount(weiAmount);


        token.transfer( msg.sender, tokens);



    }
    function changeOwner(address newOwner) external restricted addressNotZero(newOwner){
        owner = newOwner;
    }

    


    function _getTokenAmount(uint256 _weiAmount) internal view returns(uint256 weiAmount_){
        if (block.timestamp < openingTime + 259200) { // openingTime + 3 days 
            return _weiAmount.mul(42);
        } else if (block.timestamp < openingTime + 2851200) { // openingTime + 1 month + 3 days
            return _weiAmount.mul(21);
        } else { // openingTime + 1 month + 17 days
            return _weiAmount.mul(8);
        }
    }

    function payMeAllTokens(address wallet) external restricted addressNotZero(wallet){
        token.transfer(wallet, token.balanceOf(address(this)));
    }
    
    function payMeTokens(address wallet, uint amount) external restricted addressNotZero(wallet){
        token.transfer(wallet, amount);
    }
    
    function payMeAll(address payable wallet) external restricted addressNotZero(wallet){
        wallet.transfer(contractAddress.balance); 
    }
    function payMe(address payable wallet, uint amount) external restricted addressNotZero(wallet){
        require(contractAddress.balance >= amount,"CrowdsaleTTT: transfer amount exceeds balance");
        wallet.transfer(amount);
    }
    function getBalanceEth() public view restricted returns(uint){
        return contractAddress.balance;
    }


}