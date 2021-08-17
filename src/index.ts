import axios from "axios"
import path from "path"
import { save } from "./save"
import { getList, BaseInfo, getMarkdown, DetailInfo } from "./yuque"

export interface Toc extends BaseInfo {
  body?: string,
  children?: Toc[],
  path: string
}

export type Config = {
  token: String,
  namespace: String
}

const copy = <T> (data: T): T => JSON.parse(JSON.stringify(data))

function genTocs(data: Toc[]): Toc[] {
  const tocs: Toc[] = []
  data.map(a => {
    if (a.visible === 1) {
      if (a.parent_uuid === "") {
        tocs.push(a)
      } else {
        const parent = data.find(item => item.uuid === a.parent_uuid)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(a)
        }
      }
    }
  })
  return tocs
}

export async function download (namespace: string, token: string) {
  console.log("start");
  const originToc = await getList(namespace, token) as Toc[];
  console.log("get origin toc success")

  const imgs = []

  const ajaxs: Promise<DetailInfo | null>[] = originToc.map(toc => {
    if (toc.slug === "#" || !toc.slug) {
      return new Promise((r) => r(null))
    } else {
      return getMarkdown(namespace, toc.slug, token)
    }
  })
  const details = await Promise.all(ajaxs)
  details.map(item => {
    if (item) {
      const t = originToc.find(a => a.slug === item.slug)
      if (t) {
        t.body = `---\ntitle: ${item.title}\nsidebar: auto\n---\n${item.body}`
        t.body = handleImg(t.body)
      }
    }
  })
  console.log("get markdown success")


  //download images
  for (let i = 0; i < images.length; i++) {
    const url = images[i]
    await downloadImages(url)
  }
  console.log("save image success")

  /* 保存文件 */
  for (let i = 0; i < originToc.length; i++) {
    const item = originToc[i];
    const dir = []
    let start: Toc | undefined = item
    while (start && start.parent_uuid) {
      const parent = originToc.find(toc => toc.uuid === (start as Toc).parent_uuid && toc.type !== "TITLE")
      parent && dir.unshift(parent.uuid)
      start = parent 
    }
    if (item.body) {
      if (item.child_uuid) {
        dir.push(item.uuid)
        item.path = path.join("/views/", dir.join("/")).replace(/\\/g, "/")
        await save("/views/" + dir.join("/"), 'README.md', item.body as string)
      } else if (item.slug !== "#") {
        item.path = path.join("/views/", dir.join("/"), "/" + item.slug).replace(/\\/g, "/")
        await save("/views/" + dir.join("/"), item.slug + '.md', item.body as string)
      } 
    }
  }
  console.log("save success")

  /* 保存文件结束 */
  const tocs = genTocs(copy(originToc))
  await save("/views/", "data.json", JSON.stringify({
    originToc,
    tocs
  }, undefined, 4))
  console.log("gen toc success")
}



const images : URL[] = []
function handleImg(body: string) :string {
  const img: URL[] = []
  body = body.replace(/!\[.*\]\((.*)\)/gm, (match, url, offset, originString: string) => {
    const imgSrc = new URL(url)
    const names = imgSrc.pathname.split("/")
    const name = names[names.length - 1]
    if (/svg|png|jpeg|jpg/.test(url)) {
      images.push(imgSrc)
      console.log(match, match.replace(url, `/views/assert/${name}`))
      return match.replace(url, `/views/assert/${name}`)
    } else {
      return match
    }
  })
  return body
}

async function downloadImages(url :URL) {
  const res = await axios({
    method: "GET",
    url: url.href,
    responseType: "arraybuffer"
  })
  const names = url.pathname.split("/")
  const name = names[names.length - 1]
  await save("/views/assert", name , res.data)
}
