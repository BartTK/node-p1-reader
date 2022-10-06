[![NPM](https://nodei.co/npm/p1-reader.png?compact=true)](https://www.npmjs.com/package/p1-reader)

# Node.js P1-Reader

Node.js package for reading and parsing data from the P1 port of a Smart Meter. Current, both Dutch (DSMR 2.2, 4.x and 5.x) and Belgian (eMUCs 1.4) Smart Meters are supported.

## How to use

The serial connection is automatically opened on initiating the P1-Reader. Use the `reading` event to start receiving data, which should come in every 10 seconds (for DSMR <5.0) or every second (for DSMR >=5.0 and eMUCs 1.4).

```javascript
const P1Reader = require('p1-reader');
const p1Reader = new P1Reader({
    port: '/dev/tty-usbserial1',
    baudRate: 115200,
    parity: "even",
    dataBits: 7,
    stopBits: 1
});

p1Reader.on('reading', data => {
    console.log('Currently consuming: ' + data.electricity.received.actual.reading + data.electricity.received.actual.unit);
});

p1Reader.on('error', err => {
    console.log('Error while reading: ' + err);
});
```

### Example project

An example project of how to use this module to capture data from the Smart Meter and push it to an InfluxDB database can be found here: https://github.com/ruudverheijden/p1-to-influxdb

## Configuration

If for some reason the automatic serial port discovery does not work it is possible to force a certain port with a specific configuration.

Provide a `serialPort` object as option parameter to set a specific serial port configuration. The object should contain all of the following field:

* `port` : Path of the serial port to which the Smart Meter is connected (e.g. '/dev/ttyUSB0')
* `baudRate` : Baud rate of the serial port (e.g. '9600' or '115200')
* `parity` : Parity of the serial port (e.g. 'none' or 'even')
* `dataBits` : Number of data bits used for the serial port (e.g. '7' or '8')
* `stopBits` : Number of stop bits used for the serial port (e.g. '1')

### How to find the serial port location?

Usually, you will need a "Smart Meter cable" that connects the RJ-11 connector of the Smart Meter to a USB port of your device, e.g. a Raspberry Pi.
Once the cable is connected you can run `dmesg | grep tty` on a Linux based system to find details about the path of the serial port to which the Smart Meter is connected. The response of this command should return something like "USB Serial Device converter now attached to ttyUSB0", which will probably mean the path to your USB device is at "/dev/ttyUSB0".

Common locations that you can try: `/dev/ttyUSB0`, `/dev/ttyUSB1`, `/dev/ttyAMA0` or `/dev/ttyAMA1`

### Known configurations per Dutch DSMR Smart Meter Type

There are many different types of Smart Meters in the market, which have different configurations. To be able to read data from the Smart Meter you need to find the serialport configuration of your specific type of Smart Meter.

The table below is based on the [extensive analysis already done by Domoticx](http://domoticx.com/p1-poort-slimme-meter-hardware/) on the different types of Smart Meter hardware:

| Brand        | Model         | DSMR version        | Header  | Baud Rate | Parity | Data Bits | Stop Bits |
| ------------ | ------------- | ------------------- | ------- | --------- | ------ | --------- | --------- |
| Iskra        | ME 382        | 2.2                 | /ISk5\  | 9600      | Even   | 7         | 1         |
| Iskra        | MT 382        | 2.2                 | /ISk5\  | 9600      | Even   | 7         | 1         |
| Iskra        | AM 550        | 5.0                 | /ISk5\  | 115200    | None   | 8         | 1         |
| Kaifa        | E0003         | 4.0                 | KFM5    | 115200    | None   | 8         | 1         |
| Kaifa        | E0025         | 4.0                 | /KFM5   | 115200    | None   | 8         | 1         |
| Kaifa        | MA105         | 4.0 (4.0.5 / 4.0.7) | /KFM5   | 115200    | None   | 8         | 1         |
| Kaifa        | MA105C        | 4.2.2               | /KFM5   | 115200    | None   | 8         | 1         |
| Kaifa        | MA304         | 4.0 (4.0.5 / 4.0.7) | /KFM5   | 115200    | None   | 8         | 1         |
| Kaifa        | MA304C        | 4.2.2               | /KFM5   | 115200    | None   | 8         | 1         |
| Kamstrup     | 162           | 2.2                 | /KMP5   | 9600      | Even   | 7         | 1         |
| Kamstrup     | 351           | 2.2                 | /KMP5   | 9600      | Even   | 7         | 1         |
| Kamstrup     | 382           | 2.2                 | /KMP5   | 9600      | Even   | 7         | 1         |
| Landis + Gyr | E350 (ZCF100) | 4.0                 | /XMX5LG | 115200    | None   | 8         | 1         |
| Landis + Gyr | E350 (ZCF100) | 4.2                 | /XMX5LG | 115200    | Even   | 7         | 1         |
| Landis + Gyr | E350 (ZCF110) | 4.2                 | /XMX5LG | 115200    | None   | 8         | 1         |
| Landis + Gyr | E350 (ZFF100) | 4.0                 | /XMX5LG | 115200    | None   | 8         | 1         |
| Landis + Gyr | E350 (ZMF100) | 4.0                 | /XMX5LG | 115200    | None   | 8         | 1         |
| Landis + Gyr | E360 (T11142) | 5.0                 | /XMX5LG | 115200    | None   | 8         | 1         |
| Sagemcom     | T210-D ESMR5  | 5.0                 | /Ene5   | 115200    | None   | 8         | 1         |

### Known configurations per Belgian eMUCs Smart Meter Type

Please create a Pull Request if you find one or have a known working config yourself.
| Brand              | Model | DSMR version | Header  | Baud Rate | Parity | Data Bits | Stop Bits |
| ------------------ | ----- | -------------| ------- | --------- | ------ | --------- | --------- |
| Siconia (Sagemcom) | S211  | 5.0          | /FLU5   | 115200    | None   | 8         | 1         |

Warning, for personal data protection reasons, it seems that Belgian operators of gas and electricity distribution networks *disable by default* the P1 port.
You have to ask them to activate the P1 to be able to read anything. Your Serial to USB adapter migh not be broken after all.

Depending on your local operator, this activation might need a special fee.
| Locality | Operator | Fee | How to activate |
| -------- | ---------| --- | --------------- |
| Flanders | Fluvius | free (to be verified) | On their website, in your personal account. See [here](https://www.fluvius.be) or [this step-by-step procedure](https://www.engie.be/nl/support/faq/dienst-na-verkoop/boxx/inzicht-in-verbruik-en-meter/hoe-activeer-ik-de-p1-poort-slimme-meter-fluvius/) made by Engie.
| Wallonia | RESA | 46,39€ VAT included (VAT might be reduced to 6% under conditions) | Submit [this form](https://www.resa.be/wp-content/uploads/2020/02/20200210_PP1_Formulaire_NEW.pdf) (completely hidden from their website, thanks Google for crawling it!). This operation is done remotely by the operator. The whole process takes usually 2 or 3 open days (purchase order issuance, payment and actual remote work) |
| Wallonia | ORES | 25€ (to be verified) | Contact them (to be described) |
| Brussels | Sibelga | ? | ? |


## Events

The module emits the following events:

* `connected` : When a connection with the Smart Meter was successfully setup
* `reading` : When a reading is received via the serial connection (should be on a 10 second interval)
* `reading-raw` : Same as the `reading` event but instead returning the raw data as a string
* `error` : When the serial connection emits an error
* `close` : When the serial connection closes for some reason

## Reading structure

The `reading` event returns the following data structure:

```json
{
    "meterType": "ISk5\2MT382-1000",
    "version": "42",
    "timestamp": "2010-12-09T10:30:20.000Z",
    "equipmentId": "4B384547303034303436333935353037",
    "textMessage": {
        "codes": "3031203631203831",
        "message": "0123456789:;<=>?0123456789:;<=>?0123456789:;<=>?0123456789:;<=>?0123456789:;<=>?"
    },
    "electricity": {
        "received": {
            "tariff1": {
                "reading": 123456.789,
                "unit": "kWh"
            },
            "tariff2": {
                "reading": 123456.789,
                "unit": "kWh"
            },
            "actual": {
                "reading": 1.193,
                "unit": "kW"
            }
        },
        "delivered": {
            "tariff1": {
                "reading": 123456.789,
                "unit": "kWh"
            },
            "tariff2": {
                "reading": 123456.789,
                "unit": "kWh"
            },
            "actual": {
                "reading": 0,
                "unit": "kW"
            }
        },
        "tariffIndicator": 2,
        "threshold": {
            "value": 16.1,
            "unit": "kW"
        },
        "fuseThreshold": {
            "value": 10,
            "unit": "A"
        },
        "switchPosition": "1",
        "numberOfPowerFailures": 4,
        "numberOfLongPowerFailures": 2,
        "longPowerFailureLog": {
            "count": 2,
            "log": [
                {
                    "startOfFailure": "2010-12-08T14:20:15.000Z",
                    "endOfFailure": "2010-12-08T14:24:15.000Z",
                    "duration": 240,
                    "unit": "s"
                },
                {
                    "startOfFailure": "2010-12-08T14:05:03.000Z",
                    "endOfFailure": "2010-12-08T14:10:04.000Z",
                    "duration": 301,
                    "unit": "s"
                }
            ]
        },
        "voltageSags": {
            "L1": 2,
            "L2": 1,
            "L3": 0
        },
        "voltageSwell": {
            "L1": 0,
            "L2": 3,
            "L3": 0
        },
        "instantaneous": {
            "current": {
                "L1": {
                    "reading": 1,
                    "unit": "A"
                },
                "L2": {
                    "reading": 2,
                    "unit": "A"
                },
                "L3": {
                    "reading": 3,
                    "unit": "A"
                }
            },
            "voltage": {
                "L1": {
                    "reading": 231,
                    "unit": "V"
                },
                "L2": {
                    "reading": 232,
                    "unit": "V"
                },
                "L3": {
                    "reading": 233,
                    "unit": "V"
                }
            },
            "power": {
                "positive": {
                    "L1": {
                        "reading": 1.111,
                        "unit": "kW"
                    },
                    "L2": {
                        "reading": 2.222,
                        "unit": "kW"
                    },
                    "L3": {
                        "reading": 3.333,
                        "unit": "kW"
                    }
                },
                "negative": {
                    "L1": {
                        "reading": 4.444,
                        "unit": "kW"
                    },
                    "L2": {
                        "reading": 5.555,
                        "unit": "kW"
                    },
                    "L3": {
                        "reading": 6.666,
                        "unit": "kW"
                    }
                }
            }
        }
    },
    "gas": {
        "deviceType": "003",
        "equipmentId": "3232323241424344313233343536373839",
        "timestamp": "2010-12-09T10:00:00.000Z",
        "reading": 12785.123,
        "unit": "m3",
        "valvePosition": "1"
    }
}
```

## Emulator mode

Since your development machine is usually not connected to the serial port directly the emulator mode can be enabled.
When enabled the module will not connect to a serial port but instead will use a mocked version that will emit messages according to the DSMR 4.0 specification.

The emulator will emit a reading event every 10 seconds just like an actual Smart Meter would do with the most important variables (timestamp, electricity.received.tariff1, electricity.received.actual, gas.timestamp and gas.reading) being incremented.

Provide the `emulator` option parameter to run the module in emulator mode:

```javascript
const p1Reader = new P1Reader({emulator: true});
```

The emulator defaults can be overriden by passing an `emulatorOverrides` object, which can contain the following parameters:

* `electricityOffset` : Starting value of electricity on tariff 1 in kWh (default: 0)
* `electricityIncrement` : Incremental value (every 10 seconds) of electricity on tariff 1 in kW (default: 0.1)
* `gasOffset` : Starting value of gas in m3 (default: 0)
* `gasIncrement` : Incremental value (every hour) of gas in m3 (default: 0.1)
* `interval` : Interval (in seconds) in which readings are emitted (default: 10)
* `intervalGas` Interval (in seconds) in which the gas reading is incremented (default: 3600)

## Debug mode

In debug mode all raw and parsed packages are written to 2 separate log files (debug-data-raw.log and debug-data-parsed.log) and stored in the directory from which the module was triggered.

Provide the `debug` option parameter to run the module in debug mode:

```javascript
const p1Reader = new P1Reader({debug: true});
```

## Official documentation

### Dutch Smart Meter

The official DSMR Smart Meter P1 interface documentation from Netbeheer Nederland can be found here:
<https://www.netbeheernederland.nl/dossiers/slimme-meter-15/documenten>
This documentation was used as a reference to create and verify this module.

### Belgian eMUCs

The Belgian smart meter standard is based on the Dutch DSMR 5.X P1 standard.
The official documentation can be found here: <https://maakjemeterslim.be/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdUlCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--98ba80caddbb098bbc44b81e9be0a92a6637bef3/e-MUCS_P1_Ed_1_4.pdf?disposition=attachment>

## Changelog

2.0.4

* Fixing Jasmine test cases

2.0.3

* Small fix to make data structure consistent for eMUCs fuseThreshold

2.0.2

* Adding support for Belgian smart meters following the eMUCs specification

2.0.1

* Adding support for DSMR5.0, which adds instantaneous voltages measurement on all 3 phases (found at instantaneous->voltage->L1/L2/L3)

2.0.0

* Adding support for DSMR2.2 Smart Meters (tested with Kamstrup 162 model)
* Removing serial port auto discovery functionality since it causes issues on many devices, resulting in the need to change the initialisation parameters of this model and therefore a major version bump
* Updating "node-serialport" and "jasmine" dependencies to latest version
* Applying ES6 standards to code
* Improved accuracy of parsing messages by fixing assumption that header is always followed by an empty line, which is not the case for many types of smart meters
* Improved documentation and example script

1.5.1

* Small fix for bug that broke the emulator since last version

1.5.0

* Serial port auto discovery function now also tries different configurations to allow to automatically connect to any DSMR 4+ Smart Meter
* Allow forcing both a specific port and configuration (baudrate, parity, databits and stopbits) - Note that the "port" parameter is replaced, which is not backwards compatible
* Removing the "crash on purpose" when a smart meter could not be found
* Improving debug logging for better traceability of issues
* Upgrading "node-serialport" dependency to latest version for improved stability
* Applying ES6 standards to code

1.4.1

* Minor bug fix on incorrectly returning the LongPowerFailureLog object

1.4.0

* Exposing and calculating the datetime of the start of a LongPowerFailure
* Added the 'reading-raw' event to retrieve the raw data (as a string) that was retrieved from the Smart Meter

1.3.1

* Added option to control the interval of the emulator mode via an option parameter

1.3.0

* Added emulator mode for development purposes
* Extended example with all possible option parameters

1.2.0

* Upgraded serialport to 4.0.7
* Serial port is now automatically locked preventing other processes from opening it
* Added 'connected' event
* Exposed used serial port name via getSerialPort()

1.1.1

* Minor bug fix

1.1.0

* Added option to force a specific port
* Log more debugging information

1.0.1

* Updated readme

1.0.0

* Initial version with full DSMR 4.0 specification implemented
