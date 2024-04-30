import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";

describe("Front Smart Contract test by Sergio", function () {
  let collectionFactoryContract: any; //const en js no puede cambiar, let deja cambiar la variables 
  const NAME = "First Collection Name";
  const SYMBOL = "SS";

  let ownerAddress: any;
  let admin1Address: any;
  let admin2Address: any;
  let buyer1: any;
  let buyer2: any;
  let buyer3: any;
  let buyer4: any;
  let provider: any;
 
  //cosas simpler con ASSERT es mejor

  async function deployNftFixture() {
    // Contracts are deployed using the first signer/account by default
    //devuelve carteras con su direccion que nos genera hardhat, piodemos obtener todas las que haya disponibles
    const [owner, add1, add2, add3, add4, add5, add6] = await ethers.getSigners();
    provider = ethers.provider;

    ownerAddress = owner;
    admin1Address = add1;
    admin2Address = add2;
    buyer1 = add3; //whitelisted
    buyer2 = add4; //not whitelisted
    buyer3 = add5;
    buyer4 = add6;

    const CollectionFactoryContract = await ethers.getContractFactory("CollectionFactory");
    collectionFactoryContract = await CollectionFactoryContract.deploy();

    /*const CollectionERC1155 = await ethers.getContractFactory("CollectionERC1155");
    const collectionERC1155 = await CollectionERC1155.deploy(mockToken.address);*/
  
    //const AlumnsContract = await ethers.getContractFactory("AlumnList");
    //alumnsContract = await AlumnsContract.deploy(d3Token.address);
   // await d3Token.mint(100);

   // console.log(CollectionFactoryContract);

    return {owner, add1, add2, add3, add4, add5, add6, nft: collectionFactoryContract};
  }

  this.beforeAll(async () => {
    //se ejecutara antes de cada it automaticamente beforeEach, por jemeplo als funciones de desplegar tokens
      await deployNftFixture();
  });

  // testear que se crea una apuesta correctamente 
  describe("CREATE COLLECTION", function() {
   
    it("crear 2 colecciones pasando parametros, total collections == 2", async () => {
      expect(await collectionFactoryContract.connect(ownerAddress).createCollectionToken(NAME, SYMBOL, "METADATA_URL", 3, [10,20,50], [1,4,3], {value: ethers.utils.parseEther("1")})).to.not.reverted;
      let address = await collectionFactoryContract.connect(ownerAddress).createCollectionToken(NAME, SYMBOL, "METADATA_URL 2", 3, [10,20,50], [1,2,3], {value: ethers.utils.parseEther("1")});
      const receipt = await address.wait();
      
      const event = receipt.events?.find((event: { event: string; }) => event.event === 'OnCollectionCreated');
      const [addressFromContractCreated, currentCollectionAmount] = event?.args;
      //console.log("address created:", addressFromContractCreated);
      /*frontSmartContract.OnCollectionCreated(function(error: any, result: any) {
        if (!error) console.log(result);
      });*/
      expect(currentCollectionAmount).to.be.equal(2);    
    })

    it("obtener collection mint price", async () => {
      console.log(await collectionFactoryContract.COLLECTION_PRICE());
      //expect(await frontSmartContract.getCollectionsCount()).to.be.equal(1);
    })

    it("obtener token mint price", async () => {
      console.log(await collectionFactoryContract.getCollectionTokenMintPrice(0,2));
      //expect(await frontSmartContract.getCollectionsCount()).to.be.equal(1);
    })

    xit("obtener colecciones creadas", async () => {
      console.log(await collectionFactoryContract.collections(0));
      //expect(await frontSmartContract.getCollectionsCount()).to.be.equal(1);
    })

    xit("obtener balance del contrato Factory == 2 ETH", async () => {
      expect(await provider.getBalance(collectionFactoryContract.address)).to.be.equal(ethers.utils.parseEther("2"));
    })

    xit("mint token", async () => {
      
      expect(await collectionFactoryContract.connect(admin1Address).mintToken(0, 1, 2, {value: ethers.utils.parseEther("2")})).to.not.reverted;
      
      const collectionModel: any = await collectionFactoryContract.collections(0);
      const contractSigner = new ethers.Contract(
        collectionModel.ownedContract,
        collectionModel.abi, 
        provider?.getSigner()
      );

      const contract = contractSigner.connect(contractSigner.provider);  
      console.log(contract.address);

      console.log(await provider.getBalanceOf(contract.address));
    })

    xit("withdraw balance, contract balance == 0 ETH", async () => {
      //console.log("OWNER BALANCE: ", await provider.getBalance(ownerAddress.address));
      await collectionFactoryContract.connect(ownerAddress).withdrawBalance();
      //console.log("OWNER BALANCE: ", await provider.getBalance(ownerAddress.address));
      expect(await provider.getBalance(collectionFactoryContract.address)).to.be.equal(ethers.utils.parseEther("0"));
    })

    xit("comprobar que la coleccion se ha creado == 1", async () => {
      //console.log(await frontSmartContract.createCollectionToken(NAME, SYMBOL, "METADATA_URL", 10000, 5));
      //expect(await frontSmartContract.getCollectionsCount()).to.be.equal(1);
    })

    xit("Añadir admin", async () => {
      //expect(await frontSmartContract.addAdmin(admin1Address.address)).to.not.reverted;
    })

    xit("Whitelist user", async () => {
      //console.log(await frontSmartContract.createCollectionToken(NAME, SYMBOL, "METADATA_URL", 10000, 5));
      console.log(`OWNER ADDRESS: ${ownerAddress.address}`);
      expect(await collectionFactoryContract.connect(ownerAddress).whiteListUser(0, admin1Address.address)).to.not.reverted;
    })

    xit("is address whitelisted == true", async () => {
      console.log(admin1Address.address);
      expect(await collectionFactoryContract.connect(ownerAddress).isUserWhiteListed(0, admin1Address.address)).to.be.equal(true);
    })

    xit("is address whitelisted == false", async () => {
      console.log(admin1Address.address);
      expect(await collectionFactoryContract.connect(ownerAddress).isUserWhiteListed(0, admin2Address.address)).to.be.equal(false);
    })

    xit("Paused == true", async () => {
      expect(await collectionFactoryContract.connect(ownerAddress).pauseMint(0)).to.not.reverted;
      expect(await collectionFactoryContract.connect(ownerAddress).isMintPaused(0)).to.be.equal(true);
    })

    xit("Paused == false", async () => {
      expect(await collectionFactoryContract.connect(ownerAddress).pauseMint(0)).to.not.reverted;
      expect(await collectionFactoryContract.connect(ownerAddress).isMintPaused(0)).to.be.equal(false);
    })

   /* xit("Fallar al añadir admin sin ser owner", async () => {
        expect(await frontSmartContract.connect(admin1Address).addAdmin(admin1Address.address)).to.be.reverted;
    })

    xit("Whitelist User", async () => {
        expect(await frontSmartContract.connect(admin1Address).whiteListUser(buyer1.address)).to.not.reverted;
        expect(await frontSmartContract.connect(admin1Address).whiteListUser(buyer2.address)).to.not.reverted;
    })

    xit("Revelar", async () => {
      expect(await frontSmartContract.connect(admin1Address).reveal()).to.not.reverted;
  })

    xit("Fallar al Whitelist User", async () => {
        expect(await frontSmartContract.connect(admin2Address).whiteListUser(buyer1.address)).to.be.reverted;
    })

    xit("Unpause", async () => {
        expect(await frontSmartContract.connect(admin1Address).pause()).to.not.reverted;
    })*/

  })

  /*describe("ACCIONES COMPRADOR Y OWNER", function() {
    xit("Mintear nft", async () => {

      const BUY_AMOUNT = ethers.utils.parseEther("2");

      console.log(`CONTRACT TOKEN BALANCE before ${await ethers.provider.getBalance(frontSmartContract.address)}`);
      expect(await frontSmartContract.connect(buyer1).mint(2, {value: BUY_AMOUNT})).to.be.reverted;
      console.log(`TOTAL NFT AMOUNT FOR ADDRESS ${buyer1.address} is ${await frontSmartContract.balanceOf(buyer1.address)}`);
      
      console.log(`CONTRACT TOKEN BALANCE AFTER ${await ethers.provider.getBalance(frontSmartContract.address)}`);
      //await expect(await ethers.provider.getBalance(nft.address)).to.be.equal(BUY_AMOUNT);
    
      //si aqui no usara el connect, 
      //quien llama a d3Token seria la addres del contrato o del owner?
      
      //await d3Token.connect().approve(alumn1Address.address, REWARD_AMOUNT);
      //await d3Token.connect(alumn1Address).mint(REWARD_AMOUNT);
      //await d3Token.approve(alumn1Address.address, REWARD_AMOUNT);

      //si aqui no usara el connect, 
      //quien llama a alumnsContract seria la addres del contrato o del owner?
     // await expect(await alumnsContract.connect(alumn1Address).sendReward(ownerAddress.address, REWARD_AMOUNT)).to.emit(alumnsContract, "TransferDone");
      alumnsContract.on("AlumnAssistedClass", (x: any) => {
        console.log(x);
      });
      
      //console.log(`TotalSupply:           ${await d3Token.totalD3Supply()}`);
      //console.log(`Contract balance:      ${await d3Token.balanceOf(alumnsContract.address)}`);
      //porque owner tiene tanto?
      //console.log(`ownerAddress balance:  ${await d3Token.balanceOf(ownerAddress.address)}`);
      //expect(await d3Token.balanceOf(alumnsContract.address)).to.be.equal(REWARD_AMOUNT);
     // expect(await d3Token.balanceOf(alumn1Address.address)).to.be.equal(REWARD_AMOUNT);
     // expect(await d3Token.balanceOf(alumn2Address.address)).to.be.equal(0);

    })

    xit("Mintear nft BUYER 2", async () => {
      const BUY_AMOUNT = ethers.utils.parseEther("2");

      console.log(`CONTRACT TOKEN BALANCE before buyer2 ${await ethers.provider.getBalance(frontSmartContract.address)}`);
      expect(await frontSmartContract.connect(buyer2).mint(2, {value: BUY_AMOUNT})).to.be.reverted;
      console.log(`TOTAL NFT AMOUNT FOR ADDRESS buyer2 ${buyer2.address} is ${await frontSmartContract.balanceOf(buyer2.address)}`);
      
      console.log(`CONTRACT TOKEN BALANCE AFTER buyer2 ${await ethers.provider.getBalance(frontSmartContract.address)}`);
    })

    xit("Withdraw", async() => {
      expect(await frontSmartContract.connect(ownerAddress).withdrawBalance()).to.not.reverted;
      //comprobar que los token del contrato son 0 despues de withdraw
    })

    xit("Withdraw not owner", async() => {
      expect(await frontSmartContract.connect(buyer1).withdrawBalance()).to.be.revertedWith("nnjnjn");
      //comprobar que los token del contrato son 0 despues de withdraw
    })

    it("Check Contract balance is equal 0", async() => {
      console.log(`CONTRACT TOKEN BALANCE AFTER OWNER WITHDRAW ${await ethers.provider.getBalance(frontSmartContract.address)}`);
      expect(await ethers.provider.getBalance(frontSmartContract.address)).to.be.equal(0);
      console.log(`NFT TOKEN URI: ${await frontSmartContract.tokenURI(4)}`);
    })
  })*/
});