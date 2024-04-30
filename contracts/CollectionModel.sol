// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./CollectionERC1155.sol";

struct CollectionModel {
    uint256 collectionId;
    string collectionName;
    string collectionSymbol;
    string metadataBaseUri;
    uint256 maxCollectionSupply;
    uint256[] createdIds;
    uint256[] maxTokenSupply;
    uint256[] mintPrice;
    CollectionERC1155 ownedContract;
}