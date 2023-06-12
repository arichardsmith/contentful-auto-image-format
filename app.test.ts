import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.191.0/testing/asserts.ts";

import { handler } from "./app.ts";

Deno.test("It returns a 302 redirect to Contentful", () => {
  const res = handler(request());

  assertEquals(res.status, 302);

  const target = getRedirectLocation(res);
  assertEquals(target.host, "images.ctfassets.net");
});

Deno.test("It adds avif format if the request indicates it is accepted", () => {
  const res = handler(request({ accept: "image/avif,*/*" }));

  const target = getRedirectLocation(res);
  assertEquals(target.searchParams.get("fm"), "avif");
});

Deno.test("It adds webp format if the request indicates it is accepted", () => {
  const res = handler(request({ accept: "image/webp,*/*" }));

  const target = getRedirectLocation(res);
  assertEquals(target.searchParams.get("fm"), "webp");
});

Deno.test("It picks avif over webp if accepted", () => {
  const res = handler(request({ accept: "image/avif,image/webp,*/*" }));

  const target = getRedirectLocation(res);
  assertEquals(target.searchParams.get("fm"), "avif");
});

Deno.test("It passes through the format query if already set", () => {
  const res = handler(
    request({
      accept: "image/avif,image/webp,*/*",
      params: {
        fm: "jpg",
      },
    })
  );

  const target = getRedirectLocation(res);
  assertEquals(target.searchParams.get("fm"), "jpg");
});

Deno.test("It doesn't modify other query parameters", () => {
  const res = handler(
    request({
      accept: "image/avif",
      params: {
        w: "2000",
        q: "50",
        foo: "bar",
        fit: "thumb",
      },
    })
  );

  const target = getRedirectLocation(res);

  assertEquals(target.searchParams.get("w"), "2000");
  assertEquals(target.searchParams.get("q"), "50");
  assertEquals(target.searchParams.get("foo"), "bar");
  assertEquals(target.searchParams.get("fit"), "thumb");
});

function request({
  accept,
  params,
}: { accept?: string; params?: Record<string, string> } = {}) {
  const url = new URL("http://localhost:8000/space/asset/hash/file.jpg");

  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }

  return new Request(url, {
    headers: {
      Accept: accept ?? "*/*",
    },
  });
}

function getRedirectLocation(res: Response) {
  const locationHeader = res.headers.get("location");
  assertExists(locationHeader);

  return new URL(locationHeader);
}
