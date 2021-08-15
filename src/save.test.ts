import { it } from "mocha"
import { save } from "./save"
import fsp from 'fs/promises'
import { expect } from "chai"

describe("save", () => {
  it("可正确递归保存文件",async () => {
    const _path = "/_test/deve/a/d"
    const name = "markdown.md"
    const text = "Hello!"
    await save(_path, name, text)
    const $path = "./_test/deve/a/d/markdown.md"
    const stat = await fsp.stat($path)
    expect(stat.isFile()).eq(true)
    const b = await fsp.readFile($path)
    expect(b.toString("utf8")).to.eq(text)

    const name1 = "markdown1.md"
    const text1 = "Hello1!"
    await save(_path, name1, text1)
    const $path1 = "./_test/deve/a/d/markdown1.md"
    const stat1 = await fsp.stat($path1)
    expect(stat1.isFile()).eq(true)
    const b1 = await fsp.readFile($path1)
    expect(b1.toString("utf8")).to.eq(text1)
  })


  after (async () => {
    await fsp.rm("./_test", { recursive: true, force: true })
  })
})
