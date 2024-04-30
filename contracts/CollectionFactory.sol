// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Ownable.sol";
import "./CollectionModel.sol";
import "./CollectionERC1155.sol";
import "hardhat/console.sol";



contract CollectionFactory {
    using Strings for uint256;

    event OnCollectionCreated(address contractAddresss, uint256 currentCollectionAmount);
    event onMintToken(bool success);
    
    address payable public factoryOwner;

    CollectionModel[] public collections;
    uint256 private _collectionId;

    uint256[] private createdIds;

    uint256 public COLLECTION_PRICE = 1;

    mapping(address => uint256[]) userCollections;
    
    constructor() {
        factoryOwner = payable(msg.sender);
    }

    function createCollectionToken(
        string memory collectionName,
        string memory collectionSymbol,
        string memory metadataBaseUri,
        uint256 maxCollectionSupply,
        uint256[] memory maxTokenSupply,
        uint256[] memory mintPrice
    ) public payable {
        require(msg.sender != address(0), "Address not valid");
        require(msg.value >= COLLECTION_PRICE, "Insufficient amount");
        //require(msg.value > 0, "Invalid amount");
        //check values
        _createCollectionToken(collectionName, collectionSymbol, metadataBaseUri, maxCollectionSupply, maxTokenSupply, mintPrice);
    }

     function _createCollectionToken( 
        string memory collectionName,
        string memory collectionSymbol,
        string memory metadataBaseUri,
        uint256 maxCollectionSupply,
        uint256[] memory maxTokenSupply,
        uint256[] memory mintPrice
    ) private {
        require(
            checkParams(
                collectionName, collectionSymbol, metadataBaseUri, maxCollectionSupply, maxTokenSupply, mintPrice
            ) == true, 
            "Icorrect params"
        );
        CollectionERC1155 createdContract = new CollectionERC1155(msg.sender, maxCollectionSupply, metadataBaseUri);
        //TODO: emit event of contract address created
         for (uint i = 0; i < maxCollectionSupply;) {
            createdContract.crearToken(msg.sender, maxTokenSupply[i], mintPrice[i]);
            unchecked {
                i++;
                createdIds.push(i);
            }
        }
        address newItemAddress = address(createdContract);
        
        collections.push(
            CollectionModel(
                _collectionId,
                collectionName,
                collectionSymbol,
                metadataBaseUri,
                maxCollectionSupply,
                createdIds,
                maxTokenSupply,
                mintPrice,
                createdContract
            )
        );
        createdIds = new uint256[](0);
        userCollections[msg.sender].push(_collectionId);
        _collectionId += 1;
        
        emit OnCollectionCreated(newItemAddress, _collectionId);
    }
    modifier onlyOwner() {
        require(factoryOwner == msg.sender, "Not owner");
        _;
    }
    
    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getCollectionTokenMintPrice(
        uint256 collectionId,
        uint256 tokenId
    ) public view returns(uint256) {
        return collections[collectionId].ownedContract.idToPriceMap(tokenId);
    }

    /*function withdrawCollectionBalance(uint256 collectionId) public {
        collections[collectionId].ownedContract.withdrawBalance(msg.sender);
    }*/

    function getCollectionsCount() public view returns(uint256) {
        return collections.length;
    }
    function isRevealedPaused(uint256 collectionId) public view returns(bool) {
        return collections[collectionId].ownedContract.isPaused(msg.sender);
    }

    function reveal(uint256 collectionId) public {
        collections[collectionId].ownedContract.reveal(msg.sender);
    }

    function mintToken(uint256 collectionId, uint256 tokenId, uint256 amountToBuy) public payable {
        require(msg.value > 0, "Invalid amount");
        console.log("msg.value", msg.value);
        collections[collectionId].ownedContract.mint(msg.sender, tokenId, amountToBuy, msg.value);
      
        emit onMintToken(true); 
    }

    function isMintPaused(uint256 collectionId) public view returns(bool) {
        return collections[collectionId].ownedContract.isPaused(msg.sender);
    }

    function pauseMint(uint256 collectionId) public {
        collections[collectionId].ownedContract.pause(msg.sender);
    }

    function isUserWhiteListed(uint256 collectionId, address userAddressToCheck) public view returns(bool){
        return collections[collectionId].ownedContract.isWhitelisted(userAddressToCheck);
    }

    function whiteListUser(uint256 collectionId, address userAddressTowhiteList) public {
        _whiteListUser(collectionId, userAddressTowhiteList);
    }

    function _whiteListUser(uint256 collectionId, address userAddressTowhiteList) internal {
        collections[collectionId].ownedContract.whiteListUser(msg.sender, userAddressTowhiteList);
    }

    // uint maxMintAmountPerUser,
       // uint256 maxCollectionAmount, //maximo de colecciones que puede haber en la app, sensacion de exclusividad por tener una coleccion creada en esta plataforma??
    
    //function checkParams() private onlyOwner { habria algun problema? seria mejor?
    function checkParams(
        string memory collectionName,
        string memory collectionSymbol,
        string memory metadataBaseUri,
        uint256 maxCollectionSupply,
        uint256[] memory maxTokenSupply,
        uint256[] memory mintPrice
    ) internal returns(bool) {
        if (bytes(collectionName).length <= 0){
            return false;
        }
        if (bytes(collectionSymbol).length <= 0) {
            return false;
        }
        if (bytes(metadataBaseUri).length <= 0) {
            return false;
        }
        if (maxCollectionSupply < 0) {
            return false;
        }
        if (maxTokenSupply.length < 0) {
            return false;
        }
        if (mintPrice.length < 0) {
            return false;
        }
        return true;
    }
   
    receive() external payable {}
    
}
