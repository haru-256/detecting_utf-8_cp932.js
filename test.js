const Encoding = require("./encoding.js/encoding");
const Encoding2 = require("./detecting_utf-8_cp932");

let encoded_str_list = [
  // "HOGE",
  // "%8CR%8E%E8", // 軍手（CP932）
  // "U%C5%AF%C4%81%40M36", // Uﾅｯﾄ　M3（CP932）
  // "%E3%83%9E%E3%82%B9%E3%82%AF", // マスク（UTF8）
  // "%E5%8F%B0%E8%BB%8A", // 台車 (UTF8)
  // "%E3%82%A8%E3%82%BF%E3%83%8E%E3%83%BC%E3%83%AB", // エタノール　(UTF8)
  // "%E3%83%88%E3%83%AB%E3%82%AF%E3%83%AC%E3%83%B3%E3%83%81", // トルクレンチ　(UTF8)
  "%8B%C6%96%B1%97p+%83o%83X%83P%83b%83g", // 業務用 バスケット
  // "%90%DC%82%E8%8F%F4%82%DD%83R%83%93%83e%83i%82%D3%82%BD", //折り畳みコンテナふた
  // "%94%92%20%82%AE%82%C2", // 白 ぐつ
];
for (const encoded_str of encoded_str_list) {
  let data = Encoding.urlDecode(encoded_str);
  let method = Encoding2.detect(data);
  if (method == "both") {
    // method = "UTF8";
    method = "CP932";
  }
  let unicodeArray = Encoding.convert(data, { to: "UNICODE", from: method });
  let unicodeString = Encoding.codeToString(unicodeArray);
  console.log(
    `${encoded_str} は ${data.map((v, i) =>
      v.toString(16)
    )}, ${method} により ${unicodeString} に変換されました．`
  );
}
