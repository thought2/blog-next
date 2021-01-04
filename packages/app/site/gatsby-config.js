const path = require("path");

module.exports = {
  siteMetadata: {
    title: "@blog/site",
  },
  plugins: [
    "gatsby-plugin-emotion",
    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-plugin-root-import",
      options: {
        "~": path.join(__dirname, "src"),
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
