// This can be used in a 'configure' block, e.g. 
// chook_slowest_test_reporter = require('chook-slowest-test-reporter');
// chook.use(chook_slowest_test_reporter.summary());
chook.use(chook-slowest-test-reporter.reporter(10));
exports.reporter = function(numberOfTests) { 
	return {
		reporter: function(e) {

			e.on('complete', function(status){

				var flattenedTests = [];

				function getTestTimes(suitePath, suites) {
					suites.forEach(function(suite) {
						var path = suitePath.slice();
						path.push(suite.name);
						suite.tests.forEach(function(test) {
							flattenedTests.push({path: path, name: test.name, duration: test.duration});
						});
						if (suite.suites) {
							getTestTimes(path, suite.suites);
						}
					});
				}
				getTestTimes([], status.suites);

				var sorted = flattenedTests.sort(function(a, b) {
					return b.duration - a.duration;
				});

				var slowestTests = flattenedTests;
				if (flattenedTests.length > numberOfTests) {
					slowestTests = flattenedTests.slice(0, numberOfTests);
				}
				console.log('');
				console.log(numberOfTests + ' SLOWEST TESTS');
				console.log('************');

				slowestTests.forEach(function(test) {
					console.log(test.duration + 'ms : ' + test.path + ': ' + test.name);
				});

			});
		}
	};
};
