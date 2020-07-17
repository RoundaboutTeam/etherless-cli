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
class HistoryCommand extends Command_1.default {
    /**
     * History command constructor
     * @param contract: instance of class implementing EtherlessContract interface
     * @param session: instance of class implementing UserSession interface
     */
    constructor(contract, session) {
        super(session);
        this.command = 'history [limit]';
        this.description = 'Description:\n_\b  Get a list of your past request';
        this.contract = contract;
    }
    /**
     * @method exec
     * @param yargs: arguments nedded for the command
     * @description the command returns a list of all past executions of the current user
     */
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the address of the current user
            const address = yield this.session.getAddress();
            // get all past request (and result)
            let history = yield this.contract.getExecHistory(address);
            // if the are no past request, a message is shown
            if (history.length === 0)
                return 'No past executions found';
            // sort the request by id
            history.sort((a, b) => (parseInt(a.id) > parseInt(b.id) ? -1 : 1));
            // if the user has indicate a maximum limit of request, some request are removed
            if (args.limit && args.limit > 0)
                history = history.slice(0, args.limit);
            // create a table with all information
            const values = history.map((item) => [item.id.toString(), item.date, `${item.name}(${item.params})`, item.result]);
            values.unshift([chalk.bold('Id'), chalk.bold('Date'), chalk.bold('Request'), chalk.bold('Result')]);
            return table_1.table(values, {
                columns: {
                    0: {
                        width: 5,
                    },
                    1: {
                        width: 20,
                    },
                    2: {
                        width: 20,
                    },
                    3: {
                        width: 20,
                    },
                },
            });
        });
    }
    /**
     * Descriptor of the command
     * @param yargs: object used to define the command params
     */
    builder(yargs) {
        return yargs.option('limit', {
            describe: 'Maximum number of item to show',
            type: 'number',
        });
    }
}
exports.default = HistoryCommand;
