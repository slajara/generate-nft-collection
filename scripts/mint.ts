import { ethers } from "hardhat";
import fs from "fs";

const BASE_URI = "https://apinft.racksmafia.com/api/";

async function main() {

  const [owner, add1, add2] = await ethers.getSigners();
  console.log(owner.address);

  const NftContract = await ethers.getContractFactory("CollectionItemsSmartContract");
  const nftContract = await NftContract.attach("0x74f018F77AC09Dd9BC3520AC6DB45911656F1d2E");

 // await nftContract.addAdmin("0x4dF2af732C30C319012fC041780Fab5c605B0132");
  //0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
  
  //await nftContract.whiteListUser("0x3D9d681AEDe495289076131e651B41D8D2854A82");
  //await nftContract.whiteListUser("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
// await nftContract.whiteListUser(owner.address);
// const BUY_AMOUNT = ethers.utils.parseEther("0.03");
 //const tx = await nftContract.mint(2, {value: BUY_AMOUNT});
// await tx.wait();
//const tx = await nftContract.reveal();
//await tx.wait();
//await nftContract.tokenURI(1);
//const tx = await nftContract.reveal();
//await tx.wait();

//const tx = await nftContract.pause();
//await tx.wait();
//console.log(`pauseeeee ${await nftContract.paused()}`);

console.log(`nft contract erc721 ${await nftContract.balanceOf(owner.address)}`);
console.log(`token id by token owner and index ${await nftContract.tokenOfOwnerByIndex(owner.address, 1)}`);

//tokenOfOwnerByIndex

console.log(`TOKEN URI ID 1: ${await nftContract.tokenURI(1)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
