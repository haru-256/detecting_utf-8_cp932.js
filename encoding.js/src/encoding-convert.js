var config = require("./config");
var util = require("./util");
var EncodingDetect = require("./encoding-detect");
var EncodingTable = require("./encoding-table");

/**
 * JIS to SJIS
 */
function JISToSJIS(data) {
  var results = [];
  var index = 0;
  var i = 0;
  var len = data && data.length;
  var b1, b2;

  for (; i < len; i++) {
    // escape sequence
    while (data[i] === 0x1b) {
      if (
        (data[i + 1] === 0x24 && data[i + 2] === 0x42) ||
        (data[i + 1] === 0x24 && data[i + 2] === 0x40)
      ) {
        index = 1;
      } else if (data[i + 1] === 0x28 && data[i + 2] === 0x49) {
        index = 2;
      } else if (
        data[i + 1] === 0x24 &&
        data[i + 2] === 0x28 &&
        data[i + 3] === 0x44
      ) {
        index = 3;
        i++;
      } else {
        index = 0;
      }

      i += 3;
      if (data[i] === void 0) {
        return results;
      }
    }

    if (index === 1) {
      b1 = data[i];
      b2 = data[++i];
      if (b1 & 0x01) {
        b1 >>= 1;
        if (b1 < 0x2f) {
          b1 += 0x71;
        } else {
          b1 -= 0x4f;
        }
        if (b2 > 0x5f) {
          b2 += 0x20;
        } else {
          b2 += 0x1f;
        }
      } else {
        b1 >>= 1;
        if (b1 <= 0x2f) {
          b1 += 0x70;
        } else {
          b1 -= 0x50;
        }
        b2 += 0x7e;
      }
      results[results.length] = b1 & 0xff;
      results[results.length] = b2 & 0xff;
    } else if (index === 2) {
      results[results.length] = (data[i] + 0x80) & 0xff;
    } else if (index === 3) {
      // Shift_JIS cannot convert JIS X 0212:1990.
      results[results.length] = config.UNKNOWN_CHARACTER;
    } else {
      results[results.length] = data[i] & 0xff;
    }
  }

  return results;
}
exports.JISToSJIS = JISToSJIS;

/**
 * JIS to EUCJP
 */
function JISToEUCJP(data) {
  var results = [];
  var index = 0;
  var len = data && data.length;
  var i = 0;

  for (; i < len; i++) {
    // escape sequence
    while (data[i] === 0x1b) {
      if (
        (data[i + 1] === 0x24 && data[i + 2] === 0x42) ||
        (data[i + 1] === 0x24 && data[i + 2] === 0x40)
      ) {
        index = 1;
      } else if (data[i + 1] === 0x28 && data[i + 2] === 0x49) {
        index = 2;
      } else if (
        data[i + 1] === 0x24 &&
        data[i + 2] === 0x28 &&
        data[i + 3] === 0x44
      ) {
        index = 3;
        i++;
      } else {
        index = 0;
      }

      i += 3;
      if (data[i] === void 0) {
        return results;
      }
    }

    if (index === 1) {
      results[results.length] = (data[i] + 0x80) & 0xff;
      results[results.length] = (data[++i] + 0x80) & 0xff;
    } else if (index === 2) {
      results[results.length] = 0x8e;
      results[results.length] = (data[i] + 0x80) & 0xff;
    } else if (index === 3) {
      results[results.length] = 0x8f;
      results[results.length] = (data[i] + 0x80) & 0xff;
      results[results.length] = (data[++i] + 0x80) & 0xff;
    } else {
      results[results.length] = data[i] & 0xff;
    }
  }

  return results;
}
exports.JISToEUCJP = JISToEUCJP;

/**
 * SJIS to JIS
 */
function SJISToJIS(data) {
  var results = [];
  var index = 0;
  var len = data && data.length;
  var i = 0;
  var b1, b2;

  var esc = [0x1b, 0x28, 0x42, 0x1b, 0x24, 0x42, 0x1b, 0x28, 0x49];

  for (; i < len; i++) {
    b1 = data[i];
    if (b1 >= 0xa1 && b1 <= 0xdf) {
      if (index !== 2) {
        index = 2;
        results[results.length] = esc[6];
        results[results.length] = esc[7];
        results[results.length] = esc[8];
      }
      results[results.length] = (b1 - 0x80) & 0xff;
    } else if (b1 >= 0x80) {
      if (index !== 1) {
        index = 1;
        results[results.length] = esc[3];
        results[results.length] = esc[4];
        results[results.length] = esc[5];
      }

      b1 <<= 1;
      b2 = data[++i];
      if (b2 < 0x9f) {
        if (b1 < 0x13f) {
          b1 -= 0xe1;
        } else {
          b1 -= 0x61;
        }
        if (b2 > 0x7e) {
          b2 -= 0x20;
        } else {
          b2 -= 0x1f;
        }
      } else {
        if (b1 < 0x13f) {
          b1 -= 0xe0;
        } else {
          b1 -= 0x60;
        }
        b2 -= 0x7e;
      }
      results[results.length] = b1 & 0xff;
      results[results.length] = b2 & 0xff;
    } else {
      if (index !== 0) {
        index = 0;
        results[results.length] = esc[0];
        results[results.length] = esc[1];
        results[results.length] = esc[2];
      }
      results[results.length] = b1 & 0xff;
    }
  }

  if (index !== 0) {
    results[results.length] = esc[0];
    results[results.length] = esc[1];
    results[results.length] = esc[2];
  }

  return results;
}
exports.SJISToJIS = SJISToJIS;

