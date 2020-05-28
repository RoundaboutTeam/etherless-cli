import UserSession from '../Session/EthereumUserSession';
import FileManager from '../IPFS/FileManager';
import * as fs from 'fs';
/*
*Da sostituire con la classe corretta
*/
import { Provider } from 'ethers/providers';
import { Wallet } from 'ethers';
export interface EthContrct{}



class EtherlessManager{
    private session:UserSession;
    //private ipfsManager:FileManager;
    private etherlessContract:EthContrct;
    constructor(pr:Provider){
        this.session= new UserSession(pr);
        this.etherlessContract= {};
    }

    loginWithPrivateKey(private_key:string,psw:string):Wallet{
        return this.session.loginWithPrivateKey(private_key,psw);
    }
    loginWithMnemonicPhrase(mnemonic_phrase:string,psw:string):Wallet{
        return this.session.loginWithMnamonicPhrase(mnemonic_phrase,psw);
    }
    logout():void{
        this.session.logout();
    }
    signup(save:boolean):Wallet{
        const wallet=this.session.signup();
        if(save){
        fs.writeFile('./credential.txt', `Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`, (err) => {
            if (err) {
              throw err;
            }
          });
        }
        return wallet;
    };
    listAllFunction():Promise<Array<Function>>{
        /*
        *Need Ethcontract
        */
       return new Promise((resolve, reject) =>{});
    }
    listMyFunction(psw : string): Promise<Array<Function>>{
        /*
        *Need EthContract
        */
       return new Promise((resolve, reject) =>{});
    }
    runFunction(name: string, params: string, psw : string): void{
        /*
        *Need EthContract
        */
    }
    deployFunction(name: string, path: string, desc: string, psw: string): void{
        /*
        *Need EthContract
        */
    }
    updateFuncDesc(name: string, desc: string, psw: string): void{
        /*
        *Need EthContract
        */
    }
    updateFuncCode(name: string, path: string, psw: string): void{
        /*
        *Need EthContract
        */
    }
    deleteFunction(name: string): void{
        /*
        *Need EthContract
        */
    }
    getFunctionInfo(name: string): Promise<Function>{
        /*
        *Need EthContract
        */
       return new Promise((resolve, reject) =>{});
    }
    searchFunction(pattern: string): Promise<Array<Function>>{
        /*
        *Need EthContract
        */
       return new Promise((resolve, reject) =>{});
    }
}

export default EtherlessManager