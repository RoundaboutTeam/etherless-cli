import Configstore from 'configstore';
import { Wallet } from 'ethers';
import { Provider } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';

const pkg = require('../../package.json');

class EthereumUserSession {
  private static store : string= 'criptedWallet';

  private conf : Configstore;

  private provider : Provider;

  constructor(provider : Provider) {
    this.provider = provider;
    this.conf = new Configstore(pkg.name);
  }

  private checkStatus():boolean {
    return this.conf.get(EthereumUserSession.store) !== null
      && this.conf.get(EthereumUserSession.store) !== undefined;
  }

  private saveWallet(password : string, wallet : Wallet) : void {
    wallet.encrypt(password).then((encryptedJson : string) => {
      this.conf.set(EthereumUserSession.store, encryptedJson);
    });
  }

  loginWithPrivateKey(privateKey : string, password : string) : Wallet {
    if (this.checkStatus()) {
      throw new Error('You are already logged in!');
    }

    const wallet : Wallet = new Wallet(privateKey, this.provider);
    this.saveWallet(password, wallet);
    return wallet;
  }

  loginWithMnamonicPhrase(mnemonic : string, password: string) : Wallet {
    if (this.checkStatus()) {
      throw new Error('You are already logged in!');
    }

    const wallet : Wallet = Wallet.fromMnemonic(mnemonic).connect(this.provider);
    this.saveWallet(password, wallet);
    return wallet;
  }

  signup() : Wallet {
    return Wallet.createRandom();
  }

  logout() : void {
    if (this.checkStatus()) {
      this.conf.delete(EthereumUserSession.store);
    } else {
      throw new Error('You are not logged in!');
    }
  }

  restoreWallet(password:string) : Promise<Wallet> {
    if (this.checkStatus()) {
      return Wallet.fromEncryptedJson(this.conf.get(EthereumUserSession.store), password);
    }

    throw new Error('No wallet found');
  }

  getBalance(password : string) : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      this.restoreWallet(password)
        .then((result) => resolve(result.connect(this.provider).getBalance()));
    });
  }
  getAddress(password : string) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.restoreWallet(password)
        .then((result) => resolve(result.connect(this.provider).getAddress()));
    });
  }
}

export default EthereumUserSession;
