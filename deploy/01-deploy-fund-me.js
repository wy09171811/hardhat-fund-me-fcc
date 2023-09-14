// function deployFunc() {
//     console.log('deployFunc')
// }

// module.exports.default = deployFunc

// module.exports = async (hre) => {
//     // hre.getNamedAccounts
//     // hre.deployments
//     const { getNamedAccounts, deployments } = hre
// }

const { network } = require('hardhat')
const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')
// 等同于，helperConfig相当于整个文件
// const helperConfig = require('../helper-hardhat-config')
// networkConfig = helperConfig.networkConfig

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    // 获取的是hardhat.config.js中配置的accounts:[] 的内置账号
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let chainName
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        chainName = network.name
        // 获取最近一次部署的合约
        const ethUsdAggregator = await deployments.get('MockV3Aggregator')
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        chainName = networkConfig[chainId]['name']
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
    }

    console.log(`chainName:${chainName}`)
    console.log(`wait block ${network.config.blockConfirmations}`)

    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //这里参数要传不同链的喂价合约地址
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // verify
        verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
    log('-----------------------------------------')
}

module.exports.tags = ['all', 'FundMe']
