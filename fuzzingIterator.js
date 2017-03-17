var recursiveReadSync = require('recursive-readdir-sync');
var fuzzer = require('./fuzzer.js');
var shell = require('shelljs');
var fr = require('./failure_report.js');
var sleep = require('sleep');
var files = [];
function main() {

    var directory = "/home/vagrant/iTrust/src/main/";
    var filelist = listFilesRecursively(directory);
    
    shell.rm('-rf','/home/vagrant/iTrust');
    shell.cp('-R', '/home/vagrant/project/', '/home/vagrant/iTrust/');

    fuzzer.processFiles(filelist);
    sleep.sleep(5);    
    
    shell.exec('cd /home/vagrant/iTrust/; mvn clean package');
    //child_process.execSync('ls').toString();
    // child_process.execSync('mvn clean package');
    fr.updateFailureReport();

}

function listFilesRecursively(directory) {
    var files = []
    try {
        files = recursiveReadSync(directory);
    }
    catch (err) {
        if (err.errno === 34) {
            console.log('Path does not exist');
        }
        else {
            //something unrelated went wrong, rethrow 
            throw err;
        }
    }
    
    return files;

}
main();
