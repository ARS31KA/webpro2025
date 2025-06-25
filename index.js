// Node.js の標準ライブラリである 'node:http' と 'node:url' をインポートします。
// 'node:http' はHTTPサーバーを構築するために使います。
// 'node:url' はURLを解析するために使います。
import * as http from "node:http";
import * as url from "node:url";

// サーバーがリッスンするポート番号を設定します。
// 環境変数 'PORT' が設定されていればその値を使用し、設定されていなければデフォルトで8888を使用します。
const PORT = process.env.PORT || 8888;

// HTTPサーバーを作成します。
// リクエスト（クライアントからの要求）とレスポンス（サーバーからの応答）を引数に取る関数を渡します。
const server = http.createServer((req, res) => {
  // レスポンスヘッダーを設定します。
  // ステータスコード200 (OK) と、コンテンツタイプを 'text/plain; charset=utf-8' に指定します。
  // これにより、ブラウザにUTF-8エンコーディングのプレーンテキストであることを伝えます。
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // リクエストのURLを解析します。
  // URLオブジェクトはグローバルに利用できるので、importは不要です。
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname; // パス名（例: '/', '/ask'）
  const query = parsedUrl.searchParams; // クエリパラメータ（例: '?q=my+question' の 'q'）

  // どこが実行されたかを確認するためにコンソールにログを出力します。
  console.log(`Request received for: ${req.url}`);

  // パス名に基づいて異なる応答を返します。
  if (pathname === "/") {
    // ルートパス '/' にアクセスした場合
    console.log("Accessing root path"); // どこが実行されたか確認
    res.writeHead(200); // ステータスコードを確定
    res.end("こんにちは！"); // 応答を送信して接続を閉じます
  } else if (pathname === "/ask") {
    // '/ask' パスにアクセスした場合
    console.log("Accessing ask path"); // どこが実行されたか確認
    const question = query.get("q"); // クエリパラメータ 'q' の値を取得します
    if (question) {
      // 質問があればその内容を返します
      console.log(`Question received: ${question}`); // どこが実行されたか確認
      res.writeHead(200); // ステータスコードを確定
      res.end(`Your question is '${decodeURIComponent(question)}'`);
    } else {
      // 質問がない場合はエラーメッセージを返します
      console.log("No question parameter provided"); // どこが実行されたか確認
      res.writeHead(400); // Bad Request
      res.end("質問が指定されていません。例: /ask?q=あなたの質問");
    }
  } else {
    // それ以外のパスにアクセスした場合
    console.log("Accessing unknown path"); // どこが実行されたか確認
    res.writeHead(404); // Not Found
    res.end("ページが見つかりません。");
  }
});

// 指定されたポートでサーバーを起動します。
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
