export const projects = [
  {
    name: "Bolota",
    slug: "bolota",
    number: "01",
    category: { en: "AI & CONVERSATION", pt: "IA E CONVERSAÇÃO" },
    description: {
      en: "A veterinary assistant that connects natural language to the information a pet shop actually needs.",
      pt: "Um assistente veterinário que conecta linguagem natural às informações que um pet shop precisa.",
    },
    detail: {
      en: "Gemini handles the conversation while an Express API connects to a local SQLite database of prices, inventory, and medications. A React web chat brings the pieces together; Docker Compose runs the project.",
      pt: "O Gemini conduz a conversa enquanto uma API Express consulta preços, estoque e medicamentos em um banco SQLite local. Um chat em React conecta as peças, e o Docker Compose executa o projeto.",
    },
    tags: ["Gemini", "TypeScript", "Express", "SQLite"],
    inDevelopment: false,
  },
  {
    name: "n-store",
    slug: "n-store",
    number: "02",
    category: { en: "COMMERCE & SYSTEMS", pt: "COMÉRCIO E SISTEMAS" },
    description: {
      en: "An e-commerce platform in progress, exploring the pieces behind a complete shopping experience.",
      pt: "Uma plataforma de e-commerce em construção, explorando as peças de uma experiência de compra completa.",
    },
    detail: {
      en: "Built on Laravel 12 and PHP with Blade templates. This ongoing project is a space to develop the structure and interfaces of a commerce platform.",
      pt: "Construído com Laravel 12, PHP e templates Blade. Este projeto em andamento é um espaço para desenvolver a estrutura e as interfaces de uma plataforma de comércio.",
    },
    tags: ["Laravel", "PHP", "Blade"],
    inDevelopment: true,
  },
  {
    name: "TakoStreak",
    slug: "takostreak",
    number: "03",
    category: {
      en: "SMALL TOOLS, DAILY HABITS",
      pt: "PEQUENAS FERRAMENTAS, HÁBITOS DIÁRIOS",
    },
    description: {
      en: "Fluffy streaks for everyone. A small, playful project about showing up, one day at a time.",
      pt: "Sequências fofinhas para todo mundo. Um projeto leve e divertido sobre aparecer, um dia de cada vez.",
    },
    detail: {
      en: "A streak project in development using React, TanStack, Express, and TypeScript. An experiment in making a simple daily interaction feel a little more personal.",
      pt: "Um projeto de sequências em desenvolvimento com React, TanStack, Express e TypeScript. Um experimento para deixar uma interação diária simples um pouco mais pessoal.",
    },
    tags: ["React", "TanStack", "Express", "TypeScript"],
    inDevelopment: true,
  },
] as const;
