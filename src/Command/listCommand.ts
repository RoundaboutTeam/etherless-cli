import { Argv } from 'yargs';
import * as inquirer from 'inquirer';
import Command from './command';

class ListCommand extends Command {
  command = 'list [m]';

  description = 'list functions inside Etherless platform';

  async exec(args: any) : Promise<any> {
    if (args.m) {
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
      console.log('Displaying all functions owned by current user inside Etherless platform');
    } else {
      console.log('Displaying all functions inside Etherless platform');
    }
    /**
     * if(SessionManager.isLogged()) {
     *  const contract : Contract = new ethers.Contract(address, abi,
     *    getDefaultProvider('ropsten'));
     *  const functionList : Array<string> = await contract.getList();
     *  if(args.m)
     *    // pensare come fare il controllo
     *  console.log(functionList);
     * }
     */
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
