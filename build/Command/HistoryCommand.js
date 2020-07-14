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
const cli_table3_1 = __importDefault(require("cli-table3"));
const Command_1 = __importDefault(require("./Command"));
const table = new cli_table3_1.default({
    head: ['Id', 'Date', 'Request', 'Result'],
});
class HistoryCommand extends Command_1.default {
    constructor(contract, session) {
        super(session);
        this.command = 'history [limit]';
        this.description = 'get a list of your past executions';
        this.contract = contract;
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.session.getAddress();
            let history = yield this.contract.getExecHistory(address);
            if (args.limit && args.limit > 0)
                history = history.slice(0, args.limit);
            if (history.length === 0)
                return 'No past executions found';
            history.sort((a, b) => (parseInt(a.id) > parseInt(b.id) ? 1 : -1));
            const values = history.map((item) => [item.id.toString(), item.date, `${item.name}(${item.params})`, item.result]);
            table.push(...values);
            return table.toString();
        });
    }
    builder(yargs) {
        return yargs.option('limit', {
            describe: 'Maximum number of item to show',
            type: 'number',
        });
    }
}
exports.default = HistoryCommand;
