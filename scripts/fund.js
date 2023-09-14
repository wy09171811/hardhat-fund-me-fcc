const { getNamedAccounts, ethers, deployments } = require('hardhat')

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMeContract = await deployments.get('FundMe')
    console.log(`Contract Address:${fundMeContract.address}`)
    // const fundMe = await ethers.getContractAt(
    //     'FundMe',
    //     fundMeContract.address,
    //     deployer
    // )
    const signer = await ethers.provider.getSigner(deployer)
    const fundMe = new ethers.Contract(
        fundMeContract.address,
        fundMeContract.abi,
        signer
    )
    console.log(`Contract:${fundMe}`)
    const contractBalance = await fundMe.provider.balance(fundMe.address)
    console.log(`Balance:${contractBalance}`)
    const transactionReponse = await fundMe.fund({
        value: ethers.parseEther('0.1'),
    })
    await transactionReponse.wait(1)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
