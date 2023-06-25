const { exec } = require("child_process");

exports.default = async function(configuration) {
    const { path } = configuration;
    exec(`signtool sign /n "Open Source Developer, Shani Holdengreber" /t http://time.certum.pl /fd sha256 /v ${path}`);
  }