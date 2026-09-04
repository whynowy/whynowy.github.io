import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://whynowy.com/",
    title: "Derek Wang",
    description: "Derek's Homepage",
    author: "Derek Wang",
    profile: "https://whynowy.com",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "America/Los_Angeles",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/whynowy/whynowy.github.io/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/whynowy" },
    { name: "linkedin", url: "https://www.linkedin.com/in/derek-wang-8218b130/" },
    { name: "mail",     url: "mailto:whynowy@gmail.com" },
  ],
  shareLinks: [
  ],
});
