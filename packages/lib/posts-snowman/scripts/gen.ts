import { pipe } from "fp-ts/lib/function";
import * as Glob from "glob";
import * as Path from "path";
import * as Fs from "fs";
import { cons } from "fp-ts/lib/ReadonlyArray";

const mdxToSrc = (mdx: string): string => {
  const regexp = /```tsx\n((.|[\n\r])*?)```/g;
  const matches = mdx.matchAll(regexp);

  let src = "";
  for (const match of matches) {
    src = src + match[1] + "\n";
  }

  return src;
};

export default () => {
  const srcPath = "./src/prose";
  const targetPath = "./src/gen";

  Fs.rmdirSync(targetPath, { recursive: true });

  const paths = Glob.sync(Path.join(srcPath, "**/*.mdx"));

  for (const path of paths) {
    const dir = pipe(Path.relative(srcPath, path), (_) =>
      Path.join(targetPath, Path.parse(_).dir)
    );

    const name = Path.parse(path).name;

    const mdx = Fs.readFileSync(path).toString();

    Fs.mkdirSync(dir, { recursive: true });

    const src = mdxToSrc(mdx);

    if (src === "") continue;

    Fs.writeFileSync(Path.format({ dir, ext: ".tsx", name }), src);
  }
};
