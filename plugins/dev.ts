import { ViteDevServer } from "vite";

export const devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      // electron的内置模块是通过CJS Module的形式导出 ,使用esbuild进行转换
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      });
      // 通过vite的httpServer的listening事件来启动electron
      server.httpServer?.once("listening", () => {
        const { spawn } = require("child_process");
        const addressInfo = server.httpServer?.address() as any;
        // 端口，地址都为vite默认的5173
        const httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
        // dist目录下写入进程
        const electronProcess = spawn(
          require("electron").toString(),
          ["./dist/mainEntry.js", httpAddress],
          {
            cwd: process.cwd(),
            stdio: "inherit",
          }
        );
        // electron进程关闭时，关闭vite的httpServer
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};
/**
 * @description 处理 vite-plugin-optimizer 转换模块列表
 * 后续新增模块通过修改该函数实现
 * 会参与运行时和编译时
 * @returns result
 */
export const getReplacer = () => {
  const externalModels = [
    "os",
    "fs",
    "http",
    "path",
    "events",
    "child_process",
    "crypto",
    "http",
    "buffer",
    "url",
    "better-sqlite3",
    "knex",
  ];
  let result = {};
  for (const item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  result["electron"] = () => {
    let electronModules = [
      "clipboard",
      "ipcRenderer",
      "nativeImage",
      "shell",
      "webFrame",
    ].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};
