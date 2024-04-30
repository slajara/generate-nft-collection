import { ethers } from "hardhat";
import fs from "fs";

const BASE_URI = "https://apinft.racksmafia.com/api/";

async function main() {
  // Contracts are deployed using the first signer/account by default
  //devuelve carteras con su direccion que nos genera hardhat, piodemos obtener todas las que haya disponibles
  const [owner, add1, add2] = await ethers.getSigners();
 // console.log(add1.address);

  const CollectionERC1155 = await ethers.getContractFactory("CollectionERC1155");
  const Collectionerc1155 = await CollectionERC1155.deploy("0xf5b13b56C608ddeaB0fCC9b98d24064cdB264748", "3", BASE_URI);

  //await nftConttact.connect(owner).

  console.log(`frontScContract address ${Collectionerc1155.address}`);

  const constants = {
    address: Collectionerc1155.address,
    abi: Collectionerc1155.interface.format(ethers.utils.FormatTypes.json)
  };
  //console.log(constants.abi);


  fs.writeFileSync(
    "../ss-generate-nft-collection-front/constants/constantsMint.json",
    JSON.stringify(constants)
  );
  console.log("Constantes guardadass");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
