import { useLocation, useNavigate } from "react-router-dom";
import AddUserPage from "./AddUserPage";

export default function SocialRegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const provider = location.state?.provider || "";
  const providerUserId = location.state?.providerUserId || "";

  if (!provider || !providerUserId) {
    // 상태 정보가 없으면 일반 회원가입으로 돌립니다.
    navigate("/signup", { replace: true });
    return null;
  }

  // 기존 AddUserPage를 재사용해 소셜 회원가입으로 안내합니다.
  return <AddUserPage socialInfo={{ provider, providerUserId }} />;
}
