'use strict';

var sorterLocation = require('../lib/sorter/location.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
exports['getNewLocation'] = {
    setUp: function(done) {
        done();
    },
    function(test) {
        test.equal(
            sorterLocation.getNewLocation(
                '/home/example.file', {
                    Files: ['.file']
                }
            ), '/home/Files/example.file', 'The sorter is sorting files incorrectly!');
        test.done();
    },
};