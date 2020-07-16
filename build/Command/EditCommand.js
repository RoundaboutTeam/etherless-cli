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
const fs = require('fs');
const path = require('path');
class EditCommand extends Command_1.default {
    /**
     * Edit command constructor
     * @param fileParser: instance of class implementing FileParser interface
     * @param fileManager: instance of class implementing FileManager interface
     * @param contract: instance of class implementing EtherlessContract interface
     * @param session: instance of class implementing UserSession interface
     */
    constructor(fileParser, fileManager, contract, session) {
        super(session);
        this.command = 'edit <function_name> [s] [d]';
        this.description = 'Description:\n_\b  Edit a function you deployed';
        this.contract = contract;
        this.fileParser = fileParser;
        this.fileManager = fileManager;
    }
    /**
     * @method exec
     * @param yargs: arguments nedded for the command
     * @description the command allows the user to modify the source code and
     *  description of an owned function
     */
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the password to decrypt the wallet
            const password = yield inquirer
                .prompt([{
                    type: 'password',
                    message: 'Enter the password to decrypt your wallet: ',
                    name: 'password',
                }]).then((answer) => answer.password);
            // restore the wallet and connect it to the contract instance
            const wallet = yield this.session.restoreWallet(password);
            this.contract.connect(wallet);
            // check if the function exists and get its details
            let listInfo;
            try {
                listInfo = yield this.contract.getFunctionInfo(args.function_name);
            }
            catch (error) {
                // if the function doesn't exist an error is thrown
                throw new Error("The function you're looking for does not exist! :'(");
            }
            // if the current user is not the owner of the function, an error is shown
            if (!(this.session.getAddress().toUpperCase() === listInfo.developer.toUpperCase())) {
                throw new Error('You are not the owner of the function!');
            }
            let commandOutput = '';
            if (args.s) {
                // check if the path indicated on the cli is a file or directory
                const isDir = fs.lstatSync(args.s).isDirectory();
                // get the function source file path
                const sourcePath = isDir ? path.normalize(`${args.s}${path.sep}index.js`) : args.s;
                // get the function signature
                this.fileParser.parse(sourcePath);
                const signature = this.fileParser.getFunctionSignature(args.function_name);
                // get the funtion source code, package.json and package_lock.json
                const sourceCode = fs.readFileSync(sourcePath).toString();
                const packageJSON = isDir
                    ? fs.readFileSync(path.normalize(`${args.s}${path.sep}package.json`)).toString()
                    : '';
                const packageJSONLock = isDir
                    ? fs.readFileSync(path.normalize(`${args.s}${path.sep}package-lock.json`)).toString()
                    : '';
                // create a structure to store all deployment information
                const deploymentInfo = {
                    dep: isDir,
                    sourceCode,
                    package: packageJSON,
                    package_lock: packageJSONLock,
                };
                // upload the information to IPFS
                console.log('Uploading file in IPFS');
                const CID = yield this.fileManager.save(deploymentInfo);
                console.log(`File uploaded, cid: ${CID}`);
                // request to upload the function source code
                const requestId = yield this.contract.sendCodeUpdateRequest(args.function_name, signature, CID);
                // wait for the result of the edit
                const result = yield this.contract.listenResponse(requestId);
                commandOutput += `${JSON.parse(result).message}\n`;
            }
            if (args.d) {
                // request to modify the description and wait until it happend
                yield this.contract.updateDesc(args.function_name, args.d);
                commandOutput += 'Description updated correctly\n';
            }
            return commandOutput;
        });
    }
    /**
     * Descriptor of the command
     * @param yargs: object used to define the command params
     */
    builder(yargs) {
        return yargs.positional('function_name', {
            describe: 'Name of the function to edit',
            type: 'string',
        }).option('s', {
            describe: 'relative path of the source file',
            type: 'string',
        }).option('d', {
            describe: 'description of the function you want to edit',
            type: 'string',
        });
    }
}
exports.default = EditCommand;
