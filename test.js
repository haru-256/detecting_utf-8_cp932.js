const Encoding = require("./encoding.js/encoding");
const Encoding2 = require("./detecting_utf-8_cp932");

let encoded_str_list = [
  "HOGE",
  "%8CR%8E%E8", // 軍手（CP932）
  "U%C5%AF%C4%81%40M36", // Uﾅｯﾄ　M3（CP932）
  "%E3%83%9E%E3%82%B9%E3%82%AF", // マスク（UTF8）
];
for (const encoded_str of encoded_str_list) {
  let data = Encoding.urlDecode(encoded_str);
  let method = Encoding2.detect(data);
  // if (method == "both") {
  // method = "UTF8";
  // method = "SJIS";
  //}
  let unicodeArray = Encoding.convert(data, { to: "UNICODE", from: method });
  let unicodeString = Encoding.codeToString(unicodeArray);
  console.log(
    `${encoded_str} は ${method} により ${unicodeString} に変換されました．`
  );
}
