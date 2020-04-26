import {Argv} from 'yargs';
import Command from './command';

class ListCommand extends Command {
  command = 'list';

  description = 'list functions inside Etherless platform';

  async exec(args: any) : Promise<any> {
    if (args.m) {
      console.log('Displaying all functions owned by current user inside Etherless platform');
    } else {
      console.log('Displaying all functions inside Etherless platform');
    }
  }

  builder(yargs : Argv) : any {
    return yargs.option('m', {
      describe: 'Display only functions owns by the current user',
      nargs: 0,
    });
  }
}

export default ListCommand;
