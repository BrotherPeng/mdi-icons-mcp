import { getIconList } from "../utils/cache.js";

export interface ResolveResult {
  /** 匹配到的所有 icon names（kebab-case，可直接用于 @mdi/js、Vuetify、Flutter 等框架） */
  names: string[];
  /** 本次查询共命中的数量 */
  total: number;
  [key: string]: unknown;
}

/**
 * 根据关键词返回所有包含该词的 icon name（kebab-case）
 * AI 从返回列表中自行挑选最匹配语义的那个名称使用
 */
export async function resolveIcon(
  keyword: string,
  limit: number = 200
): Promise<ResolveResult> {
  const iconList = getIconList();
  const lower = keyword.toLowerCase().trim();

  const matched = iconList
    .filter((icon) => icon.name.includes(lower))
    .map((icon) => icon.name);

  return {
    names: matched.slice(0, limit),
    total: matched.length
  };
}
