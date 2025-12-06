export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);

    // Extract the subpath after /api/leetcode-proxy
    const path = url.pathname.replace(/^\/api\/leetcode-proxy/, "") || "/";

    // Construct the target URL
    const target = `https://lccn.lbao.site/api/v1${path}${url.search}`;

    // Fetch from the target API
    const response = await fetch(target, {
      method: req.method, // keep the method (GET, POST, etc.)
      headers: {
        "User-Agent": "AlgoZen-Client",
        // Forward content-type if POST/PUT
        "Content-Type": req.headers.get("Content-Type") || "application/json",
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? await req.text()
        : undefined,
    });

    // Return response to client
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    console.error("LeetCode Proxy Error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong in LeetCode proxy" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
