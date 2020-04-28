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
  private setWallet(w:Wallet) {
    this.wallet=w;
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
    ethers.Wallet.fromEncryptedJson(new KeyManager().getkey(), password).then(function(mywallet) {
        //console.log("Address: " + mywallet.address);
        UserSession.getInstance().setWallet(mywallet);
        //console.log(UserSession.getInstance().getWallet());
    })
  }

  public saveInFile(password : string) : void {
    if (!this.wallet) {
      throw new Error('No wallet found');
    }
    const jsonP : Promise<string> = this.wallet.encrypt(password);
    /*
      const jsonP : Promise<string> = wallet.encrypt(password);
      ... salvataggio su file nel then della promise
    */
    jsonP.then(function(json) {
        console.log(json);
        new KeyManager().setkey(json);
    });
  }
}

/*
function clientCodes() {
    const s1 = UserSession.getInstance();
    const s2 = UserSession.getInstance();

    if (s1 === s2) {
        console.log('Singleton works, both variables contain the same instance.');
    } else {
        console.log('Singleton failed, variables contain different instances.');
    }
    s1.loginWithPrivateKey("0xa5b6135d60a32f1ab5efaa4e90c4c9468c67d466ff69d0635d176b176d9b39e8");
    console.log(s1.getWallet());
    
    s1.saveInFile("BestPass");
    setTimeout(function(){s1.logout()},3000);
    setTimeout(function(){console.log(s1.getWallet());},5000);
    setTimeout(function(){s1.loadFromFile("BestPass")},9000);
    setTimeout(function(){console.log(s1.getWallet());},12000);
    
}

clientCodes();
*/
export default UserSession;
