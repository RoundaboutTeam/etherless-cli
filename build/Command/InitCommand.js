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
class InitCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.command = 'init';
        this.description = 'Functionality showcase';
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = table_1.table([
                [chalk.bgRed('Welcome to Etherless')],
                ['Perform any action following the sintax below : \netherless <command_name> [-flag] [params..] '],
            ], {
                columns: {
                    0: {
                        width: 50,
                        alignment: 'center',
                    },
                },
            });
            data += table_1.table([
                [chalk.bold('Command'), chalk.bold('Description')],
                ['signup \n\n\n\n\n\nsignup -save', 'Signup into Ethereum network, the following information will be provided:\n-Private Key, \n-Mnenonic Phrase, \n-Address\n\nSave credentials to file'],
                ['login <your_private_key> | -m <your_mnemonic_phrase>', 'Login into the ethereum network'],
                ['logout', 'Logout from ethereum network'],
                ['whoami', 'Return the address of your current session'],
            ], {
                columns: {
                    0: {
                        width: 30,
                    },
                    1: {
                        width: 50,
                    },
                },
            });
            return data;
        });
    }
    builder(yargs) {
        return {};
    }
}
exports.default = InitCommand;
