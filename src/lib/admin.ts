/*
 * "Admin device" flag: the Admin link in the site menu only shows in browsers
 * where the admin has signed in to /admin (or opened the site once with ?admin).
 * This only hides the link from visitors — the real protection is the password,
 * which Supabase checks on every request. The flag never stores the password.
 */
const ADMIN_DEVICE_KEY = "mntn-admin-device";

export const rememberAdminDevice = () => {
  try {
    localStorage.setItem(ADMIN_DEVICE_KEY, "1");
  } catch {
    /* storage unavailable — link just stays hidden */
  }
};

export const forgetAdminDevice = () => {
  try {
    localStorage.removeItem(ADMIN_DEVICE_KEY);
  } catch {
    /* ignore */
  }
};

export const isAdminDevice = () => {
  try {
    if (new URLSearchParams(window.location.search).has("admin")) rememberAdminDevice();
    return localStorage.getItem(ADMIN_DEVICE_KEY) === "1";
  } catch {
    return false;
  }
};
