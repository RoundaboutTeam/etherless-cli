import Configstore from 'configstore';
import { Wallet } from 'ethers';
import { Provider } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';
import UserSession from './UserSession';

const pkg = require('../../package.json');

class EthereumUserSession implements UserSession {
  private static store : string = 'criptedWallet';

  private conf : Configstore;

  private provider : Provider;

  constructor(provider : Provider) {
    this.provider = provider;
    this.conf = new Configstore(pkg.name);
  }

  isLogged() : boolean {
    return this.conf.get(EthereumUserSession.store) !== null
      && this.conf.get(EthereumUserSession.store) !== undefined;
  }

  private saveWallet(password : string, wallet : Wallet) : void {
    wallet.encrypt(password).then((encryptedJson : string) => {
      this.conf.set(EthereumUserSession.store, encryptedJson);
    });
  }

  loginWithPrivateKey(privateKey : string, password : string) : Wallet {
    if (this.isLogged()) {
      throw new Error('You are already logged in!');
    }

    const wallet : Wallet = new Wallet(privateKey, this.provider);
    this.saveWallet(password, wallet);
    return wallet;
  }

  loginWithMnemonicPhrase(mnemonic : string, password: string) : Wallet {
    if (this.isLogged()) {
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
    if (this.isLogged()) {
      this.conf.delete(EthereumUserSession.store);
    } else {
      throw new Error('You are not logged in!');
    }
  }

  async restoreWallet(password:string) : Promise<Wallet> {
    if (this.isLogged()) {
      const wallet : Wallet = await Wallet.fromEncryptedJson(
        this.conf.get(EthereumUserSession.store),
        password,
      );

      return wallet.connect(this.provider);
    }

    throw new Error('No wallet found');
  }

  async getBalance(password : string) : Promise<BigNumber> {
    const wallet : Wallet = await this.restoreWallet(password);
    return wallet.connect(this.provider).getBalance();
  }

  async getAddress(password : string) : Promise<string> {
    const wallet : Wallet = await this.restoreWallet(password);
    return wallet.address;
  }
}

export default EthereumUserSession;
