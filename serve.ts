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

const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  const target = resolve(join(appRoot, path === "/" ? "index.html" : path));
  if (!target.startsWith(appRoot) || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("not found\n");
    return;
  }
  response.writeHead(200, { "content-type": mediaTypes[extname(target)] ?? "application/octet-stream" });
  createReadStream(target).pipe(response);
});

server.listen(port, () => {
  console.log(`Leonida Trophy Guide serving app/ at http://localhost:${port}`);
});
