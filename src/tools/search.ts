import { getIconList } from "../utils/cache.js";

/**
 * 执行搜索
 */
export async function searchIcons(keyword: string, limit: number = 100): Promise<{ icons: string[] }> {
  const iconList = getIconList();
  const lower = keyword.toLowerCase();

  const results = iconList
    .filter((icon) => icon.name.toLowerCase().includes(lower))
    .slice(0, limit)
    .map((icon) => icon.name);

  return { icons: results };
}
