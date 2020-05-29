import { Wallet, getDefaultProvider } from 'ethers';
import EtherlessContract from './EtherlessContract';
import Function from './Function';
import BriefFunction from './BriefFunction';

const ESmart = require('../../contracts/EtherlessSmart.json');

const wallet = new Wallet('0x326712c09375d35e396b0cd80bc7002f13cd227b70e1959686f28ca994a28635', getDefaultProvider('ropsten'));

const ec = new EtherlessContract('0xbb3196457153f67421a89d3f0591a2473fcab9c6', ESmart.abi, getDefaultProvider('ropsten'));

ec.connect(wallet);

// ---------------------- TEST SECTION ---------------------- \\

// TEST getFunctionInfo()
/*
ec.getFunctionInfo('mul')
  .then((res: Function) => { console.log(res); })
  .catch((error: Error) => { console.log(error); });
*/

// TEST getAllFunctions()
/*
ec.getAllFunctions()
  .then((res: Array<BriefFunction>) => { console.log(res); })
  .catch((error: Error) => { console.log(error); });
*/

// TEST RUN FUNCTION
/*
ec.sendRunRequest('mul', '5 6')
  .then((requestID) => {
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
  ec.addFunction('testName3', 'testSignature3', 35, 'testDescr3');
} catch (error) {
  console.log(error);
}
*/

// TEST getCost()
/*
ec.getFunctionCost('testName3')
  .then((res: number) => { console.log(res); })
  .catch((error: Error) => { console.log(error); });
*/
