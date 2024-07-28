export const appConfig = {
  title: "Samjna Medico",
  description: "A Samjna Analytics Application - Words and Beyond",
  company: "Samjna Analytics",
  copyright: "2024",
  url: "",
  links: {
    twitter: "",
    company: "",
  },
  api: {
    node: "http://node-server:8001",
    nodeSocket: "http://localhost:8001",
    python: "http://python-server:8002",
  },
};

export type AppConfig = typeof appConfig;
