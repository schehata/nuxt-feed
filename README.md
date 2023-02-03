# Nuxt Feed Generator

`nuxt-feed` is a layer that is added on top of Nuxt 3 to generate a `feed.xml` file for your content.

## Installation

Make sure to install the npm package using npm or yarn

```bash
yarn add nuxt-feed
```

Then add the dependency to your `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: [
    'nuxt-feed'
  ]
})
```

Now, its time to provide the required configuration for the feed
under the `runtimeConfig` key in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: [
    'nuxt-feed'
  ],
  runtimeConfig: {
    public: {
      feed: {
        id: 'rss', // optional, default: 'rss'
        title: 'Your site title',
        siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://site.com',
        description: 'welcome to my cool site',
        image: '' // optional,
        favicon '' // optional,
        language: 'ar-EG', // prefer more explicit language codes like `en-AU` over `en`
        author: { // optional
          name: 'Islam Shehata',
          email: 'myemail@company.com'
        },
        where: {} // where object for the serverQueryContent() method. default { published: true }
        sort: {} // sort object for the serverQueryContent() method. default: { date: -1 }
        pathStartsWith: null // optional filter to filter out docs by path before generating the feed, e.g: '/blog'
      }
    }
  }
})

```

you are done! you should be able to access your feed at `http://localhost:3000/feed.xml`

in production build, this will be prerendered.
