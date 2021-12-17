const fs = require("fs");
const path = require("path");

class Decoder {
  constructor(data) {
    this.code = data.split("\n").filter(Boolean)[0];
    this.binaryCode = [...this.code]
      .map((letter) => parseInt(letter, 16).toString(2).padStart(4, "0"))
      .join("");
    this.packet = {};
    this.index = 0;
  }

  evaluate(packet) {
    let result = 0;
    switch (packet.header.typeId) {
      case 4:
        result = packet.literalValue;
        break;
      case 0:
        result = packet.subPackets.reduce(
          (prev, curr) => prev + this.evaluate(curr),
          0
        );
        break;
      case 1:
        result = packet.subPackets.reduce(
          (prev, curr) => prev * this.evaluate(curr),
          1
        );
        break;
      case 2:
        result = Math.min(
          ...packet.subPackets.map((packet) => this.evaluate(packet))
        );
        break;
      case 3:
        result = Math.max(
          ...packet.subPackets.map((packet) => this.evaluate(packet))
        );
        break;
      case 5:
        result = +(
          this.evaluate(packet.subPackets[0]) -
            this.evaluate(packet.subPackets[1]) >
          0
        );
        break;
      case 6:
        result = +(
          this.evaluate(packet.subPackets[1]) -
            this.evaluate(packet.subPackets[0]) >
          0
        );
        break;
      case 7:
        result = +(
          this.evaluate(packet.subPackets[0]) ===
          this.evaluate(packet.subPackets[1])
        );
        break;
    }
    return result;
  }

  addVersions(packet) {
    return (
      packet.header.version +
      (packet?.subPackets?.length
        ? packet.subPackets.reduce(
            (prev, curr) => prev + this.addVersions(curr),
            0
          )
        : 0)
    );
  }

  parseBinaryCode() {
    const packet = {};
    const header = this.binaryCode.slice(this.index, this.index + 6);
    const version = header.slice(0, 3);
    const typeId = header.slice(3, 6);
    packet.header = {
      version: parseInt(version, 2),
      typeId: parseInt(typeId, 2),
    };
    this.index += 6;
    if (packet.header.typeId === 4) {
      let binaryNumber = "";
      let prefix;
      do {
        const group = this.binaryCode.slice(this.index, this.index + 5);
        prefix = parseInt(group.charAt(0), 10);
        const binaryPart = group.slice(1);
        binaryNumber += binaryPart;
        this.index += 5;
      } while (prefix);
      packet.literalValue = parseInt(binaryNumber, 2);
    } else {
      const lengthTypeId = parseInt(this.binaryCode.charAt(this.index), 10);
      let subPackets = [];
      this.index++;
      if (lengthTypeId) {
        let nbOfSubpackets = parseInt(
          this.binaryCode.slice(this.index, this.index + 11),
          2
        );
        this.index += 11;
        do {
          const subPacket = this.parseBinaryCode();
          subPackets.push(subPacket);
          nbOfSubpackets--;
        } while (nbOfSubpackets);
      } else {
        let totalSubpacketsLength = parseInt(
          this.binaryCode.slice(this.index, this.index + 15),
          2
        );
        this.index += 15;
        do {
          const savePos = this.index;
          const subPacket = this.parseBinaryCode();
          subPackets.push(subPacket);
          totalSubpacketsLength -= this.index - savePos;
        } while (totalSubpacketsLength);
      }
      packet.subPackets = subPackets;
    }
    return packet;
  }
}

try {
  const data = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
  const decoder = new Decoder(data);
  const packet = decoder.parseBinaryCode();
  const result1 = decoder.addVersions(packet);
  const result2 = decoder.evaluate(packet);
  console.log("result - part 1:", result1);
  console.log("result - part 2:", result2);
} catch (error) {
  console.log(error);
}
