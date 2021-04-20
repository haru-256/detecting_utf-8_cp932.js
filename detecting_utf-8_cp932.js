const Encoding = require("./encoding.js/encoding");
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
 * detecting if the data is isCP932.
 * @param {Array.<Number>} data The data being detected
 * @returns {Boolean} The encode method for the given data is isCP932
 */
function isStrictCP932(data) {
  let len = data && data.length;
  let b;
  let b1_range;
  let b2_range;
  let b2_base_range = arrayRemove(rangeArray(0x40, 0xfc), 0x7f);

  /** 記号 */
  let b1_symbol_range = [0x81];
  let b2_symbol_range = arrayRemove(
    b2_base_range,
    rangeArray(0xad, 0xb7)
      .concat(rangeArray(0xc0, 0xc7))
      .concat(rangeArray(0xcf, 0xd9))
      .concat(rangeArray(0xe9, 0xef))
      .concat(rangeArray(0xf8, 0xff))
  );
  /** 英字，数字，ひらがな */
  let b1_dig_alpha_hira_range = [0x82];
  let b2_dig_alpha_hira_range = arrayRemove(
    b2_base_range,
    rangeArray(0x40, 0x4e)
      .concat(rangeArray(0x59, 0x5f))
      .concat(rangeArray(0x7b, 0x80))
      .concat(rangeArray(0x9b, 0x9e))
      .concat(rangeArray(0xf2, 0xff))
  );
  /** カタカナ，ギリシャ文字 */
  let b1_katakana_greek_range = [0x83];
  let b2_katakaba_greek_range = arrayRemove(
    b2_base_range,
    rangeArray(0x97, 0x9e)
      .concat(rangeArray(0xb7, 0xbe))
      .concat(rangeArray(0xd0, 0xff))
  );
  /** キリル文字，罫線 */
  let b1_cyrillic_keisen_range = [0x84];
  let b2_cyrillic_keisen_range = arrayRemove(
    b2_base_range,
    rangeArray(0x61, 0x6f)
      .concat(rangeArray(0x92, 0x9e))
      .concat(rangeArray(0xbf, 0xff))
  );
  /** NEC拡張文字 */
  let b1_nec_range = [0x87];
  let b2_nec_range = arrayRemove(
    b2_base_range,
    [0x5e]
      .concat(rangeArray(0x76, 0x7d))
      .concat(rangeArray(0x90, 0x92))
      .concat(rangeArray(0x95, 0x97))
      .concat(rangeArray(0x9a, 0xff))
  );
  /** JIS第1水準 */
  let b1_jis1_range = rangeArray(0x88, 0x97);
  let b2_jis1_range = b2_base_range;
  /** JIS第1水準 OR JIS第2水準 */
  let b1_jis1_jis2_range = [0x98];
  let b2_jis1_jis2_range = arrayRemove(b2_base_range, rangeArray(0x73, 0x9e));
  /** JIS第2水準 */
  let b1_jis2_range = rangeArray(0x99, 0xe9);
  let b2_jis2_range = b2_base_range;
  let b1_jis2_ea_range = [0xea];
  let b2_jis2_ea_range = arrayRemove(b2_base_range, rangeArray(0xa5, 0xff));
  /** IBM拡張文字 */
  let b1_ibm_fa_range = [0xfa];
  let b2_ibm_fa_range = arrayRemove(
    b2_base_range,
    rangeArray(0x4a, 0x54).concat(rangeArray(0x58, 0x5b))
  );
  let b1_ibm_fb_range = [0xfb];
  let b2_ibm_fb_range = b2_base_range;
  let b1_ibm_fc_range = [0xfc];
  let b2_ibm_fc_range = arrayRemove(b2_base_range, rangeArray(0x4c, 0x4f));

  /** 2B文字の1B目としてありえる範囲を作成 */
  b1_range = b1_symbol_range;
  for (range of [
    b1_dig_alpha_hira_range,
    b1_katakana_greek_range,
    b1_cyrillic_keisen_range,
    b1_nec_range,
    b1_jis1_range,
    b1_jis1_jis2_range,
    b1_jis2_range,
    b1_jis2_ea_range,
    b1_ibm_fa_range,
    b1_ibm_fb_range,
    b1_ibm_fc_range,
  ]) {
    b1_range = b1_range.concat(range);
  }

  for (let i = 0; i < len; i++) {
    b = data[i];
    /** 1B文字かどうか */
    if ((0x00 <= b && b <= 0x80) || (0xa1 <= b && b <= 0xdf)) {
      continue;
    }

    /** 2B文字としてありえるかどうか */
    b1 = b;
    if (!b1_range.includes(b1)) {
      return false;
    }

    /** 2B文字であればそれに応じてチェック */
    if (b1_symbol_range.includes(b1)) {
      b2_range = b2_symbol_range;
    } else if (b1_dig_alpha_hira_range.includes(b1)) {
      b2_range = b1_dig_alpha_hira_range;
    } else if (b1_katakana_greek_range.includes(b1)) {
      b2_range = b2_katakaba_greek_range;
    } else if (b1_cyrillic_keisen_range.includes(b1)) {
      b2_range = b2_cyrillic_keisen_range;
    } else if (b1_nec_range.includes(b1)) {
      b2_range = b2_nec_range;
    } else if (b1_jis1_range.includes(b1)) {
      b2_range = b2_jis1_range;
    } else if (b1_jis1_jis2_range.includes(b1)) {
      b2_range = b2_jis1_jis2_range;
    } else if (b1_jis2_range.includes(b1)) {
      b2_range = b2_jis2_range;
    } else if (b1_jis2_ea_range.includes(b1)) {
      b2_range = b2_jis2_ea_range;
    } else if (b1_ibm_fa_range.includes(b1)) {
      b2_range = b2_ibm_fa_range;
    } else if (b1_ibm_fb_range.includes(b1)) {
      b2_range = b2_ibm_fb_range;
    } else if (b1_ibm_fc_range.includes(b1)) {
      b2_range = b2_ibm_fc_range;
    }
    b2 = data[i + 1];
    if (!b2_range.includes(b2)) {
      return false;
    }
    i += 1;
  }
  return true;
}

