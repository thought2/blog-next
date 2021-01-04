import React, { FC, ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "./CodeBlock";

const components = {
  pre: (props: any) => <div {...props} />,
  code: CodeBlock,
};

const CustomMdxProvider: FC<{ children: ReactNode }> = (props) => (
  <MDXProvider components={components} {...props} />
);

export default CustomMdxProvider;
