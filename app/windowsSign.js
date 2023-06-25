const { common } = require("@mui/material/colors");
const { spawn } = require("child_process");

exports.default = async function (configuration) {
    console.log("Called with " + configuration.path)
    const { path } = configuration;
    const cmd = `signtool sign /n "Open Source Developer, Shani Holdengreber" /t http://time.certum.pl /fd sha256 /v ${path}`;
    console.log(`--- signing cmd: ${cmd}`);
    try {
        await spawnTool(cmd);
    } catch (e) {
        if (e.message.includes("The file is being used by another process") || e.message.includes("The specified timestamp server either could not be reached")) {
            console.log("Retrying in 5 seconds");
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    await spawnTool(cmd);
                    resolve();
                }, 5000);
            });
        }
    }
}

function spawnTool(command) {
    return new Promise((resolve, reject) => {
        const execution = spawn(command, { shell: true });
        execution.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });
        
        execution.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });
        
        execution.on('error', (error) => {
            console.log(`error: ${error.message}`);
            reject(error);
        });
        
        execution.on("close", code => {
            console.log(`child process exited with code ${code}`);
            resolve();
        });
    });
}