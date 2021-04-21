# パーセントエンコードされた URL が CP932 なのか UTF-8 なのかを判定

このコードではパーセントエンコードされた URL が CP932 なのか UTF-8 なのかを判定します．
このコードでは以下の前提を設けます．

- 絶対的にこの URL が CP932 なのか UTF-8 なのかを判定するのではなく，相対的な判定で CP932 か UTF-8 を判定します．
- CP932 とも UTF-8 とも取れる文字列があるため，確実に CP932 か UTF-8 かを判定することができない場合があります．その場合は日本語環境として有り得そうな文字列をもとに判定を行います．
  1. SJIS エンコード文字を UTF8 と推定する対処：CP932 で扱えていない範囲の文字コードを含む場合はそれは UTF8 と読めても UTF8 と判定しない
  1. 以下の場合は SJIS としても SJIS と判定しない．
  - 文字列の半分以上が JIS 第２水準である
  - 1B 文字  と JIS 第２水準のみである
  - JIS 第２水準のあとに 1B 文字が来る
  - キリル文字・罫線が現れた

## UTF-8

可変マルチバイト文字で，1B - 6B まである．ありえる範囲は以下の通り．だが，5B, 6B は使用していない？

また，マルチバイト文字の 2B 以降は 8x,9x,Ax,Bx の中にある

- 1B: 00 - 7F (制御文字+ASCII → UTF-8 と同じ)
- 2B: C2 - DF + 80 - BF
- 3B: E0 - EF + 80 - BF + 80 - BF
- 4B: F0 - F7 + 80 - BF + 80 - BF + 80 - BF
- 5B: F8 - FB + 80 - BF + 80 - BF + 80 - BF + 80 - BF
- 6B: FC - FD + 80 - BF + 80 - BF + 80 - BF + 80 - BF + 80 - BF

## CP932

Shift_JIS の空き領域に独自に Windows 機種依存文字を定義したもの．
可変マルチバイト文字で，1B - 2B まである．

- 1B:
  - 00 - 80(制御文字+ASCII → UTF-8 と同じ)
  - A1 - DF (半角カタカナ)
- 2B: (2 バイト目であり得る範囲は 40 - FF)
  - "81 - 9F, E0 - FC" + "40 - 7E, 80 - FC"
    - 1B 目が 81: 記号
      - ただし，以下は定義されていない
        - 2B 目: 7F, AD - AF, B0 - B7, C0 - C7, D0 - D9, E9 - EF, F8 - FB, FD - FF
    - 1B 目が 82: 数字，英字（大文字小文字），ひらがな
      - ただし，以下は定義されていない
        - 2B 目: 40 - 4E, 5A - 5F, 7B - 7F, 80, 9C - 9E, F2 - FF
    - 1B 目が 83: カタカナ，ギリシャ文字
      - ただし，以下は定義されていない
        - 2B 目: 7F, 97 - 9E, B7 - BE, D0 - FF
    - 1B 目が 84: キリル文字，罫線
      - ただし，以下は定義されていない
        - 2B 目: 61 - 6F, 7F, 92 - 9E, BF - FF
    - 1B 目が 87: NEC 特殊文字 (SJIS にはない)
      - ただし，以下は定義されていない
        - 2B 目: 5E, 76 - 7D, 7F, 90 - 92, 95 - 97, 9A - FF
    - 1B 目が 88 - 97 : JIS 第 1 水準
      - ただし，以下は定義されていない
        - 2B 目: 7F, FD - FF
    - 1B 目が 98 : JIS 第 1 OR 第 2 水準
      - ただし，以下は定義されていない
        - 2B 目: 73 - 9E, FD - FF
    - 1B 目が 99 - E9 : JIS 第 2 水準
      - ただし，以下は定義されていない
        - 2B 目: 00 - 3F, 7F, FD - FF
    - 1B 目が EA : JIS 第 2 水準
      - ただし，以下は定義されていない
        - 2B 目: 00 - 3F, 7F, A5 - FF
    - FIXME: 1B 目 ED - EE の NEC 選定 IBM 拡張文字を考慮する
    - 1B 目が FA - FC: IBM 拡張文字 (SJIS にはない)
      - ただし，以下は定義されていない
        - 1B 目: FA, 2B 目: 00 - 3F, 4A - 4F, 50 - 54, 58 - 5B, 7F, FD - FF
        - 1B 目: FB, 2B 目: 7F, FD - FF
        - 1B 目: 40 - 4B 以外

# 判定ロジック

基本的に CP932 かどうかを確認する．もし違えば UTF-8 という判定をする．
どちらでもありえるものに関しては日本語環境としてありえそうな方で判定する．

## UTF-8 でも CP932 でもありえる部分

### C2 - DF + 80 - BF

- UTF-8: 2B,
  - C2 - DF + 80 - BF
    - 以下以外であれば，utf8 でないとする
      - C280(), C2A5(¥), C2B1(±), CE91 - CEA9 (ギリシャ文字　大文字), CEB1 - CF89 (ギリシャ文字小文字)
- CP932:
  - C2 - DF + 80 - BF (ただし，7F, FD - FF はない)
  - EA + 80 - A4

### E0 - EF + 80 - BF + 80 - BF

- UTF-8: 3B
  - E0 - EF + 80 - BF + 80 - BF
    - 以下であれば，utf8 でないとする
      - 1B 目が E0, E1, EA, EB, EC, ED
      - E2 の中でも以下に該当するもの
        - E2 B0 80 - E2 B7 7F
      - EF の中でも以下に該当するもの
        - EF AD 90 - EF B8 8F
        - EF B9 B0 - EF BC 7F
- CP932: JIS 第 2 水準
  - E0 - E9 + 80 - BF (ただし，7F, FD - FF はない)
  - EA + 80 - A4

CP932 と判定した場合，次の 1B（UTF-8 の 3B 目）の 80 - BF の判定候補は以下の通り

- A1 - DF であれば，1B 文字と判断しそれは半角カタカナとなる
  - false
- A1 - DF でなければ，2B 文字の 1B 目と判し，候補は以下の通り．
  - 81→ 数字，英字（大文字小文字），ひらがな
    - まだわからない
  - 84→ キリル文字，罫線
    - false
  - 87→NEC 特殊文字 (SJIS にはない)
    - false
  - 88 - 97 →JIS 第 1 水準
    - まだわからない
  - 98 →JIS 第 1 水準 OR JIS 第 2 水準
    - 第 2 水準であれば false, 第 1 水準であればわからない
  - 99 - BF →JIS 第 2 水準
    - false

# 参考

- [Shift_JIS と Windows-31J (MS932) の違いを整理してみよう](https://weblabo.oscasierra.net/shift_jis-windows31j/)
- [Shift_JIS 系文字一覧イメージと SJIS・MS932・CP943・SJIS2004 の違い](https://tools.m-bsys.com/ex/sjis.php)
