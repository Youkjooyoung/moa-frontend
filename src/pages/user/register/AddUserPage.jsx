import { useSignup } from "@/hooks/auth/useSignup";

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

export default function AddUserPage({ socialInfo }) {
  const isSocialSignup = !!socialInfo;
  const socialEmail = socialInfo?.email;
  const shouldShowEmailInput = !isSocialSignup || !socialEmail;

  const {
    form,
    errors,
    handleChange,
    handleBlur,
    handleImageChange,
    handlePassAuth,
    handleSubmit,
  } = useSignup({
    mode: isSocialSignup ? "social" : "normal",
    socialInfo,
  });

  return (
    <div className="w-full pb-20 bg-slate-50 text-slate-900">
      <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-4 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 mr-2" />
              MoA ?좉퇋 硫ㅻ쾭 ?깅줉 쨌 援щ룆 ?뚰떚 ?⑸쪟 以鍮?
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 drop-shadow-md">
              MoA ?뚯썝媛?낆쑝濡?
              <br />
              <span className="text-indigo-100">援щ룆??媛숈씠 ?섎늻??/span>
            </h2>

            <p className="text-sm sm:text-base text-indigo-50/90 max-w-md mx-auto lg:mx-0 leading-relaxed">
              ?대찓?? 鍮꾨?踰덊샇, ?대???踰덊샇留??뺥솗???낅젰?섎㈃ 諛붾줈 ?뚰떚???⑸쪟??
              ???덉뼱??
            </p>
          </div>

          <div className="w-full max-w-xl">
            <form onSubmit={handleSubmit}>
              <Card className="w-full bg-white border border-gray-100 shadow-2xl rounded-3xl">
                <CardHeader className="border-b border-gray-100 pb-4 px-6 pt-6">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-900">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold">
                      01
                    </span>
                    湲곕낯 ?뺣낫 ?낅젰
                  </CardTitle>

                  <CardDescription className="text-gray-500 text-xs md:text-sm mt-1.5">
                    ?대찓?? 鍮꾨?踰덊샇, ?대???踰덊샇瑜??낅젰?섍퀬 MoA 援щ룆 ?뚰떚??
                    李몄뿬??蹂댁꽭??
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-6 px-6 pb-6">
                  {isSocialSignup && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
                      移댁뭅??怨꾩젙?쇰줈 媛꾪렪媛??以묒엯?덈떎
                    </div>
                  )}

                  {isSocialSignup && socialEmail && (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-xs md:text-sm text-gray-800"
                      >
                        Social Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="bg-gray-100 border border-gray-300 text-sm"
                        value={socialEmail}
                        readOnly
                      />
                      <p className="text-xs mt-1 text-gray-500">
                        Email received from the social provider.
                      </p>
                    </div>
                  )}



                  {shouldShowEmailInput && (
                    <>
                      {/* ?대찓??*/}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="email"
                          className="text-xs md:text-sm text-gray-800"
                        >
                          ?대찓???꾩씠??
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="?? moa@email.com"
                          className="bg-white border border-gray-300 text-sm"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <p
                          className={`text-xs mt-1 ${
                            errors.email.isError
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {errors.email.message}
                        </p>
                      </div>

                      {/* 鍮꾨?踰덊샇 */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="password"
                          className="text-xs md:text-sm text-gray-800"
                        >
                          鍮꾨?踰덊샇
                        </Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="?곷Ц+?レ옄+?뱀닔臾몄옄 ?ы븿 8~20??
                          className="bg-white border border-gray-300 text-sm"
                          value={form.password}
                          onChange={handleChange}
                        />
                        <p
                          className={`text-xs mt-1 ${
                            errors.password.isError
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {errors.password.message}
                        </p>
                      </div>

                      {/* 鍮꾨?踰덊샇 ?뺤씤 */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="passwordCheck"
                          className="text-xs md:text-sm text-gray-800"
                        >
                          鍮꾨?踰덊샇 ?뺤씤
                        </Label>
                        <Input
                          id="passwordCheck"
                          name="passwordCheck"
                          type="password"
                          placeholder="鍮꾨?踰덊샇瑜???踰????낅젰"
                          className="bg-white border border-gray-300 text-sm"
                          value={form.passwordCheck}
                          onChange={handleChange}
                        />
                        <p
                          className={`text-xs mt-1 ${
                            errors.passwordCheck.isError
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {errors.passwordCheck.message}
                        </p>
                      </div>
                    </>
                  )}

                  {/* ?됰꽕??*/}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="nickname"
                      className="text-xs md:text-sm text-gray-800"
                    >
                      ?됰꽕??
                    </Label>
                    <Input
                      id="nickname"
                      name="nickname"
                      placeholder="2~10?? ?쒓?/?곷Ц/?レ옄"
                      className="bg-white border border-gray-300 text-sm"
                      value={form.nickname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p
                      className={`text-xs mt-1 ${
                        errors.nickname.isError
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {errors.nickname.message}
                    </p>
                  </div>

                  {/* ?대???踰덊샇 + 蹂몄씤?몄쬆 */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs md:text-sm text-gray-800"
                    >
                      ?대???踰덊샇
                    </Label>
                    <div className="flex items-end gap-2">
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="蹂몄씤?몄쬆 ???먮룞 ?낅젰"
                        readOnly
                        className="flex-1 bg-gray-100 border border-gray-300 text-sm"
                        value={form.phone}
                      />
                      <Button
                        type="button"
                        onClick={handlePassAuth}
                        className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold"
                      >
                        蹂몄씤?몄쬆
                      </Button>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        errors.phone.isError ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {errors.phone.message}
                    </p>
                  </div>

                  {/* ?꾨줈???대?吏 */}
                  <div className="space-y-2">
                    <Label className="text-xs md:text-sm text-gray-800">
                      ?꾨줈???대?吏
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center text-gray-400 text-xs relative">
                        {form.previewUrl ? (
                          <img
                            src={form.previewUrl}
                            className="w-full h-full object-cover"
                            alt="profile preview"
                          />
                        ) : (
                          <span className="block">誘몄꽑??/span>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="bg-white border border-gray-300 text-xs"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  {/* 留덉????숈쓽 */}
                  <div className="rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3 text-xs md:text-sm text-gray-700 flex items-start gap-2">
                    <input
                      id="agreeMarketing"
                      name="agreeMarketing"
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                      checked={form.agreeMarketing}
                      onChange={handleChange}
                    />
                    <div>
                      <p className="font-medium">
                        留덉????뺣낫 ?섏떊 ?숈쓽 (?좏깮)
                      </p>
                      <p className="mt-1 text-[11px] md:text-xs text-gray-500">
                        ?대깽?? ?꾨줈紐⑥뀡, ?좉퇋 ?뚰떚 ?뚮┝???대찓?셋룸Ц?먮줈 諛쏆븘蹂?
                        ???덉뒿?덈떎.
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-gray-100 px-6 pb-6">
                  <Button
                    type="submit"
                    className="w-full h-12 text-sm md:text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isSocialSignup
                      ? "媛꾪렪媛???꾨즺?섍린"
                      : "?뚯썝媛???꾨즺?섍퀬 ?뚰떚 蹂대윭媛湲?}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
