import Configstore from 'configstore';

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

    this.conf.delete('privateKey');
  }
}

export default keyManager;
