#! /usr/bin/env node

import ScriptCommand from "./script-command/script-command";

const scriptCommand = ScriptCommand.getInstance();
scriptCommand.execute();