"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require('yargs');
class CommandManager {
    /**
     * @param command: to be added to managed commands
     */
    static addCommand(command) {
        yargs.command(command.getCommand(), command.getDescription(), command.builder, (args) => {
            command.exec(args)
                .then((result) => console.log(`${result}`))
                .catch((error) => {
                const message = error.reason ? error.reason : error.message;
                console.log(`Something went wrong! \nError: ${message}`);
            });
        });
    }
    /**
     * @description: finish initalization of yargs, after this the CLI is ready
     *               to manage all added commands
     */
    static init() {
        const commands = yargs.getCommandInstance().getCommands();
        const { argv } = yargs;
        if (!argv._[0] || commands.indexOf(argv._[0]) === -1) {
            console.log('Non-existing or no command specified');
        }
    }
}
exports.default = CommandManager;
