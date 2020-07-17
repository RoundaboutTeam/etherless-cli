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
class DeleteCommand extends Command_1.default {
    /**
     * Delete command constructor
     * @param contract: instance of class implementing EtherlessContract interface
     * @param session: instance of class implementing UserSession interface
     */
    constructor(contract, session) {
        super(session);
        this.command = 'delete <function_name>';
        this.description = 'Description:\n_\b  Delete a function you own inside Etherless';
        this.contract = contract;
    }
    /**
     * @method exec
     * @param yargs: arguments nedded for the command
     * @description the command deletes the function indicated by the user,
     * if an error occurs, a corresponding exception will be thrown
     */
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = yield inquirer
                .prompt([{
                    type: 'password',
                    message: 'Enter the password to decrypt your wallet: ',
                    name: 'password',
                }]).then((answer) => answer.password);
            // restore and connect to the wallet
            const wallet = yield this.session.restoreWallet(password);
            this.contract.connect(wallet);
            // send deletion request
            const requestId = yield this.contract.sendDeleteRequest(args.function_name);
            // wait for the server result
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
            describe: 'Name of the function to delete',
            type: 'string',
        });
    }
}
exports.default = DeleteCommand;