/**
 * SJIS to EUCJP
 */
function SJISToEUCJP(data) {
  var results = [];
  var len = data && data.length;
  var i = 0;
  var b1, b2;

  for (; i < len; i++) {
    b1 = data[i];
    if (b1 >= 0xa1 && b1 <= 0xdf) {
      results[results.length] = 0x8e;
      results[results.length] = b1;
    } else if (b1 >= 0x81) {
      b2 = data[++i];
      b1 <<= 1;
      if (b2 < 0x9f) {
        if (b1 < 0x13f) {
          b1 -= 0x61;
        } else {
          b1 -= 0xe1;
        }

        if (b2 > 0x7e) {
          b2 += 0x60;
        } else {
          b2 += 0x61;
        }
      } else {
        if (b1 < 0x13f) {
          b1 -= 0x60;
        } else {
          b1 -= 0xe0;
        }
        b2 += 0x02;
      }
      results[results.length] = b1 & 0xff;
      results[results.length] = b2 & 0xff;
    } else {
      results[results.length] = b1 & 0xff;
    }
  }

  return results;
}
exports.SJISToEUCJP = SJISToEUCJP;

/**
 * EUCJP to JIS
 */
function EUCJPToJIS(data) {
  var results = [];
  var index = 0;
  var len = data && data.length;
  var i = 0;
  var b;

  // escape sequence
  var esc = [
    0x1b,
    0x28,
    0x42,
    0x1b,
    0x24,
    0x42,
    0x1b,
    0x28,
    0x49,
    0x1b,
    0x24,
    0x28,
    0x44,
  ];

  for (; i < len; i++) {
    b = data[i];
    if (b === 0x8e) {
      if (index !== 2) {
        index = 2;
        results[results.length] = esc[6];
        results[results.length] = esc[7];
        results[results.length] = esc[8];
      }
      results[results.length] = (data[++i] - 0x80) & 0xff;
    } else if (b === 0x8f) {
      if (index !== 3) {
        index = 3;
        results[results.length] = esc[9];
        results[results.length] = esc[10];
        results[results.length] = esc[11];
        results[results.length] = esc[12];
      }
      results[results.length] = (data[++i] - 0x80) & 0xff;
      results[results.length] = (data[++i] - 0x80) & 0xff;
    } else if (b > 0x8e) {
      if (index !== 1) {
        index = 1;
        results[results.length] = esc[3];
        results[results.length] = esc[4];
        results[results.length] = esc[5];
      }
      results[results.length] = (b - 0x80) & 0xff;
      results[results.length] = (data[++i] - 0x80) & 0xff;
    } else {
      if (index !== 0) {
        index = 0;
        results[results.length] = esc[0];
        results[results.length] = esc[1];
        results[results.length] = esc[2];
      }
      results[results.length] = b & 0xff;
    }
  }

  if (index !== 0) {
    results[results.length] = esc[0];
    results[results.length] = esc[1];
    results[results.length] = esc[2];
  }

  return results;
}
exports.EUCJPToJIS = EUCJPToJIS;

/**
 * EUCJP to SJIS
 */
function EUCJPToSJIS(data) {
  var results = [];
  var len = data && data.length;
  var i = 0;
  var b1, b2;

  for (; i < len; i++) {
    b1 = data[i];
    if (b1 === 0x8f) {
      results[results.length] = config.UNKNOWN_CHARACTER;
      i += 2;
    } else if (b1 > 0x8e) {
      b2 = data[++i];
      if (b1 & 0x01) {
        b1 >>= 1;
        if (b1 < 0x6f) {
          b1 += 0x31;
        } else {
          b1 += 0x71;
        }

        if (b2 > 0xdf) {
          b2 -= 0x60;
        } else {
          b2 -= 0x61;
        }
      } else {
        b1 >>= 1;
        if (b1 <= 0x6f) {
          b1 += 0x30;
        } else {
          b1 += 0x70;
        }
        b2 -= 0x02;
      }
      results[results.length] = b1 & 0xff;
      results[results.length] = b2 & 0xff;
    } else if (b1 === 0x8e) {
      results[results.length] = data[++i] & 0xff;
    } else {
      results[results.length] = b1 & 0xff;
    }
  }

  return results;
}
exports.EUCJPToSJIS = EUCJPToSJIS;

/**
 * SJIS To UTF-8
 */
