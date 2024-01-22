// 自定义协议
import { protocol } from "electron";
import fs from "fs";
import path from "path";
// 自定义app协议
const schemeConfig = {
  standard: true,// 是否标准协议
  supportFetchAPI: true,// 是否支持fetch api
  bypassCSP: true,// 是否绕过内容安全策略
  corsEnabled: true,// 是否允许跨域
  stream: true,// 是否流式传输
};
// 绕过内容安全策略
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: schemeConfig },
]);

export class CustomScheme {
  private static getMimeType(ext: string): string {
    switch (ext) {
      case ".js":
        return "text/javascript";
      case ".css":
        return "text/css";
      case ".html":
        return "text/html";
      case ".png":
        return "image/png";
      case ".jpg":
        return "image/jpg";
      case ".gif":
        return "image/gif";
      case ".svg":
        return "image/svg+xml";
      default:
        return "text/plain";
    }
  }

  // 注册自定义协议
  static registerScheme() {
    protocol.handle("app", (request) => {
      let { pathname: pathName } = new URL(request.url);
      // 读取文件
      let extension = path.extname(pathName).toLocaleLowerCase();
      if (extension === "") {
        pathName = "/index.html";
        extension = ".html";
      }
      // 读取文件
      const tarFile = path.join(__dirname, pathName);

      return new Response(fs.readFileSync(tarFile), {
        status: 200,
        headers: { "content-type": this.getMimeType(extension) },
      });
    });
  }
}
