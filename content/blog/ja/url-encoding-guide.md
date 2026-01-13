# URLエンコーディングガイド：知っておくべきすべて

URLエンコーディング（パーセントエンコーディングとも呼ばれる）は、Web開発に不可欠です。このガイドでは、URLにエンコーディングが必要な理由、その仕組み、避けるべき一般的な落とし穴を説明します。

## URLエンコーディングが存在する理由

URLはASCII文字セットの限られた文字のみを含むことができます。URLに特殊文字、スペース、または非ASCII文字を含める必要がある場合、エンコードする必要があります。

### 予約文字

これらの文字はURLで特別な意味を持ちます：

| 文字 | 用途 | エンコード |
|------|------|------------|
| : | プロトコル区切り | %3A |
| / | パス区切り | %2F |
| ? | クエリ文字列開始 | %3F |
| # | フラグメント識別子 | %23 |
| & | パラメータ区切り | %26 |
| = | キー値区切り | %3D |

### 安全でない文字

これらの文字は常にエンコードする必要があります：

| 文字 | エンコード | 理由 |
|------|------------|------|
| スペース | %20 または + | URLで許可されない |
| " | %22 | 区切り文字 |
| < | %3C | 安全でない |
| > | %3E | 安全でない |

## URLエンコーディングの仕組み

URLエンコーディングは、文字をパーセント記号が前に付いた16進数ASCII値に変換します：

```
文字 → ASCIIコード → 16進数値 → %16進数値

スペース → 32 → 20 → %20
! → 33 → 21 → %21
@ → 64 → 40 → %40
```


### 非ASCII文字のエンコーディング

非ASCII文字（中国語、アラビア語、絵文字など）は、まずUTF-8バイトに変換され、次に各バイトがパーセントエンコードされます：

```
中 → UTF-8: E4 B8 AD → %E4%B8%AD
🎉 → UTF-8: F0 9F 8E 89 → %F0%9F%8E%89
```

## JavaScriptエンコーディング関数

### encodeURI vs encodeURIComponent

```javascript
const url = 'https://example.com/path?name=John Doe&city=東京';

// encodeURI - 完全なURLをエンコード、URL構造を保持
encodeURI(url);

// encodeURIComponent - すべてをエンコード、URLパーツ用
encodeURIComponent(url);
```

### 使い分け

| 関数 | 使用例 |
|------|--------|
| `encodeURI` | 完全なURLのエンコード |
| `encodeURIComponent` | URLパラメータのエンコード |
| `URLSearchParams` | クエリ文字列の構築 |

## よくある間違い

### 1. 二重エンコーディング

```javascript
// 間違い - 2回エンコード
const param = encodeURIComponent('hello world');
const url = encodeURI(`https://example.com?q=${param}`);

// 正しい
const url = `https://example.com?q=${encodeURIComponent('hello world')}`;
```

### 2. ユーザー入力をエンコードしない

```javascript
// 危険 - XSS脆弱性
const url = `https://example.com/search?q=${userInput}`;

// 安全
const url = `https://example.com/search?q=${encodeURIComponent(userInput)}`;
```

## ベストプラクティス

1. **URLに含める前に常にユーザー入力をエンコード**
2. **クエリパラメータには`encodeURIComponent`を使用**
3. **完全なURLにのみ`encodeURI`を使用**
4. **クエリ文字列の構築には`URLSearchParams`を優先**
5. **処理前にサーバーでデコード**

## 結論

URLエンコーディングは、すべての開発者が理解すべき基本的なWeb概念です。適切なエンコーディングはバグやセキュリティ脆弱性を防ぎ、アプリケーションが国際文字で正しく動作することを保証します。
