import {Argv} from 'yargs';
import Command from './command';

class SayCommand extends Command {
  command = 'say <word>';

  description = 'say something';

  exec(args: any) : void {
    console.log(`Say ${args.word}!`);
    if (args.other) {
      console.log(`Hai inserito anche ${args.other}`);
    }
  }

  builder(yargs : Argv) : any {
    return yargs.positional('word', {
      describe: 'Word to say',
      type: 'string',
    }).option('other', {
      desibe: 'Other stuff',
      type: 'string',
    });
  }
}

export default SayCommand;
