import React, { ReactNode } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
//import Prism from "prism-react-renderer/prism";

export default (props: { className: string; children: string }) => {
  console.log(props);

  const matches = props.className.match(/language-(?<lang>.*)/);

  const lang =
    matches && matches.groups && matches.groups.lang ? matches.groups.lang : "";

  return (
    <Highlight
      {...defaultProps}
      code={props.children}
      language="tsx"
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
