# git-blame-format

```bash
npx git-blame-format src/blame-file.ts::BlameLineInfo
```

Output:

```
/home/user/gbf/src/blame-file.ts:10     Jason   b68dd81 export interface BlameLineInfo {
/home/user/gbf/src/blame-file.ts:11     Jason   b68dd81   file: string;
/home/user/gbf/src/blame-file.ts:12     Jason   b68dd81   hash: string;
/home/user/gbf/src/blame-file.ts:13     Jason   b68dd81   sourceLine: number;
/home/user/gbf/src/blame-file.ts:14     Jason   b68dd81   resultLine: number;
/home/user/gbf/src/blame-file.ts:15     Jason   b68dd81   numberOfLines?: number;
/home/user/gbf/src/blame-file.ts:16     Jason   b68dd81   info: Record<string, string>;
/home/user/gbf/src/blame-file.ts:17     Jason   b68dd81   sourceContent: string;
/home/user/gbf/src/blame-file.ts:18     Jason   b68dd81 }
/home/user/gbf/src/blame-file.ts:19     Jason   b68dd81
```
