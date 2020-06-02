import * as fs from 'fs';
/*
*Da sostituire con la classe corretta
*/
import { Provider } from 'ethers/providers';
import { Wallet } from 'ethers';
import { rejects } from 'assert';

import IPFS from '../IPFS/IPFSFileManager';
import JSParser from '../FileParser/JSFileParser';
import UserSession from '../Session/EthereumUserSession';
import EthContract from '../EtherlessContract/EthContract';
import EtherlessContract from '../EtherlessContract/EtherlessContract';
import Function from '../EtherlessContract/Function';
import BriefFunction from '../EtherlessContract/BriefFunction';
import HistoryItem from '../EtherlessContract/HistoryItem';

const ESmart = require('../../contracts/EtherlessSmart.json');

class EtherlessManager {
  private session : UserSession;

  // private ipfsManager:FileManager;

  private etherlessContract : EthContract;

  constructor(pr : Provider) {
    this.session = new UserSession(pr);
    this.etherlessContract = new EtherlessContract(
      '0xbb3196457153f67421a89d3f0591a2473fcab9c6',
      ESmart.abi,
      pr,
    );
  }

  loginWithPrivateKey(privateKey : string, psw : string) : Wallet {
    return this.session.loginWithPrivateKey(privateKey, psw);
  }

  loginWithMnemonicPhrase(mnemonicPhrase : string, psw : string) : Wallet {
    return this.session.loginWithMnamonicPhrase(mnemonicPhrase, psw);
  }

  logout() : void {
    this.session.logout();
  }

  getAddress(psw:string):Promise<string>{
    return this.session.getAddress(psw);
  }

  signup(save : boolean) : Wallet {
    const wallet = this.session.signup();
    if (save) {
      fs.writeFile('./credential.txt', `Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    return wallet;
  }

  async listAllFunctions() : Promise<Array<BriefFunction>> {
    // this.etherlessContract.connect(await this.session.restoreWallet(psw));
    return this.etherlessContract.getAllFunctions();
  }

  async listMyFunctions(psw : string) : Promise<Array<BriefFunction>> {
    this.etherlessContract.connect(await this.session.restoreWallet(psw));
    return this.etherlessContract.getMyFunctions();
  }

  async searchFunctions(pattern : string, psw: string) : Promise<Array<BriefFunction>> {
    this.etherlessContract.connect(await this.session.restoreWallet(psw));
    return this.etherlessContract.getSearchedFunction(pattern);
  }

  async getFunctionInfo(name: string, psw: string) : Promise<Function> {
    this.etherlessContract.connect(await this.session.restoreWallet(psw));
    return this.etherlessContract.getFunctionInfo(name);
  }

  async getExecHistory(psw : string) : Promise<Array<HistoryItem>> {
    try {
      this.etherlessContract.connect(await this.session.restoreWallet(psw));
      return this.etherlessContract.getExecHistory();
    } catch (error) {
      return new Promise<Array<HistoryItem>>((response, reject) => {
        rejects(error);
      });
    }
  }

  async runFunction(name: string, params: string, psw : string) : Promise<string> {
    try {
      this.etherlessContract.connect(await this.session.restoreWallet(psw));
      return this.etherlessContract
        .listenRunResponse(await this.etherlessContract.sendRunRequest(name, params));
    } catch (error) {
      return new Promise<string>((response, reject) => {
        reject(error);
      });
    }
  }

  async deleteFunction(name: string, psw: string) : Promise<string> {
    try {
      this.etherlessContract.connect(await this.session.restoreWallet(psw));
      return this.etherlessContract
        .listenDeleteResponse(await this.etherlessContract.sendDeleteRequest(name));
    } catch (error) {
      return new Promise<string>((response, reject) => {
        reject(error);
      });
    }
  }

  async updateFuncCode(name: string, path: string, psw: string) : Promise<string> {
    try {
      this.etherlessContract.connect(await this.session.restoreWallet(psw));
      return this.etherlessContract
        .listenCodeUpdateResponse(await this.etherlessContract.sendCodeUpdateRequest(name, path));
    } catch (error) {
      return new Promise<string>((response, reject) => {
        reject(error);
      });
    }
  }

  async updateFuncDesc(name: string, desc: string, psw: string) : Promise<string> {
    try {
      this.etherlessContract.connect(await this.session.restoreWallet(psw));
      return this.etherlessContract
        .listenDescUpdateResponse(await this.etherlessContract.sendDescUpdateRequest(name, desc));
    } catch (error) {
      return new Promise<string>((response, reject) => {
        reject(error);
      });
    }
  }

  async deployFunction(name: string, path: string, desc: string, psw: string) : Promise<string> {
    try {
      const signature : string = new JSParser(path).getFunctionSignature(name);
      const fileCID : string = await new IPFS().save(fs.readFileSync(path));
      this.etherlessContract.connect(await this.session.restoreWallet(psw));
      return this.etherlessContract
        .listenDeployResponse(await this.etherlessContract.sendDeployRequest(name, path, desc));
    } catch (error) {
      return new Promise<string>((response, reject) => {
        reject(error);
      });
    }
  }
}

export default EtherlessManager;
