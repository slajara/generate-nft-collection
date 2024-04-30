import { ethers } from "hardhat";
import fs from "fs";

const BASE_URI = "https://apinft.racksmafia.com/api/";

async function main() {
  // Contracts are deployed using the first signer/account by default
  //devuelve carteras con su direccion que nos genera hardhat, piodemos obtener todas las que haya disponibles
  const [owner, add1, add2] = await ethers.getSigners();
 // console.log(add1.address);

  const CollectionFactoryContract = await ethers.getContractFactory("CollectionFactory");
  const collectionFactoryContract = await CollectionFactoryContract.deploy();

  //await nftConttact.connect(owner).

  console.log(`frontScContract address ${collectionFactoryContract.address}`);

  const constants = {
    address: collectionFactoryContract.address,
    abi: collectionFactoryContract.interface.format(ethers.utils.FormatTypes.json)
  };
  //console.log(constants.abi);


  fs.writeFileSync(
    "../ss-generate-nft-collection-front/constants/constants.json",
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
