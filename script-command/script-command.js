"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_loader_1 = require("./command-loader");
var command_processor_1 = require("./command-processor");
var command_executor_1 = require("./command-executor");
var ScriptCommand = /** @class */ (function () {
    function ScriptCommand() {
    }
    ScriptCommand.prototype.execute = function () {
        var processArgv = process.argv;
        // Needed command variables ---
        var scriptCommand = processArgv[2];
        if (typeof scriptCommand === 'undefined') {
            throw new Error('Command parameter missing!');
        }
        var commandParameters = processArgv.slice(3, processArgv.length);
        // ---
        var commandLoader = command_loader_1.default.getInstance();
        // Load and run command definition ---
        commandLoader.loadDefinition(scriptCommand, function onLoaded(commandDefinition) {
            var commandProcessor = command_processor_1.default.getInstance();
            commandDefinition = commandProcessor.prepareCommandName(commandDefinition);
            var parallelCalls = commandProcessor.parseParameterValues(commandParameters);
            commandProcessor.verifyParameters(parallelCalls, commandDefinition);
            var commandExecutor = command_executor_1.default.getInstance();
            commandExecutor.execute(commandDefinition, parallelCalls);
        });
        // ---
    };
    ScriptCommand.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ScriptCommand();
        return this.instance;
    };
    return ScriptCommand;
}());
exports.default = ScriptCommand;
//# sourceMappingURL=script-command.js.map