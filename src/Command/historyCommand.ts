import {Argv} from 'yargs';
import Command from './command';

class HistoryCommand extends Command {
  command = 'history [limit]';

  description = 'show the executing history of the current user';

  async exec(args: any) : Promise<any> {
    console.log('Showing past executions and results');
    if (args.limit) {
      console.log(`Showing at most ${args.limit} items`);
    }
  }

  builder(yargs : Argv) : any {
    return yargs.option('limit', {
      describe: 'Max number of item to show',
      type: 'number',
    });
  }
}

export default HistoryCommand;
