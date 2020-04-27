import { Argv } from 'yargs';
import Command from './command';

class DeleteCommand extends Command {
  command = 'delete <function_name>';

  description = 'delete a function';

  async exec(args: any) : Promise<any> {
    console.log(`Deleting function ${args.function_name}`);
    /**
     * if(UserSession.getInstance().isLogged) {
     *  const contract : Contract = new ethers.contract(contractAddress, abi,
     *   getDefaultProvider('ropsten')).connect(UserSession.getInstance().getWallet());
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
