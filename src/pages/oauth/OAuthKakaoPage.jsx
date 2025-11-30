import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import httpClient from "@/api/httpClient";

export default function OAuthKakaoPage() {
    const [params] = useSearchParams();

    useEffect(() => {
        const status = params.get("status");
        const providerUserId = params.get("providerUserId");
        const userId = params.get("userId");

        if (status === "CONNECT") {
            connectKakao(providerUserId, userId);
        }

        if (status === "NEED_REGISTER") {
            window.location.href = `/signup?provider=kakao&providerUserId=${providerUserId}`;
        }

        if (status === "LOGIN") {
            window.location.href = `/login/social?provider=kakao&userId=${userId}`;
        }

        if (status === "ALREADY_CONNECTED") {
            alert("이미 다른 계정에 연결된 카카오 계정입니다.");
            window.location.href = "/mypage";
        }
    }, []);

    async function connectKakao(providerUserId, userId) {
        try {
            const res = await httpClient.post("/oauth/connect", {
                provider: "kakao",
                providerUserId,
                userId
            });

            if (res.success) {
                alert("카카오 계정이 성공적으로 연결되었습니다!");
                window.location.href = "/mypage";
            }
        } catch (e) {
            alert("카카오 연결 실패");
            window.location.href = "/mypage";
        }
    }

    return <div>처리중…</div>;
}
