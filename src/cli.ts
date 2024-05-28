import { resolve } from 'path';

import { program } from 'commander';

import { blame } from './blame';
import { format } from './format';

interface CliOptions {
  format: string;
}

program
  .argument('<files...>', 'Files to blame', (file, prev: string[] = []) => [
    ...prev,
    resolve(file),
  ])
  .option(
    '-f, --format [format]',
    'Specifies the format for blame info.',
    '[file]:[resultLine]\t[info.author]\t[hash:7]\t[sourceContent]',
  )
  .action(async (files: string[], options: CliOptions) => {
    const res = await blame(
      files.map((file) => {
        const sepIndex = file.indexOf(':');
        if (sepIndex < 0) {
          return { file };
        }
        return {
          file: file.slice(0, sepIndex),
          range: file.slice(sepIndex + 1),
        };
      }),
    );
    for (const item of res) {
      console.log(format(options.format, item));
    }
  });

program.parse();
