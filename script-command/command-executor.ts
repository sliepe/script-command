import CommandProcessor from "./command-processor";
import {ChildProcess} from "child_process";

export default class CommandExecutor {
    // private childProcess: ChildProcess[] = []; // Not needed

    executeChildProcess(command: string, onTerminated: Function): ChildProcess {
        const child_process = require('child_process');

        const childProcess = child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            onTerminated();
        });

        // https://nodejs.org/docs/latest-v12.x/api/child_process.html#child_process_child_process_spawn_command_args_options
        /* Not on detached --- */
        childProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        childProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        }); /* --- */

        childProcess.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
        });

        // https://nodejs.org/docs/latest-v12.x/api/child_process.html#child_process_event_close
        childProcess.on('exit', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        return childProcess;
    }

    execute(commandDefinition: string, parallels: string[][][]) {
        const commandProcessor = CommandProcessor.getInstance();

        for (const parallel of parallels) {
            let commands: string[] = [];
            let commandsCalledIndex = 0;

            for (let sequentialIndex = 0; sequentialIndex < parallel.length; sequentialIndex++) {
                const sequential = parallel[sequentialIndex];

                commands[sequentialIndex] = commandProcessor.applyParameterValues(commandDefinition, sequential);

                if (sequentialIndex == 0) {
                    const onTerminated = () => {
                        commandsCalledIndex++;

                        if (commandsCalledIndex < commands.length) {
                            const nextCommand = commands[commandsCalledIndex];

                            this.executeChildProcess(nextCommand, onTerminated);
                        }
                    };

                    this.executeChildProcess(commands[0], onTerminated);
                }
            }
        }
    }

    private static instance: CommandExecutor;

    static getInstance(): CommandExecutor {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new CommandExecutor();

        return this.instance;
    }
}