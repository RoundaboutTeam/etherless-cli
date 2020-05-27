/*
*Improvements needed
*/
import UserSession from '../src/Session/EthereumUserSession';
import { getDefaultProvider } from 'ethers';
function testFunc() {    
    let k = new UserSession(getDefaultProvider('ropsten'));
    k.loginWithPrivateKey('0x326712c09375d35e396b0cd80bc7002f13cd227b70e1959686f28ca994a28635',"pass");
    setTimeout(() => {
        k.getBalance("pass").then(
            result => console.log(result)
        );
        
        k.restoreWallet("pass").then(
            result => console.log(result)
        ).then(
            result => {k.logout();console.log("here we are")}
        );
    }, 5000);
  }
  
testFunc();