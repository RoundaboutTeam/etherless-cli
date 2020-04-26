import { Argv } from 'yargs';
import Command from './command';

class DeleteCommand extends Command {
  command = 'delete <function_name>';

  description = 'delete a function';

  async exec(args: any) : Promise<any> {
    console.log(`Deleting function ${args.function_name}`);
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to delete',
      type: 'string',
    });
  }
}

export default DeleteCommand;
