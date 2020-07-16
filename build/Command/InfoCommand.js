"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const table_1 = require("table");
const Command_1 = __importDefault(require("./Command"));
const chalk = require('chalk');
class InfoCommand extends Command_1.default {
    /**
     * Info command constructor
     * @param contract: instance of class implementing EtherlessContract interface
     * @param session: instance of class implementing UserSession interface
     */
    constructor(contract, session) {
        super(session);
        this.command = 'info <function_name>';
        this.description = 'Description:\n_\b  Information of a specific function inside Etherless platform';
        this.contract = contract;
    }
    /**
     * @method exec
     * @param yargs: arguments nedded for the command
     * @description the command returns all details about a specific function
     */
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // it is required that a user must be logged
            if (!this.session.isLogged()) {
                throw new Error('You must be logged to use this command');
            }
            try {
                // get details about the function from the smart contract
                const listInfo = yield this.contract.getFunctionInfo(args.function_name);
                // show data in a table
                const data = [
                    [chalk.bold('Name'), listInfo.name],
                    [chalk.bold('Owner'), listInfo.developer],
                    [chalk.bold('Signature'), listInfo.signature],
                    [chalk.bold('Price'), listInfo.price],
                    [chalk.bold('Description'), listInfo.description],
                ];
                return table_1.table(data, {
                    columns: {
                        0: {
                            width: 20,
                        },
                        1: {
                            width: 50,
                        },
                    },
                });
            }
            catch (error) {
                // if the function doesn't exits, an error is thrown
                throw Error('The function you are looking for doesn not exist!');
            }
        });
    }
    /**
     * Descriptor of the command
     * @param yargs: object used to define the command params
     */
    builder(yargs) {
        return yargs.positional('function_name', {
            describe: 'Name of the function you want to view details',
            type: 'string',
        });
    }
}
exports.default = InfoCommand;
// R1F7.2
