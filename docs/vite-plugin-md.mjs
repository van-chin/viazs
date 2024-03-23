import MarkdownIt from "markdown-it";

export default () => ({
  name: "vitePluginMarkdown",
  // src为文件内容，id为当前文件的路径
  transform(src, id) {
    // 匹配.md后缀的文件进行解析
    if (id.endsWith(".md")) {
      const markdownIt = MarkdownIt({
        html: true,
        xhtmlOut: false,
      });

      // 解析之后的html文档需要在外层包裹<template>根结点
      return {
        code: `<template>${markdownIt.render(src)}</template>`,
        map: null,
      };
    }
  },
});
