describe("parsePacket", function() {
    const parsePacket = require('../lib/parsePacket');

    const defaultHeader = "/MyMeterType\r\n \r\n";

    it("should be able to parse the packet header containing the meter type", function() {
        const parsedPacket = parsePacket(defaultHeader);

        expect(parsedPacket.meterType).toEqual("MyMeterType");
    });


});
