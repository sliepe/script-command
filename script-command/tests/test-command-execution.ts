const child_process = require('child_process'); //

// Spawning a command with parameters works, if it`s quoted as a whole
const childProcess = child_process.spawn('"../../node_modules/.bin/tsc" --project tsconfig.json --listEmittedFiles --pretty --watch', {
    shell: true,
    detached: true
});

childProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

childProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

childProcess.on('error', function (error) {
    console.log("Process error!");
});

childProcess.on('exit', function (code:number) {
    console.log("Process exited with code: " + code);
});