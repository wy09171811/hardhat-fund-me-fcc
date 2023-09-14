require('@nomicfoundation/hardhat-toolbox')
require('hardhat-gas-reporter')
require('@nomicfoundation/hardhat-verify')
require('dotenv').config()
require('solidity-coverage')
require('hardhat-deploy')
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || 'https://eth-rinkeby'
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://eth-rinkeby'
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY || '0xkey'
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY || '0xkey'
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'key'
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 'key'

module.exports = {
    defaultNetwork: 'hardhat',
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
        polygon: {
            url: POLYGON_RPC_URL,
            accounts: [POLYGON_PRIVATE_KEY],
            chainId: 137,
            blockConfirmations: 6,
        },
        localhost: {
            url: 'http://127.0.0.1:8545/',
            accounts: [
                '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
            ],
            chainId: 31337,
        },
    },
    // solidity: '0.8.19',
    solidity: {
        compilers: [{ version: '0.8.8' }, { version: '0.6.6' }],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
    },
    gasReporter: {
        enabled: true,
        currency: 'USD',
        outputFile: 'gas-report.txt',
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            31337: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        //这是自定义的名称
        user: {
            default: 0,
        },
    },
    mocha: {
        timeout: 500000,
    },
}
