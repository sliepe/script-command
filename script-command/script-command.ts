import CommandLoader from "./command-loader";
import CommandProcessor from "./command-processor";
import CommandExecutor from "./command-executor";

export default class ScriptCommand {
    execute() {
        const processArgv = process.argv;

        // Needed command variables ---
        let scriptCommand = processArgv[2];

        if (typeof scriptCommand === 'undefined') {
            throw new Error('Command parameter missing!');
        }

        const commandParameters = processArgv.slice(3, processArgv.length);
        // ---

        const commandLoader = CommandLoader.getInstance();

        // Load and run command definition ---
        commandLoader.loadDefinition(scriptCommand, function onLoaded(commandDefinition: string) {
            const commandProcessor = CommandProcessor.getInstance();

            commandDefinition = commandProcessor.prepareCommandName(commandDefinition);
            const parallelCalls = commandProcessor.parseParameterValues(commandParameters);
            commandProcessor.verifyParameters(parallelCalls, commandDefinition);

            const commandExecutor = CommandExecutor.getInstance();
            commandExecutor.execute(commandDefinition, parallelCalls);
        });
        // ---
    }

    private static instance: ScriptCommand;

    static getInstance(): ScriptCommand {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new ScriptCommand();

        return this.instance;
    }
}