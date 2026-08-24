import { useNavigate } from "react-router-dom";
import { MoaButton, MoaEmptyState, MoaPage } from "@/shared/ui";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <MoaPage className="flex min-h-[60vh] items-center justify-center">
      <MoaEmptyState
        className="w-full max-w-2xl"
        title="요청한 페이지를 찾을 수 없어요"
        description="주소가 변경되었거나 더 이상 제공되지 않는 화면입니다. 홈에서 다시 시작해 주세요."
        action={<MoaButton onClick={() => navigate("/")}>홈으로 이동</MoaButton>}
      />
    </MoaPage>
  );
}
