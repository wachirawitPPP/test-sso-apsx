import axios from "axios";

export async function POST(req) {
  try {
    // Get the Authorization header
    const authorization = req.headers.get("authorization");

    if (!authorization) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Make the SSO request with Axios
    const instance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth/loginsso`,
      timeout: 1000,
      headers: {
        authorization: `${authorization}`, // Pass the received authorization header
        "Ap-Id": "f8d7bdc1-cd8b-419e-8f00-ad045bc2f766", // Custom header
      },
    });

    const ssoResult = await instance.post("");

    // Return SSO response
    return new Response(JSON.stringify(ssoResult.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Include CORS headers in the response
      },
    });
  } catch (error) {
    console.error("Error during SSO POST:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Include CORS headers in error response
      },
    });
  }
}

export async function OPTIONS() {
  // Handle preflight requests for CORS
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Ap-Id",
    },
  });
}
