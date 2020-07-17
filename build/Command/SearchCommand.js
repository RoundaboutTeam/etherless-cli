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
class SearchCommand extends Command_1.default {
    /**
     * Search command constructor
     * @param contract: instance of class implementing EtherlessContract interface
     * @param session: instance of class implementing UserSession interface
     */
    constructor(contract, session) {
        super(session);
        this.command = 'search <keyword>';
        this.description = 'Description:\n_\b  List all functions having a keyword inside their name';
        this.contract = contract;
    }
    /**
     * @method exec
     * @param yargs: arguments nedded for the command
     * @description the command looks for functions in the platform that contain
     *  a keyword inside their name
     */
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // get all functions from the contract
            const list = yield this.contract.getAllFunctions();
            // filter the functions by the keyword
            const filteredList = list.filter((item) => item.name.includes(args.keyword));
            // if there are no function found, return a message
            if (filteredList.length === 0)
                return 'No function found';
            // otherwise, a table with all details is created
            const items = filteredList
                .map((item) => [item.name + item.signature, item.price]);
            items.unshift([chalk.bold('Function'), chalk.bold('Price')]);
            return table_1.table(items, {
                columns: {
                    0: {
                        width: 30,
                    },
                    1: {
                        width: 5,
                        alignment: 'center',
                    },
                },
            });
        });
    }
    builder(yargs) {
        return yargs.positional('keyword', {
            describe: 'Keyword to find inside functions name',
            type: 'string',
        });
    }
}
exports.default = SearchCommand;
