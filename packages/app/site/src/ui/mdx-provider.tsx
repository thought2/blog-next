import React, { FC, ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "./CodeBlock";

const components = {
  pre: (props: any) => <div {...props} />,
  code: CodeBlock,
  h1: (props: any) => <h1 style={{ fontFamily: "Arial" }} {...props} />,
  h2: (props: any) => <h2 style={{ fontFamily: "Arial" }} {...props} />,
  h3: (props: any) => <h3 style={{ fontFamily: "Arial" }} {...props} />,
};

const CustomMdxProvider: FC<{ children: ReactNode }> = (props) => (
  <MDXProvider components={components} {...props} />
);

export default CustomMdxProvider;
