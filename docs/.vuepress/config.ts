import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import MarkdownItPlantuml from 'markdown-it-plantuml';

export default defineUserConfig({
  // Замінити на назву свого репозиторія
  base: "/db-course-hope-template/",

  lang: "en-US",
  // Замінити на назву свого проєкту
  title: "GetUrCourse",

  theme,

  extendsMarkdown: md =>{
    md.use(MarkdownItPlantuml);
  },
});