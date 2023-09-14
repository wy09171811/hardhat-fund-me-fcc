const { assert } = require('chai')
const { network, ethers, getNamedAccounts, deployments } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')

developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe Staging Tests', function () {
          let deployer
          let fundMe
          const sendValue = ethers.parseEther('0.1')
          beforeEach(async () => {
              console.log('准备获取合约对象')
              deployer = (await getNamedAccounts()).deployer
              const fundMeContract = await deployments.get('FundMe')
              const signer = await ethers.provider.getSigner(deployer)
              fundMe = new ethers.Contract(
                  fundMeContract.address,
                  fundMeContract.abi,
                  signer
              )
          })

          it('allows people to fund and withdraw', async function () {
              const fundTxResponse = await fundMe.fund({ value: sendValue })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait(1)

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      ' should equal 0, running assert equal...'
              )
              assert.equal(endingFundMeBalance.toString(), '0')
          })
      })
