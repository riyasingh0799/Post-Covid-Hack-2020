const getContractInstance = async (web3, contractDefinition, x) => {
    // get network ID and the deployed address

    const deployedAddress = contractDefinition.networks[x].address
    // create the instance
    const instance = new web3.eth.Contract(contractDefinition.abi, deployedAddress)
    return instance
  }
  
  export default getContractInstance