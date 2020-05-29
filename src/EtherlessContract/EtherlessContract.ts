import {
  ethers,
  Contract,
  getDefaultProvider,
  Wallet,
  EventFilter,
} from 'ethers';
import { Provider } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';

import EthContract from './EthContract';
import BriefFunction from './BriefFunction';
import Function from './Function';
import HistoryItem from './HistoryItem';

class EtherlessContract implements EthContract {
  private contract: Contract;

  constructor(address: string, abi: string, provider: Provider) {
    this.contract = new ethers.Contract(address, abi, provider);
  }

  public connect(wallet: Wallet): void {
    this.contract = this.contract.connect(wallet);
  }

  public async getAllFunctions() : Promise<Array<BriefFunction>> {
    try {
      const functionList = (JSON.parse(await this.contract.getFuncList())).functionArray;
      const briefFunctionList: BriefFunction[] = [];
      let briefFunction: BriefFunction;
      for (let i = 0; i < functionList.length; i += 1) {
        briefFunction = {
          name: functionList[i].name,
          price: functionList[i].price,
        };
        briefFunctionList.push(briefFunction);
      }
      // console.log(briefFunctionList);
      return new Promise<Array<BriefFunction>>((resolve, reject) => {
        resolve(briefFunctionList);
      });
    } catch (error) {
      return new Promise<Array<BriefFunction>>((resolve, reject) => {
        reject(error);
      });
    }
  }

  public async getFunctionInfo(name : string) : Promise<Function> {
    // const str = await this.contract.getInfo(name);
    // console.log(str);
    try {
      const obj = JSON.parse(await this.contract.getInfo(name));
      const f : Function = {
        owner: obj.developer,
        signature: obj.signature,
        name: obj.name,
        price: obj.price,
        description: obj.description,
      };
      return new Promise<Function>((resolve, reject) => {
        resolve(f);
      });
    } catch (error) {
      return new Promise<Function>((resolve, reject) => {
        reject(error);
      });
    }
  }

  // TEST METHOD
  public addFunction(name: string, signature: string, price: number, description: string): void {
    this.contract.addFunction(name, signature, price, description);
    // .catch((error: Error) => { console.log(error); });
  }

  public async getFunctionCost(name : string) : Promise<number> {
    // console.log(Number(await this.contract.getCost(name)));
    try {
      const cost = await this.contract.getCost(name);
      return new Promise<number>((resolve, reject) => {
        resolve(Number(cost));
      });
    } catch (error) {
      return new Promise<number>((resolve, reject) => {
        reject(error);
      });
    }
  }

  public async getExecHistory() : Promise<Array<HistoryItem>> {
    const historyItemList: HistoryItem[] = [];
    return new Promise<Array<HistoryItem>>((resolve, reject) => {
      resolve(historyItemList);
    });
  }

  public async updateFunctionDesc(name: string, newDesc : string) : Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      resolve(false);
    });
  }

  public async sendRunRequest(name : string, params: string) : Promise<BigNumber> {
    console.log('Creating request to execute function..');
    const tx = await this.contract.runFunction(name, params, { value: ethers.utils.parseEther('0.001') });

    console.log(`Sending request, transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log('Request done.');
    const requestId : BigNumber = this.contract.interface.parseLog(receipt.events[0]).values.id;

    return new Promise<BigNumber>((resolve, reject) => { resolve(requestId); });
  }

  public async sendDeleteRequest(name: string) : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      resolve(new BigNumber(-1));
    });
  }

  public async sendCodeUpdateRequest(name: string, filePath: string) : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      resolve(new BigNumber(-1));
    });
  }

  public async sendDeployRequest(name: string, filePath: string, desc : string) : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      resolve(new BigNumber(-1));
    });
  }

  public listenRunResponse(requestId : BigNumber) : Promise<string> {
    console.log('Waiting for the result...');
    const eventFilter : EventFilter = this.contract.filters.response(null, requestId);
    return new Promise<string>((resolve, reject) => {
      this.contract.on(eventFilter, (result, id, event) => {
        resolve(JSON.parse(result).message);
        this.contract.removeAllListeners(eventFilter);
      });
    });
  }

  public async listenDeleteResponse(requestId : BigNumber) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      resolve('Method not implemented');
    });
  }

  public async listenCodeUpdateResponse(requestId : BigNumber) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      resolve('Method not implemented');
    });
  }

  public async listenDeployResponse(requestId : BigNumber) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      resolve('Method not implemented');
    });
  }
}

export default EtherlessContract;