function SJISToUTF8(data) {
  config.init_JIS_TO_UTF8_TABLE();

  var results = [];
  var i = 0;
  var len = data && data.length;
  var b, b1, b2, u2, u3, jis, utf8;

  for (; i < len; i++) {
    b = data[i];
    if (b >= 0xa1 && b <= 0xdf) {
      b2 = b - 0x40;
      u2 = 0xbc | ((b2 >> 6) & 0x03);
      u3 = 0x80 | (b2 & 0x3f);

      results[results.length] = 0xef;
      results[results.length] = u2 & 0xff;
      results[results.length] = u3 & 0xff;
    } else if (b >= 0x80) {
      b1 = b << 1;
      b2 = data[++i];

      if (b2 < 0x9f) {
        if (b1 < 0x13f) {
          b1 -= 0xe1;
        } else {
          b1 -= 0x61;
        }

        if (b2 > 0x7e) {
          b2 -= 0x20;
        } else {
          b2 -= 0x1f;
        }
      } else {
        if (b1 < 0x13f) {
          b1 -= 0xe0;
        } else {
          b1 -= 0x60;
        }
        b2 -= 0x7e;
      }

      b1 &= 0xff;
      jis = (b1 << 8) + b2;

      utf8 = EncodingTable.JIS_TO_UTF8_TABLE[jis];
      if (utf8 === void 0) {
        results[results.length] = config.UNKNOWN_CHARACTER;
      } else {
        if (utf8 < 0xffff) {
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        } else {
          results[results.length] = (utf8 >> 16) & 0xff;
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        }
      }
    } else {
      results[results.length] = data[i] & 0xff;
    }
  }

  return results;
}
exports.SJISToUTF8 = SJISToUTF8;

/**
 * EUC-JP to UTF-8
 */
function EUCJPToUTF8(data) {
  config.init_JIS_TO_UTF8_TABLE();

  var results = [];
  var i = 0;
  var len = data && data.length;
  var b, b2, u2, u3, j2, j3, jis, utf8;

  for (; i < len; i++) {
    b = data[i];
    if (b === 0x8e) {
      b2 = data[++i] - 0x40;
      u2 = 0xbc | ((b2 >> 6) & 0x03);
      u3 = 0x80 | (b2 & 0x3f);

      results[results.length] = 0xef;
      results[results.length] = u2 & 0xff;
      results[results.length] = u3 & 0xff;
    } else if (b === 0x8f) {
      j2 = data[++i] - 0x80;
      j3 = data[++i] - 0x80;
      jis = (j2 << 8) + j3;

      utf8 = EncodingTable.JISX0212_TO_UTF8_TABLE[jis];
      if (utf8 === void 0) {
        results[results.length] = config.UNKNOWN_CHARACTER;
      } else {
        if (utf8 < 0xffff) {
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        } else {
          results[results.length] = (utf8 >> 16) & 0xff;
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        }
      }
    } else if (b >= 0x80) {
      jis = ((b - 0x80) << 8) + (data[++i] - 0x80);

      utf8 = EncodingTable.JIS_TO_UTF8_TABLE[jis];
      if (utf8 === void 0) {
        results[results.length] = config.UNKNOWN_CHARACTER;
      } else {
        if (utf8 < 0xffff) {
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        } else {
          results[results.length] = (utf8 >> 16) & 0xff;
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        }
      }
    } else {
      results[results.length] = data[i] & 0xff;
    }
  }

  return results;
}
exports.EUCJPToUTF8 = EUCJPToUTF8;

/**
 * JIS to UTF-8
 */
function JISToUTF8(data) {
  config.init_JIS_TO_UTF8_TABLE();

  var results = [];
  var index = 0;
  var i = 0;
  var len = data && data.length;
  var b2, u2, u3, jis, utf8;

  for (; i < len; i++) {
    while (data[i] === 0x1b) {
      if (
        (data[i + 1] === 0x24 && data[i + 2] === 0x42) ||
        (data[i + 1] === 0x24 && data[i + 2] === 0x40)
      ) {
        index = 1;
      } else if (data[i + 1] === 0x28 && data[i + 2] === 0x49) {
        index = 2;
      } else if (
        data[i + 1] === 0x24 &&
        data[i + 2] === 0x28 &&
        data[i + 3] === 0x44
      ) {
        index = 3;
        i++;
      } else {
        index = 0;
      }

      i += 3;
      if (data[i] === void 0) {
        return results;
      }
    }

    if (index === 1) {
      jis = (data[i] << 8) + data[++i];

      utf8 = EncodingTable.JIS_TO_UTF8_TABLE[jis];
      if (utf8 === void 0) {
        results[results.length] = config.UNKNOWN_CHARACTER;
      } else {
        if (utf8 < 0xffff) {
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        } else {
          results[results.length] = (utf8 >> 16) & 0xff;
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        }
      }
    } else if (index === 2) {
      b2 = data[i] + 0x40;
      u2 = 0xbc | ((b2 >> 6) & 0x03);
      u3 = 0x80 | (b2 & 0x3f);

      results[results.length] = 0xef;
      results[results.length] = u2 & 0xff;
      results[results.length] = u3 & 0xff;
    } else if (index === 3) {
      jis = (data[i] << 8) + data[++i];

      utf8 = EncodingTable.JISX0212_TO_UTF8_TABLE[jis];
      if (utf8 === void 0) {
        results[results.length] = config.UNKNOWN_CHARACTER;
      } else {
        if (utf8 < 0xffff) {
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        } else {
          results[results.length] = (utf8 >> 16) & 0xff;
          results[results.length] = (utf8 >> 8) & 0xff;
          results[results.length] = utf8 & 0xff;
        }
      }
    } else {
      results[results.length] = data[i] & 0xff;
    }
  }

  return results;
}
exports.JISToUTF8 = JISToUTF8;

/**
 * UTF-8 to SJIS
 */
