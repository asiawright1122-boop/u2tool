# JWT トークン完全解説：JSON Web Token ガイド

JSON Web Token（JWT）は、安全な認証と情報交換のための業界標準です。このガイドでは、JWTの構造、仕組み、セキュリティのベストプラクティス、実装のヒントを解説します。

## JWT とは？

JWT（JSON Web Token）は、当事者間で情報をJSONオブジェクトとして安全に送信するためのオープン標準（RFC 7519）です。JWTの特徴：

- **コンパクト**：小さいサイズ、URLやHTTPヘッダーに適している
- **自己完結型**：必要なユーザー情報をすべて含む
- **検証可能**：デジタル署名で整合性を保証

## JWT の構造

JWTは、ドットで区切られた3つの部分で構成されます：

```
xxxxx.yyyyy.zzzzz
ヘッダー.ペイロード.署名
```

### 1. ヘッダー

トークンタイプと署名アルゴリズムを含む：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

一般的なアルゴリズム：
- **HS256**：SHA-256を使用したHMAC（対称）
- **RS256**：SHA-256を使用したRSA（非対称）
- **ES256**：SHA-256を使用したECDSA（非対称）

### 2. ペイロード

クレーム（ユーザーに関する記述）を含む：

```json
{
  "sub": "1234567890",
  "name": "山田太郎",
  "email": "taro@example.com",
  "iat": 1516239022,
  "exp": 1516242622
}
```

#### 標準クレーム

| クレーム | 名前 | 説明 |
|----------|------|------|
| `iss` | 発行者 | トークンを発行した人 |
| `sub` | 主題 | ユーザー識別子 |
| `aud` | 対象者 | 意図された受信者 |
| `exp` | 有効期限 | トークンの有効期限 |
| `nbf` | 有効開始 | トークンが有効になる時刻 |
| `iat` | 発行時刻 | トークンが発行された時刻 |
| `jti` | JWT ID | 一意のトークン識別子 |

### 3. 署名

トークンが改ざんされていないことを保証：

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## JWT 認証の仕組み

### 1. ユーザーログイン

```
クライアント                      サーバー
  |                               |
  |-- POST /login (認証情報) ---->|
  |                               |
  |<---- JWT トークン ------------|
  |                               |
```

### 2. 保護されたリソースへのアクセス

```
クライアント                      サーバー
  |                               |
  |-- GET /api/data ------------->|
  |   Authorization: Bearer JWT   |
  |                               |
  |<---- 保護されたデータ --------|
  |                               |
```

## セキュリティのベストプラクティス

### 1. 強力なシークレットを使用

HS256の場合、少なくとも256ビットのランダムシークレットを使用：

```javascript
// 悪い例
const secret = "mysecret";

// 良い例
const secret = crypto.randomBytes(32).toString('hex');
```

### 2. 適切な有効期限を設定

短命のトークンでリスクを軽減：

```javascript
const token = jwt.sign(payload, secret, {
  expiresIn: '15m'  // アクセストークンは15分
});
```

### 3. HTTPSのみを使用

傍受を防ぐため、常にHTTPS経由でJWTを送信。

### 4. 機密データを保存しない

JWTペイロードはBase64エンコードされているだけで、暗号化されていない：

```javascript
// 悪い例 - ペイロードに機密データ
{
  "password": "secret123",
  "creditCard": "1234-5678-9012-3456"
}

// 良い例 - 必要な識別子のみ
{
  "sub": "user123",
  "role": "admin"
}
```

### 5. リフレッシュトークンを使用

より良いセキュリティのためにトークンリフレッシュを実装：

```
アクセストークン：短命（15分）
リフレッシュトークン：長命（7日）、安全に保存
```

## JWT のデコード

### U2Tool JWT デコーダーの使用

[U2Tool JWT デコーダー](https://www.u2tool.com/ja/tools/jwt-decoder)の特徴：

- ✅ 即座にJWTをデコード
- ✅ ヘッダーとペイロードの可視化
- ✅ 有効期限の表示
- ✅ クレームの説明
- ✅ サーバーにデータを送信しない

### 使い方

1. [JWT デコーダー](https://www.u2tool.com/ja/tools/jwt-decoder)にアクセス
2. JWTトークンを貼り付け
3. デコードされたヘッダーとペイロードを確認
4. 有効期限やその他のクレームをチェック

## 実装例

### Node.js (jsonwebtoken)

```javascript
const jwt = require('jsonwebtoken');

// トークン作成
const token = jwt.sign(
  { userId: '123', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// トークン検証
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
} catch (err) {
  console.error('無効なトークン');
}
```

### Python (PyJWT)

```python
import jwt
from datetime import datetime, timedelta

# トークン作成
payload = {
    'user_id': '123',
    'exp': datetime.utcnow() + timedelta(hours=1)
}
token = jwt.encode(payload, 'secret', algorithm='HS256')

# トークン検証
try:
    decoded = jwt.decode(token, 'secret', algorithms=['HS256'])
    print(decoded)
except jwt.ExpiredSignatureError:
    print('トークンの有効期限切れ')
```

## FAQ

### シークレットなしでJWTをデコードできますか？

はい、ヘッダーとペイロードはBase64エンコードされているだけで、暗号化されていません。誰でもデコードして読むことができます。シークレットは署名の検証にのみ使用され、コンテンツの暗号化には使用されません。JWTペイロードに機密データを入れないでください。

### JWTを無効化するには？

JWTはステートレスなので、直接無効化できません。オプション：
- 短い有効期限
- トークンブラックリスト（サーバー側ストレージが必要）
- リフレッシュトークンのローテーション
- 署名シークレットの変更（すべてのトークンが無効になる）

### JWTはlocalStorageとCookieのどちらに保存すべき？

両方にトレードオフがあります：
- **localStorage**：XSS攻撃に脆弱
- **Cookie**：CSRF攻撃に脆弱（httpOnlyとSameSiteフラグを使用）

ほとんどのアプリケーションでは、適切なCSRF保護を備えたhttpOnly Cookieが推奨されます。

### JWTの有効期限が切れるとどうなる？

サーバーは401 Unauthorizedレスポンスでトークンを拒否します。クライアントは：
1. リフレッシュトークンを使用して新しいアクセストークンを取得
2. またはユーザーを再度ログインにリダイレクト

## まとめ

JWTは認証と認可のための強力なツールです。開発中にトークンを検査・デバッグするには[U2Tool JWT デコーダー](https://www.u2tool.com/ja/tools/jwt-decoder)を使用してください。ユーザーを保護するために、常にセキュリティのベストプラクティスに従ってください。

重要なポイント：
- トークンは短命に保つ
- ペイロードに機密データを保存しない
- 常に署名とクレームを検証
- すべてのトークン送信にHTTPSを使用
- 適切なトークンリフレッシュメカニズムを実装
