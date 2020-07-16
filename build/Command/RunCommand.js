"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const inquirer = __importStar(require("inquirer"));
const Command_1 = __importDefault(require("./Command"));
class RunCommand extends Command_1.default {
    /**
     * Run command constructor
     * @param contract: instance of class implementing EtherlessContract interface
     * @param session: instance of class implementing UserSession interface
     */
    constructor(contract, session) {
        super(session);
        this.command = 'run <function_name> [params..]';
        this.description = 'Description:\n_\b  Execute a function';
        this.contract = contract;
    }
    /**
     * @method exec
     * @param yargs: arguments nedded for the command
     * @description the command executes the considered function using
     *  the parameters indicated by the user
     */
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // request the password to decrypt the wallet
            const password = yield inquirer
                .prompt([{
                    type: 'password',
                    message: 'Enter the password to decrypt your wallet: ',
                    name: 'password',
                }]).then((answer) => answer.password);
            // restore the wallet and connect it to the cotract instance
            const wallet = yield this.session.restoreWallet(password);
            this.contract.connect(wallet);
            // send the run request
            const requestId = yield this.contract.sendRunRequest(args.function_name, args.params.toString());
            // return the message received from the server
            const result = yield this.contract.listenResponse(requestId);
            return JSON.parse(result).message;
        });
    }
    /**
     * Descriptor of the command
     * @param yargs: object used to define the command params
     */
    builder(yargs) {
        return yargs.positional('function_name', {
            describe: 'Name of the function to execute',
            type: 'string',
        }).option('params', {
            describe: 'Array of params to use for the execution',
            type: 'array',
        });
    }
}
exports.default = RunCommand;
