import CommandPath from "command-path";

export default class CommandProcessor {
    // TODO: Match spaces in a possible command path (escaped spaces, quoted whole command path)
    private static commandNamePattern = '[^\\s]+';

    /**
     * Prepare command name, if its relative or local.
     *
     * @param commandDefintion
     */
    prepareCommandName(commandDefintion: string) {
        // Get command path frist (first part until any space character)
        const regExpMatchArray = commandDefintion.match(CommandProcessor.commandNamePattern);
        let commandName = regExpMatchArray[0];

        if (CommandPath.isAbsolute(commandName)) {
            // Simply return
            return commandDefintion;
        }

        if (CommandPath.isRelative(commandName)) {
            const processCwd = process.cwd();

            const path = require('path');

            // Simply prepend current working dir of the node process
            return processCwd + path.sep + commandDefintion;
        }

        if (CommandPath.isLocal(commandName)) {
            // Get local command path
            let localCommandPath = CommandPath.getLocal(commandName);

            // If local path contains any whitespace
            if (CommandPath.containsWhitespace(localCommandPath)) {
                // Update with double quotes surrounded
                localCommandPath = CommandPath.surroundWithDoubleQuotes(localCommandPath);
            }

            const regExpCommandName = new RegExp(CommandProcessor.commandNamePattern);

            // Return Replaced command name with local command path
            return commandDefintion.replace(regExpCommandName, localCommandPath);
        }

        if (CommandPath.isGlobal(commandName)) {
            // Simply return
            return commandDefintion;
        }
    }

    /**
     * Parse parameter values, to build parallel calls array.
     *
     * @param commandParameters
     */
    parseParameterValues(commandParameters: string[]) {
        let parallelCalls: string[][][] = [[[]]];

        let sequentialCount = 0;
        let parallelCount = 0;

        for (const passedParameter of commandParameters) {
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
    }

    private static placerHolderPattern = '<[^/>]*/>';

    verifyParameters(parallelCalls: string[][][], commandDefinition: string) {
        // Search for defined placehoder format '<x/>', to get the matched count first
        const regExpPlaceholder = new RegExp(CommandProcessor.placerHolderPattern, 'g');
        const definedParameters = commandDefinition.match(regExpPlaceholder);

        for (const parallelCall of parallelCalls) {
            for (const sequentialCall of parallelCall) {
                if (definedParameters != null && sequentialCall.length != definedParameters.length || sequentialCall.length > 0 && definedParameters == null) {
                    throw new Error("Parameter amount must be equal to placeholder amount!");
                }
            }
        }
    }

    /**
     * Apply parameter values.
     *
     * @param commandDefinition
     * @param parameterValues
     */
    applyParameterValues(commandDefinition: string, parameterValues: string[]) {
        // Search for defined placehoder format '<x/>', to replace them with parameter values
        const regExpPlaceholder = new RegExp(CommandProcessor.placerHolderPattern, 'g');

        let parameterCount = 0;

        const command = commandDefinition.replace(regExpPlaceholder, function (substring: string, ...args: any[]) {
            const parameterValue = parameterValues[parameterCount];
            parameterCount++;

            return parameterValue;
        });

        return command;
    }

    private static instance: CommandProcessor;

    static getInstance(): CommandProcessor {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new CommandProcessor();

        return this.instance;
    }
}