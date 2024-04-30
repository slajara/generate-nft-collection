//importante asignar clases
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "@nomiclabs/hardhat-etherscan";
import 'solidity-coverage';
import "hardhat-gas-reporter";
dotenv.config(); //instanciandola
/**
 * aqui se importaran todas las librerias de terceros que queramos usar
 * configurar wallet, networks que utilizaremos para desarrollar smart contracts
 * 
 * hay dos maneras de leer un nodo https y no se que mas xD
**/


//npm hardhat run scripts/contracts/Contract.sol

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        //0-1000 a menos mas barato, mas caro interactuar, y al reves
        runs: 200 
      }
    }
  },
  networks: {
    hardhat:{},
    polygonMumbai: {
      accounts: [process.env.ACCOUNT_API_KEY!], //array d eprivate keys 
      url: process.env.PROVIDER_URL_MUMBAI!
    },
    goerli: {
      accounts: [process.env.ACCOUNT_API_KEY!], //array d eprivate keys 
      url: process.env.PROVIDER_URL_GOERLI!
    }
  },
  etherscan: {
    apiKey:{
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
      goerli: process.env.ETH_SCAN_API_KEY!
    } 
  },
  gasReporter: {
    currency: 'EUR',
    gasPrice: 21,
    enabled: true
  }
};

export default config;
