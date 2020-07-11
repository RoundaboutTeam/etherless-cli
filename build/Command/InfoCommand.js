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
const Command_1 = __importDefault(require("./Command"));
const Table = require('cli-table');
class InfoCommand extends Command_1.default {
    constructor(contract, session) {
        super(session);
        this.command = 'info <function_name>';
        this.description = 'info of a specific function inside Etherless platform';
        this.contract = contract;
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.session.isLogged()) {
                throw new Error('You must be logged to use this command');
            }
            const listInfo = yield this.contract.getFunctionInfo(args.function_name);
            const table = new Table();
            table.push({ Name: listInfo.name }, { Owner: listInfo.developer }, { Signature: listInfo.signature }, { Price: listInfo.price }, { Description: listInfo.description });
            return table.toString();
        });
    }
    builder(yargs) {
        return yargs.positional('function_name', {
            describe: 'Name of the function you want to view informations',
            type: 'string',
        });
    }
}
exports.default = InfoCommand;
// R1F7.2
