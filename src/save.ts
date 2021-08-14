import path from "path"
import fs from "fs"
import fsp from "fs/promises"


/**
 * 根据给出路径与文件名存储文件
 * @param _path 路径
 * @param name 文件名
 * @param content 文件内容
 */
export async function save (_path: string, name: string, content: string) {
  const dir = path.join(".", _path);
  if (!fs.existsSync(dir)) {
    await fsp.mkdir(dir, { recursive: true })
  }
  return fsp.writeFile(path.join(".", _path, name), content)
}
