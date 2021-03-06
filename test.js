const Encoding = require("./encoding.js/encoding");
const Encoding2 = require("./detecting_utf-8_cp932");

function sumArray(array) {
  return array.reduce((acc, curr) => acc + curr);
}
function avgArray(array) {
  return sumArray(array) / array.length;
}
function stdArray(array) {
  let avg = avgArray(array);
  let squareDiffs = array.map((v) => {
    let diff = v - avg;
    return diff * diff;
  });
  let variance = sumArray(squareDiffs) / (squareDiffs.length - 1);
  return Math.sqrt(variance);
}

let encoded_str_list = [
  "HOGE",
  "%8CR%8E%E8", // 軍手（CP932）
  "U%C5%AF%C4%81%40M36", // Uﾅｯﾄ　M3（CP932）
  "%E3%83%9E%E3%82%B9%E3%82%AF", // マスク（UTF8）
  "%E5%8F%B0%E8%BB%8A", // 台車 (UTF8)
  "%E3%82%A8%E3%82%BF%E3%83%8E%E3%83%BC%E3%83%AB", // エタノール　(UTF8)
  "%E3%83%88%E3%83%AB%E3%82%AF%E3%83%AC%E3%83%B3%E3%83%81", // トルクレンチ　(UTF8)
  "%8B%C6%96%B1%97p+%83o%83X%83P%83b%83g", // 業務用 バスケット
  "%90%DC%82%E8%8F%F4%82%DD%83R%83%93%83e%83i%82%D3%82%BD", //折り畳みコンテナふた
  "%94%92%20%82%AE%82%C2", // 白 ぐつ
  "%83X%83e%83%93%83%8C%83X%81%40%83%D338", // ステンレス
  "%E3%82%AA%E3%83%A0%E3%83%AD%E3%83%B3%20E3S-LS20XE4", // オムロン E3S-LS20XE4
  "%E6%8A%B5%E6%8A%97%E6%8E%A5%E5%9C%B0", // 抵抗接地 UTF8
  "%83S%83%80%20%91%CF%83K%83%255C%83%8A%83%93", // ゴム 耐ガソリン CP932
  "%83%255C%83t%83g%20%83h%83A%83N%83%8D%81%5B%83U%81%5B",
];
let n = 10000;
let timeSeries = [];
let startTime;
let endTime;
let precision = 4;
let sum;
let avg;
let std;

for (let i = 0; i < n; i++) {
  startTime = performance.now();
  for (const encoded_str of encoded_str_list) {
    let data = Encoding.urlDecode(encoded_str);
    let method = Encoding2.detect(data);
    // if (method == "both") {
    //   // method = "UTF8";
    //   method = "CP932";
    // }
    let unicodeArray = Encoding.convert(data, { to: "UNICODE", from: method });
    let unicodeString = Encoding.codeToString(unicodeArray);
    // console.log(
    //   `${encoded_str} は ${data.map((v, i) =>
    //     v.toString(16)
    //   )}, ${method} により ${unicodeString} に変換されました．`
    // );
  }
  endTime = performance.now();
  timeSeries.push(endTime - startTime);
}
sum = Math.ceil(sumArray(timeSeries) / 1000);
avg = avgArray(timeSeries).toPrecision(precision);
std = stdArray(timeSeries).toPrecision(precision);
console.log(
  `Elapsed Time: ${sum} (s) | 1 Loop: ${avg} ± ${std} (ms) | n: ${n})`
);
