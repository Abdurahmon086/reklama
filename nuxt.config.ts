// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    ssr: true,
    devtools: { enabled: true },
    routeRules: {
        "/**": { isr: true },
    },
    css: ["@/assets/css/tailwind.css"],
    modules: ["@nuxt/ui"],
    colorMode: {
        preference: "light",
    },
});
