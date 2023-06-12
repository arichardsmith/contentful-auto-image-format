import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const BASE_URL = "https://images.ctfassets.net";

function handler(req: Request): Response {
  const requestedUrl = new URL(req.url);

  if (requestedUrl.searchParams.has("fm")) {
    // Redirect as is if format is already specified
    return redirectToContentfulOrigin(requestedUrl)
  }

  const acceptHeader = req.headers.get("Accept")

  if (acceptHeader?.includes('image/avif')) {
    requestedUrl.searchParams.set("fm", 'avif')
    return redirectToContentfulOrigin(requestedUrl)
  }

  if (acceptHeader?.includes('image/webp')) {
    requestedUrl.searchParams.set("fm", "webp")
    return redirectToContentfulOrigin(requestedUrl)
  }

  // Pass through if the requester doesn't accept avif or webp
  return redirectToContentfulOrigin(requestedUrl);
}

serve(handler, { port: 1324 });

function redirectToContentfulOrigin(url: URL) {
  const contentfulUrl = new URL(url.pathname + url.search, BASE_URL);
  
  return Response.redirect(contentfulUrl, 302);
}