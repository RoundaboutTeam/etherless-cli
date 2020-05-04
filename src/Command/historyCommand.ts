import { Argv } from 'yargs';
import Command from './command';

const ESmart = require('../../contracts/EtherlessSmart.json');

class HistoryCommand extends Command {
  command = 'history [limit]';

  description = 'show the executing history of the current user';

  async exec(args: any) : Promise<any> {
    /*
    let password = '';
    await inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to decrypt your wallet: ',
        name: 'password',
      }])
      .then((answers) => {
        password = answers.password;
      });

    // DA CAPIRE DOVE E COME INSERIRE QUESTO VALORE LIMITE
    let limit = 0;

    if (args.limit) {
      console.log(`Showing at most ${args.limit} items`);
      limit = args.limit;
    } else {
      console.log('Showing past executions and results');
    }

    const wallet : Wallet =
      (await SessionManager.getWallet(password)).connect(getDefaultProvider('ropsten'));
    const contract : Contract =
      new ethers.Contract('0xF93aB9d297bc05C373eA788C83f506E812c36DFF', ESmart.abi,
      getDefaultProvider('ropsten')).connect(wallet);

    const filter = contract.filters.runRequest(wallet.address);

    getDefaultProvider('ropsten').getLogs({
      ...filter, // spread operator -> permette di ottenere tutte le proprietà dell'oggetto filter
      fromBlock: 0, // blocco da cui ricercare gli eventi
      toBlock: 'latest', // blocco fino a cui cercare
    })
      .then((logs) => {
        console.log('Risultati: ');
        logs.forEach((log) => {
          // fa il parse in un oggetto che come attributi ha gli elementi dell'evento
          console.log(contract.interface.parseLog(log));
        });
      });
    */

    return new Promise<string>((resolve, reject) => {
      resolve('Showing your execution history');
    });
  }

  builder(yargs : Argv) : any {
    return yargs.option('limit', {
      describe: 'Max number of item to show',
      type: 'number',
    });
  }
}

export default HistoryCommand;
