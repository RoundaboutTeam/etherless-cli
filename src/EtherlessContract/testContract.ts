import { Wallet, getDefaultProvider } from 'ethers';
import { BigNumber } from 'ethers/utils';
import EtherlessContract from './EtherlessContract';
import Function from './Function';
import BriefFunction from './BriefFunction';

const ESmart = require('../../contracts/EtherlessSmart.json');

const wallet = new Wallet('0x326712c09375d35e396b0cd80bc7002f13cd227b70e1959686f28ca994a28635', getDefaultProvider('ropsten'));

const ec = new EtherlessContract('0x5f95F9FC6345C8f6CC94D154e3C6212722660146', ESmart.abi, getDefaultProvider('ropsten'));

// ec.connect(wallet);

// console.log(new BigNumber(48));

// console.log(wallet.getAddress());

// ---------------------- TEST SECTION ---------------------- \\

// TEST getFunctionInfo()
/*
ec.getFunctionInfo('testName1')
  .then((res: Function) => { console.log(res); })
  .catch((error: Error) => { console.log(error); });
*/

// TEST getAllFunctions()
/*
ec.getAllFunctions()
  .then((res: Array<BriefFunction>) => {
    if (res.length === 0) console.log('There are no functions!');
    else {
      let printString : string = 'List of functions: \n';
      for (let i = 0; i < res.length; i += 1) {
        printString += `  - Name: ${res[i].name}, Price: ${res[i].price}\n`;
      }
      console.log(printString);
    }
    // console.log(String(res));
  })
  .catch((error: Error) => { console.log(error); });
*/

// TEST RUN FUNCTION
/*
ec.sendRunRequest('mul', '5 6')
  .then((requestID) => {
    console.log(Number(requestID));
    console.log(requestID);
    ec.listenRunResponse(requestID)
      .then((res: string) => {
        console.log(`${res}`);
      }).catch((error) => { console.log(error); });
  })
  .catch((error) => { console.log(error); });
*/

// TEST ADD FUNCTION
/*
try {
  ec.addFunction('testName3', 'testSignature3', 20, 'testDescription3');
} catch (error) {
  console.log(error);
}
*/

// TEST getCost()
/*
ec.getFunctionCost('testName1')
  .then((res: number) => { console.log(res); })
  .catch((error: Error) => { console.log(error); });
*/
