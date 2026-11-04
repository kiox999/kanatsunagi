# かなつなぎ

4×4のひらがな盤面をなぞって言葉を作る、120秒のワードゲーム。
日替わり（メダル・カレンダー）、フリー、落ちもの、CPU対戦（かんたん〜おに）、チュートリアル、みんなで対戦（ふつう／早い者勝ち／陣取り）。

## 公開手順（GitHub Pages）

1. このフォルダの `index.html` と `README.md` をリポジトリ直下に置く
2. リポジトリの Settings → Pages → Branch を `main` / `(root)` にして保存
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で開ける

## 対戦を動かす（Firebase Realtime Database）

1. Firebase コンソールでプロジェクトを開く（既存の `crane-s-voice` でも可）
2. 「プロジェクトの設定 → マイアプリ → ウェブアプリ」の `firebaseConfig` を `index.html` の `window.KT_FIREBASE_CONFIG = {...}` に貼る
3. Realtime Database → ルール に以下を追加（`kana` 以下だけ読み書き可）

```json
"kana": {
  "rooms":     { ".read": true, "$code": { ".write": true } },
  "proposals": { ".read": true, "$id":   { ".write": true } },
  "extra":     { ".read": true, ".write": true }
}
```

（既に `tsuru` などのルールがある場合は `"kana": {...}` を並べて追加する）

設定を貼らなければ、対戦以外のモードはそのまま遊べる。

## 辞書について

語彙は JMdict（EDRDG）を加工して同梱している。
JMdict は Creative Commons Attribution-ShareAlike 4.0 ライセンス。
https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project

## みんなの辞書（申請・承認）

- 結果画面の「辞書になかった言葉」から申請できる（`kana/proposals` に溜まる）
- 管理画面は URL の末尾に `#admin` を付けて開く（例：`https://kiox999.github.io/kanatsunagi/#admin`）。合言葉を入れると申請一覧が出て、表記とジャンルを決めて「採用」すると `kana/extra` に入り、全員の辞書に反映される（次回ページ読み込み時）
- 合言葉は `admin_pass.txt` の内容から作ったハッシュを index.html に埋め込んでいる。変えたいときは build し直す
- 注意：管理画面の合言葉は「うっかり」を防ぐ程度のもので、Firebase の `extra` 自体は誰でも書ける設定。悪意ある人が直接書き込むことは防げない（趣味サイトの範囲では十分）
