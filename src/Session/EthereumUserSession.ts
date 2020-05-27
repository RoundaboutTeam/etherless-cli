import Configstore from 'configstore';
import { Wallet } from 'ethers';
import { Provider } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';
import UserInfo from './UserInfo';

const pkg = require('../../package.json');

class EthereumUserSession{

    private conf:Configstore;

    private provider:Provider;
    constructor(provider:Provider){
        this.provider=provider;
        this.conf = new Configstore(pkg.name)
    }
    private checkStatus():boolean{
        return this.conf.get('criptedWallet') !== null && this.conf.get('criptedWallet') !== undefined
    }
    private saveWallet(password:string,wallet:Wallet):void{    
        wallet.encrypt(password).then((encryptedJson : string) => {
        this.conf.set('criptedWallet', encryptedJson);
        });
    }
    loginWithPrivateKey(privateKey:string,password:string):void{
        if (this.checkStatus()) {
            throw new Error('You are already logged in!');
        }
        const wallet : Wallet = new Wallet(privateKey, this.provider);
        this.saveWallet(password,wallet);
    }
    loginWithMnamonicPhrase(mnemonic:string,password:string):void{
        if (this.checkStatus()) {
            throw new Error('You are already logged in!');
        }
        const wallet : Wallet = Wallet.fromMnemonic(mnemonic).connect(this.provider);
        this.saveWallet(password,wallet);
    }
    signup():UserInfo{
        const wallet : Wallet = Wallet.createRandom();
        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic,
        };
    }
    logout(){
        if (this.checkStatus()) {
            this.conf.delete('criptedWallet');
        } else {
            throw new Error('You are not logged in!');
        }
    }
    
    restoreWallet(password:string):Promise<Wallet>{
        if (this.checkStatus()) {
            return Wallet.fromEncryptedJson(this.conf.get('criptedWallet'), password);
        }
      
        throw new Error('No wallet found');
    }
    getBalance(password:string):Promise<BigNumber>{

        let provider=this.provider;
        return new Promise<BigNumber>((resolve,reject) => {
            this.restoreWallet(password)
            .then(
                function(result){
                    resolve(result.connect(provider).getBalance());
                }
            )
        })
    }
}

export default  EthereumUserSession