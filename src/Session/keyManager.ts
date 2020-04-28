declare function require(name:string):any;
const pkg = require('../../package.json');
import { ethers, Wallet} from 'ethers';
import Configstore from 'configstore';

class keyManager{
    conf:Configstore;
    constructor(){
        this.conf= new Configstore(pkg.name);
    }
    setkey(key:string){
        this.conf.set('criptedWallet',key);
        return key;
    }

    getkey():string{
        const key:string = this.conf.get('criptedWallet');
        if(!key){
            console.log('No Data Found');
        }
        return key;
    }

    deletekey(){
        const key = this.conf.get('criptedWallet');
        if(!key){
            console.log('No Data');
        }
        this.conf.delete('privateKey');

        return;
    }
}
//Test code to delete
/*
function clientCodes() {
    //
    const wallet : Wallet = Wallet.createRandom();
    console.log(wallet);
    const jsonPe = wallet.encrypt("BestPass");
    jsonPe.then(function(json) {
        console.log(json);
        //k.setkey(json);
    });



    const jsonP : Promise<string> = wallet.encrypt("BestPass");

    console.log(jsonP);
    //
    //const k = new keyManager();
    let walletto:Wallet|null=null;
    //console.log(k.conf.path)
    console.log(new keyManager().getkey());
    //k.deletekey();
    new keyManager().getkey();
    ethers.Wallet.fromEncryptedJson(new keyManager().getkey(), "BestPass").then(function(wallet) {
        console.log("Address: " + wallet.address);
        // "Address: 0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290"
    })
}

clientCodes();
*/

export default keyManager;