function UTF8ToSJIS(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var b, b1, b2, utf8, jis;

  for (; i < len; i++) {
    b = data[i];
    if (b >= 0x80) {
      if (b <= 0xdf) {
        // 2 bytes
        utf8 = (b << 8) + data[++i];
      } else {
        // 3 bytes
        utf8 = (b << 16) + (data[++i] << 8) + (data[++i] & 0xff);
      }

      jis = EncodingTable.UTF8_TO_JIS_TABLE[utf8];
      if (jis === void 0) {
        results[results.length] = config.UNKNOWN_CHARACTER;
      } else {
        if (jis < 0xff) {
          results[results.length] = jis + 0x80;
        } else {
          if (jis > 0x10000) {
            jis -= 0x10000;
          }

          b1 = jis >> 8;
          b2 = jis & 0xff;
          if (b1 & 0x01) {
            b1 >>= 1;
            if (b1 < 0x2f) {
              b1 += 0x71;
            } else {
              b1 -= 0x4f;
            }

            if (b2 > 0x5f) {
              b2 += 0x20;
            } else {
              b2 += 0x1f;
            }
          } else {
            b1 >>= 1;
            if (b1 <= 0x2f) {
              b1 += 0x70;
            } else {
              b1 -= 0x50;
            }
            b2 += 0x7e;
          }
          results[results.length] = b1 & 0xff;
          results[results.length] = b2 & 0xff;
        }
      }
    } else {
      results[results.length] = data[i] & 0xff;
    }
  }

  return results;
}
exports.UTF8ToSJIS = UTF8ToSJIS;

/**
 * UTF-8 to EUC-JP
 */
function UTF8ToEUCJP(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var b, utf8, jis;

  for (; i < len; i++) {
    b = data[i];
    if (b >= 0x80) {
      if (b <= 0xdf) {
        utf8 = (data[i++] << 8) + data[i];
      } else {
        utf8 = (data[i++] << 16) + (data[i++] << 8) + (data[i] & 0xff);
      }

      jis = EncodingTable.UTF8_TO_JIS_TABLE[utf8];
      if (jis === void 0) {
        jis = EncodingTable.UTF8_TO_JISX0212_TABLE[utf8];
        if (jis === void 0) {
          results[results.length] = config.UNKNOWN_CHARACTER;
        } else {
          results[results.length] = 0x8f;
          results[results.length] = ((jis >> 8) - 0x80) & 0xff;
          results[results.length] = ((jis & 0xff) - 0x80) & 0xff;
        }
      } else {
        if (jis > 0x10000) {
          jis -= 0x10000;
        }
        if (jis < 0xff) {
          results[results.length] = 0x8e;
          results[results.length] = (jis - 0x80) & 0xff;
        } else {
          results[results.length] = ((jis >> 8) - 0x80) & 0xff;
          results[results.length] = ((jis & 0xff) - 0x80) & 0xff;
        }
      }
    } else {
      results[results.length] = data[i] & 0xff;
    }
  }

  return results;
}
exports.UTF8ToEUCJP = UTF8ToEUCJP;

/**
 * UTF-8 to JIS
 */
function UTF8ToJIS(data) {
  var results = [];
  var index = 0;
  var len = data && data.length;
  var i = 0;
  var b, utf8, jis;
  var esc = [
    0x1b,
    0x28,
    0x42,
    0x1b,
    0x24,
    0x42,
    0x1b,
    0x28,
    0x49,
    0x1b,
    0x24,
    0x28,
    0x44,
  ];

  for (; i < len; i++) {
    b = data[i];
    if (b < 0x80) {
      if (index !== 0) {
        index = 0;
        results[results.length] = esc[0];
        results[results.length] = esc[1];
        results[results.length] = esc[2];
      }
      results[results.length] = b & 0xff;
    } else {
      if (b <= 0xdf) {
        utf8 = (data[i] << 8) + data[++i];
      } else {
        utf8 = (data[i] << 16) + (data[++i] << 8) + data[++i];
      }

      jis = EncodingTable.UTF8_TO_JIS_TABLE[utf8];
      if (jis === void 0) {
        jis = EncodingTable.UTF8_TO_JISX0212_TABLE[utf8];
        if (jis === void 0) {
          if (index !== 0) {
            index = 0;
            results[results.length] = esc[0];
            results[results.length] = esc[1];
            results[results.length] = esc[2];
          }
          results[results.length] = config.UNKNOWN_CHARACTER;
        } else {
          // JIS X 0212:1990
          if (index !== 3) {
            index = 3;
            results[results.length] = esc[9];
            results[results.length] = esc[10];
            results[results.length] = esc[11];
            results[results.length] = esc[12];
          }
          results[results.length] = (jis >> 8) & 0xff;
          results[results.length] = jis & 0xff;
        }
      } else {
        if (jis > 0x10000) {
          jis -= 0x10000;
        }
        if (jis < 0xff) {
          // Halfwidth Katakana
          if (index !== 2) {
            index = 2;
            results[results.length] = esc[6];
            results[results.length] = esc[7];
            results[results.length] = esc[8];
          }
          results[results.length] = jis & 0xff;
        } else {
          if (index !== 1) {
            index = 1;
            results[results.length] = esc[3];
            results[results.length] = esc[4];
            results[results.length] = esc[5];
          }
          results[results.length] = (jis >> 8) & 0xff;
          results[results.length] = jis & 0xff;
        }
      }
    }
  }

  if (index !== 0) {
    results[results.length] = esc[0];
    results[results.length] = esc[1];
    results[results.length] = esc[2];
  }

  return results;
}
exports.UTF8ToJIS = UTF8ToJIS;

