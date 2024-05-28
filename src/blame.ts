import { BlameOptions, blameFile } from './blame-file';

export async function blame(target: BlameOptions | BlameOptions[]) {
  if (!Array.isArray(target)) {
    return blameFile(target);
  }
  const grouped = new Map<string, Array<string | string[] | undefined>>();
  for (const item of target) {
    if (!grouped.has(item.file)) {
      grouped.set(item.file, []);
    }
    grouped.get(item.file)!.push(item.range);
  }
  const blameList: BlameOptions[] = [];
  for (const [file, ranges] of Array.from(grouped.entries())) {
    if (ranges.some((range) => !range)) {
      blameList.push({ file });
      continue;
    }
    blameList.push({
      file,
      range: ranges.flatMap((range) => range || []),
    });
  }
  const res = await Promise.all(blameList.map(blameFile));
  return res.flat();
}
