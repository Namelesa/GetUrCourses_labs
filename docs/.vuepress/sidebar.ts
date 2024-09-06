import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "Специфікації до вимог",
      // icon: "laptop-code",
      prefix: "requirements",
      children: "structure",
      collapsible: true,
    },
    {
      text: "Проектування архітектури",
      // icon: "laptop-code",
      prefix: "use cases/",
      link: "use cases/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "Проєктування інформаційного забезпечення",
      // icon: "laptop-code",
      prefix: "design/",
      link: "design/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "Реалізація інформаційного та програмного забезпечення",
      // icon: "laptop-code",
      prefix: "software/",
      link: "software/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "Тестування процездатності системи",
      // icon: "laptop-code",
      prefix: "test/",
      link: "test/",
      children: "structure",
      collapsible: true,
    },
  ],
});