/**
 * UTF-16 (JavaScript Unicode array) to UTF-8
 */
function UNICODEToUTF8(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var c, second;

  for (; i < len; i++) {
    c = data[i];

    // high surrogate
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < len) {
      second = data[i + 1];
      // low surrogate
      if (second >= 0xdc00 && second <= 0xdfff) {
        c = (c - 0xd800) * 0x400 + second - 0xdc00 + 0x10000;
        i++;
      }
    }

    if (c < 0x80) {
      results[results.length] = c;
    } else if (c < 0x800) {
      results[results.length] = 0xc0 | ((c >> 6) & 0x1f);
      results[results.length] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      results[results.length] = 0xe0 | ((c >> 12) & 0xf);
      results[results.length] = 0x80 | ((c >> 6) & 0x3f);
      results[results.length] = 0x80 | (c & 0x3f);
    } else if (c < 0x200000) {
      results[results.length] = 0xf0 | ((c >> 18) & 0xf);
      results[results.length] = 0x80 | ((c >> 12) & 0x3f);
      results[results.length] = 0x80 | ((c >> 6) & 0x3f);
      results[results.length] = 0x80 | (c & 0x3f);
    }
  }

  return results;
}
exports.UNICODEToUTF8 = UNICODEToUTF8;

/**
 * UTF-8 to UTF-16 (JavaScript Unicode array)
 */
function UTF8ToUNICODE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var n, c, c2, c3, c4, code;

  while (i < len) {
    c = data[i++];
    n = c >> 4;
    if (n >= 0 && n <= 7) {
      // 0xxx xxxx
      code = c;
    } else if (n === 12 || n === 13) {
      // 110x xxxx
      // 10xx xxxx
      c2 = data[i++];
      code = ((c & 0x1f) << 6) | (c2 & 0x3f);
    } else if (n === 14) {
      // 1110 xxxx
      // 10xx xxxx
      // 10xx xxxx
      c2 = data[i++];
      c3 = data[i++];
      code = ((c & 0x0f) << 12) | ((c2 & 0x3f) << 6) | (c3 & 0x3f);
    } else if (n === 15) {
      // 1111 0xxx
      // 10xx xxxx
      // 10xx xxxx
      // 10xx xxxx
      c2 = data[i++];
      c3 = data[i++];
      c4 = data[i++];
      code =
        ((c & 0x7) << 18) |
        ((c2 & 0x3f) << 12) |
        ((c3 & 0x3f) << 6) |
        (c4 & 0x3f);
    }

    if (code <= 0xffff) {
      results[results.length] = code;
    } else {
      // Split in surrogate halves
      code -= 0x10000;
      results[results.length] = (code >> 10) + 0xd800; // High surrogate
      results[results.length] = (code % 0x400) + 0xdc00; // Low surrogate
    }
  }

  return results;
}
exports.UTF8ToUNICODE = UTF8ToUNICODE;

/**
 * UTF-16 (JavaScript Unicode array) to UTF-16
 *
 * UTF-16BE (big-endian)
 * Note: this function does not prepend the BOM by default.
 *
 * RFC 2781 4.3 Interpreting text labelled as UTF-16
 *   If the first two octets of the text is not 0xFE followed by
 *   0xFF, and is not 0xFF followed by 0xFE, then the text SHOULD be
 *   interpreted as being big-endian.
 *
 * @link https://www.ietf.org/rfc/rfc2781.txt
 * UTF-16, an encoding of ISO 10646
 */
function UNICODEToUTF16(data, options) {
  var results;

  if (options && options.bom) {
    var optBom = options.bom;
    if (!util.isString(optBom)) {
      optBom = "BE";
    }

    var bom, utf16;
    if (optBom.charAt(0).toUpperCase() === "B") {
      // Big-endian
      bom = [0xfe, 0xff];
      utf16 = UNICODEToUTF16BE(data);
    } else {
      // Little-endian
      bom = [0xff, 0xfe];
      utf16 = UNICODEToUTF16LE(data);
    }

    results = [];
    results[0] = bom[0];
    results[1] = bom[1];

    for (var i = 0, len = utf16.length; i < len; i++) {
      results[results.length] = utf16[i];
    }
  } else {
    // Without BOM: Convert as BE (SHOULD).
    results = UNICODEToUTF16BE(data);
  }

  return results;
}
exports.UNICODEToUTF16 = UNICODEToUTF16;

/**
 * UTF-16 (JavaScript Unicode array) to UTF-16BE
 *
 * @link https://www.ietf.org/rfc/rfc2781.txt
 * UTF-16, an encoding of ISO 10646
 */
function UNICODEToUTF16BE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var c;

  while (i < len) {
    c = data[i++];
    if (c <= 0xff) {
      results[results.length] = 0;
      results[results.length] = c;
    } else if (c <= 0xffff) {
      results[results.length] = (c >> 8) & 0xff;
      results[results.length] = c & 0xff;
    }
  }

  return results;
}
exports.UNICODEToUTF16BE = UNICODEToUTF16BE;

