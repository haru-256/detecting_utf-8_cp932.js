/**
 * Removing the specific value
 * @param {Array.<any>} arr
 * @param {Any|Array.<ay>} value
 * @returns {Array.<any>}
 */
function arrayRemove(arr, value) {
  let rt_arr = [...arr];
  if (value instanceof Array) {
    for (v of value) {
      rt_arr = rt_arr.filter(function (ele) {
        return ele != v;
      });
    }
  } else {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  return rt_arr;
}

function rangeArray(start, end) {
  return [...Array(end - start)].map((_, i) => i + start);
}
// class Encoder {
//   /**
//    * Decoding a percent encoded string to character code array
//    *
//    * @param {string} str The string being decoded
//    * @returns {Array.<Number|Object} The decoded array
//    */
//   urlDecode(str) {
//     let results = {};
//     // let results = [];
//     let i = 0;
//     let len = str && str.length;
//     let code; // ％以外の部分を文字コードにしてArrayに格納
//     let char;
//
//     while (i < len) {
//       char = str.charAt(i);
//       // Unicode のコードポイント(16進数)に変換し，それを10進数表記にする
//       code = str.charCodeAt(i);
//       i++;
//       if (code === 0x25 /** is % */) {
//         /**
//          * 次とその次の文字が16進数表記で表示されたものとしてintに変換する
//          * 1バイトを1つの数で表す．
//          */
//         char = str.charAt(i++) + str.charAt(i++);
//         code = parseInt(char, 16);
//       }
//       // results.push(c);
//       results[char] = code;
//     }
//     return results;
//   }
//   /**
//    * Detecting the encode method for data
//    * @param {Array.<Number>} data The data being detected
//    * @param {(Object|String|Array.<String>)=} methods The encode method for data
//    * @returns {String|Boolean} The detected encode method, or false
//    */
//   detect(data, methods = null) {
//     if (data === null || data.length === 0) {
//       return false;
//     }
//     /**
//      * First, detecting if data encoded method is CP932
//      * Second, detecting if data encoded method is UTF-8
//      * TODO: Enable to change the detecting order.
//      */
//     if (this.isCP932(data)) {
//       return "CP932";
//     } else if (this.isUTF8(data)) {
//       return "UTF-8";
//     }
//     return false;
//   }
//   /**
//    * detecting if the data is isCP932.
//    * @param {Array.<Number>} data The data being detected
//    * @returns {Boolean} The encode method for the given data is isCP932
//    */
//   isCP932(data) {
//     let len = data && data.length;
//     let b;
//     let b2_base_range = arrayRemove(rangeArray(0x40, 0xfc), 0x7f);
//
//     let b1_symbol_range = [0x81];
//     let b2_symbol_range = arrayRemove(
//       b2_base_range,
//       rangeArray(0xad, 0xb7)
//         .concat(rangeArray(0xc0, 0xc7))
//         .concat(rangeArray(0xcf, 0xd9))
//         .concat(rangeArray(0xe9, 0xef))
//         .concat(rangeArray(0xf8, 0xff))
//     );
//     let b1_dig_alpha_hira_range = [0x82];
//     let b2_dig_alpha_hira_range = arrayRemove(
//       b2_base_range,
//       rangeArray(0x40, 0x4e)
//         .concat(rangeArray(0x59, 0x5f))
//         .concat(rangeArray(0x7b, 0x80))
//         .concat(rangeArray(0x9b, 0x9e))
//         .concat(rangeArray(0xf2, 0xff))
//     );
//     let b1_katakana_greek_range = [0x83];
//     let b2_katakaba_greek_range = arrayRemove(
//       b2_base_range,
//       rangeArray(0x97, 0x9e)
//         .concat(rangeArray(0xb7, 0xbe))
//         .concat(rangeArray(0xd0, 0xff))
//     );
//     let b1_cyrillic_keisen_range = [0x84];
//     let b2_cyrillic_keisen_range = arrayRemove(
//       b2_base_range,
//       rangeArray(0x61, 0x6f)
//         .concat(rangeArray(0x92, 0x9e))
//         .concat(rangeArray(0xbf, 0xff))
//     );
//     let b1_nec_range = [0x87];
//     let b2_nec_range = arrayRemove(
//       b2_base_range,
//       [0x5e]
//         .concat(rangeArray(0x76, 0x7d))
//         .concat(rangeArray(0x90, 0x92))
//         .concat(rangeArray(0x95, 0x97))
//         .concat(rangeArray(0x9a, 0xff))
//     );
//     let b1_jis1_range = rangeArray(0x88, 0x97);
//     let b2_jis1_range = arrayRemove(
//       b2_base_range,
//       rangeArray(0x61, 0x6f)
//         .concat(rangeArray(0x92, 0x9e))
//         .concat(rangeArray(0xbf, 0xff))
//     );
//     let b1_jis1_jis2_range = [0x98];
//     let b2_jis1_jis2_range = [];
//     let b1_jis2_range = rangeArray(0x97, 0xea);
//     let b1_ibm_range = rangeArray(0xfa, 0xfc);
//
//     let b2_jis1_range = [...Array(0x97 - 0x88)].map((_, i) => i + 0x88);
//     let b2_jis1_jis2_range = [0x98];
//     let b2_jis2_range = [...Array(0xea - 0x97)].map((_, i) => i + 0xea);
//     let b2_ibm_range = [...Array(0xfc - 0xfa)].map((_, i) => i + 0xfc);
//     let b1_range = [];
//     /** 2B文字の1B目としてありえる範囲を作成 */
//     for (range of [
//       b1_symbol_range,
//       b1_dig_alpha_hira_range,
//       b1_nec_range,
//       b1_jis1_range,
//       b1_jis1_jis2_range,
//       b1_jis2_range,
//       b1_ibm_range,
//     ]) {
//       b1_range.push(range);
//     }
//
//     for (let i = 0; i < len; i++) {
//       b = data[i];
//       /** 1B文字かどうか */
//       if ((0x00 <= b && b <= 0x80) || (0xa1 <= b && b <= 0xdf)) {
//         continue;
//       }
//
//       /** 2B文字としてありえるかどうか */
//       b1 = b;
//       b2 = data[i++];
//       if (!b1_range.includes(b1)) {
//         return false;
//       }
//
//       /** 2B文字であればそれに応じてチェック */
//       if (b1_symbol_range.includes(b1)) {
//         //b2.
//       }
//     }
//     return true;
//   }
//   /**
//    * detecting if the data is UTF-8.
//    * @param {Array.<Number>} data The data being detected
//    * @returns {Boolean} The encode method for the given data is UTF-8
//    */
//   isUTF8(data) {
//     let i = 0;
//     let len = data && data.length;
//     let b;
//
//     for (; i < len; i++) {
//       b = data[i];
//       if (b > 0xff) {
//         return false;
//       }
//
//       if (b === 0x09 || b === 0x0a || b === 0x0d || (b >= 0x20 && b <= 0x7e)) {
//         continue;
//       }
//
//       if (b >= 0xc2 && b <= 0xdf) {
//         if (i + 1 >= len || data[i + 1] < 0x80 || data[i + 1] > 0xbf) {
//           return false;
//         }
//         i++;
//       } else if (b === 0xe0) {
//         if (
//           i + 2 >= len ||
//           data[i + 1] < 0xa0 ||
//           data[i + 1] > 0xbf ||
//           data[i + 2] < 0x80 ||
//           data[i + 2] > 0xbf
//         ) {
//           return false;
//         }
//         i += 2;
//       } else if ((b >= 0xe1 && b <= 0xec) || b === 0xee || b === 0xef) {
//         if (
//           i + 2 >= len ||
//           data[i + 1] < 0x80 ||
//           data[i + 1] > 0xbf ||
//           data[i + 2] < 0x80 ||
//           data[i + 2] > 0xbf
//         ) {
//           return false;
//         }
//         i += 2;
//       } else if (b === 0xed) {
//         if (
//           i + 2 >= len ||
//           data[i + 1] < 0x80 ||
//           data[i + 1] > 0x9f ||
//           data[i + 2] < 0x80 ||
//           data[i + 2] > 0xbf
//         ) {
//           return false;
//         }
//         i += 2;
//       } else if (b === 0xf0) {
//         if (
//           i + 3 >= len ||
//           data[i + 1] < 0x90 ||
//           data[i + 1] > 0xbf ||
//           data[i + 2] < 0x80 ||
//           data[i + 2] > 0xbf ||
//           data[i + 3] < 0x80 ||
//           data[i + 3] > 0xbf
//         ) {
//           return false;
//         }
//         i += 3;
//       } else if (b >= 0xf1 && b <= 0xf3) {
//         if (
//           i + 3 >= len ||
//           data[i + 1] < 0x80 ||
//           data[i + 1] > 0xbf ||
//           data[i + 2] < 0x80 ||
//           data[i + 2] > 0xbf ||
//           data[i + 3] < 0x80 ||
//           data[i + 3] > 0xbf
//         ) {
//           return false;
//         }
//         i += 3;
//       } else if (b === 0xf4) {
//         if (
//           i + 3 >= len ||
//           data[i + 1] < 0x80 ||
//           data[i + 1] > 0x8f ||
//           data[i + 2] < 0x80 ||
//           data[i + 2] > 0xbf ||
//           data[i + 3] < 0x80 ||
//           data[i + 3] > 0xbf
//         ) {
//           return false;
//         }
//         i += 3;
//       } else {
//         return false;
//       }
//     }
//
//     return true;
//   }
// }

/**
 * Shift-JIS (SJIS)
 */
function isSJIS(data) {
  var i = 0;
  var len = data && data.length;
  var b;

  /** ２バイト目の文字が */
  while (i < len && data[i] > 0x80) {
    if (data[i++] > 0xff) {
      return false;
    }
  }

  for (; i < len; i++) {
    b = data[i];
    if (b <= 0x80 || (0xa1 <= b && b <= 0xdf)) {
      continue;
    }

    if (b === 0xa0 || b > 0xef || i + 1 >= len) {
      return false;
    }

    b = data[++i];
    if (b < 0x40 || b === 0x7f || b > 0xfc) {
      return false;
    }
  }

  return true;
}
exports.isSJIS = isSJIS;
/**
 * UTF-8
 */
function isUTF8(data) {
  var i = 0;
  var len = data && data.length;
  var b;

  for (; i < len; i++) {
    b = data[i];
    if (b > 0xff) {
      return false;
    }

    if (b === 0x09 || b === 0x0a || b === 0x0d || (b >= 0x20 && b <= 0x7e)) {
      continue;
    }

    if (b >= 0xc2 && b <= 0xdf) {
      if (i + 1 >= len || data[i + 1] < 0x80 || data[i + 1] > 0xbf) {
        return false;
      }
      i++;
    } else if (b === 0xe0) {
      if (
        i + 2 >= len ||
        data[i + 1] < 0xa0 ||
        data[i + 1] > 0xbf ||
        data[i + 2] < 0x80 ||
        data[i + 2] > 0xbf
      ) {
        return false;
      }
      i += 2;
    } else if ((b >= 0xe1 && b <= 0xec) || b === 0xee || b === 0xef) {
      if (
        i + 2 >= len ||
        data[i + 1] < 0x80 ||
        data[i + 1] > 0xbf ||
        data[i + 2] < 0x80 ||
        data[i + 2] > 0xbf
      ) {
        return false;
      }
      i += 2;
    } else if (b === 0xed) {
      if (
        i + 2 >= len ||
        data[i + 1] < 0x80 ||
        data[i + 1] > 0x9f ||
        data[i + 2] < 0x80 ||
        data[i + 2] > 0xbf
      ) {
        return false;
      }
      i += 2;
    } else if (b === 0xf0) {
      if (
        i + 3 >= len ||
        data[i + 1] < 0x90 ||
        data[i + 1] > 0xbf ||
        data[i + 2] < 0x80 ||
        data[i + 2] > 0xbf ||
        data[i + 3] < 0x80 ||
        data[i + 3] > 0xbf
      ) {
        return false;
      }
      i += 3;
    } else if (b >= 0xf1 && b <= 0xf3) {
      if (
        i + 3 >= len ||
        data[i + 1] < 0x80 ||
        data[i + 1] > 0xbf ||
        data[i + 2] < 0x80 ||
        data[i + 2] > 0xbf ||
        data[i + 3] < 0x80 ||
        data[i + 3] > 0xbf
      ) {
        return false;
      }
      i += 3;
    } else if (b === 0xf4) {
      if (
        i + 3 >= len ||
        data[i + 1] < 0x80 ||
        data[i + 1] > 0x8f ||
        data[i + 2] < 0x80 ||
        data[i + 2] > 0xbf ||
        data[i + 3] < 0x80 ||
        data[i + 3] > 0xbf
      ) {
        return false;
      }
      i += 3;
    } else {
      return false;
    }
  }

  return true;
}
exports.isUTF8 = isUTF8;

/**
 * Detecting the encode method for data
 * @param {Array.<Number>} data The data being detected
 * @param {(Object|String|Array.<String>)=} methods The encode method for data
 * @returns {String|Boolean} The detected encode method, or false
 */
function detect(data, methods = null) {
  if (data === null || data.length === 0) {
    return false;
  }
  let sjis_flg = isSJIS(data);
  let utf8_flg = isUTF8(data);
  if (sjis_flg && !utf8_flg) {
    return "SJIS";
  } else if (!sjis_flg && utf8_flg) {
    return "UTF8";
  } else if (sjis_flg && utf8_flg) {
    return "both";
    /** cp932にもutf8でもTrueであれば，場合分けして判断 */
  }
  return false;
}
exports.detect = detect;
