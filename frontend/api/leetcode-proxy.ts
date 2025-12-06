export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const url = new URL(req.url);

  const target =
    "https://lccn.lbao.site/api/v1" +
    url.pathname.replace("/api/leetcode-proxy", "") +
    url.search;

  const response = await fetch(target, {
    headers: {
      "User-Agent": "AlgoZen-Client",
    },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") || "application/json",
    },
  });
}
