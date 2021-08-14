import axios from "axios";

const http = axios.create({
  baseURL: "https://www.yuque.com/api/v2",
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.TOKEN,
  },
});

export type BaseInfo = {
  id: Number;
  slug: String;
  title: String;
  description: String;
  user_id: Number;
  book_id: Number;
  format: String;
  public: Number;
  status: Number;
  view_status: Number;
  read_status: Number;
  likes_count: Number;
  comments_count: Number;
  content_updated_at: String;
  created_at: String;
  updated_at: String;
  published_at: String;
  first_published_at: String;
  draft_version: Number;
  last_editor_id: Number;
  word_count: Number;
  cover: any;
  custom_description: any;
  last_editor: {
    id: Number;
    type: String;
    login: String;
    name: String;
    description: String | null;
    avatar_url: String;
    followers_count: Number;
    following_count: Number;
    created_at: String;
    updated_at: String;
    _serializer: String;
  };
  book: null | String;
  _serializer: String;
};


export type DetailInfo = {
  id: number; //- 文档编号
  slug: string; // - 文档路径
  title: string; // - 标题
  book_id: number; // - 仓库编号，就是 repo_id
  book: Object; // - 仓库信息 <BookSerializer>，就是 repo 信息
  user_id: number; // - 用户/团队编号
  user: Object; // - 用户/团队信息 <UserSerializer>
  format: "lake" | "markdown"; // - 描述了正文的格式 [lake , markdown]
  body: string; // - 正文 Markdown 源代码
  body_draft: string; // - 草稿 Markdown 源代码
  body_html: string; // - 转换过后的正文 HTML （重大变更，详情请参考：https://www.yuque.com/yuque/developer/yr938f）
  body_lake: string; // - 语雀 lake 格式的文档内容
  creator_id: number; //- 文档创建人 User Id
  public: number; // - 公开级别 [0 - 私密, 1 - 公开]
  status: number; // - 状态 [0 - 草稿, 1 - 发布]
  likes_count: number; // - 赞数量
  comments_count: number; // - 评论数量
  content_updated_at: string; // - 文档内容更新时间
  deleted_at: string; // - 删除时间，未删除为 null
  created_at: string; // - 创建时间
  updated_at: string; // - 更新时间
};

/**
 * 获取文章列表
 * @param namespace 命名空间
 * @returns 文章列表
 */
export async function getList(namespace: String): Promise<BaseInfo[]> {
  const data = await http.get(`repos/${namespace}/docs`);
  return data.data.data;
}

/**
 * 根据ID获取MarkDown形式的字符串
 * @param id 文章ID
 * @returns 文章Markdown形式字符串
 */
export async function getMarkdown(
  namespace: String,
  slug: String
): Promise<DetailInfo> {
  const data = await http.get(`/repos/${namespace}/docs/${slug}`);
  return data.data.data as DetailInfo;
}
