import Cookies from "js-cookie";

export const setAuthCookies = (
  accessToken: string,
  role: string,
) => {
  Cookies.set("accessToken", accessToken, {
    expires: 1,
    sameSite: "lax",
  });

  Cookies.set("role", role, {
    expires: 1,
    sameSite: "lax",
  });
};

export const clearAuthCookies = () => {
  Cookies.remove("accessToken");
  Cookies.remove("role");
};