const { exec } = require("child_process");

exports.default = async function (configuration) {
    const { path } = configuration;
    const cmd = `signtool sign /n "Open Source Developer, Shani Holdengreber" /t http://time.certum.pl /fd sha256 /v ${path}`;
    console.log(`--- signing cmd: ${cmd}`);
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`--- signing error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.log(`--- signing stderr: ${stderr}`);
            return;
        }

        console.log(`--- signing stdout: ${stdout}`);
    });
}