/**
 * detecting if the data is isUTF8.
 * @param {Array.<Number>} data The data being detected
 * @returns {Boolean} The encode method for the given data is isCP932
 */
function isStrictUTF8(data) {
  let i = 0;
  let len = data && data.length;
  let b;
  /** マルチバイト文字の2B目以降の範囲  */
  let multi_b_range = rangeArray(0x80, 0xbf);

  for (; i < len; i++) {
    b = data[i];
    if (b > 0xff) {
      return false;
    }

    /** 1B文字かどうか */
    if (0x00 <= b && b <= 0x7f) {
      continue;
    }

    /** マルチバイト文字は1B目に応じて判定 */
    if (0xc2 <= b && b <= 0xdf) {
      /** 2B文字の処理 */
      if (i + 1 >= len || !multi_b_range.includes(data[i + 1])) {
        return false;
      }
      i++;
    } else if (b === 0xe0) {
      /** 3B文字で1B目がE0の処理 */
      if (
        i + 2 >= len ||
        !(0xa0 <= data[i + 1] && data[i + 1] <= 0xbf) ||
        !multi_b_range.includes(data[i + 1])
      ) {
        return false;
      }
      i += 2;
    } else if ((0xe1 <= b && b <= 0xec) || b === 0xef) {
      /** 3B文字で1B目がE1 - ECの処理 */
      if (
        i + 2 >= len ||
        !multi_b_range.includes(data[i + 1]) ||
        !multi_b_range.includes(data[i + 2])
      ) {
        return false;
      }
      i += 2;
    } else if (b === 0xed) {
      /** 3B文字で1B目がEDの処理 */
      if (
        i + 2 >= len ||
        !(0x80 <= data[i + 1] && data[i + 1] < 0x9f) ||
        !multi_b_range.includes(data[i + 2])
      ) {
        return false;
      }
      i += 2;
    } else if (b === 0xf0) {
      /** 4B文字で1B目がF0の処理 */
      if (
        i + 3 >= len ||
        !(0x90 <= data[i + 1] && data[i + 1] <= 0x9f) ||
        !multi_b_range.includes(data[i + 2]) ||
        !multi_b_range.includes(data[i + 3])
      ) {
        return false;
      }
      i += 3;
    } else if (0xf1 <= b && b <= 0xf3) {
      /** 4B文字で1B目がF1 - F3の処理 */
      if (
        i + 3 >= len ||
        !multi_b_range.includes(data[i + 1]) ||
        !multi_b_range.includes(data[i + 2]) ||
        !multi_b_range.includes(data[i + 3])
      ) {
        return false;
      }
      i += 3;
    } else if (b === 0xf4) {
      /** 4B文字で1B目がF4の処理 */
      if (
        i + 3 >= len ||
        !(0x80 <= data[i + 1] && data[i + 1] <= 0x8f) ||
        !multi_b_range.includes(data[i + 2]) ||
        !multi_b_range.includes(data[i + 3])
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

/**
 * ASCII (ISO-646)
 */
function isASCII(data) {
  var b;
  for (b of data) {
    if (b > 0xff || (0x80 <= b && b <= 0xff)) {
      return false;
    }
  }
  return true;
}

/**
 * detecting if the data is isCP932.
 * @param {Array.<Number>} data The data being detected
 * @returns {Boolean} The encode method for the given data is isCP932
 */
function isMonoCP932(data) {
  let len = data && data.length;
  let char_len = 0;
  let b;
  let b1_range;
  let counter = { hankaku: 0, cyrillic_keisen: 0, nec: 0, jis2: 0, ibm: 0 };

  /** 記号 */
  let b1_symbol_range = [0x81];
  /** 英字，数字，ひらがな */
  let b1_dig_alpha_hira_range = [0x82];
  /** カタカナ，ギリシャ文字 */
  let b1_katakana_greek_range = [0x83];
  /** キリル文字，罫線 */
  let b1_cyrillic_keisen_range = [0x84];
  /** NEC拡張文字 */
  let b1_nec_range = [0x87];
  /** JIS第1水準 */
  let b1_jis1_range = rangeArray(0x88, 0x97);
  /** JIS第1水準 OR JIS第2水準 */
  let b1_jis1_jis2_range = [0x98];
  /** JIS第2水準 */
  let b1_jis2_range = rangeArray(0x99, 0xea);
  /** IBM拡張文字 */
  let b1_ibm_range = [0xfa, 0xfb, 0xfc];

  /** 2B文字の1B目としてありえる範囲を作成 */
  b1_range = b1_symbol_range;
  for (range of [
    b1_dig_alpha_hira_range,
    b1_katakana_greek_range,
    b1_cyrillic_keisen_range,
    b1_nec_range,
    b1_jis1_range,
    b1_jis1_jis2_range,
    b1_jis2_range,
    b1_ibm_range,
  ]) {
    b1_range = b1_range.concat(range);
  }

  for (let i = 0; i < len; i++) {
    b = data[i];
    /** 1B文字かどうか */
    if ((0x00 <= b && b <= 0x80) || (0xa1 <= b && b <= 0xdf)) {
      if (0xa1 <= b && b <= 0xdf) {
        counter["hankaku"] += 1;
      }
      char_len += 1;
      continue;
    }

    /** 2B文字としてありえるかどうか */
    if (!b1_range.includes(b)) {
      return false;
    }

    /** 2B文字でJIS第２水準か半角カタカナ, キリル文字であればカウント */
    b2 = data[i + 1];
    if (b1_cyrillic_keisen_range.includes(b)) {
      counter["cyrillic_keisen"] += 1;
    } else if (b1_nec_range.includes(b)) {
      counter["nec"] += 1;
    } else if (
      (b1_jis1_jis2_range.includes(b) && 0x91 <= b2 && b2 <= 0xfc) ||
      b1_jis2_range.includes(b)
    ) {
      counter["jis2"] += 1;
    } else if (b1_ibm_range.includes(b)) {
      counter["ibm"] += 1;
    }
    i += 1;
    char_len += 1;
  }
  if (counter["jis2"] > parseInt(char_len / 2)) {
    /** 文字列の過半数がJIS第２水準のみ */
    return false;
  } else if (counter["jis2"] + counter["hankaku"] >= char_len) {
    /** 半角カタカナと JIS 第２水準のみである */
    return false;
  }
  return true;
}

/**
 * detecting if the data is isUTF8.
 * @param {Array.<Number>} data The data being detected
 * @returns {Boolean} The encode method for the given data is isCP932
 */
function isMonoUTF8(data) {
  let i = 0;
  let len = data && data.length;
  let b;
  /** マルチバイト文字の2B目以降の範囲  */
  let multi_b_range = rangeArray(0x80, 0xbf);
  /** 2B文字で2B目の範囲  */
  let b2_ce_greek_range = rangeArray(0x91, 0xa9).concat(rangeArray(0xb1, 0xff));
  let b2_cf_greek_range = rangeArray(0x80, 0x89);
  /** 3B文字で1B目の範囲  */
  let b1_3b_range = arrayRemove(rangeArray(0xe0, 0xef), [
    0xe0,
    0xe1,
    0xea,
    0xeb,
    0xec,
    0xed,
  ]); // TODO: E2とEFもダメな範囲があるので厳密にやる？

  for (; i < len; i++) {
    b = data[i];
    /** 1B文字かどうか */
    if (0x00 <= b && b <= 0x7f) {
      continue;
    }

    /** マルチバイト文字は1B目に応じて判定 */
    /** 2B文字の処理 */
    if (0xc2 <= b && b <= 0xdf) {
      if (b === 0xc2) {
        /** 0x80: , 0xa5: ¥, 0xb1: ± 以外か */
        if (![0x80, 0xa5, 0xb1].includes(data[i + 1])) {
          return false;
        }
      } else if (b === 0xce) {
        /** ギリシャ文字 大文字小文字以外か */
        if (!b2_ce_greek_range.includes(data[i + 1])) {
          return false;
        }
      } else if (b === 0xcf) {
        /** ギリシャ文字 大文字小文字以外か */
        if (!b2_cf_greek_range.includes(data[i + 1])) {
          return false;
        }
      } else {
        return false;
      }
      i++;
    } else if (0xe0 <= b && b <= 0xef) {
      /** 3B文字の処理 */
      if (!b1_3b_range.includes(b)) {
        /** 3B文字の1B目としてありえるどうか */
        return false;
      }
      i += 2;
    } else if (0xf0 <= b && b <= 0xf7) {
      /** 4B文字の処理 */
      if (b !== 0xf0) {
        return false;
      }
      i += 3;
    } else {
      return false;
    }
  }

  return true;
}

function judging(cp932_flg, utf8_flg) {
  if (cp932_flg && !utf8_flg) {
    return "CP932";
  } else if (!cp932_flg && utf8_flg) {
    return "UTF8";
  } else if (cp932_flg && utf8_flg) {
    return "both";
  }
  return false;
}

/**
 * Detecting the encode method for data
 * @param {Array.<Number>} data The data being detected
 * @param {(Object|String|Array.<String>)=} methods The encode method for data
 * @returns {String|Boolean} The detected encode method, or false
 */
function detect(data, methods = null) {
  let cp932_flg;
  let utf8_flg;
  let encode_method;
  if (data === null || data.length === 0) {
    return false;
  }
  if (Encoding.detect(data, "ASCII") === "ASCII") {
    return "ASCII";
  }

  cp932_flg = Encoding.detect(data, "SJIS") === "SJIS";
  utf8_flg = Encoding.detect(data, "UTF8") === "UTF8";
  // utf8_flg = isStrictUTF8(data, "UTF8");
  encode_method = judging(cp932_flg, utf8_flg);
  console.log(encode_method);
  if (encode_method === "both") {
    /** cp932にもutf8でもTrueであれば，日本語環境としてありえるか判断 */
    cp932_flg = isMonoCP932(data);
    utf8_flg = isMonoUTF8(data);
    encode_method = judging(cp932_flg, utf8_flg);
    console.log(encode_method);
  }
  return encode_method;
}
exports.detect = detect;
