import Configstore from 'configstore';
import { Wallet} from 'ethers';
declare function require(name:string):any;
const pkg = require('../../package.json');

class keyManager {
  conf : Configstore;

  constructor() {
    this.conf = new Configstore(pkg.name);
  }

  setkey(key:string) : void {
    this.conf.set('criptedWallet', key);
  }

  getkey() : string {
    const key : string = this.conf.get('criptedWallet');
    if (!key) {
      throw new Error('No data found');
    }

    return key;
  }

  deletekey() : void {
    const key = this.conf.get('criptedWallet');
    if (!key) {
      throw new Error('No data found');
    }

    this.conf.delete('criptedWallet');
  }

  setState(state:Wallet|null) : void {
    this.conf.set('state', state);
  }

  getState() : Wallet {
    const state : Wallet = this.conf.get('state');
    if (state===undefined) {
      throw new Error('No State found');
    }
    return state;
  }

  deleteState() : void {
    const state = this.conf.get('state');
    console.log(this.conf.get('state'));
    if (state===undefined) {
      throw new Error('No State found');
    }

    this.conf.delete('state');
  }

  isSetState():boolean{
    const state : string = this.conf.get('state');
    if(state!==null && state!==undefined){
      return true;
    }
    return false;
  }
}

export default keyManager;
