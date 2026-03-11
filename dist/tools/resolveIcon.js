import { getIconList } from "../utils/cache.js";
/**
 * 根据关键词返回所有包含该词的 icon name（kebab-case）
 * AI 从返回列表中自行挑选最匹配语义的那个名称使用
 */
export async function resolveIcon(keyword, limit = 200) {
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
//# sourceMappingURL=resolveIcon.js.map