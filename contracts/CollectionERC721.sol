// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Ownable.sol";
import "hardhat/console.sol";


contract CollectionERC720 is Ownable, ERC721Enumerable {
    using Strings for uint256;
    
    uint256 private _tokenId;
    // es eficiente usar uint256 para esta variable
    uint16 public constant MAX_SUPPLY = 1000; 
    uint8 public immutable MAX_PER_USER;
    uint public constant COST_PER_NFT = 0.01 ether;

    bool public whitelistOn = true;
    bool public paused = false;
    bool revealed = false;

    string public BASE_URI;

    mapping(address => bool) public isWhitelisted;
    mapping(address => uint) public userMints;

//lo correcto es guardarse la base uri a traves del constructor
    constructor(
        address ownerAddress,
        string memory _name,
        string memory _symbol,
        string memory baseUri
    ) ERC721(_name, _symbol) Ownable(ownerAddress){
        MAX_PER_USER = 5;
       // BASE_URI = "https://apinft.racksmafia.com/api/";
       BASE_URI = baseUri;
    }

    function mint(uint amount) external payable {
        if (whitelistOn)
            require(isWhitelisted[msg.sender], "user not whitelisted");
        require(msg.value >= amount * COST_PER_NFT);
        _mint(amount);
    }

    function _mint(uint amount) internal {
        require(amount > 0, "No puedes mintear 0");
        require(
            balanceOf(msg.sender) <= MAX_PER_USER,
            "No puedes tener mas de 5!"
        );
        require(totalSupply() + amount <= MAX_SUPPLY, "Mint not available");
        require(!paused, "Contrato pausado");
        userMints[msg.sender] += amount;

        for (uint256 i = 1; i <= amount; ) {
            _tokenId += 1;
            _safeMint(msg.sender, totalSupply() + _tokenId);
            console.log(_tokenId);
            unchecked {
                ++i;
            }
        }

       // console.log(address(this).balance);
    }

    function withdrawBalance(address contractOwnerAddress) public onlyOwner(contractOwnerAddress) {
        payable(contractOwnerAddress).transfer(address(this).balance); //???
    }

    /*function pause() public onlyAdmin {
        paused = !paused;
    }

     function reveal() public onlyAdmin {
        revealed = !revealed;
    }
 
    function whiteListUser(address userAddressTowhiteList) public onlyAdmin {
        isWhitelisted[userAddressTowhiteList] = true;
    }*/


    //como se controla que no ponga un tokenid que no existe
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(tokenId <= _tokenId, "Token ID no valido");
        if (!revealed) return "Aun no se han revelado";
        //encodePacked concatena texto
        return string(abi.encodePacked(BASE_URI, tokenId.toString(), ".json"));
    }
}
