var EventEmitter = require('events');
var util = require('util');
const lineReader = require('line-reader');

var serialPortUsed = false;
var constructor;
var crcCheckRequired = false;

const checkCrc = require('./lib/checkCrc');
var parsePacket = require('./lib/parsePacket');
var debug = require('./lib/debug');
var config = require('./config/config.json');

function P1Reader(options) {
    if (options.debug) {
        debug.enableDebugMode();
    }

    // Overwrite serialport module when emulator mode is set
    if (options.emulator) {
        SerialPort = require('./lib/emulateSerialport');
        SerialPort.setEmulatorOverrides(options.emulatorOverrides);
    }

    if (options.crcCheckRequired) {
        crcCheckRequired = options.crcCheckRequired;
    }

    constructor = this;

    EventEmitter.call(this);
    
    _setupSerialConnection(options.serialPort);
}

util.inherits(P1Reader, EventEmitter);

module.exports = P1Reader;

/**
 * Setup serial port connection
 */
function _setupSerialConnection(port) {
    debug.log('Trying to connect to Smart Meter via port: ' + port);

    var received = '';

    lineReader.eachLine(port, function(line, last) {
        received += line + '\r\n';

        var startCharPos = received.indexOf(config.startCharacter);
        var endCharPos = received.indexOf(config.stopCharacter);

        if (endCharPos >= 0 && endCharPos < startCharPos) {
            received = received.substr(endCharPos + 1);
            startCharPos = -1;
            endCharPos = -1;
        }

        // Package is complete if the start- and stop character are received
        const crcReceived = endCharPos >= 0 && received.length > endCharPos + 4;
        if (startCharPos >= 0 && endCharPos >= 0 && crcReceived) {           
            var packet = received.substr(startCharPos, endCharPos - startCharPos);
            const expectedCrc = parseInt(received.substr(endCharPos + 1, 4), 16);
            received = received.substr(endCharPos + 5);

            var crcOk = true;
            if (crcCheckRequired) {
                crcOk = checkCrc(packet + '!', expectedCrc);
            }

            if (crcOk) {
                var parsedPacket = parsePacket(packet);

                // Verify if connected to the correct serial port at initialization
                if (!serialPortUsed) {
                    if (parsedPacket.timestamp !== null) {
                        debug.log('Connection with Smart Meter established');
                        serialPortUsed = port;

                        constructor.emit('connected', port);
                    } else {
                        _tryNextSerialPort();
                    }
                }

                debug.writeToLogFile(packet, parsedPacket);

                constructor.emit('reading-raw', packet);

                if (parsedPacket.timestamp !== null) {
                    constructor.emit('reading', parsedPacket);
                } else {
                    constructor.emit('error', 'Invalid reading');
                }
            } else {
                constructor.emit('error', 'Invalid CRC');
            }
        }
    });
}

