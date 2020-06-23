import {
  ethers,
  Contract,
  Wallet,
  EventFilter,
} from 'ethers';
import { Provider } from 'ethers/providers';
import { BigNumber, bigNumberify, parseEther } from 'ethers/utils';

import EtherlessContract from './EtherlessContract';
import BriefFunction from './BriefFunction';
import Function from './Function';
import HistoryItem from './HistoryItem';

class EthereumContract implements EtherlessContract {
  private contract: Contract;

  constructor(contract : Contract) {
    this.contract = contract;
  }

  async getAllFunctions() : Promise<Array<BriefFunction>> {
    return JSON.parse(await this.contract.getFuncList()).functionArray;
  }

  async getMyFunctions(address : string) : Promise<Array<BriefFunction>> {
    return JSON.parse(
      await this.contract.getOwnedList(ethers.utils.getAddress(address)),
    ).functionArray;
  }

  /** TODO */
  async getSearchedFunction(pattern : string) : Promise<Array<BriefFunction>> {
    return new Promise<Array<BriefFunction>>((response, reject) => {});
  }

  async getFunctionInfo(name : string) : Promise<Function> {
    return JSON.parse(await this.contract.getInfo(name));
  }

  /** TODO */
  async getExecHistory(address : string) : Promise<Array<HistoryItem>> {
    return new Promise<Array<HistoryItem>>((resolve, reject) => {});
  }

  async sendRunRequest(name : string, params: string) : Promise<BigNumber> {
    console.log('Creating request to execute function..');
    const tx = await this.contract.runFunction(name, params, { value: bigNumberify('10') });

    console.log(`Sending request, transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log('Request done.');
    const requestId : BigNumber = this.contract.interface.parseLog(receipt.events[0]).values.id;
    return requestId;
  }

  async sendDeleteRequest(name: string) : Promise<BigNumber> {
    console.log('Creating request to delete function..');
    const tx = await this.contract.deleteFunction(name, { value: bigNumberify('10') });

    console.log(`Sending request, transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log('Request done.');
    const requestId : BigNumber = this.contract.interface.parseLog(receipt.events[0]).values.id;
    return requestId;
  }

  /** TODO */
  async sendCodeUpdateRequest(name: string, filePath: string) : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {});
  }

  /** TODO */
  async updateDesc(name: string, newDesc : string) : Promise<void> {
    return new Promise<void>((resolve, reject) => {});
  }

  async sendDeployRequest(name: string, signature: string, desc : string, cid: string)
      : Promise<BigNumber> {
    console.log('Creating request to deploy function..');
    const tx = await this.contract.deployFunction(name, signature, desc, cid, { value: bigNumberify('10') });

    console.log(`Sending request, transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log('Request done.');
    const requestId : BigNumber = this.contract.interface.parseLog(receipt.events[0]).values.id;
    return requestId;
  }

  listenResponse(requestId : BigNumber) : Promise<string> {
    console.log('Waiting for the response...');

    const successFilter : EventFilter = this.contract.filters.resultOk(null, requestId);
    const errorFilter : EventFilter = this.contract.filters.resultError(null, requestId);

    return new Promise<string>((resolve, reject) => {
      // ascolto per eventi di successo
      this.contract.on(successFilter, (result, id, event) => {
        resolve(result);
        this.contract.removeAllListeners(successFilter);
        this.contract.removeAllListeners(errorFilter);
      });

      // asolto per eventi di errore
      this.contract.on(errorFilter, (result, id, event) => {
        reject(result);
        this.contract.removeAllListeners(successFilter);
        this.contract.removeAllListeners(errorFilter);
      });
    });
  }
}

export default EthereumContract;
