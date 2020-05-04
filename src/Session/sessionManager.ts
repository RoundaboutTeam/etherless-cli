import Configstore from 'configstore';
import { Wallet, getDefaultProvider } from 'ethers';

const pkg = require('../../package.json');

export interface UserInfo {
  address: string,
  privateKey: string,
  mnemonic: string
}

class SessionManager {
  static conf = new Configstore(pkg.name);

  public static signup() : UserInfo {
    const wallet : Wallet = Wallet.createRandom();

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic,
    };
  }

  public static isLogged() : boolean {
    return (this.conf.get('criptedWallet') !== null && this.conf.get('criptedWallet') !== undefined);
  }

  public static loginWithPrivateKey(privateKey : string, password : string) : void {
    if (this.conf.get('criptedWallet') !== null && this.conf.get('criptedWallet') !== undefined) {
      throw new Error('You are already logged in!');
    }

    const wallet : Wallet = new Wallet(privateKey, getDefaultProvider('ropsten'));

    // Save cripted wallet to a file
    wallet.encrypt(password).then((encryptedJson : string) => {
      this.conf.set('criptedWallet', encryptedJson);
    });
  }

  public static loginWithMnemonicPhrase(mnemonicPhrase : string, password : string) : void {
    if (this.conf.get('criptedWallet') !== null && this.conf.get('criptedWallet') !== undefined) {
      throw new Error('You are already logged in!');
    }

    const wallet : Wallet = Wallet.fromMnemonic(mnemonicPhrase).connect(getDefaultProvider('ropsten'));

    // Save cripted wallet to a file
    wallet.encrypt(password).then((encryptedJson : string) => {
      this.conf.set('criptedWallet', encryptedJson);
    });
  }

  public static logout() : void {
    if (this.conf.get('criptedWallet') !== null && this.conf.get('criptedWallet') !== undefined) {
      this.conf.delete('criptedWallet');
    } else {
      throw new Error('You are not logged in!');
    }
  }

  public static getWallet(password : string) : Promise<Wallet> {
    if (this.conf.get('criptedWallet') !== null && this.conf.get('criptedWallet') !== undefined) {
      return Wallet.fromEncryptedJson(this.conf.get('criptedWallet'), password);
    }

    throw new Error('No wallet found');
  }
}

export default SessionManager;
