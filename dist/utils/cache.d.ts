export declare const CACHE_FILE = "icons.json";
export interface IconInfo {
    name: string;
    url: string;
}
export interface IconCache {
    version: string;
    updatedAt: string;
    icons: IconInfo[];
}
/**
 * 获取图标列表
 */
export declare function getIconList(): IconInfo[];
/**
 * 加载图标缓存（版本号优先策略）
 */
export declare function loadIconCache(): Promise<void>;
//# sourceMappingURL=cache.d.ts.map