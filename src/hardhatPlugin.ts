import { Web3PluginBase, Numbers, BlockNumberOrTag } from 'web3';
import Web3 from 'web3';

export default class HardhatPlugin extends Web3PluginBase {
    public pluginNamespace = 'hardhat';

    public constructor(){
        super();
    }

    public async impersonateAccount(address: string) {
        await this.requestManager.send({method:'hardhat_impersonateAccount', params:[address]});
    }

    public async stopImpersonatingAccount(address: string) {
        await this.requestManager.send({method:'hardhat_stopImpersonatingAccount', params:[address]});
    }

    public async dropTransaction(txHash: string) {
        await this.requestManager.send({method:'hardhat_dropTransaction', params:[txHash]});
    }

    public async setBalance(address: string, balance: string) {
        const balanceHex = Web3.utils.toHex(balance);
        await this.requestManager.send({method:'hardhat_setBalance', params:[address, balanceHex]});
    }

    public async setBlockGasLimit(gasLimit: string) {
        const gasLimitHex = Web3.utils.toHex(gasLimit);
        await this.requestManager.send({method:'evm_setBlockGasLimit', params:[gasLimitHex]});
    }
    
    public async getStorageAt(address: string, position: Numbers, blockNumber: BlockNumberOrTag) {
        return await this.requestManager.send({method:'hardhat_getStorageAt', params:[address, position, blockNumber]});
    }

    public async mine(blocks: Numbers, options: {interval?: string}){
        const blockHex = Web3.utils.toHex(blocks);
        if (options.interval !== undefined) {
            const intervalHex = Web3.utils.toHex(options.interval);
            return await this.requestManager.send({method:'hardhat_mine', params:[blockHex, intervalHex]});
        }
        return await this.requestManager.send({method:'hardhat_mine', params:[blockHex]});
    }

    public async mineUpTo(block: Numbers){
        return await this.requestManager.send({method:'hardhat_mine', params:[block]});
    }

    public async reset(url?: string, blockNumber?: Numbers){
        if (url === undefined){
            await this.requestManager.send({method:'hardhat_reset', params:[]});
        }
        else if (blockNumber === undefined){
            await this.requestManager.send({method:'hardhat_reset', params:[{forking: {jsonRpcUrl:url}}]});
        }
        else {
            await this.requestManager.send({method:'hardhat_reset', params:[{forking:{jsonRpcUrl:url, blockNumber: Web3.utils.toNumber(blockNumber)}}]});
        }
    }

    public async setCode(address: string, code: string){
        await this.requestManager.send({method:'hardhat_setCode', params:[address, code]});
    }

    public async setCoinbase(address: string){
        await this.requestManager.send({method:'hardhat_setCoinbase', params:[address]});
    }

    public async setNextBlockBaseFeePerGas(baseFeePerGas: Numbers){
        const baseFeePerGasHex = Web3.utils.toHex(baseFeePerGas);
        await this.requestManager.send({method:'hardhat_setNextBlockBaseFeePerGas', params:[baseFeePerGasHex]});
    }

    public async setNonce(address: string, nonce: string){
        const nonceHex = Web3.utils.toHex(nonce);
        await this.requestManager.send({method:'hardhat_setNonce', params:[address, nonceHex]});
    }

    public async setPrevRandao(prevRandao: Numbers) {
        const paddedHexPrevRandao = Web3.utils.padLeft(Web3.utils.toHex(prevRandao), 64)
        await this.requestManager.send({method:'hardhat_setPrevRandao', params:[paddedHexPrevRandao]});
    }

    public async setStorageAt(address: string, index: Numbers, value: Numbers){
        const indexParam = Web3.utils.toHex(index);
        const codeParam = Web3.utils.padLeft(Web3.utils.toHex(value), 64);
        await this.requestManager.send({method:'hardhat_setStorageAt', params:[address, indexParam, codeParam]});
    }

    public async takeSnapshot(){
        return await this.requestManager.send({method:'hardhat_takeSnapshot', params:[]});
    }

}

declare module 'web3' {
	interface Web3Context {
		hardhat: HardhatPlugin;
	}
}