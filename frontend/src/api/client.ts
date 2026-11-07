import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const api = createClient<paths>({
  baseUrl: "http://localhost:8080/api/v1",
});

// Middleware wstrzykujący token JWT z localStorage
api.use({
  async onRequest({ request }) {
    const token = localStorage.getItem("zakop_token");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
});
