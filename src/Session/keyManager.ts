declare function require(name:string):any;
const pkg = require('../../package.json');
import Configstore from 'configstore';

class keyManager{
    conf:Configstore;
    constructor(){
        this.conf= new Configstore(pkg.name);
    }
    setkey(key:string){
        this.conf.set('privateKey',key);
        return key;
    }

    getkey():string{
        const key:string = this.conf.get('privateKey');
        if(!key){
            console.log('No Private Key Found');
        }
        return key;
    }

    deletekey(){
        const key = this.conf.get('privateKey');
        if(!key){
            console.log('No Private Key Found');
        }
        this.conf.delete('privateKey');

        return;
    }
}
//Test code to delete
/*
function clientCodes() {
    const k = new keyManager();
    k.setkey("BestPrivateKey");
    console.log(k.getkey());
    k.deletekey();
    k.getkey();
}
clientCodes();
*/
export default keyManager;