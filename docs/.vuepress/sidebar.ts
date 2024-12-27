import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
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
      prefix: "architecture/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "Макет інтерфейсу",
      // icon: "laptop-code",
      prefix: "UI/",
      children: "structure",
      collapsible: true,
    },
    {
      text: "Розробка базової структури коду",
      // icon: "laptop-code",
      prefix: "code/",
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
