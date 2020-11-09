var HDWalletProvider = require('@truffle/hdwallet-provider')
const path = require("path");
var mnemonic = "doll cactus special visa depend neither wealth must donkey coil dentist lab";
// var publicTestnetNode = 'https://public-node.testnet.rsk.co/'
const fs = require('fs');
const gasPriceTestnetRaw = fs.readFileSync(".gas-price-testnet.json").toString().trim();
const gasPriceTestnet = parseInt(JSON.parse(gasPriceTestnetRaw).result, 16);
if (typeof gasPriceTestnet !== 'number' || isNaN(gasPriceTestnet)) {
  throw new Error('unable to retrieve network gas price from .gas-price-testnet.json');
}
console.log("Gas price Testnet: " + gasPriceTestnet);

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/build/contracts"),

  networks: {
    rskTestnet: {
      provider: () => new HDWalletProvider({mnemonic, 
        providerOrUrl: 'https://public-node.testnet.rsk.co/2.0.1/',
        pollingInterval: 10e3,

      }),
      network_id: 31,
      gasPrice: Math.floor(gasPriceTestnet * 10.1),
      networkCheckTimeout: 1e9,
      timeoutBlocks: 100
    }
  },
  compilers : {
     solc: {
      version: "0.5.0",
      evmVersion: "byzantium"
     }
  }
}
// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   contracts_build_directory: path.join(__dirname, "client/src/build/contracts"),
//   networks: {
//     develop: {
//       host: "127.0.0.1",
//       network_id: "*",
//       port: 8545
//     }
//   }
// };
