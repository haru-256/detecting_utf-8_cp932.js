const Encoding = require("./encoding.js/encoding");
const Encoding2 = require("./detecting_utf-8_cp932");

let str = "軍手";
// let encoded_str = encodeURIComponent(str);
let encoded_str = "%8CR%8E%E8"; // 軍手（CP932）
let data = Encoding.urlDecode(encoded_str);

console.log(encoded_str);
console.log(data);
let method = Encoding2.detect(data);
console.log(method);
