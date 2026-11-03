# かなつなぎ

4×4のひらがな盤面をなぞって言葉を作る、120秒のワードゲーム。
日替わり（メダル・カレンダー）、フリー、チュートリアル、みんなで対戦。

## 公開手順（GitHub Pages）

1. このフォルダの `index.html` と `README.md` をリポジトリ直下に置く
2. リポジトリの Settings → Pages → Branch を `main` / `(root)` にして保存
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で開ける

## 対戦を動かす（Firebase Realtime Database）

1. Firebase コンソールでプロジェクトを開く（既存の `crane-s-voice` でも可）
2. 「プロジェクトの設定 → マイアプリ → ウェブアプリ」の `firebaseConfig` を `index.html` の `window.KT_FIREBASE_CONFIG = {...}` に貼る
3. Realtime Database → ルール に以下を追加（`kana` 以下だけ読み書き可）

```json
{
  "rules": {
    "kana": { ".read": true, ".write": true }
  }
}
```

（既に `tsuru` などのルールがある場合は `"kana": {...}` を並べて追加する）

設定を貼らなければ、対戦以外のモードはそのまま遊べる。

## 辞書について

語彙は JMdict（EDRDG）を加工して同梱している。
JMdict は Creative Commons Attribution-ShareAlike 4.0 ライセンス。
https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
