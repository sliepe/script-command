"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandLoader = /** @class */ (function () {
    function CommandLoader() {
    }
    /**
     * Load package.json file
     */
    CommandLoader.prototype.loadPackageJson = function () {
        var processCwd = process.cwd();
        var packageJsonPath = processCwd + '/package.json';
        return Promise.resolve().then(function () { return require(packageJsonPath); }).catch(function (reason) {
            throw new Error("package.json file wasn't able too load!" + " Reason: " + reason);
        });
    };
    /**
     * Load command definition from package.json commands object
     *
     * @param scriptCommand
     * @param onDefinitionLoaded
     */
    CommandLoader.prototype.loadDefinition = function (scriptCommand, onDefinitionLoaded) {
        // Load package.json file
        this.loadPackageJson().then(
        // Package.json file loaded
        function (packageJson) {
            // Check for commands property
            if (packageJson.hasOwnProperty('commands')) {
                // Split script command to it`s parts, by ':'
                var splittedScriptCommand = scriptCommand.split(':');
                // Determine, if the splitted script-command parts are available inside the commands object ---
                var commandPartCount = 0;
                var commandPartLength = splittedScriptCommand.length;
                if (packageJson.hasOwnProperty('commands')) {
                    // Start with whole commands object
                    var object = packageJson['commands'];
                    // Loop to a max of command part length
                    while (commandPartCount < commandPartLength) {
                        var commandPartKey = splittedScriptCommand[commandPartCount];
                        // Command part key available
                        if (object.hasOwnProperty(commandPartKey)) {
                            commandPartCount++;
                            // Use the value for further checks
                            var commandPartValue = object[commandPartKey];
                            // If all command parts found
                            if (commandPartCount == commandPartLength) {
                                // Command part value must be of type string
                                if (typeof commandPartValue == 'string') {
                                    // Pass it
                                    onDefinitionLoaded(commandPartValue);
                                    // Leave the enclosing function
                                    return;
                                }
                                else {
                                    throw new Error("Command definition needs to be of type string!");
                                }
                            }
                            else {
                                if (typeof commandPartValue != 'object') {
                                    throw new Error("Command part value needs to be of type object!");
                                }
                                // Next try
                                object = commandPartValue;
                            }
                        }
                        else {
                            throw new Error("Command part " + commandPartKey + " not found!");
                        }
                    }
                }
                else {
                    throw new Error("Commands property not defined!");
                }
                // ---
            }
        });
    };
    CommandLoader.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new CommandLoader();
        return this.instance;
    };
    return CommandLoader;
}());
exports.default = CommandLoader;
//# sourceMappingURL=command-loader.js.map