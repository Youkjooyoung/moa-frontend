import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { resolveProfileImageUrl } from "@/utils/profileImage";

export function useHeaderLogic() {
  const { user, fetchSession, logout: storeLogout, initialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) {
      fetchSession();
    }
  }, [initialized, fetchSession]);

  const logout = async () => {
    await storeLogout();
    navigate("/");
  };

  const isAdmin = user?.role === "ADMIN";
  const profileImageUrl = resolveProfileImageUrl(user?.profileImage);
  const userInitial = user?.nickname
    ? user.nickname.substring(0, 1).toUpperCase()
    : "U";
  const displayNickname = user?.nickname || "User";
  const displayEmail = user?.email || "";

  return {
    user,
    isAdmin,
    isAdminMode: isAdmin,
    profileImageUrl,
    userInitial,
    displayNickname,
    displayEmail,
    logout,
    handleAdminSwitch: () => {},
  };
}
