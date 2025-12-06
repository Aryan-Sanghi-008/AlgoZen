export const config = {
  runtime: "edge",
};


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: Request) {
  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/api\/leetcode-proxy/, "") || "/";
    const target = `https://lccn.lbao.site/api/v1${path}${url.search}`;
    
    const response = await fetch(target, {
      method: req.method,
      headers: {
        "User-Agent": "AlgoZen-Client",
        "Content-Type": req.headers.get("Content-Type") || "application/json",
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? await req.text()
        : undefined,
    });

    const responseHeaders = new Headers({
      ...corsHeaders,
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    });

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("LeetCode Proxy Error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong in LeetCode proxy" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
}