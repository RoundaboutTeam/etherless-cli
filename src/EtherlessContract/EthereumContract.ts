import {
  ethers,
  Contract,
  Wallet,
  EventFilter,
} from 'ethers';
import { Provider } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';

import EtherlessContract from './EtherlessContract';
import BriefFunction from './BriefFunction';
import Function from './Function';
import HistoryItem from './HistoryItem';

class EthereumContract implements EtherlessContract {
  // METHOD FOR TESTING addFunction() OF THE SMART CONTRACT
  addFunction(name: string, signature: string, price: number, description: string): void {
    try {
      this.contract.addFunction(name, signature, price, description);
    } catch (error) {
      console.log(error);
    }
  }

  private contract: Contract;

  constructor(address: string, abi: string, provider: Provider) {
    this.contract = new ethers.Contract(address, abi, provider);
  }

  connect(wallet: Wallet): void {
    this.contract = this.contract.connect(wallet);
  }

  async getAllFunctions() : Promise<Array<BriefFunction>> {
    return JSON.parse(await this.contract.getFuncList()).functionArray;

    /*
      const briefFunctionList: BriefFunction[] = [];
      let briefFunction: BriefFunction;
      for (let i = 0; i < functionList.length; i += 1) {
        briefFunction = {
          name: functionList[i].name,
          price: functionList[i].price,
        };
        briefFunctionList.push(briefFunction);
      }

      return briefFunctionList;
    */
  }

  /** TODO */
  async getMyFunctions() : Promise<Array<BriefFunction>> {
    const briefFunctionList: BriefFunction[] = [];
    // CALL SMART CONTRACT'S METHOD
    return briefFunctionList;
  }

  /** TODO */
  async getSearchedFunction(pattern : string) : Promise<Array<BriefFunction>> {
    return new Promise<Array<BriefFunction>>((response, reject) => {});
  }

  async getFunctionInfo(name : string) : Promise<Function> {
    const result : string = await this.contract.getInfo(name);
    return JSON.parse(result);
  }

  /** TODO */
  async getExecHistory(address : string) : Promise<Array<HistoryItem>> {
    return new Promise<Array<HistoryItem>>((resolve, reject) => {});
  }

  async sendRunRequest(name : string, params: string) : Promise<BigNumber> {
    console.log('Creating request to execute function..');
    const tx = await this.contract.runFunction(name, params, { value: ethers.utils.parseEther('0.001') });

    console.log(`Sending request, transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log('Request done.');
    const requestId : BigNumber = this.contract.interface.parseLog(receipt.events[0]).values.id;
    return requestId;
  }

  /** TODO */
  async sendDeleteRequest(name: string) : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {});
  }

  /** TODO */
  async sendCodeUpdateRequest(name: string, filePath: string) : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {});
  }

  /** TODO */
  async updateDesc(name: string, newDesc : string) : Promise<void> {
    return new Promise<void>((resolve, reject) => {});
  }

  /** TODO */
  async sendDeployRequest(name: string, filePath: string, desc : string)
    : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {});
  }

  listenResponse(requestId : BigNumber) : Promise<string> {
    console.log('Waiting for the result...');
    const eventFilter : EventFilter = this.contract.filters.response(null, requestId);

    return new Promise<string>((resolve, reject) => {
      this.contract.on(eventFilter, (result, id, event) => {
        resolve(result);
        this.contract.removeAllListeners(eventFilter);
      });
    });
  }
}

export default EthereumContract;
