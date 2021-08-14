require("custom-env").env("test")
import { expect, assert } from "chai"
import { getList, getMarkdown } from "./yuque"




describe("yuque", () => {
  it("getList: 可以获取正确的文章列表", async () => {
    const namespace = process.env.NAME_SPACE as string
    const data = await getList(namespace)
    expect(data).be.length.gt(0)
    data.forEach((item) => {
      assert.typeOf(item.slug, "string", "slug must being string")
    })

    let arr = []

    // 可以获取文章详情
    for(let i = 0; i < 3 || i < data.length; i ++) {
      arr.push(getMarkdown(namespace, data[i].slug))
    }

    const markdowns = await Promise.all(arr);

    markdowns.map(item => {
      assert.exists(item.body)
    })

  })
})
