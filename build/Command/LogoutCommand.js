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
class LogoutCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.command = 'logout';
        this.description = 'Description:\n_\b  Logout from Ethereum network';
    }
    /**
     * @method exec
     * @param yargs: arguments nedded for the command
     * @description the command deletes all information about the current user. If no user
     * is logged, it throw a corrisponding error
     */
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.session.logout();
            return 'Logout from Ethereum network successfully done';
        });
    }
    /**
     * Descriptor of the command
     * @param yargs: object used to define the command params
     */
    builder(yargs) {
        return {};
    }
}
exports.default = LogoutCommand;
