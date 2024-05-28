import { BlameLineInfo } from './blame-file';

export function format(template: string, info: BlameLineInfo) {
  const data: Record<string, unknown> = {
    tab: '\t',
    newline: '\n',
    file: info.file,
    hash: info.hash,
    sourceLine: info.sourceLine,
    resultLine: info.resultLine,
    numberOfLines: info.numberOfLines,
    sourceContent: info.sourceContent,
  };
  for (const [key, value] of Object.entries(info.info)) {
    data[`info.${key}`] = value;
  }
  return template.replace(/\[([^\]]+)\]/g, (match, raw) => {
    const [key, limit] = raw.split(':');
    let value = String(data[key] || '');
    if (limit) {
      value = value.slice(0, limit);
    }
    return value;
  });
}
