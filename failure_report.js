var fs = require('fs'),
    path = require('path'),
    xml2js = require('xml2js');
var parser = new xml2js.Parser();



exports.updateFailureReport = function(){
    var reports = ["/home/vagrant/iTrust/target/surefire-reports/"];
    gatherFailedTestCases(reports[0]);
}

function gatherFailedTestCases(dir) {

    var files = fs.readdirSync(dir);
    var filelist = [];
    files.forEach(function (file) {

        var filePath = path.join(dir, file);
        if (path.extname(filePath) === '.xml') {
            filelist.push(filePath);
        }
    });

    function compare(a, b) {

        if (!a.failed && b.failed) {
            return 1;
        }
        else if (a.failed && !b.failed) {
            return -1;
        }
        else
            return a.time - b.time;
    }
//   filelist = ["/home/vagrant/iTrust/target/surefire-reports/TEST-edu.ncsu.csc.itrust.unit.bean.DistanceComparatorTest.xml"]
   console.log("FilelIst"+filelist.length) 
   var failedTestCases = [];
    for (var file in filelist) {
//	console.log("File"+filelist[file]);
        fs.readFile(filelist[file], function (err, data) {
            parser.parseString(data, function (err, result) {
//                console.log(filelist[file])
//                console.log(result);
                for (var testCase in result.testsuite.testcase) {
                    var t = {};
                    //console.log(result.testsuite.testcase[testCase]);
                    t.testname = result.testsuite.testcase[testCase]['$'].name;
                    t.failed = false;;
                    if (result.testsuite.testcase[testCase].hasOwnProperty("failure")) {
                        t.failed = true;
                        console.log("FailedTestCases "+t.testname);
                        fs.appendFile('/home/vagrant/Fuzzer2/failures.txt', t.testname+"\n", function (err) {});

                    }

                }


            });
        });

    }
}
