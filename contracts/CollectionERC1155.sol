// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Ownable.sol";
import "./CollectionModel.sol";
import "hardhat/console.sol";


//preg: si extendiera de ownable, estaria haciendo owner al sc1 (sii uso msg.sender) puesto que seria sc1 quien deployee este smart contract?si no?
//resp: si
contract CollectionERC1155 is ERC1155Supply, Ownable {
    using Strings for uint256;    

    uint256 private _tokenId;
    uint256 private immutable maxCollectionSupply;
    //tokenid, tokenamount
    mapping(uint256 => uint256) public idToSupplyMap;
    //tokenid, mintPrice
    mapping(uint256 => uint256) public idToPriceMap;
    address private collectionOwner;

    string private BASE_URI;

    bool public whitelistOn;
    bool public paused;
    bool revealed;
    mapping(address => bool) public isWhitelisted;

    constructor(
        address _collectionOwner,
        uint256 _maxCollectionSupply,
        string memory baseUri
    ) ERC1155(baseUri) Ownable(_collectionOwner) {
        BASE_URI = baseUri;
        collectionOwner = _collectionOwner;
        maxCollectionSupply = _maxCollectionSupply;
    }

    function mint(address to, uint256 tokenId, uint256 amountToBuy, uint256 amount) public {
        require(amount >= amountToBuy * idToPriceMap[tokenId], "Insufficient MATIC");
        _mint(to, tokenId, amountToBuy, "");
    }

    function crearToken(address callerAddress, uint256 tokenSupply, uint256 mintPrice) public onlyOwner(callerAddress) {
        require(_tokenId + 1 <= maxCollectionSupply, "");
        _tokenId += 1;
        idToSupplyMap[_tokenId] = tokenSupply;
        idToPriceMap[_tokenId] = mintPrice;
    }

    function isPaused(address callerAddress) public view onlyOwner(callerAddress) returns(bool)  {
        return paused;
    }

    function pause(address callerAddress) public onlyOwner(callerAddress) {
        paused = !paused;
    }

     function reveal(address callerAddress) public onlyOwner(callerAddress) {
        revealed = !revealed;
    }

    function isRevealed(address callerAddress) public view onlyOwner(callerAddress) returns(bool)  {
        return revealed;
    }
 
    function whiteListUser(address callerAddress, address userAddressTowhiteList) public onlyOwner(callerAddress) {
        isWhitelisted[userAddressTowhiteList] = true;
    }

     function withdrawBalance(address ownerAddress) public onlyOwner(ownerAddress) {
        payable(ownerAddress).transfer(address(this).balance);
    }

    function totalItemsSupply(uint256 tokenId) public view returns(uint256) {
        return totalSupply(tokenId);
    }

    receive() external payable {}

    //como se controla que no ponga un tokenid que no existe
    function uri(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(tokenId <= _tokenId, "Token ID no valido");
        //if (!revealed) return "Aun no se han revelado";
        //encodePacked concatena texto
        return string(abi.encodePacked(BASE_URI, tokenId.toString(), ".json"));
    }
}
