import { it } from "mocha"
import { save } from "./save"

describe("save", () => {
  it("可正确递归保存文件",async () => {
    const path = "/save/deve/a/d"
    const name = "markdown.md"
    const text = "Hello!"
    await save(path, name, text)
  })
})
