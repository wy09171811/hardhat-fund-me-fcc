const { assert, expect } = require('chai')
const { deployments, ethers, getNamedAccounts, network } = require('hardhat')
const {
    isCallTrace,
} = require('hardhat/internal/hardhat-network/stack-traces/message-trace')
const { developmentChains } = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.parseEther('1')
          beforeEach(async function () {
              // 获得hardhat.config.js中network下的Accounts数组，如果是hardhat节点，则返回10个虚拟钱包
              // const accounts = ethers.getSigner()
              // const accountZero = accounts[0]
              // 用哪个钱包来操作合约
              deployer = (await getNamedAccounts()).deployer
              // fixture运行deploy目录下所有文件，这里指定是tags=all的文件
              await deployments.fixture(['all'])
              // 获取最后一次部署的FundMe合约
              const fundMeContract = await deployments.get('FundMe')

              // 让钱包的签名者对象，连接到合约
              const signer = await ethers.provider.getSigner(deployer)
              fundMe = new ethers.Contract(
                  fundMeContract.address,
                  fundMeContract.abi,
                  signer
              )

              const mockV3AggregatorContract = await deployments.get(
                  'MockV3Aggregator'
              )
              mockV3Aggregator = new ethers.Contract(
                  mockV3AggregatorContract.address,
                  mockV3AggregatorContract.abi,
                  signer
              )
          })

          describe('constructor', async function () {
              it('test constructro', async function () {
                  const response = await fundMe.priceFeed()
                  console.log(`response:${response}`)
                  assert.equal(response, await mockV3Aggregator.getAddress())
              })
          })

          describe('fund', async function () {
              it('should revert if the ETH amount is less than the minimum required', async function () {
                  console.log(`sendValue:${sendValue}`)
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.addressToAmountFunded[
                      deployer.address
                  ]
                  assert(response, sendValue)
              })
              // it('is allows us to withdraw with multiple funders', async () => {
              //     // Arrange
              //     const accounts = await ethers.getSigners()
              //     for (i = 1; i < 6; i++) {
              //         const fundMeConnectedContract = await fundMe.connect(
              //             accounts[i]
              //         )
              //         await fundMeConnectedContract.fund({ value: sendValue })
              //     }
              //     console.log(`fundMe.provider:${await fundMe.provider}`)
              //     const startingFundMeBalance = await fundMe.provider.getBalance(
              //         fundMe.address
              //     )
              //     const startingDeployerBalance = await fundMe.provider.getBalance(
              //         deployer
              //     )

              //     // Act
              //     const transactionResponse = await fundMe.withdraw()
              //     // Let's comapre gas costs :)
              //     // const transactionResponse = await fundMe.withdraw()
              //     const transactionReceipt = await transactionResponse.wait()
              //     const { gasUsed, effectiveGasPrice } = transactionReceipt
              //     // BigNumber相当于BigDecimal，加减乘除需要调用对应的方法来做
              //     const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
              //     console.log(`GasCost: ${withdrawGasCost}`)
              //     console.log(`GasUsed: ${gasUsed}`)
              //     console.log(`GasPrice: ${effectiveGasPrice}`)
              //     const endingFundMeBalance = await fundMe.provider.getBalance(
              //         fundMe.address
              //     )
              //     const endingDeployerBalance = await fundMe.provider.getBalance(
              //         deployer
              //     )
              //     // Assert
              //     assert.equal(
              //         startingFundMeBalance.add(startingDeployerBalance).toString(),
              //         endingDeployerBalance.add(withdrawGasCost).toString()
              //     )
              //     // Make a getter for storage variables
              //     await expect(fundMe.getFunder(0)).to.be.reverted

              //     for (i = 1; i < 6; i++) {
              //         assert.equal(
              //             await fundMe.getAddressToAmountFunded(accounts[i].address),
              //             0
              //         )
              //     }
              // })
              // it('should revert if the ETH amount is less than the minimum required', async function () {
              //     await expect(
              //         fundMe.fund({ value: 0.01 * 1e18 })
              //     ).to.be.revertedWith('You need to spend more ETH!')
              // })
          })
      })
