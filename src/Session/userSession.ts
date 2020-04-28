import { ethers, Wallet, getDefaultProvider } from 'ethers';
import KeyManager from './keyManager';

class UserSession {
  private static instance : UserSession;

  private wallet : Wallet|null = null;

  /*private constructor() {
    this.wallet = null;
  }*/

  public static getInstance() : UserSession {
    if (!UserSession.instance) {
      UserSession.instance = new UserSession();
    }

    return UserSession.instance;
  }
  // wallet : boolean;

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

  public static signup() {
    const wallet : Wallet = Wallet.createRandom();
    return {
      address: wallet.address,
      private: wallet.privateKey,
      mnemonic: wallet.mnemonic,
    };
  }

  public logout() {
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

    /*
      const json : string = readFile ....
      this.wallet = Wallet.fromEncryptedJson(PATH, password).connect(getDefaultProvider('ropsten'));
    */
  }

  public saveInFile(password : string) : void {
    if (!this.wallet) {
      throw new Error('No wallet found');
    }

    /*
      const jsonP : Promise<string> = wallet.encrypt(password);
      ... salvataggio su file nel then della promise
    */
  }
}

/**
 * The client code. Must be deleted
function clientCodes() {
    const s1 = userSession.getInstance();
    const s2 = userSession.getInstance();

    if (s1 === s2) {
        console.log('Singleton works, both variables contain the same instance.');
    } else {
        console.log('Singleton failed, variables contain different instances.');
    }
    s1.loginWithPrivateKey("BestPass");
    console.log(s1.isLoggedIn());
    s2.isLoggedIn();
    s2.logOut();
    s1.isLoggedIn();
}

clientCodes();
*/
export default UserSession;
