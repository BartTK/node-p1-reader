describe("parsePacket", function() {
    const parsePacket = require('../lib/parsePacket');

    const defaultHeader = "/MyMeterType\r\n \r\n";

    it("should be able to parse the packet header containing the meter type", function() {
        const parsedPacket = parsePacket(defaultHeader);

        expect(parsedPacket.meterType).toEqual("MyMeterType");
    });

    it("should return the expected output object", function() {
        // Input the default header and set version to "00", to prevent the incorrect assumption of a DSMR2.2 packet
        const parsedPacket = parsePacket(defaultHeader + "1-3:0.2.8(00)");

        const expectedOutputObject = {
            meterType: "MyMeterType",
                version: "00",
                timestamp: null,
                equipmentId: null,
                textMessage: {
                codes: null,
                    message: null
            },
            electricity: {
                received: {
                    tariff1: {
                        reading: null,
                            unit: null
                    },
                    tariff2: {
                        reading: null,
                            unit: null
                    },
                    actual: {
                        reading: null,
                            unit: null
                    }
                },
                delivered: {
                    tariff1: {
                        reading: null,
                            unit: null
                    },
                    tariff2: {
                        reading: null,
                            unit: null
                    },
                    actual: {
                        reading: null,
                            unit: null
                    }
                },
                tariffIndicator: null,
                    threshold: null,
                    fuseThreshold: null,
                    switchPosition: null,
                    numberOfPowerFailures: null,
                    numberOfLongPowerFailures: null,
                    longPowerFailureLog: null,
                    voltageSags: {
                    L1: null,
                        L2: null,
                        L3: null
                },
                voltageSwell: {
                    L1: null,
                        L2: null,
                        L3: null
                },
                instantaneous: {
                    current: {
                        L1: {
                            reading: null,
                                unit: null
                        },
                        L2: {
                            reading: null,
                                unit: null
                        },
                        L3: {
                            reading: null,
                                unit: null
                        }
                    },
                    voltage: {
                        L1: {
                            reading: null,
                            unit: null
                        },
                        L2: {
                            reading: null,
                            unit: null
                        },
                        L3: {
                            reading: null,
                            unit: null
                        }
                    },
                    power: {
                        positive: {
                            L1: {
                                reading: null,
                                    unit: null
                            },
                            L2: {
                                reading: null,
                                    unit: null
                            },
                            L3: {
                                reading: null,
                                    unit: null
                            }
                        },
                        negative: {
                            L1: {
                                reading: null,
                                    unit: null
                            },
                            L2: {
                                reading: null,
                                    unit: null
                            },
                            L3: {
                                reading: null,
                                    unit: null
                            }
                        }
                    },
                    harmonics: {
                        reading: null,
                        unit: null
                    }
                }
            },
            gas: {
                deviceType: null,
                    equipmentId: null,
                    timestamp: null,
                    reading: null,
                    unit: null,
                    valvePosition: null
            }
        };

        expect(parsedPacket).toEqual(expectedOutputObject);
    });

    it("should be able to parse the timestamp (summer time) from a packet", function() {
        // Input the default header and set version to "00", to prevent the incorrect assumption of a DSMR2.2 packet
        const packet = defaultHeader + "1-3:0.2.8(00)\r\n" + "0-0:1.0.0(160520213143S)";
        const parsedPacket = parsePacket(packet);

        expect(parsedPacket.timestamp).toEqual("2016-05-20T21:31:43.000Z");
    });

    it("should be able to parse the timestamp (winter time) from a packet", function() {
        // Input the default header and set version to "00", to prevent the incorrect assumption of a DSMR2.2 packet
        const packet = defaultHeader + "1-3:0.2.8(00)\r\n" + "0-0:1.0.0(160100000000W)";
        const parsedPacket = parsePacket(packet);

        expect(parsedPacket.timestamp).toEqual("2015-12-31T00:00:00.000Z");
    });

    it("should be able to parse an example DSMR4.0 packet of a KFM5KAIFA meter", function() {
        const packet = defaultHeader +
            "1-3:0.2.8(42)\r\n" +
            "0-0:1.0.0(160520213143S)\r\n" +
            "0-0:96.1.1(1234567890123456789012345678901234)\r\n" +
            "1-0:1.8.1(000123.456*kWh)\r\n" +
            "1-0:1.8.2(000456.789*kWh)\r\n" +
            "1-0:2.8.1(000200.120*kWh)\r\n" +
            "1-0:2.8.2(000300.230*kWh)\r\n" +
            "0-0:96.14.0(0001)\r\n" +
            "1-0:1.7.0(00.345*kW)\r\n" +
            "1-0:2.7.0(00.456*kW)\r\n" +
            "0-0:96.7.21(00008)\r\n" +
            "0-0:96.7.9(00005)\r\n" +
            "1-0:99.97.0(1)(0-0:96.7.19)(000101000014W)(60*s)\r\n" +
            "1-0:32.32.0(00001)\r\n" +
            "1-0:52.32.0(00002)\r\n" +
            "1-0:72.32.0(00003)\r\n" +
            "1-0:32.36.0(00004)\r\n" +
            "1-0:52.36.0(00005)\r\n" +
            "1-0:72.36.0(00006)\r\n" +
            "0-0:96.13.1(12345678)\r\n" +
            "0-0:96.13.0(303132333435363738393A3B3C3D3E3F)\r\n" +
            "1-0:31.7.0(001*A)\r\n" +
            "1-0:51.7.0(002*A)\r\n" +
            "1-0:71.7.0(003*A)\r\n" +
            "1-0:21.7.0(00.201*kW)\r\n" +
            "1-0:22.7.0(00.222*kW)\r\n" +
            "1-0:41.7.0(00.401*kW)\r\n" +
            "1-0:42.7.0(00.422*kW)\r\n" +
            "1-0:61.7.0(00.601*kW)\r\n" +
            "1-0:62.7.0(00.622*kW)\r\n" +
            "0-1:24.1.0(003)\r\n" +
            "0-1:96.1.0(1234567890123456789012345678901234)\r\n" +
            "0-1:24.2.1(160520210000S)(00500.123*m3)";

        const parsedPacket = parsePacket(packet);
        
        const expectedOutputObject = {
            "meterType": "MyMeterType",
            "version": "42",
            "timestamp": "2016-05-20T21:31:43.000Z",
            "equipmentId": "1234567890123456789012345678901234",
            "textMessage": {
                "codes": "12345678",
                "message": "0123456789:;<=>?"
            },
            "electricity": {
                "received": {
                    "tariff1": {
                        "reading": 123.456,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 456.789,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 0.345,
                        "unit": "kW"
                    }
                },
                "delivered": {
                    "tariff1": {
                        "reading": 200.12,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 300.23,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 0.456,
                        "unit": "kW"
                    }
                },
                "tariffIndicator": 1,
                "threshold": null,
                "fuseThreshold": null,
                "switchPosition": null,
                "numberOfPowerFailures": 8,
                "numberOfLongPowerFailures": 5,
                "longPowerFailureLog": {
                    "count": 1,
                    "log": [
                        {
                            "startOfFailure": "1999-12-31T23:59:14.000Z",
                            "endOfFailure": "2000-01-01T00:00:14.000Z",
                            "duration": 60,
                            "unit": "s"
                        }
                    ]
                },
                "voltageSags": {
                    "L1": 1,
                    "L2": 2,
                    "L3": 3
                },
                "voltageSwell": {
                    "L1": 4,
                    "L2": 5,
                    "L3": 6
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
                            "reading": null,
                            "unit": null
                        },
                        "L2": {
                            "reading": null,
                            "unit": null
                        },
                        "L3": {
                            "reading": null,
                            "unit": null
                        }
                    },
                    "power": {
                        "positive": {
                            "L1": {
                                "reading": 0.201,
                                "unit": "kW"
                            },
                            "L2": {
                                "reading": 0.401,
                                "unit": "kW"
                            },
                            "L3": {
                                "reading": 0.601,
                                "unit": "kW"
                            }
                        },
                        "negative": {
                            "L1": {
                                "reading": 0.222,
                                "unit": "kW"
                            },
                            "L2": {
                                "reading": 0.422,
                                "unit": "kW"
                            },
                            "L3": {
                                "reading": 0.622,
                                "unit": "kW"
                            }
                        }
                    },
                    "harmonics": {
                        "reading": null,
                        "unit": null
                    }
                }
            },
            "gas": {
                "deviceType": "003",
                "equipmentId": "1234567890123456789012345678901234",
                "timestamp": "2016-05-20T21:00:00.000Z",
                "reading": 500.123,
                "unit": "m3",
                "valvePosition": null
            }
        };

        expect(parsedPacket).toEqual(expectedOutputObject);
    });

    it("should be able to parse an example DSMR4.0 packet of a KAIFA E0003 meter", function() {
        const packet = defaultHeader +
            "1-3:0.2.8(42)\r\n" +
            "0-0:1.0.0(160520213143S)\r\n" +
            "0-0:96.1.1(1234567890123456789012345678901234)\r\n" +
            "1-0:1.8.1(000123.456*kWh)\r\n" +
            "1-0:1.8.2(000456.789*kWh)\r\n" +
            "1-0:2.8.1(000200.120*kWh)\r\n" +
            "1-0:2.8.2(000300.230*kWh)\r\n" +
            "0-0:96.14.0(0001)\r\n" +
            "1-0:1.7.0(00.345*kW)\r\n" +
            "1-0:2.7.0(00.456*kW)\r\n" +
            "0-0:96.7.21(00008)\r\n" +
            "0-0:96.7.9(00005)\r\n" +
            "1-0:99.97.0(1)(0-0:96.7.19)(000101000014W)(60*s)\r\n" +
            "1-0:32.32.0(00001)\r\n" +
            "1-0:52.32.0(00002)\r\n" +
            "1-0:72.32.0(00003)\r\n" +
            "1-0:32.36.0(00004)\r\n" +
            "1-0:52.36.0(00005)\r\n" +
            "1-0:72.36.0(00006)\r\n" +
            "0-0:96.13.1(12345678)\r\n" +
            "0-0:96.13.0(303132333435363738393A3B3C3D3E3F)\r\n" +
            "1-0:31.7.0(001*A)\r\n" +
            "1-0:51.7.0(002*A)\r\n" +
            "1-0:71.7.0(003*A)\r\n" +
            "1-0:21.7.0(00.201*kW)\r\n" +
            "1-0:22.7.0(00.222*kW)\r\n" +
            "1-0:41.7.0(00.401*kW)\r\n" +
            "1-0:42.7.0(00.422*kW)\r\n" +
            "1-0:61.7.0(00.601*kW)\r\n" +
            "1-0:62.7.0(00.622*kW)\r\n" +
            "0-1:24.1.0(003)\r\n" +
            "0-1:96.1.0(1234567890123456789012345678901234)\r\n" +
            "0-1:24.2.1(160520210000S)(00500.123*m3)";

        const parsedPacket = parsePacket(packet);
        
        const expectedOutputObject = {
            "meterType": "MyMeterType",
            "version": "42",
            "timestamp": "2016-05-20T21:31:43.000Z",
            "equipmentId": "1234567890123456789012345678901234",
            "textMessage": {
                "codes": "12345678",
                "message": "0123456789:;<=>?"
            },
            "electricity": {
                "received": {
                    "tariff1": {
                        "reading": 123.456,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 456.789,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 0.345,
                        "unit": "kW"
                    }
                },
                "delivered": {
                    "tariff1": {
                        "reading": 200.12,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 300.23,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 0.456,
                        "unit": "kW"
                    }
                },
                "tariffIndicator": 1,
                "threshold": null,
                "fuseThreshold": null,
                "switchPosition": null,
                "numberOfPowerFailures": 8,
                "numberOfLongPowerFailures": 5,
                "longPowerFailureLog": {
                    "count": 1,
                    "log": [
                        {
                            "startOfFailure": "1999-12-31T23:59:14.000Z",
                            "endOfFailure": "2000-01-01T00:00:14.000Z",
                            "duration": 60,
                            "unit": "s"
                        }
                    ]
                },
                "voltageSags": {
                    "L1": 1,
                    "L2": 2,
                    "L3": 3
                },
                "voltageSwell": {
                    "L1": 4,
                    "L2": 5,
                    "L3": 6
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
                            "reading": null,
                            "unit": null
                        },
                        "L2": {
                            "reading": null,
                            "unit": null
                        },
                        "L3": {
                            "reading": null,
                            "unit": null
                        }
                    },
                    "power": {
                        "positive": {
                            "L1": {
                                "reading": 0.201,
                                "unit": "kW"
                            },
                            "L2": {
                                "reading": 0.401,
                                "unit": "kW"
                            },
                            "L3": {
                                "reading": 0.601,
                                "unit": "kW"
                            }
                        },
                        "negative": {
                            "L1": {
                                "reading": 0.222,
                                "unit": "kW"
                            },
                            "L2": {
                                "reading": 0.422,
                                "unit": "kW"
                            },
                            "L3": {
                                "reading": 0.622,
                                "unit": "kW"
                            }
                        }
                    },
                    "harmonics": {
                        "reading": null,
                        "unit": null
                    }
                }
            },
            "gas": {
                "deviceType": "003",
                "equipmentId": "1234567890123456789012345678901234",
                "timestamp": "2016-05-20T21:00:00.000Z",
                "reading": 500.123,
                "unit": "m3",
                "valvePosition": null
            }
        };

        expect(parsedPacket).toEqual(expectedOutputObject);
    });

    it("should be able to parse an example DSMR2.2 packet of a Kamstrup 162 meter", function() {
        const packet = "/KMP5 ABCD123456789012\r\n" +
        "0-0:96.1.1(1234567890123456789012345678901234)\r\n" +
        "1-0:1.8.1(01234.567*kWh)\r\n" +
        "1-0:1.8.2(02345.678*kWh)\r\n" +
        "1-0:2.8.1(03456.789*kWh)\r\n" +
        "1-0:2.8.2(04567.890*kWh)\r\n" +
        "0-0:96.14.0(0001)\r\n" +
        "1-0:1.7.0(0001.23*kW)\r\n" +
        "1-0:2.7.0(0002.34*kW)\r\n" +
        "0-0:96.13.1(12345678)\r\n" +
        "0-0:96.13.0(303132333435363738393A3B3C3D3E3F)\r\n" +
        "0-1:24.1.0(3)\r\n" +
        "0-1:96.1.0(2345678901234567890123456789012345)\r\n" +
        "0-1:24.3.0(190914100000)(08)(60)(1)(0-1:24.2.1)(m3)\r\n" +
        "(02888.297)\r\n";

        const parsedPacket = parsePacket(packet);

        // Set timestamp of the expected output to now, since for DSMR2.2 the server determines the timestamp
        const now = new Date();
        now.setMilliseconds(0);
        
        const expectedOutputObject = {
            "meterType": "KMP5 ABCD123456789012",
            "version": "22",
            "timestamp": now.toISOString(),
            "equipmentId": "1234567890123456789012345678901234",
            "textMessage": {
                "codes": "12345678",
                "message": "0123456789:;<=>?"
            },
            "electricity": {
                "received": {
                    "tariff1": {
                        "reading": 1234.567,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 2345.678,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 1.23,
                        "unit": "kW"
                    }
                },
                "delivered": {
                    "tariff1": {
                        "reading": 3456.789,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 4567.890,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 2.34,
                        "unit": "kW"
                    }
                },
                "tariffIndicator": 1,
                "threshold": null,
                "fuseThreshold": null,
                "switchPosition": null,
                "numberOfPowerFailures": null,
                "numberOfLongPowerFailures": null,
                "longPowerFailureLog": null,
                "voltageSags": {
                    "L1": null,
                    "L2": null,
                    "L3": null
                },
                "voltageSwell": {
                    "L1": null,
                    "L2": null,
                    "L3": null
                },
                "instantaneous": {
                    "current": {
                        "L1": {
                            "reading": null,
                            "unit": null
                        },
                        "L2": {
                            "reading": null,
                            "unit": null
                        },
                        "L3": {
                            "reading": null,
                            "unit": null
                        }
                    },
                    "voltage": {
                        "L1": {
                            "reading": null,
                            "unit": null
                        },
                        "L2": {
                            "reading": null,
                            "unit": null
                        },
                        "L3": {
                            "reading": null,
                            "unit": null
                        }
                    },
                    "power": {
                        "positive": {
                            "L1": {
                                "reading": null,
                                "unit": null
                            },
                            "L2": {
                                "reading": null,
                                "unit": null
                            },
                            "L3": {
                                "reading": null,
                                "unit": null
                            }
                        },
                        "negative": {
                            "L1": {
                                "reading": null,
                                "unit": null
                            },
                            "L2": {
                                "reading": null,
                                "unit": null
                            },
                            "L3": {
                                "reading": null,
                                "unit": null
                            }
                        }
                    }
                }
            },
            "gas": {
                "deviceType": "3",
                "equipmentId": "2345678901234567890123456789012345",
                "timestamp": "2019-09-14T10:00:00.000Z",
                "reading": 2888.297,
                "unit": "m3",
                "valvePosition": null
            }
        };

        expect(parsedPacket).toEqual(expectedOutputObject);
    });

    it("should be able to parse an example DSMR2.2 packet of a XMX5 meter", function() {
        const packet = "/XMX5XMXABCE123456789\r\n" +
        "\r\n" +
        "0-0:96.1.1(4B414145303031343123456789012345)\r\n" +
        "1-0:1.8.1(03432.896*kWh)\r\n" +
        "1-0:1.8.2(03492.086*kWh)\r\n" +
        "1-0:2.8.1(02243.242*kWh)\r\n" +
        "1-0:2.8.2(05196.924*kWh)\r\n" +
        "0-0:96.14.0(0001)\r\n" +
        "1-0:1.7.0(0000.00*kW)\r\n" +
        "1-0:2.7.0(0001.34*kW)\r\n" +
        "0-0:96.13.1()\r\n" +
        "0-0:96.13.0()\r\n" +
        "0-1:96.1.0(3238303131303038333123456789012345)\r\n" +
        "0-1:24.1.0(03)\r\n" +
        "0-1:24.3.0(200509150000)(08)(60)(1)(0-1:24.2.0)(m3)\r\n" +
        "(05933.694)";

        const parsedPacket = parsePacket(packet);

        // Set timestamp of the expected output to now, since for DSMR2.2 the server determines the timestamp
        const now = new Date();
        now.setMilliseconds(0);
        
        const expectedOutputObject = {
            "meterType": "XMX5XMXABCE123456789",
            "version": "22",
            "timestamp": now.toISOString(),
            "equipmentId": "4B414145303031343123456789012345",
            "textMessage": {
                "codes": "",
                "message": ""
            },
            "electricity": {
                "received": {
                    "tariff1": {
                        "reading": 3432.896,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 3492.086,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 0,
                        "unit": "kW"
                    }
                },
                "delivered": {
                    "tariff1": {
                        "reading": 2243.242,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 5196.924,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 1.34,
                        "unit": "kW"
                    }
                },
                "tariffIndicator": 1,
                "threshold": null,
                "fuseThreshold": null,
                "switchPosition": null,
                "numberOfPowerFailures": null,
                "numberOfLongPowerFailures": null,
                "longPowerFailureLog": null,
                "voltageSags": {
                    "L1": null,
                    "L2": null,
                    "L3": null
                },
                "voltageSwell": {
                    "L1": null,
                    "L2": null,
                    "L3": null
                },
                "instantaneous": {
                    "current": {
                        "L1": {
                            "reading": null,
                            "unit": null
                        },
                        "L2": {
                            "reading": null,
                            "unit": null
                        },
                        "L3": {
                            "reading": null,
                            "unit": null
                        }
                    },
                    "voltage": {
                        "L1": {
                            "reading": null,
                            "unit": null
                        },
                        "L2": {
                            "reading": null,
                            "unit": null
                        },
                        "L3": {
                            "reading": null,
                            "unit": null
                        }
                    },
                    "power": {
                        "positive": {
                            "L1": {
                                "reading": null,
                                "unit": null
                            },
                            "L2": {
                                "reading": null,
                                "unit": null
                            },
                            "L3": {
                                "reading": null,
                                "unit": null
                            }
                        },
                        "negative": {
                            "L1": {
                                "reading": null,
                                "unit": null
                            },
                            "L2": {
                                "reading": null,
                                "unit": null
                            },
                            "L3": {
                                "reading": null,
                                "unit": null
                            }
                        }
                    }
                }
            },
            "gas": {
                "deviceType": "03",
                "equipmentId": "3238303131303038333123456789012345",
                "timestamp": "2020-05-09T15:00:00.000Z",
                "reading": 5933.694,
                "unit": "m3",
                "valvePosition": null
            }
        };

        expect(parsedPacket).toEqual(expectedOutputObject);
    });

    it("should be able to parse a complete DSMR4.0 packet (official documentation example)", function() {
        const packet = "/ISk5\\2MT382-1000\r\n \r\n" +
            "1-3:0.2.8(42)\r\n" +
            "0-0:1.0.0(101209113020W)\r\n" +
            "0-0:96.1.1(4B384547303034303436333935353037)\r\n" +
            "1-0:1.8.1(123456.789*kWh)\r\n" +
            "1-0:1.8.2(123456.789*kWh)\r\n" +
            "1-0:2.8.1(123456.789*kWh)\r\n" +
            "1-0:2.8.2(123456.789*kWh)\r\n" +
            "0-0:96.14.0(0002)\r\n" +
            "1-0:1.7.0(01.193*kW)\r\n" +
            "1-0:2.7.0(00.000*kW)\r\n" +
            "0-0:17.0.0(016.1*kW)\r\n" +
            "0-0:96.3.10(1)\r\n" +
            "0-0:96.7.21(00004)\r\n" +
            "0-0:96.7.9(00002)\r\n" +
            "1-0:99.97.0(2)(0-0:96.7.19)(101208152415W)(0000000240*s)(101208151004W)(0000000301*s)\r\n" +
            "1-0:32.32.0(00002)\r\n" +
            "1-0:52.32.0(00001)\r\n" +
            "1-0:72.32.0(00000)\r\n" +
            "1-0:32.36.0(00000)\r\n" +
            "1-0:52.36.0(00003)\r\n" +
            "1-0:72.36.0(00000)\r\n" +
            "0-0:96.13.1(3031203631203831)\r\n" +
            "0-0:96.13.0(303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F)\r\n" +
            "1-0:31.7.0(001*A)\r\n" +
            "1-0:51.7.0(002*A)\r\n" +
            "1-0:71.7.0(003*A)\r\n" +
            "1-0:21.7.0(01.111*kW)\r\n" +
            "1-0:41.7.0(02.222*kW)\r\n" +
            "1-0:61.7.0(03.333*kW)\r\n" +
            "1-0:22.7.0(04.444*kW)\r\n" +
            "1-0:42.7.0(05.555*kW)\r\n" +
            "1-0:62.7.0(06.666*kW)\r\n" +
            "0-1:24.1.0(003)\r\n" +
            "0-1:96.1.0(3232323241424344313233343536373839)\r\n" +
            "0-1:24.2.1(101209110000W)(12785.123*m3)\r\n" +
            "0-1:24.4.0(1)";

        const parsedPacket = parsePacket(packet);

        const expectedOutputObject = {
            "meterType": "ISk5\\2MT382-1000",
            "version": "42",
            "timestamp": "2010-12-09T11:30:20.000Z",
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
                "fuseThreshold": null,
                "switchPosition": "1",
                "numberOfPowerFailures": 4,
                "numberOfLongPowerFailures": 2,
                "longPowerFailureLog": {
                    "count": 2,
                    "log": [
                        {
                            "startOfFailure": "2010-12-08T15:20:15.000Z",
                            "endOfFailure": "2010-12-08T15:24:15.000Z",
                            "duration": 240,
                            "unit": "s"
                        },
                        {
                            "startOfFailure": "2010-12-08T15:05:03.000Z",
                            "endOfFailure": "2010-12-08T15:10:04.000Z",
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
                            "reading": null,
                            "unit": null
                        },
                        "L2": {
                            "reading": null,
                            "unit": null
                        },
                        "L3": {
                            "reading": null,
                            "unit": null
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
                "timestamp": "2010-12-09T11:00:00.000Z",
                "reading": 12785.123,
                "unit": "m3",
                "valvePosition": "1"
            }
        };

        expect(parsedPacket).toEqual(expectedOutputObject);
    });

    it("should be able to parse an example DSMR5.0 packet of a Sagemcom T210-D ESMR5 meter", function() {
        const packet = "/Ene5\T210-D ESMR5.0\r\n" +
        "\r\n" +
        "1-3:0.2.8(50)\r\n" +
        "0-0:1.0.0(200513132834S)\r\n" +
        "0-0:96.1.1(4530303438303030303123456789012345)\r\n" +
        "1-0:1.8.1(006166.961*kWh)\r\n" +
        "1-0:1.8.2(004386.431*kWh)\r\n" +
        "1-0:2.8.1(000000.111*kWh)\r\n" +
        "1-0:2.8.2(000000.000*kWh)\r\n" +
        "0-0:96.14.0(0002)\r\n" +
        "1-0:1.7.0(00.165*kW)\r\n" +
        "1-0:2.7.0(00.000*kW)\r\n" +
        "0-0:96.7.21(00608)\r\n" +
        "0-0:96.7.9(00008)\r\n" +
        "1-0:99.97.0(2)(0-0:96.7.19)(180823083010S)(0000001375*s)(171006104702S)(0000000747*s)\r\n" +
        "1-0:32.32.0(00003)\r\n" +
        "1-0:52.32.0(00003)\r\n" +
        "1-0:72.32.0(00002)\r\n" +
        "1-0:32.36.0(00000)\r\n" +
        "1-0:52.36.0(00000)\r\n" +
        "1-0:72.36.0(00000)\r\n" +
        "0-0:96.13.0()\r\n" +
        "1-0:32.7.0(234.0*V)\r\n" +
        "1-0:52.7.0(233.0*V)\r\n" +
        "1-0:72.7.0(231.0*V)\r\n" +
        "1-0:31.7.0(000*A)\r\n" +
        "1-0:51.7.0(000*A)\r\n" +
        "1-0:71.7.0(000*A)\r\n" +
        "1-0:21.7.0(00.067*kW)\r\n" +
        "1-0:41.7.0(00.000*kW)\r\n" +
        "1-0:61.7.0(00.098*kW)\r\n" +
        "1-0:22.7.0(00.000*kW)\r\n" +
        "1-0:42.7.0(00.000*kW)\r\n" +
        "1-0:62.7.0(00.000*kW)\r\n" +
        "0-1:24.1.0(003)\r\n" +
        "0-1:96.1.0(4730303533303033363123456789012345)\r\n" +
        "0-1:24.2.1(200513132500S)(03917.977*m3)";

        const parsedPacket = parsePacket(packet);
        
        const expectedOutputObject = {
            "meterType": "Ene5\T210-D ESMR5.0",
            "version": "50",
            "timestamp": "2020-05-13T13:28:34.000Z",
            "equipmentId": "4530303438303030303123456789012345",
            "textMessage": {
                "codes": null,
                "message": ""
            },
            "electricity": {
                "received": {
                    "tariff1": {
                        "reading": 6166.961,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 4386.431,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 0.165,
                        "unit": "kW"
                    }
                },
                "delivered": {
                    "tariff1": {
                        "reading": 0.111,
                        "unit": "kWh"
                    },
                    "tariff2": {
                        "reading": 0,
                        "unit": "kWh"
                    },
                    "actual": {
                        "reading": 0,
                        "unit": "kW"
                    }
                },
                "tariffIndicator": 2,
                "threshold": null,
                "fuseThreshold": null,
                "switchPosition": null,
                "numberOfPowerFailures": 608,
                "numberOfLongPowerFailures": 8,
                "longPowerFailureLog": {
                    "count": 2,
                    "log": [
                        {
                            "startOfFailure": "2018-08-23T08:07:15.000Z",
                            "endOfFailure": "2018-08-23T08:30:10.000Z",
                            "duration": 1375,
                            "unit": "s"
                        },
                        {
                            "startOfFailure": "2017-10-06T10:34:35.000Z",
                            "endOfFailure": "2017-10-06T10:47:02.000Z",
                            "duration": 747,
                            "unit": "s"
                        }
                    ]
                },
                "voltageSags": {
                    "L1": 3,
                    "L2": 3,
                    "L3": 2
                },
                "voltageSwell": {
                    "L1": 0,
                    "L2": 0,
                    "L3": 0
                },
                "instantaneous": {
                    "current": {
                        "L1": {
                            "reading": 0,
                            "unit": "A"
                        },
                        "L2": {
                            "reading": 0,
                            "unit": "A"
                        },
                        "L3": {
                            "reading": 0,
                            "unit": "A"
                        }
                    },
                    "voltage": {
                        "L1": {
                            "reading": 234,
                            "unit": "V"
                        },
                        "L2": {
                            "reading": 233,
                            "unit": "V"
                        },
                        "L3": {
                            "reading": 231,
                            "unit": "V"
                        }
                    },
                    "power": {
                        "positive": {
                            "L1": {
                                "reading": 0.067,
                                "unit": "kW"
                            },
                            "L2": {
                                "reading": 0,
                                "unit": "kW"
                            },
                            "L3": {
                                "reading": 0.098,
                                "unit": "kW"
                            }
                        },
                        "negative": {
                            "L1": {
                                "reading": 0,
                                "unit": "kW"
                            },
                            "L2": {
                                "reading": 0,
                                "unit": "kW"
                            },
                            "L3": {
                                "reading": 0,
                                "unit": "kW"
                            }
                        }
                    }
                }
            },
            "gas": {
                "deviceType": "003",
                "equipmentId": "4730303533303033363123456789012345",
                "timestamp": "2020-05-13T13:25:00.000Z",
                "reading": 3917.977,
                "unit": "m3",
                "valvePosition": null
            }
        };

        expect(parsedPacket).toEqual(expectedOutputObject);
    });

    it("should be able to parse a complete DSMR5.0 packet (official documentation example)", function() {
        const packet = "/ISk5\2MT382-1000\r\n" +
        "\r\n" +
        "1-3:0.2.8(50)\r\n" +
        "0-0:1.0.0(101209113020W)\r\n" +
        "0-0:96.1.1(4B384547303034303436333935353037)\r\n" +
        "1-0:1.8.1(123456.789*kWh)\r\n" +
        "1-0:1.8.2(123456.789*kWh)\r\n" +
        "1-0:2.8.1(123456.789*kWh)\r\n" +
        "1-0:2.8.2(123456.789*kWh)\r\n" +
        "0-0:96.14.0(0002)\r\n" +
        "1-0:1.7.0(01.193*kW)\r\n" +
        "1-0:2.7.0(00.000*kW)\r\n" +
        "0-0:96.7.21(00004)\r\n" +
        "0-0:96.7.9(00002)\r\n" +
        "1-0:99.97.0(2)(0-0:96.7.19)(101208152415W)(0000000240*s)(101208151004W)(0000000301*s)\r\n" +
        "1-0:32.32.0(00002)\r\n" +
        "1-0:52.32.0(00001)\r\n" +
        "1-0:72.32.0(00000)\r\n" +
        "1-0:32.36.0(00000)\r\n" +
        "1-0:52.36.0(00003)\r\n" +
        "1-0:72.36.0(00000)\r\n" +
        "0-0:96.13.0(303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F)\r\n" +
        "1-0:32.7.0(220.1*V)\r\n" +
        "1-0:52.7.0(220.2*V)\r\n" +
        "1-0:72.7.0(220.3*V)\r\n" +
        "1-0:31.7.0(001*A)\r\n" +
        "1-0:51.7.0(002*A)\r\n" +
        "1-0:71.7.0(003*A)\r\n" +
        "1-0:21.7.0(01.111*kW)\r\n" +
        "1-0:41.7.0(02.222*kW)\r\n" +
        "1-0:61.7.0(03.333*kW)\r\n" +
        "1-0:22.7.0(04.444*kW)\r\n" +
        "1-0:42.7.0(05.555*kW)\r\n" +
        "1-0:62.7.0(06.666*kW)\r\n" +
        "0-1:24.1.0(003)\r\n" +
        "0-1:96.1.0(3232323241424344313233343536373839)\r\n" +
        "0-1:24.2.1(101209112500W)(12785.123*m3)";

        const parsedPacket = parsePacket(packet);

        const expectedOutputObject = {
            "meterType": "ISk5\2MT382-1000",
            "version": "50",
            "timestamp": "2010-12-09T11:30:20.000Z",
            "equipmentId": "4B384547303034303436333935353037",
            "textMessage": {
                "codes": null,
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
                "threshold": null,
                "fuseThreshold": null,
                "switchPosition": null,
                "numberOfPowerFailures": 4,
                "numberOfLongPowerFailures": 2,
                "longPowerFailureLog": {
                    "count": 2,
                    "log": [
                        {
                            "startOfFailure": "2010-12-08T15:20:15.000Z",
                            "endOfFailure": "2010-12-08T15:24:15.000Z",
                            "duration": 240,
                            "unit": "s"
                        },
                        {
                            "startOfFailure": "2010-12-08T15:05:03.000Z",
                            "endOfFailure": "2010-12-08T15:10:04.000Z",
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
                            "reading": 220,
                            "unit": "V"
                        },
                        "L2": {
                            "reading": 220,
                            "unit": "V"
                        },
                        "L3": {
                            "reading": 220,
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
                "timestamp": "2010-12-09T11:25:00.000Z",
                "reading": 12785.123,
                "unit": "m3",
                "valvePosition": null
            }
        };

        expect(parsedPacket).toEqual(expectedOutputObject);
    });

});
