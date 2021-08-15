import { save } from "./save"
import { getList } from "./yuque"

require("custom-env").env()

export type Config = {
  token: String,
  namespace: String
}

const namespace = process.env.NAME_SPACE as string

async function app() {
  // 获取文章列表
  const data =  await getList(namespace)
  console.log(data)
  const s = JSON.stringify(data, undefined, 4)
  await save(".", "s.json", s)
  // 根据文章列表梳理数据

}

app()
