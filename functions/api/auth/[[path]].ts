import { handleAuth } from "../../../server/auth.ts";
import type { AuthDatabase } from "../../../server/auth.ts";
export const onRequest = ({
  request,
  env,
}: {
  request: Request;
  env: { DB: AuthDatabase };
}) =>
  handleAuth(
    request,
    env.DB,
    request.headers.get("CF-Connecting-IP") || "unknown",
  );
