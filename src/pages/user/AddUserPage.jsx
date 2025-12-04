import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { initSignupPage } from "@/services/logic/addUserPageLogic";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSignupStore } from "@/store/user/signupStore";

export default function AddUserPage() {
  const [params] = useSearchParams();
  const provider = params.get("provider");
  const providerUserId = params.get("providerUserId");
  const isSocialSignup = provider && providerUserId;

  const { setField } = useSignupStore();

  useEffect(() => {
    initSignupPage();
  }, []);

  return (
    <div className="flex flex-col items-center pt-28 pb-20 bg-gray-50">
      <h2 className="text-3xl font-bold mb-4">회원가입</h2>
      <p className="text-gray-500 mb-10 text-sm">
        아래 정보를 정확히 입력해 주세요.
      </p>

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>기본 정보 입력</CardTitle>
          <CardDescription>
            {isSocialSignup
              ? "카카오 계정으로 회원가입을 진행합니다."
              : "이메일, 비밀번호, 휴대폰 번호를 입력해주세요."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {isSocialSignup && (
            <>
              <div className="p-3 bg-yellow-50 border rounded text-sm">
                <p className="font-semibold text-yellow-700">
                  카카오 소셜 회원가입
                </p>
                <p className="text-yellow-600 mt-1">
                  이메일/비밀번호 입력은 생략됩니다.
                </p>
              </div>

              <input type="hidden" value={provider || ""} />
              <input type="hidden" value={providerUserId || ""} />
            </>
          )}

          {!isSocialSignup && (
            <>
              <div className="space-y-1">
                <Label>이메일(아이디)</Label>
                <Input
                  placeholder="예: moa@email.com"
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label>비밀번호</Label>
                <Input
                  type="password"
                  placeholder="8~20자 / 영문+숫자 조합"
                  onChange={(e) => setField("password", e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label>비밀번호 확인</Label>
                <Input
                  type="password"
                  placeholder="다시 입력"
                  onChange={(e) => setField("passwordCheck", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <Label>닉네임</Label>
            <Input onChange={(e) => setField("nickname", e.target.value)} />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label>휴대폰 번호</Label>
              <Input placeholder="숫자만 입력" readOnly />
            </div>

            <Button type="button">본인인증</Button>
          </div>

          <div className="space-y-2">
            <Label>프로필 이미지</Label>

            <div className="flex items-center gap-4 mt-1">
              <div className="w-28 h-28 border rounded-lg bg-gray-100 overflow-hidden">
                <img
                  id="signupProfilePreview"
                  className="hidden w-full h-full object-cover"
                />
              </div>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setField("profileImage", e.target.files[0])}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={(e) => setField("marketingAgree", e.target.checked)}
              />
              마케팅 정보 수신 동의 (선택)
            </label>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full">회원가입</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
