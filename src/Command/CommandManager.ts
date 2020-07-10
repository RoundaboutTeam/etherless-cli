import Command from './Command';

const yargs = require('yargs');

class CommandManager {
  /**
   * @param command: to be added to managed commands
   */
  static addCommand(command : Command) : void {
    yargs.command(
      command.getCommand(),
      command.getDescription(),
      command.builder,
      (args : any) => {
        command.exec(args)
          .then((result : string) => console.log(`${result}`))
          .catch((error : any) => {
            console.log(`Something went wrong! \nError name: ${error.name} \nMessage: ${error.message}`);
            if (error.reason) console.log(`Reason: ${error.reason}`);
          });
      },
    );
  }

  /**
   * @description: finish initalization of yargs, after this the CLI is ready
   *               to manage all added commands
   */
  static init() : void {
    yargs.parse();

    const commands = yargs.getCommandInstance().getCommands();
    const argv = yargs.argv;
    if (!argv._[0] || commands.indexOf(argv._[0]) === -1) {
      console.log('Non-existing or no command specified');
    }
  }
}

export default CommandManager;
