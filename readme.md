# Contentful Auto Image Format

A tiny Deno Deploy app that redirects to the correct Contentful image CDN path depending on what image formats the requesting browser supports. This allows you to use modern image formats without having to resort to `<picture>` tags.

## Usage

Just replace `https://images.ctfassets.net` with the url for this app in your image sources.

As the app just redirects to the Contentful CDN, the browser will still have to connect to the CDNs servers, adding one extra connection. You should add a preconnect tag to your headers/html to give the browser a head start.

```html
<link rel="preconnect" href="https://images.ctfassets.net" />
```