/**
 * UTF-16 (JavaScript Unicode array) to UTF-16LE
 *
 * @link https://www.ietf.org/rfc/rfc2781.txt
 * UTF-16, an encoding of ISO 10646
 */
function UNICODEToUTF16LE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var c;

  while (i < len) {
    c = data[i++];
    if (c <= 0xff) {
      results[results.length] = c;
      results[results.length] = 0;
    } else if (c <= 0xffff) {
      results[results.length] = c & 0xff;
      results[results.length] = (c >> 8) & 0xff;
    }
  }

  return results;
}
exports.UNICODEToUTF16LE = UNICODEToUTF16LE;

/**
 * UTF-16BE to UTF-16 (JavaScript Unicode array)
 *
 * @link https://www.ietf.org/rfc/rfc2781.txt
 * UTF-16, an encoding of ISO 10646
 */
function UTF16BEToUNICODE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var c1, c2;

  if (
    len >= 2 &&
    ((data[0] === 0xfe && data[1] === 0xff) ||
      (data[0] === 0xff && data[1] === 0xfe))
  ) {
    i = 2;
  }

  while (i < len) {
    c1 = data[i++];
    c2 = data[i++];
    if (c1 === 0) {
      results[results.length] = c2;
    } else {
      results[results.length] = ((c1 & 0xff) << 8) | (c2 & 0xff);
    }
  }

  return results;
}
exports.UTF16BEToUNICODE = UTF16BEToUNICODE;

/**
 * UTF-16LE to UTF-16 (JavaScript Unicode array)
 *
 * @link https://www.ietf.org/rfc/rfc2781.txt
 * UTF-16, an encoding of ISO 10646
 */
function UTF16LEToUNICODE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var c1, c2;

  if (
    len >= 2 &&
    ((data[0] === 0xfe && data[1] === 0xff) ||
      (data[0] === 0xff && data[1] === 0xfe))
  ) {
    i = 2;
  }

  while (i < len) {
    c1 = data[i++];
    c2 = data[i++];
    if (c2 === 0) {
      results[results.length] = c1;
    } else {
      results[results.length] = ((c2 & 0xff) << 8) | (c1 & 0xff);
    }
  }

  return results;
}
exports.UTF16LEToUNICODE = UTF16LEToUNICODE;

/**
 * UTF-16 to UTF-16 (JavaScript Unicode array)
 *
 * @link https://www.ietf.org/rfc/rfc2781.txt
 * UTF-16, an encoding of ISO 10646
 */
function UTF16ToUNICODE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var isLE = false;
  var first = true;
  var c1, c2;

  while (i < len) {
    c1 = data[i++];
    c2 = data[i++];

    if (first && i === 2) {
      first = false;
      if (c1 === 0xfe && c2 === 0xff) {
        isLE = false;
      } else if (c1 === 0xff && c2 === 0xfe) {
        // Little-endian
        isLE = true;
      } else {
        isLE = EncodingDetect.isUTF16LE(data);
        i = 0;
      }
      continue;
    }

    if (isLE) {
      if (c2 === 0) {
        results[results.length] = c1;
      } else {
        results[results.length] = ((c2 & 0xff) << 8) | (c1 & 0xff);
      }
    } else {
      if (c1 === 0) {
        results[results.length] = c2;
      } else {
        results[results.length] = ((c1 & 0xff) << 8) | (c2 & 0xff);
      }
    }
  }

  return results;
}
exports.UTF16ToUNICODE = UTF16ToUNICODE;

/**
 * UTF-16 to UTF-16BE
 */
function UTF16ToUTF16BE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var isLE = false;
  var first = true;
  var c1, c2;

  while (i < len) {
    c1 = data[i++];
    c2 = data[i++];

    if (first && i === 2) {
      first = false;
      if (c1 === 0xfe && c2 === 0xff) {
        isLE = false;
      } else if (c1 === 0xff && c2 === 0xfe) {
        // Little-endian
        isLE = true;
      } else {
        isLE = EncodingDetect.isUTF16LE(data);
        i = 0;
      }
      continue;
    }

    if (isLE) {
      results[results.length] = c2;
      results[results.length] = c1;
    } else {
      results[results.length] = c1;
      results[results.length] = c2;
    }
  }

  return results;
}
exports.UTF16ToUTF16BE = UTF16ToUTF16BE;

/**
 * UTF-16BE to UTF-16
 */
function UTF16BEToUTF16(data, options) {
  var isLE = false;
  var bom;

  if (options && options.bom) {
    var optBom = options.bom;
    if (!util.isString(optBom)) {
      optBom = "BE";
    }

    if (optBom.charAt(0).toUpperCase() === "B") {
      // Big-endian
      bom = [0xfe, 0xff];
    } else {
      // Little-endian
      bom = [0xff, 0xfe];
      isLE = true;
    }
  }

  var results = [];
  var len = data && data.length;
  var i = 0;

  if (
    len >= 2 &&
    ((data[0] === 0xfe && data[1] === 0xff) ||
      (data[0] === 0xff && data[1] === 0xfe))
  ) {
    i = 2;
  }

  if (bom) {
    results[0] = bom[0];
    results[1] = bom[1];
  }

  var c1, c2;
  while (i < len) {
    c1 = data[i++];
    c2 = data[i++];

    if (isLE) {
      results[results.length] = c2;
      results[results.length] = c1;
    } else {
      results[results.length] = c1;
      results[results.length] = c2;
    }
  }

  return results;
}
exports.UTF16BEToUTF16 = UTF16BEToUTF16;

