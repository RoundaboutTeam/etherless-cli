import { Argv } from 'yargs';
import { getDefaultProvider } from 'ethers';
import * as inquirer from 'inquirer';
import Command from './Command';
import EtherlessManager from '../Manager/EtherlessManager';
import BriefFunction from '../EtherlessContract/BriefFunction';

class ListCommand extends Command {
  command = 'list [m]';

  description = 'list functions inside Etherless platform';

  async exec(args: any) : Promise<any> {
    const em : EtherlessManager = new EtherlessManager(getDefaultProvider('ropsten'));
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

    if (args.m) {
      console.log('Displaying all functions owned by current user inside Etherless platform');
    } else {
      console.log('Displaying all functions inside Etherless platform');
      const listFunction : Array<BriefFunction> = await em.listAllFunctions(password);
      console.log(listFunction);
      /*
      em.listAllFunctions(password)
        .then((res: Array<BriefFunction>) => {
          console.log('OK');
          let printString : string;
          if (res.length === 0) printString = 'There are no functions!';
          else {
            printString = 'List of functions: \n';
            for (let i = 0; i < res.length; i += 1) {
              printString += `  - Name: ${res[i].name}, Price: ${res[i].price}\n`;
            }
          }
          return new Promise<string>((resolve, reject) => resolve(printString));
        }).catch((error: Error) => {
          console.log('here');
          return new Promise((response, reject) => { reject(error); });
        });
      */
    }
  }

  builder(yargs : Argv) : any {
    return yargs.option('m', {
      describe: 'Display only functions owns by the current user',
      type: 'boolean',
      default: false,
    });
  }
}

export default ListCommand;
