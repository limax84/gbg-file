#!/usr/bin/env node
'use strict';

// Lib dependencies
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var childProcess = require('child_process');
var path = require('path');
var fs = require('fs');

// Express application
var app = express();
app.set('hostname', 'localhost');
app.set('port', 1337);

// Parse JSON requests' bodies
app.use(bodyParser.json());


// Activation route
app.all('/activation', function(req, res) {

    // Logs the request in a file (To save CPU and SDCARD for example)
    var fd = fs.openSync(path.join(__dirname, 'requests.log'), 'a+');
    req.body.timestamp = new Date().getTime();
    fs.writeSync(fd, JSON.stringify(req.body) + '\n');
    fs.closeSync(fd);

    // Call the Shell script
    exec('./script.sh ' + req.body.hostname, function(exitCode) {
        var filePath;
        switch (exitCode) {
            case 0:
                filePath = path.join(__dirname, 'files', req.body.hostname + '.tar.gz');
                res.status(200);
                break;
            case 1:
                filePath = path.join(__dirname, 'files', req.body.hostname + '.tar.gz');
                res.status(500);
                break;
            default:
                return res.status(404).send('Activation not found');
                break;
        }
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }
        return res.download(filePath);
    });

});


// Error handling
app.use(function(err, req, res) {
    console.error('CAUGHT ERROR', err);
    res.status(500).send(err.message);
});

// Create HTTP server
var server = http.createServer(app);

// Start server
server.listen(app.get('port'), app.get('hostname'));
server.on('listening', function() {
    console.log('--------------------');
    console.log('SERVER STARTED and listening on [http://' + app.get('hostname') + ':' + app.get('port') + ']');
});


/**
 * Execute the given command
 * @param command
 * @param callback
 */
function exec(command, callback) {
    childProcess.exec(command, {}, function(err, stdout, stderr) {
        // ON SCRIPT EXIT

        // Print buffered console outputs
        process.stdout.write(stdout);
        process.stderr.write(stderr);

        // No error means exitCode = 0
        var exitCode = 0;
        if (err) {
            // Fetch the error code
            exitCode = err.code;
            // Print the error itself
            process.stderr.write('EXEC ERROR: ' + err);
        }

        // Call the callback function with the exit code
        callback(exitCode);
    });
}