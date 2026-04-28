import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const host = process.env.HOST ?? "127.0.0.1";
const requestedPort = Number(process.env.PORT ?? getArgValue("--port") ?? 4173);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"]
]);

for (let port = requestedPort; port < requestedPort + 20; port += 1) {
  const server = createStaticServer();
  const started = await listen(server, port);
  if (started) {
    console.log(`Local game server: http://${host}:${port}`);
    break;
  }
}

function createStaticServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
      const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
      const target = normalize(join(root, decodeURIComponent(pathname)));

      if (relative(root, target).startsWith("..")) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const info = await stat(target);
      const filePath = info.isDirectory() ? join(target, "index.html") : target;
      const body = await readFile(filePath);
      response.writeHead(200, {
        "content-type": mimeTypes.get(extname(filePath)) ?? "application/octet-stream"
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
}

function listen(server, port) {
  return new Promise((resolve) => {
    server.once("error", () => resolve(false));
    server.listen(port, host, () => resolve(true));
  });
}

function getArgValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}
