"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_path_1 = require("command-path");
var CommandProcessor = /** @class */ (function () {
    function CommandProcessor() {
    }
    /**
     * Prepare command name, if its relative or local.
     *
     * @param commandDefintion
     */
    CommandProcessor.prototype.prepareCommandName = function (commandDefintion) {
        // Get command path frist (first part until any space character)
        var regExpMatchArray = commandDefintion.match(CommandProcessor.commandNamePattern);
        var commandName = regExpMatchArray[0];
        if (command_path_1.default.isAbsolute(commandName)) {
            // Simply return
            return commandDefintion;
        }
        if (command_path_1.default.isRelative(commandName)) {
            var processCwd = process.cwd();
            var path = require('path');
            // Simply prepend current working dir of the node process
            return processCwd + path.sep + commandDefintion;
        }
        if (command_path_1.default.isLocal(commandName)) {
            // Get local command path
            var localCommandPath = command_path_1.default.getLocal(commandName);
            // If local path contains any whitespace
            if (command_path_1.default.containsWhitespace(localCommandPath)) {
                // Update with double quotes surrounded
                localCommandPath = command_path_1.default.surroundWithDoubleQuotes(localCommandPath);
            }
            var regExpCommandName = new RegExp(CommandProcessor.commandNamePattern);
            // Return Replaced command name with local command path
            return commandDefintion.replace(regExpCommandName, localCommandPath);
        }
        if (command_path_1.default.isGlobal(commandName)) {
            // Simply return
            return commandDefintion;
        }
    };
    /**
     * Parse parameter values, to build parallel calls array.
     *
     * @param commandParameters
     */
    CommandProcessor.prototype.parseParameterValues = function (commandParameters) {
        var parallelCalls = [[[]]];
        var sequentialCount = 0;
        var parallelCount = 0;
        for (var _i = 0, commandParameters_1 = commandParameters; _i < commandParameters_1.length; _i++) {
            var passedParameter = commandParameters_1[_i];
            switch (passedParameter) {
                case '+':
                    parallelCount++;
                    sequentialCount = 0;
                    parallelCalls[parallelCount] = [];
                    parallelCalls[parallelCount][sequentialCount] = [];
                    break;
                case '++':
                    sequentialCount++;
                    parallelCalls[parallelCount][sequentialCount] = [];
                    break;
                default:
                    parallelCalls[parallelCount][sequentialCount].push(passedParameter);
                    break;
            }
        }
        return parallelCalls;
    };
    CommandProcessor.prototype.verifyParameters = function (parallelCalls, commandDefinition) {
        // Search for defined placehoder format '<x/>', to get the matched count first
        var regExpPlaceholder = new RegExp(CommandProcessor.placerHolderPattern, 'g');
        var definedParameters = commandDefinition.match(regExpPlaceholder);
        for (var _i = 0, parallelCalls_1 = parallelCalls; _i < parallelCalls_1.length; _i++) {
            var parallelCall = parallelCalls_1[_i];
            for (var _a = 0, parallelCall_1 = parallelCall; _a < parallelCall_1.length; _a++) {
                var sequentialCall = parallelCall_1[_a];
                if (definedParameters != null && sequentialCall.length != definedParameters.length || sequentialCall.length > 0 && definedParameters == null) {
                    throw new Error("Parameter amount must be equal to placeholder amount!");
                }
            }
        }
    };
    /**
     * Apply parameter values.
     *
     * @param commandDefinition
     * @param parameterValues
     */
    CommandProcessor.prototype.applyParameterValues = function (commandDefinition, parameterValues) {
        // Search for defined placehoder format '<x/>', to replace them with parameter values
        var regExpPlaceholder = new RegExp(CommandProcessor.placerHolderPattern, 'g');
        var parameterCount = 0;
        var command = commandDefinition.replace(regExpPlaceholder, function (substring) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var parameterValue = parameterValues[parameterCount];
            parameterCount++;
            return parameterValue;
        });
        return command;
    };
    CommandProcessor.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new CommandProcessor();
        return this.instance;
    };
    // TODO: Match spaces in a possible command path (escaped spaces, quoted whole command path)
    CommandProcessor.commandNamePattern = '[^\\s]+';
    CommandProcessor.placerHolderPattern = '<[^/>]*/>';
    return CommandProcessor;
}());
exports.default = CommandProcessor;
//# sourceMappingURL=command-processor.js.map