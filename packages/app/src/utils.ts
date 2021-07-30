export function exec(path, result) {
  const out = new URLSearchParams();
  const matches = result.pattern.exec(path);
  let i = 0;
  while (i < result.keys.length) {
    out.set(result.keys[i], matches[++i] || null);
  }
  return out;
}
