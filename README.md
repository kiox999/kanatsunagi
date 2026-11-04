# かなつなぎ

4×4のひらがな盤面をなぞって言葉を作る、120秒のワードゲーム。
日替わり（メダル・カレンダー）、フリー、落ちもの、CPU対戦（かんたん〜おに）、チュートリアル、みんなで対戦（ふつう／早い者勝ち／陣取り）、クエスト（落ちものRPG：カードガチャ・ダンジョン9本＋日替わり・ギミック14種）。

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

語彙は JMdict（EDRDG）と JMnedict（固有名詞：地名・史跡・人名・駅名・作品名）を加工して同梱している。
JMdict は Creative Commons Attribution-ShareAlike 4.0 ライセンス。
https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project

## みんなの辞書（申請・承認）

- 結果画面の「辞書になかった言葉」またはホームの「みんなの辞書」から申請できる（`kana/proposals` に溜まる）
- 管理画面はホーム →「みんなの辞書」→「管理」、または URL 末尾 `#admin`。**管理人の Google アカウントでログイン**して使う（合言葉は廃止）
- 採用すると `kana/extra` に入り、全員の辞書に反映される（次回ページ読み込み時）

### Firebase 側の設定（1回だけ）

1. Authentication → Sign-in method → **Google** を有効にする
2. Authentication → Settings → **承認済みドメイン** に `kiox999.github.io` を追加
3. Realtime Database → ルール の `kana` を以下にする（`YOUR_EMAIL` を管理人の Gmail に置き換える）

```json
"kana": {
  "rooms":     { ".read": true, "$code": { ".write": true } },
  "proposals": { ".read": true, "$id": { ".write": "!data.exists() || (auth != null && auth.token.email === 'YOUR_EMAIL')" } },
  "extra":     { ".read": true, ".write": "auth != null && auth.token.email === 'YOUR_EMAIL'" }
}
```

これで `extra`（採用語）と申請の状態変更は管理人だけ、申請の新規作成は誰でも、対戦部屋は誰でも、になる。
