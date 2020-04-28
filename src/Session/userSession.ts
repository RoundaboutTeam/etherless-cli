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
<<<<<<< HEAD
    wallet : boolean;

    public loginWithPrivateKey(key:string){
        if(!this.isLoggedIn()){
            console.log("Logged with key: "+key);
            this.wallet=true;
        }else{
            console.log("You are still loggedIn");
        }
    }

    public logOut(){
        this.wallet=false;
        console.log("Longin out");
    }

    public isLoggedIn() : boolean{
        return this.wallet;
=======

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
>>>>>>> 4d0356d70145765de7de125f0cc017a0910ab25e
    }

    /*
      const jsonP : Promise<string> = wallet.encrypt(password);
      ... salvataggio su file nel then della promise
    */
  }
}

/**
 * The client code. Must be deleted
<<<<<<< HEAD
 */
/*
=======

>>>>>>> 4d0356d70145765de7de125f0cc017a0910ab25e
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
<<<<<<< HEAD

export default userSession;
=======
export default UserSession;
>>>>>>> 4d0356d70145765de7de125f0cc017a0910ab25e
