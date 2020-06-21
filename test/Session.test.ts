import UserSession from '../src/Session/EthereumUserSession';
import { getDefaultProvider, Wallet } from 'ethers';
import Configstore from 'configstore';
const pkg = require('../package.json');

test('Session: Login with Privatekay',()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    if(k.isLogged()){
        k.logout();
    }
    const data =  k.loginWithPrivateKey('0x2bbd8f70ee60484124e3575a06e14527a82d0cca16cb162a1d9ef5df11440e60',"pass");
    expect(data.address).toBe('0x1611Ef4B1A22ff3f3fF62Fd86b9059e3679b6212');
})

test('Session: Login with Mnemonic',()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    const data =  k.loginWithMnemonicPhrase('apple inner trash finger buyer tomorrow abstract donate donor caught high weird',"pass");
    expect(data.address).toBe('0x1611Ef4B1A22ff3f3fF62Fd86b9059e3679b6212');
})

test('Session: Login PK Error',()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    let conf = new Configstore(pkg.name);
    conf.set('criptedWallet', "Mock_Wallet");
    expect(() => {k.loginWithPrivateKey('0x2bbd8f70ee60484124e3575a06e14527a82d0cca16cb162a1d9ef5df11440e60',"pass")}).toThrow(new Error('You are already logged in!'));
    conf.delete('criptedWallet');
})
test('Session: Login Mnemonic Error',()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    let conf = new Configstore(pkg.name);
    conf.set('criptedWallet', "Mock_Wallet");
    expect(() => {k.loginWithMnemonicPhrase('apple inner trash finger buyer tomorrow abstract donate donor caught high weird',"pass");}).toThrow(new Error('You are already logged in!'));
    conf.delete('criptedWallet');
})
test('Session: getWallet error',async()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    try{
        await k.restoreWallet("pass");
    }catch(e){
        expect(e.message).toBe("No wallet found");
    }
})
test('Session: getBalance error',async()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    try{
        await k.getBalance("pass");
    }catch(e){
        expect(e.message).toBe("No wallet found");
    }
})
test('Session: getAddress error', ()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    expect(() => {k.getAddress()}).toThrow(new Error('No user logged in'));
})
test('Session: login error', ()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    expect(k.isLogged()).toBe(false);
})

let mockWallet = '{"address":"83ba9c5cccf9ea5cfe16bc6e8bafd135358c5561","id":"d3b01d52-e5dc-496c-ba0c-a4d485841aa8","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1b128bb68853b603dfdfd9051afa7537"},"ciphertext":"6d2e7d01ee6c4936e3832dfb70d7272e4989bbecdd376cae8f6d2b87af2ad711","kdf":"scrypt","kdfparams":{"salt":"d41165dbc5044dae28f82c0a3ab1ea0821dca21c3da928c3518c33a90e1611ef","n":131072,"dklen":32,"p":1,"r":8},"mac":"e4a10e5286a7437a186039e5ff0f8767dd2f3e9537fa13518e72933dc7f748ea"}}';

test('Session: getAddress',()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    let conf = new Configstore(pkg.name);
    conf.set('criptedWallet', "Mock_Wallet");
    conf.set('walletAddress', "0x83BA9C5ccCF9ea5cFe16BC6e8BAFD135358c5561");
    expect(k.getAddress()).toBe("0x83BA9C5ccCF9ea5cFe16BC6e8BAFD135358c5561");
    conf.delete('criptedWallet');
    conf.delete('walletAddress');
})

test('Session: restorewallet',async ()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    let conf = new Configstore(pkg.name);
    conf.set('criptedWallet', mockWallet);
    let wallet = await(k.restoreWallet("pass"));
    expect(wallet.address).toBe("0x83BA9C5ccCF9ea5cFe16BC6e8BAFD135358c5561");
    conf.delete('criptedWallet');
},9000)

test('Session: logout Error',()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    let conf = new Configstore(pkg.name);
    conf.delete('criptedWallet');
    try{
        k.logout();
    }catch(e){
        expect(e.message).toBe("You are not logged in!");
    }
})
test('Session: logout',()=>{
    let k = new UserSession(getDefaultProvider('ropsten'));
    let conf = new Configstore(pkg.name);
    conf.set('criptedWallet', "Mock_Wallet");
    k.logout()
    expect(conf.get('criptedWallet')).toBe(undefined);
})
