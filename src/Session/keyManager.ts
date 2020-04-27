declare function require(name:string):any;
const Configstore = require('configstore');
const pkg = require('../../package.json');

class keyManager{
    conf:any;
    constructor(){
        this.conf= new Configstore(pkg.name);
    }
    public setkey(key:string){
        this.conf.set('privateKey',key);
        return key;
    }

    public getkey():string{
        const key:string = this.conf.get('privateKey');
        if(!key){
            console.log('No Private Key Found');
        }
        return key;
    }

    public deletekey(){
        const key = this.conf.get('privateKey');
        if(!key){
            console.log('No Private Key Found');
        }
        this.conf.delete('privateKey');

        return;
    }
}
//Test code to delete
function clientCodes() {
    const k = new keyManager();
    k.setkey("BestPrivateKey");
    console.log(k.getkey());
    k.deletekey();
    k.getkey();
}
clientCodes();

export default keyManager;