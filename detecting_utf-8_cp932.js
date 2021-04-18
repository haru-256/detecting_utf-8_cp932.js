const Encoding = require("./encoding.js/encoding");

class Encoder {
  /**
   * Decoding a percent encoded string to character code array
   *
   * @param {string} str The string being decoded
   * @returns {Array.<Number|Object} The decoded array
   */
  urlDecode(str) {
    let results = {};
    // let results = [];
    let i = 0;
    let len = str && str.length;
    let code; // ％以外の部分を文字コードにしてArrayに格納
    let char;

    while (i < len) {
      char = str.charAt(i);
      // Unicode のコードポイント(16進数)に変換し，それを10進数表記にする
      code = str.charCodeAt(i);
      i++;
      if (code === 0x25 /** is % */) {
        /**
         * 次とその次の文字が16進数表記で表示されたものとしてintに変換する
         * 1バイトを1つの数で表す．
         */
        char = str.charAt(i++) + str.charAt(i++);
        code = parseInt(char, 16);
      }
      // results.push(c);
      results[char] = code;
    }
    return results;
  }
  /**
   * Detecting the encode method for data
   * @param {Array.<Number>} data The data being detected
   * @param {(Object|String|Array.<String>)=} methods The encode method for data
   * @returns {String|Boolean} The detected encode method, or false
   */
  detect(data, methods = null) {
    if (data === null || data.length === 0) {
      return false;
    }
    /**
     * First, detecting if data encoded method is CP932
     * Second, detecting if data encoded method is UTF-8
     * TODO: Enable to change the detecting order.
     */
    if (this.isCP932(data)) {
      return "CP932";
    } else if (this.isUTF8(data)) {
      return "UTF-8";
    }
    return false;
  }
  /**
   * detecting if the data is isCP932.
   * @param {Array.<Number>} data The data being detected
   * @returns {Boolean} The encode method for the given data is isCP932
   */
  isCP932(data) {
    var i = 0;
    var len = data && data.length;
    var b;

    /** data[i] > 0x80はdata[i]が2バイト文字の先頭であることを意味する */
    while (i < len && data[i] > 0x80) {
      if (data[i++] > 0xff) {
        return false;
      }
    }
    return true;
  }
  /**
   * detecting if the data is UTF-8.
   * @param {Array.<Number>} data The data being detected
   * @returns {Boolean} The encode method for the given data is UTF-8
   */
  isUTF8(data) {
    var i = 0;
    var len = data && data.length;
    var b;
    for (; i < len; i++) {
      b = data[i];
      if (b > 0xff) {
        return false;
      }
    }
    return true;
  }
}

let str = "軍手";
// let encoded_str = encodeURIComponent(str);
let encoded_str = "%8CR%8E%E8"; // 軍手（CP932）
let encoder = new Encoder();

console.log(encoded_str);
console.log(encoder.urlDecode(encoded_str));
console.log(encoder.detect(encoded_str));
console.log(encoder.detect(encoded_str, ["hoge"]));
