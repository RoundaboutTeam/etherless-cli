import { Wallet, getDefaultProvider } from 'ethers';

import KeyManager from './keyManager';

interface UserInfo {
  address: string,
  privateKey: string,
  mmenomic: string
}

class UserSession {
  private static instance : UserSession;

  private wallet : Wallet|null = null;

  public static getInstance() : UserSession {
    if (!UserSession.instance) {
      UserSession.instance = new UserSession();
    }

    return UserSession.instance;
  }

  public loginWithPrivateKey(privateKey : string) : void {
    if (this.wallet) {
      throw new Error('You are already logged in!');
    }

    this.wallet = new Wallet(privateKey, getDefaultProvider('ropsten'));
  }

  public loginWithMnemonic(mnemonic : string) : void {
    if (this.wallet) {
      throw new Error('You are already logged in!');
    }

    this.wallet = Wallet.fromMnemonic(mnemonic).connect(getDefaultProvider('ropsten'));
  }

  public getWallet() : Wallet|null {
    return this.wallet;
  }

  public static signup() : UserInfo {
    const wallet : Wallet = Wallet.createRandom();

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mmenomic: wallet.mnemonic,
    };
  }

  public logout() : void {
    if (!this.wallet) {
      throw new Error('No user logged');
    }

    this.wallet = null;
  }

  public isLogged() : boolean {
    return this.wallet !== null;
  }

  public loadFromFile(password : string) : void {
    if (this.wallet) {
      throw new Error('User already logged');
    }

    try {
      const encryptedJson : string = new KeyManager().getkey();
      Wallet.fromEncryptedJson(encryptedJson, password)
        .then((wallet : Wallet) => {
          this.wallet = wallet;
          console.log('Loaded wallet of the user with address: ' + wallet.address);
        })
        .catch((error : Error) => {
          throw new Error(`Error trying loading wallet: ${error.message}`);
        });
    } catch (error) {
      throw new Error('Error trying loading wallet: no wallet found');
    }
  }

  public saveInFile(password : string) : void {
    if (!this.wallet) {
      throw new Error('No wallet found');
    }

    this.wallet.encrypt(password).then((encryptedJson : string) => {
      new KeyManager().setkey(encryptedJson);
    });
  }
}

export default UserSession;
