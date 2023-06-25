const { spawn } = require("child_process");

exports.default = async function (configuration) {
    const { path } = configuration;
    const cmd = `signtool sign /n "Open Source Developer, Shani Holdengreber" /t http://time.certum.pl /fd sha256 /v ${path}`;
    console.log(`--- signing cmd: ${cmd}`);
    const execution = spawn(cmd, { shell: true });
    execution.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });
    
    execution.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
    
    execution.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    
    execution.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });
}