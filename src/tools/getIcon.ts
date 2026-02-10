/**
 * 获取图标 SVG
 */
export async function getIcon(
  name: string,
  size: number = 24,
  color: string = "currentColor"
): Promise<{ svg: string; name: string } | { error: string }> {
  const url = `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${name}.svg`;

  const res = await fetch(url);
  if (!res.ok) {
    return { error: `Icon '${name}' not found` };
  }

  const svg = await res.text();

  // 修改 SVG 属性
  const modified = svg
    .replace(/width="\d+"/, `width="${size}"`)
    .replace(/height="\d+"/, `height="${size}"`)
    .replace(/fill="[^"]*"/, `fill="${color}"`);

  return { svg: modified, name };
}
