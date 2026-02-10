import fs from "fs/promises";
import path from "path";
export const CACHE_FILE = "icons.json";
let iconList = [];
const JSdelivr_API = "https://data.jsdelivr.com/v1/package/npm/@mdi/svg";
/**
 * 获取图标列表
 */
export function getIconList() {
    return iconList;
}
/**
 * 加载图标缓存（版本号优先策略）
 */
export async function loadIconCache() {
    const cachePath = path.resolve(CACHE_FILE);
    // 1. 获取远程最新版本号
    let latestVersion;
    try {
        const versionRes = await fetch(JSdelivr_API);
        if (!versionRes.ok) {
            throw new Error(`Version fetch failed: ${versionRes.status}`);
        }
        const versionData = (await versionRes.json());
        latestVersion = versionData.tags?.latest || "7.4.47";
    }
    catch (err) {
        console.error("[MDI] Failed to fetch version:", err);
        return;
    }
    // 2. 尝试读取本地缓存
    try {
        const cachedData = await fs.readFile(cachePath, "utf-8");
        const cached = JSON.parse(cachedData);
        // 版本号无变化，使用缓存
        if (cached.version === latestVersion) {
            iconList = cached.icons;
            console.error(`[MDI] Cache up to date (${cached.version}), ${iconList.length} icons`);
            return;
        }
        console.error(`[MDI] Version changed: ${cached.version} → ${latestVersion}, refreshing...`);
    }
    catch {
        console.error("[MDI] No cache found, fetching from API...");
    }
    // 3. 刷新缓存
    await refreshIconCache(latestVersion);
}
/**
 * 刷新图标缓存
 */
async function refreshIconCache(version) {
    console.error(`[MDI] Fetching icons from jsDelivr (${version})...`);
    const res = await fetch(`${JSdelivr_API}@${version}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch from jsDelivr: ${res.status}`);
    }
    const data = (await res.json());
    // 查找 svg 目录（可能直接在根目录，也可能在某个目录下）
    let svgFiles = [];
    // 情况1: svg 文件直接在根目录
    svgFiles = data.files.filter((f) => f.name.endsWith(".svg"));
    // 情况2: svg 在子目录中
    if (svgFiles.length === 0) {
        const svgDir = data.files.find((f) => f.name === "svg");
        if (svgDir?.files) {
            svgFiles = svgDir.files.filter((f) => f.name.endsWith(".svg"));
        }
    }
    iconList = svgFiles.map((f) => ({
        name: f.name.replace(".svg", ""),
        url: `https://cdn.jsdelivr.net/npm/@mdi/svg@${version}/svg/${f.name}`
    }));
    // 保存缓存
    const cache = {
        version,
        updatedAt: new Date().toISOString(),
        icons: iconList
    };
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
    console.error(`[MDI] Cached ${iconList.length} icons (${cache.version})`);
}
//# sourceMappingURL=cache.js.map