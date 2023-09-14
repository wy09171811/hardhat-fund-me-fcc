const { network } = require('hardhat')
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require('../helper-hardhat-config')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log('Deploy MockV3Aggregator...')
        await deploy('MockV3Aggregator', {
            contract: 'MockV3Aggregator',
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        })
        log('Mock Deploy...')
        log('-----------------------------------------')
    }
}

module.exports.tags = ['all', 'mocks']
