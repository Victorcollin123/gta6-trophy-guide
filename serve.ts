// serve.ts — a tiny static server for the guide.
//
// Serves app/ at http://localhost:8080 so the guide can be tried in a
// desktop browser. Node standard library only; run it with `node serve.ts`.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(join(fileURLToPath(new URL(".", import.meta.url)), "app"));
const port = 8080;

const mediaTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

// Maps a file extension to the content type the browser needs to render it
// correctly. Unknown extensions fall back to a generic binary type so the
// browser downloads them instead of guessing — guessing once served a JSON
// file as HTML in an earlier draft of this server.
function contentTypeFor(filePath: string): string {
  return mediaTypes[extname(filePath)] ?? "application/octet-stream";
}

const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  const target = resolve(join(appRoot, path === "/" ? "index.html" : path));
  if (!target.startsWith(appRoot) || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("not found\n");
    return;
  }
  response.writeHead(200, { "content-type": contentTypeFor(target) });
  createReadStream(target).pipe(response);
});

server.listen(port, () => {
  console.log(`Leonida Trophy Guide serving app/ at http://localhost:${port}`);
});
