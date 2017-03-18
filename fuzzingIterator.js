var recursiveReadSync = require('recursive-readdir-sync');
var fuzzer = require('./fuzzer.js');
var shell = require('shelljs');
var fr = require('./failure_report.js');
var sleep = require('sleep');
var files = [];
function main() {

    var directory = "/home/vagrant/iTrust/src/main/";
    var filelist = listFilesRecursively(directory);

    for (var i = 0; i < 3; i++){
   
        try{

           shell.rm('-rf','/home/vagrant/iTrust');
           shell.cp('-R', '/home/vagrant/project/', '/home/vagrant/iTrust/');

           fuzzer.processFiles(filelist);
           sleep.sleep(5);    
    
           //shell.exec('cd /home/vagrant/iTrust/; mvn clean package');
           shell.exec('cd /home/vagrant/iTrust/');
           shell.exec('git add .');
           shell.exec('git commit -m "Fuzzed '+i+' "');
        
           var isProjectBuilding = true;
           while(isProjectBuilding){

    	      sleep.sleep(10);
              var jsonOutput = shell.exec('curl http://localhost:8080/job/iTrust/lastBuild/api/json');
              var buildObj = JSON.parse(jsonOutput);
	      isProjectBuilding = buildObj.building;
           
	   }
	}catch(e){
	  console.log(e);
	}
       
        
        //child_process.execSync('ls').toString();
        // child_process.execSync('mvn clean package');
    fr.updateFailureReport();
    }
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
