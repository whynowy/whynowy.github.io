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
    googleAnalyticsId: "G-RF121RQEMQ",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: false,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
      // url: "https://github.com/whynowy/whynowy.github.io/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/whynowy" },
    { name: "linkedin", url: "https://www.linkedin.com/in/derek-wang-8218b130/" },
    { name: "mail",     url: "mailto:whynowy@gmail.com" },
  ],
  shareLinks: [
    { name: "linkedin", url: "https://www.linkedin.com/sharing/share-offsite/?url=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
  ],
});