/**
 * UTF-16 to UTF-16LE
 */
function UTF16ToUTF16LE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var isLE = false;
  var first = true;
  var c1, c2;

  while (i < len) {
    c1 = data[i++];
    c2 = data[i++];

    if (first && i === 2) {
      first = false;
      if (c1 === 0xfe && c2 === 0xff) {
        isLE = false;
      } else if (c1 === 0xff && c2 === 0xfe) {
        // Little-endian
        isLE = true;
      } else {
        isLE = EncodingDetect.isUTF16LE(data);
        i = 0;
      }
      continue;
    }

    if (isLE) {
      results[results.length] = c1;
      results[results.length] = c2;
    } else {
      results[results.length] = c2;
      results[results.length] = c1;
    }
  }

  return results;
}
exports.UTF16ToUTF16LE = UTF16ToUTF16LE;

/**
 * UTF-16LE to UTF-16
 */
function UTF16LEToUTF16(data, options) {
  var isLE = false;
  var bom;

  if (options && options.bom) {
    var optBom = options.bom;
    if (!util.isString(optBom)) {
      optBom = "BE";
    }

    if (optBom.charAt(0).toUpperCase() === "B") {
      // Big-endian
      bom = [0xfe, 0xff];
    } else {
      // Little-endian
      bom = [0xff, 0xfe];
      isLE = true;
    }
  }

  var results = [];
  var len = data && data.length;
  var i = 0;

  if (
    len >= 2 &&
    ((data[0] === 0xfe && data[1] === 0xff) ||
      (data[0] === 0xff && data[1] === 0xfe))
  ) {
    i = 2;
  }

  if (bom) {
    results[0] = bom[0];
    results[1] = bom[1];
  }

  var c1, c2;
  while (i < len) {
    c1 = data[i++];
    c2 = data[i++];

    if (isLE) {
      results[results.length] = c1;
      results[results.length] = c2;
    } else {
      results[results.length] = c2;
      results[results.length] = c1;
    }
  }

  return results;
}
exports.UTF16LEToUTF16 = UTF16LEToUTF16;

/**
 * UTF-16BE to UTF-16LE
 */
function UTF16BEToUTF16LE(data) {
  var results = [];
  var i = 0;
  var len = data && data.length;
  var c1, c2;

  if (
    len >= 2 &&
    ((data[0] === 0xfe && data[1] === 0xff) ||
      (data[0] === 0xff && data[1] === 0xfe))
  ) {
    i = 2;
  }

  while (i < len) {
    c1 = data[i++];
    c2 = data[i++];
    results[results.length] = c2;
    results[results.length] = c1;
  }

  return results;
}
exports.UTF16BEToUTF16LE = UTF16BEToUTF16LE;

/**
 * UTF-16LE to UTF-16BE
 */
function UTF16LEToUTF16BE(data) {
  return UTF16BEToUTF16LE(data);
}
exports.UTF16LEToUTF16BE = UTF16LEToUTF16BE;

/**
 * UTF-16 (JavaScript Unicode array) to JIS
 */
function UNICODEToJIS(data) {
  return UTF8ToJIS(UNICODEToUTF8(data));
}
exports.UNICODEToJIS = UNICODEToJIS;

/**
 * JIS to UTF-16 (JavaScript Unicode array)
 */
function JISToUNICODE(data) {
  return UTF8ToUNICODE(JISToUTF8(data));
}
exports.JISToUNICODE = JISToUNICODE;

/**
 * UTF-16 (JavaScript Unicode array) to EUCJP
 */
function UNICODEToEUCJP(data) {
  return UTF8ToEUCJP(UNICODEToUTF8(data));
}
exports.UNICODEToEUCJP = UNICODEToEUCJP;

/**
 * EUCJP to UTF-16 (JavaScript Unicode array)
 */
function EUCJPToUNICODE(data) {
  return UTF8ToUNICODE(EUCJPToUTF8(data));
}
exports.EUCJPToUNICODE = EUCJPToUNICODE;

/**
 * UTF-16 (JavaScript Unicode array) to SJIS
 */
function UNICODEToSJIS(data) {
  return UTF8ToSJIS(UNICODEToUTF8(data));
}
exports.UNICODEToSJIS = UNICODEToSJIS;

/**
 * SJIS to UTF-16 (JavaScript Unicode array)
 */
function SJISToUNICODE(data) {
  return UTF8ToUNICODE(SJISToUTF8(data));
}
exports.SJISToUNICODE = SJISToUNICODE;

/**
 * UTF-8 to UTF-16
 */
function UTF8ToUTF16(data, options) {
  return UNICODEToUTF16(UTF8ToUNICODE(data), options);
}
exports.UTF8ToUTF16 = UTF8ToUTF16;

/**
 * UTF-16 to UTF-8
 */
function UTF16ToUTF8(data) {
  return UNICODEToUTF8(UTF16ToUNICODE(data));
}
exports.UTF16ToUTF8 = UTF16ToUTF8;

