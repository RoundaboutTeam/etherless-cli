import {Argv} from 'yargs';
import Command from './command';

class ExecCommand extends Command {
  command = 'run <function_name> [params..]';

  description = 'execute a function ';

  async exec(args: any) : Promise<any> {
    console.log(`Executing function ${args.function_name}`);
    if (args.params.length > 0) {
      console.log(`With params: ${args.params}`);
    }
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to execute',
      type: 'string',
    }).option('params', {
      describe: 'Array of params to use for the execution',
      type: 'array',
    });
  }
}

export default ExecCommand;
