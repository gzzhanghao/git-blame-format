import { spawn } from 'node:child_process';
import { dirname } from 'node:path';
import { createInterface } from 'node:readline';

export interface BlameOptions {
  file: string;
  range?: string | string[];
}

export interface BlameLineInfo {
  file: string;
  hash: string;
  sourceLine: number;
  resultLine: number;
  numberOfLines?: number;
  info: Record<string, string>;
  sourceContent: string;
}

const HEAD_REGEX =
  /^(?<hash>[a-f0-9]{40})\s(?<sourceLine>\d+)\s(?<resultLine>\d+)(\s(?<numberOfLines>\d+))?$/;

const INFO_REGEX = /^(?<token>.+?)\s(?<data>.+)$/;

export async function blameFile(options: BlameOptions) {
  const args = ['--no-pager', 'blame', '--line-porcelain'];
  for (const range of options.range || []) {
    args.push('-L', range);
  }
  args.push('--', options.file);

  const git = spawn('git', args, {
    windowsHide: true,
    cwd: dirname(options.file),
  });

  const readline = createInterface({ input: git.stdout });

  let currentLine: BlameLineInfo | undefined;
  const lines: BlameLineInfo[] = [];

  for await (const line of readline) {
    const parsedLine = line.match(HEAD_REGEX);
    if (parsedLine?.groups) {
      currentLine = {
        file: options.file,
        hash: parsedLine.groups.hash,
        sourceLine: Number(parsedLine.groups.sourceLine),
        resultLine: Number(parsedLine.groups.resultLine),
        numberOfLines: parsedLine.groups.numberOfLines
          ? Number(parsedLine.groups.numberOfLines)
          : undefined,
        info: {},
        sourceContent: '',
      };
      lines.push(currentLine);
      continue;
    }
    if (!currentLine) {
      continue;
    }
    if (line[0] === '\t') {
      currentLine.sourceContent = line.slice(1);
      continue;
    }
    const commitInfo = line.match(INFO_REGEX);
    if (commitInfo?.groups) {
      currentLine.info[commitInfo.groups.token] = commitInfo.groups.data;
    }
  }

  return lines;
}
