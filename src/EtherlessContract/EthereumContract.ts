import {
  Contract,
  Wallet,
  EventFilter,
} from 'ethers';

import {
  BigNumber,
  bigNumberify,
  getAddress,
} from 'ethers/utils';

import EtherlessContract from './EtherlessContract';
import BriefFunction from './BriefFunction';
import Function from './Function';
import HistoryItem from './HistoryItem';

class EthereumContract implements EtherlessContract {
  private contract: Contract;

  constructor(contract : Contract) {
    this.contract = contract;
  }

  /**
   * Get a list of all functions available inside the platform
   */
  async getAllFunctions() : Promise<Array<BriefFunction>> {
    return JSON.parse(await this.contract.getFuncList()).functionArray;
  }

  /**
   * Get a list of all functions owned by a user
   * @param address: address of the user to consider
   */
  async getMyFunctions(address : string) : Promise<Array<BriefFunction>> {
    return JSON.parse(
      await this.contract.getOwnedList(getAddress(address)),
    ).functionArray;
  }

  /**
   * Returns all details about a function
   * @param name: name of the function
   */
  async getFunctionInfo(name : string) : Promise<Function> {
    return JSON.parse(await this.contract.getInfo(name));
  }

  /**
   * Connect a wallet to a contract instance
   * @param wallet: wallet to connect
   */
  connect(wallet : Wallet) : void {
    this.contract = this.contract.connect(wallet);
  }

  /**
   * Get all events related to a filter
   * @param filter: filter to use to retrieve events
   */
  private async getEvents(filter : any) : Promise<Array<any>> {
    filter.fromBlock = 0;
    filter.toBlock = 'latest';
    return this.contract.provider.getLogs(filter);
  }

  /**
   * Parse a list of log
   * @param logs: array of logs
   */
  private parseLogs(logs : Array<any>) : Array<any> {
    return logs.map((log : any) => this.contract.interface.parseLog(log));
  }

  /**
   * Get details about past run request of a user
   * @param address: address of the considered user
   */
  async getExecHistory(address : string) : Promise<Array<HistoryItem>> {
    const pastRequest = await this.getEvents(
      this.contract.filters.runRequest(null, null, address, null),
    );

    const parsedOk = this.parseLogs(await this.getEvents(this.contract.filters.resultOk()));
    const parsedError = this.parseLogs(await this.getEvents(this.contract.filters.resultError()));
    Array.prototype.push.apply(parsedOk, parsedError);

    return Promise.all(pastRequest.map((async (request : any) => {
      const { timestamp } = await this.contract.provider.getBlock(request.blockHash as string);
      const parsedRequest = this.contract.interface.parseLog(request);
      const result = parsedOk.find(
        (item : any) => item.values.id.eq(parsedRequest.values.id),
      )?.values;

      let requestResult;
      try { requestResult = JSON.parse(result.result).message; }
      catch (error) { requestResult = '--Error trying to find the result--'; }

      return {
        id: parsedRequest.values.id,
        date: new Date(timestamp * 1000).toLocaleString(),
        name: parsedRequest.values.funcname,
        params: parsedRequest.values.param,
        result: requestResult,
      };
    })));
  }

  /**
   * Check if a function is available on the platform
   * @param name: name of the function
   */
  async existsFunction(name : string) : Promise<boolean> {
    try {
      const listInfo : Function = await this.getFunctionInfo(name);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Send a run request to the smart contract
   * @param name: name of the function to execute
   * @param params: params to pass to the function
   * @returns the request ID
   */
  async sendRunRequest(name : string, params: string) : Promise<BigNumber> {
    let listInfo : Function;
    try {
      listInfo = await this.getFunctionInfo(name);
    } catch (error) {
      throw new Error("The function you're looking for does not exist!");
    }

    // NUMBER OF PARAMETERS
    if (listInfo.signature.split(',').length !== params.split(',').length) {
      throw new Error('The number of parameters is not correct!');
    }

    console.log('Creating request to execute function..');
    const tx = await this.contract.runFunction(name, params, { value: bigNumberify('10') });

    console.log(`Sending request, transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log('Request done.');
    const requestId : BigNumber = this.contract.interface.parseLog(receipt.events[0]).values.id;
    return requestId;
  }

  /**
   * Check if two string are case-insensitive equals
   * @param s1: first string
   * @param s2: second string
   */
  private caseInsensitiveEquality(s1 : string, s2: string) : boolean {
    return s1.toUpperCase() === s2.toUpperCase();
  }

  /**
   * Send a delete request to the smart contract
   * @param name: name of the function to delete
   * @returns the request ID
   */
  async sendDeleteRequest(name: string) : Promise<BigNumber> {
    let listInfo : Function;
    try {
      listInfo = await this.getFunctionInfo(name);
    } catch (error) {
      throw new Error("The function you're looking for does not exist!");
    }

    if (!this.caseInsensitiveEquality(
      await this.contract.signer.getAddress(),
      listInfo.developer,
    )) {
      throw new Error('You are not the owner of the function!');
    }

    console.log('Creating request to delete function..');
    const tx = await this.contract.deleteFunction(name, { value: bigNumberify('10') });

    console.log(`Sending request, transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log('Request done.');
    const requestId : BigNumber = this.contract.interface.parseLog(receipt.events[0]).values.id;
    return requestId;
  }

  /**
   * Send a code update request to the smart contract
   * @param name: name of the function to update
   * @param signature: new signature of the function
   * @param cid: id of the IPFS resource
   * @returns the request ID
   */
  async sendCodeUpdateRequest(name: string, signature: string, cid: string) : Promise<BigNumber> {
    console.log('Creating request to edit function..');
    const tx = await this.contract.editFunction(name, signature, cid, { value: bigNumberify('10') });

    console.log(`Sending request, transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log('Request done.');
    const requestId : BigNumber = this.contract.interface.parseLog(receipt.events[0]).values.id;
    return requestId;
  }

  /**
   * Update the description of a function
   * @param name: function name
   * @param newDesc: new description
   */
  async updateDesc(name: string, newDesc : string) : Promise<void> {
    if (newDesc.length > 150) {
      throw new Error('The new description must be at most 150 characters long');
    }

    const tx = await this.contract.editFunctionDescr(name, newDesc, { value: bigNumberify('10') });
    await tx.wait();
  }

  /**
   * Send a deployment request to the smart contract
   * @param name: name of the function to update
   * @param desc: description of the function
   * @param signature: new signature of the function
   * @param cid: id of the IPFS resource
   * @returns the request ID
   */
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

  /**
   * Listen to the server response of a request
   * @param requestId: id of the considered request
   */
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
        reject(JSON.parse(result));
        this.contract.removeAllListeners(successFilter);
        this.contract.removeAllListeners(errorFilter);
      });
    });
  }
}

export default EthereumContract;
