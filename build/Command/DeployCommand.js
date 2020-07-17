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
class DeployCommand extends Command_1.default {
    /**
     * Edit command constructor
     * @param fileParser: instance of class implementing FileParser interface
     * @param fileManager: instance of class implementing FileManager interface
     * @param contract: instance of class implementing EtherlessContract interface
     * @param session: instance of class implementing UserSession interface
     */
    constructor(fileParser, fileManager, contract, session) {
        super(session);
        this.command = 'deploy <function_name> <path> <description>';
        this.description = 'Description:\n_\b  Deploy a function inside Etherless';
        this.contract = contract;
        this.fileParser = fileParser;
        this.fileManager = fileManager;
    }
    /**
     * @method exec
     * @param yargs: arguments nedded for the command
     * @description the command allows the user to deploy a function
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
            // restore the wallet and connect to the contract instance
            const wallet = yield this.session.restoreWallet(password);
            this.contract.connect(wallet);
            // check if the function exists
            if (yield this.contract.existsFunction(args.function_name)) {
                throw new Error('The name of the function is already used!');
            }
            // check if the function name respects the length limits
            if (args.function_name.length > 30) {
                throw new Error('The name must be at most 30 characters long!');
            }
            // check if the description respects the length limits
            if (args.description.length > 150) {
                throw new Error('The description must be at most 150 characters long!');
            }
            // check if the path provided by the user is a directory or file
            const isDir = fs.lstatSync(args.path).isDirectory();
            // get the source file path
            const sourcePath = isDir ? path.normalize(`${args.path}${path.sep}index.js`) : args.path;
            // get the function signature
            this.fileParser.parse(sourcePath);
            const signature = this.fileParser.getFunctionSignature(args.function_name);
            // obtain the source code of the function and the content of package.json
            // and package_lock.json files
            const sourceCode = fs.readFileSync(sourcePath).toString();
            const packageJSON = isDir
                ? fs.readFileSync(path.normalize(`${args.path}${path.sep}package.json`)).toString()
                : '';
            const packageJSONLock = isDir
                ? fs.readFileSync(path.normalize(`${args.path}${path.sep}package-lock.json`)).toString()
                : '';
            // create a function to store all deployment informations
            const deploymentInfo = {
                dep: isDir,
                sourceCode,
                package: packageJSON,
                package_lock: packageJSONLock,
            };
            // upload the informations in IPFS
            console.log('Uploading file in IPFS');
            const CID = yield this.fileManager.save(deploymentInfo);
            console.log(`File uploaded, cid: ${CID}`);
            // send deployment request
            const requestId = yield this.contract.sendDeployRequest(args.function_name, signature, args.description, CID);
            // wait for the result from the server
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
            describe: 'Name of the function to deploy',
            type: 'string',
        }).positional('path', {
            describe: 'Relative path of the source file',
            type: 'string',
        }).positional('description', {
            describe: 'Description of the function to deploy',
            type: 'string',
        });
    }
}
exports.default = DeployCommand;
