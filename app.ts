import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const BASE_URL = "https://images.ctfassets.net";

export function handler(req: Request): Response {
  const requestedUrl = new URL(req.url);

  if (requestedUrl.searchParams.has("fm")) {
    // Redirect as is if format is already specified
    return redirectToContentfulOrigin(requestedUrl);
  }

  const acceptHeader = req.headers.get("Accept");

  if (!acceptHeader) {
    // Pass through if there is no accept header
    return redirectToContentfulOrigin(requestedUrl);
  }

  if (acceptHeader.includes("image/avif")) {
    requestedUrl.searchParams.set("fm", "avif");
    return redirectToContentfulOrigin(requestedUrl);
  }

  if (acceptHeader.includes("image/webp")) {
    requestedUrl.searchParams.set("fm", "webp");
    return redirectToContentfulOrigin(requestedUrl);
  }

  // Pass through if the requester doesn't accept avif or webp
  return redirectToContentfulOrigin(requestedUrl);
}

if (import.meta.main) {
  // Allow port to be set by an env var.
  const envPort = Deno.env.get("DENO_PORT");
  const port = envPort ? parseInt(envPort) : 8000;
  
  serve(handler, { port });
}

function redirectToContentfulOrigin(url: URL) {
  const contentfulUrl = new URL(url.pathname + url.search, BASE_URL);

  return Response.redirect(contentfulUrl, 302);
}
