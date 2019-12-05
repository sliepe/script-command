"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var command_processor_1 = require("./command-processor");
var CommandExecutor = /** @class */ (function () {
    function CommandExecutor() {
    }
    // private childProcess: ChildProcess[] = []; // Not needed
    CommandExecutor.prototype.executeChildProcess = function (command, onTerminated) {
        var child_process = require('child_process');
        var childProcess = child_process.exec(command, function (error, stdout, stderr) {
            if (error) {
                console.error("exec error: " + error);
                return;
            }
            console.log("stdout: " + stdout);
            console.error("stderr: " + stderr);
            onTerminated();
        });
        // https://nodejs.org/docs/latest-v12.x/api/child_process.html#child_process_child_process_spawn_command_args_options
        /* Not on detached --- */
        childProcess.stdout.on('data', function (data) {
            console.log("stdout: " + data);
        });
        childProcess.stderr.on('data', function (data) {
            console.error("stderr: " + data);
        }); /* --- */
        childProcess.on('close', function (code) {
            console.log("child process close all stdio with code " + code);
        });
        // https://nodejs.org/docs/latest-v12.x/api/child_process.html#child_process_event_close
        childProcess.on('exit', function (code) {
            console.log("child process exited with code " + code);
        });
        return childProcess;
    };
    CommandExecutor.prototype.execute = function (commandDefinition, parallels) {
        var _this = this;
        var commandProcessor = command_processor_1.default.getInstance();
        var _loop_1 = function (parallel) {
            var commands = [];
            var commandsCalledIndex = 0;
            var _loop_2 = function (sequentialIndex) {
                var sequential = parallel[sequentialIndex];
                commands[sequentialIndex] = commandProcessor.applyParameterValues(commandDefinition, sequential);
                if (sequentialIndex == 0) {
                    var onTerminated_1 = function () {
                        commandsCalledIndex++;
                        if (commandsCalledIndex < commands.length) {
                            var nextCommand = commands[commandsCalledIndex];
                            _this.executeChildProcess(nextCommand, onTerminated_1);
                        }
                    };
                    this_1.executeChildProcess(commands[0], onTerminated_1);
                }
            };
            for (var sequentialIndex = 0; sequentialIndex < parallel.length; sequentialIndex++) {
                _loop_2(sequentialIndex);
            }
        };
        var this_1 = this;
        for (var _i = 0, parallels_1 = parallels; _i < parallels_1.length; _i++) {
            var parallel = parallels_1[_i];
            _loop_1(parallel);
        }
    };
    CommandExecutor.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new CommandExecutor();
        return this.instance;
    };
    return CommandExecutor;
}());
exports.default = CommandExecutor;
//# sourceMappingURL=command-executor.js.map