/**
 * UTF-8 to UTF-16BE
 */
function UTF8ToUTF16BE(data) {
  return UNICODEToUTF16BE(UTF8ToUNICODE(data));
}
exports.UTF8ToUTF16BE = UTF8ToUTF16BE;

/**
 * UTF-16BE to UTF-8
 */
function UTF16BEToUTF8(data) {
  return UNICODEToUTF8(UTF16BEToUNICODE(data));
}
exports.UTF16BEToUTF8 = UTF16BEToUTF8;

/**
 * UTF-8 to UTF-16LE
 */
function UTF8ToUTF16LE(data) {
  return UNICODEToUTF16LE(UTF8ToUNICODE(data));
}
exports.UTF8ToUTF16LE = UTF8ToUTF16LE;

/**
 * UTF-16LE to UTF-8
 */
function UTF16LEToUTF8(data) {
  return UNICODEToUTF8(UTF16LEToUNICODE(data));
}
exports.UTF16LEToUTF8 = UTF16LEToUTF8;

/**
 * JIS to UTF-16
 */
function JISToUTF16(data, options) {
  return UTF8ToUTF16(JISToUTF8(data), options);
}
exports.JISToUTF16 = JISToUTF16;

/**
 * UTF-16 to JIS
 */
function UTF16ToJIS(data) {
  return UTF8ToJIS(UTF16ToUTF8(data));
}
exports.UTF16ToJIS = UTF16ToJIS;

/**
 * JIS to UTF-16BE
 */
function JISToUTF16BE(data) {
  return UTF8ToUTF16BE(JISToUTF8(data));
}
exports.JISToUTF16BE = JISToUTF16BE;

/**
 * UTF-16BE to JIS
 */
function UTF16BEToJIS(data) {
  return UTF8ToJIS(UTF16BEToUTF8(data));
}
exports.UTF16BEToJIS = UTF16BEToJIS;

/**
 * JIS to UTF-16LE
 */
function JISToUTF16LE(data) {
  return UTF8ToUTF16LE(JISToUTF8(data));
}
exports.JISToUTF16LE = JISToUTF16LE;

/**
 * UTF-16LE to JIS
 */
function UTF16LEToJIS(data) {
  return UTF8ToJIS(UTF16LEToUTF8(data));
}
exports.UTF16LEToJIS = UTF16LEToJIS;

/**
 * EUC-JP to UTF-16
 */
function EUCJPToUTF16(data, options) {
  return UTF8ToUTF16(EUCJPToUTF8(data), options);
}
exports.EUCJPToUTF16 = EUCJPToUTF16;

/**
 * UTF-16 to EUC-JP
 */
function UTF16ToEUCJP(data) {
  return UTF8ToEUCJP(UTF16ToUTF8(data));
}
exports.UTF16ToEUCJP = UTF16ToEUCJP;

/**
 * EUC-JP to UTF-16BE
 */
function EUCJPToUTF16BE(data) {
  return UTF8ToUTF16BE(EUCJPToUTF8(data));
}
exports.EUCJPToUTF16BE = EUCJPToUTF16BE;

/**
 * UTF-16BE to EUC-JP
 */
function UTF16BEToEUCJP(data) {
  return UTF8ToEUCJP(UTF16BEToUTF8(data));
}
exports.UTF16BEToEUCJP = UTF16BEToEUCJP;

/**
 * EUC-JP to UTF-16LE
 */
function EUCJPToUTF16LE(data) {
  return UTF8ToUTF16LE(EUCJPToUTF8(data));
}
exports.EUCJPToUTF16LE = EUCJPToUTF16LE;

/**
 * UTF-16LE to EUC-JP
 */
function UTF16LEToEUCJP(data) {
  return UTF8ToEUCJP(UTF16LEToUTF8(data));
}
exports.UTF16LEToEUCJP = UTF16LEToEUCJP;

/**
 * SJIS to UTF-16
 */
function SJISToUTF16(data, options) {
  return UTF8ToUTF16(SJISToUTF8(data), options);
}
exports.SJISToUTF16 = SJISToUTF16;

/**
 * UTF-16 to SJIS
 */
function UTF16ToSJIS(data) {
  return UTF8ToSJIS(UTF16ToUTF8(data));
}
exports.UTF16ToSJIS = UTF16ToSJIS;

/**
 * SJIS to UTF-16BE
 */
function SJISToUTF16BE(data) {
  return UTF8ToUTF16BE(SJISToUTF8(data));
}
exports.SJISToUTF16BE = SJISToUTF16BE;

/**
 * UTF-16BE to SJIS
 */
function UTF16BEToSJIS(data) {
  return UTF8ToSJIS(UTF16BEToUTF8(data));
}
exports.UTF16BEToSJIS = UTF16BEToSJIS;

/**
 * SJIS to UTF-16LE
 */
function SJISToUTF16LE(data) {
  return UTF8ToUTF16LE(SJISToUTF8(data));
}
exports.SJISToUTF16LE = SJISToUTF16LE;

/**
 * UTF-16LE to SJIS
 */
function UTF16LEToSJIS(data) {
  return UTF8ToSJIS(UTF16LEToUTF8(data));
}
exports.UTF16LEToSJIS = UTF16LEToSJIS;
