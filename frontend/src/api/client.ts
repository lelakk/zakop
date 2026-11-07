import createClient from "openapi-fetch";
import type { paths } from "./schema";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const api = createClient<paths>({
  baseUrl: BASE_URL,
});

api.use({
  async onRequest({ request }) {
    const token = localStorage.getItem("zakop_token");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
  async onResponse({ response }) {
    if (response.status === 401) {
      localStorage.removeItem("zakop_token");
      localStorage.removeItem("zakop_user");
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return response;
  },
});
