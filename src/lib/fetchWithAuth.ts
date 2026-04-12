import { getSession } from "./session";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function fetchWithAuth(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const session = await getSession();

  const doFetch = (token: string) =>
    fetch(`${BACKEND_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  let res = await doFetch(session.accessToken);

  if (res.status === 401 && session.refreshToken) {
    const refreshRes = await fetch(`${BACKEND_URL}/api/auth/reissue`, {
      method: "POST",
      headers: { "Refresh-Token": session.refreshToken },
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      if (refreshData.success && refreshData.data) {
        session.accessToken = refreshData.data.accessToken;
        session.refreshToken = refreshData.data.refreshToken;
        await session.save();

        res = await doFetch(session.accessToken);
      }
    }

    if (res.status === 401) {
      session.destroy();
    }
  }

  return res;
}

export async function fetchPublic(
  path: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}
