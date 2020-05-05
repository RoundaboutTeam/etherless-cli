import { Argv } from 'yargs';
import Command from './command';

class DeleteCommand extends Command {
  command = 'delete <function_name>';

  description = 'delete a function';

  async exec(args: any) : Promise<any> {
    console.log(`Deleting function ${args.function_name}`);
    /**
     * if(SessionManager.isLogged()) {
     *  let password = '';
     *  await inquirer
     *    .prompt([{
     *      type: 'password',
     *      message: 'Enter the password to decrypt your wallet: ',
     *      name: 'password',
     *    }])
     *    .then((answers) => {
     *      password = answers.password;
     *    });
     *
     *  const wallet : Wallet = (await SessionManager.getWallet(password))
     *    .connect(getDefaultProvider('ropsten'));
     *  const contract : Contract =
     *  new ethers.Contract('0xF93aB9d297bc05C373eA788C83f506E812c36DFF',
     *    ESmart.abi, getDefaultProvider('ropsten')).connect(wallet);
     *
     *  const response : boolean = await contract.deleteFunction(args.function_name);
     *  return response ? ('Function has been deleted successfully') :
     *  ('Some problem found while trying deleting funtion');
     *
     * }
     *
     * return 'You need to be logged to delete functions';
     */
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to delete',
      type: 'string',
    });
  }
}

export default DeleteCommand;
