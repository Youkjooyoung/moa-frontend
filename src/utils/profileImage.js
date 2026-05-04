export const resolveProfileImageUrl = (profileImage) => {
  if (!profileImage) return "";

  if (/^blob:/i.test(profileImage)) {
    return profileImage;
  }

  if (/^https?:\/\//i.test(profileImage)) {
    return profileImage;
  }

  const imageBase = (() => {
    const configuredImageBase = import.meta.env.VITE_IMAGE_BASE_URL;
    if (configuredImageBase) return configuredImageBase;

    const apiBase = import.meta.env.VITE_API_BASE_URL || "";
    if (/^https?:\/\//i.test(apiBase)) return new URL(apiBase).origin;

    return window.location.origin;
  })();

  const path = profileImage.startsWith("/") ? profileImage : `/${profileImage}`;

  return `${imageBase}${path}`;
};
