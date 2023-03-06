import { post } from "/libs/BLT-Wrap.mjs";

function generateGuest(enabled) {
  return async function() {
    const guestAccess = await post(`/api/v1/users/guest-access/${enabled ? "enable" : "disable"}`, {
      token: localStorage.getItem("token"),
    });

    if (guestAccess instanceof axios.AxiosError) {
      throw alert(
        `${enabled ? "Enabling" : "Disabling"} guest access failed with code %s: %s`
          .replace("%s", guestAccess.response.status)
          .replace("%s", guestAccess.response.data.error)
      );
    }

    window.location.reload();
  }
}

export async function enableGuest() {
  await generateGuest(true)();
}

export async function disableGuest() {
  await generateGuest(false)();
}