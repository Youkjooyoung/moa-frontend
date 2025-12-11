import React from "react";
import { Link } from "react-router-dom";

export default function LandingTestPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    랜딩 페이지 A/B/C/D/E/F 테스트
                </h1>
                <p className="text-gray-600 mb-8">
                    원하는 디자인 버전을 선택하여 미리보기해 보세요.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/"
                        className="block w-full py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200 col-span-1 md:col-span-2"
                    >
                        오리지널 (현재)
                    </Link>

                    <Link
                        to="/landing/a"
                        className="block w-full py-6 px-6 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Variant A<br />
                        <span className="text-sm font-normal opacity-70">모던 & 볼드 (다크)</span>
                    </Link>

                    <Link
                        to="/landing/b"
                        className="block w-full py-6 px-6 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Variant B<br />
                        <span className="text-sm font-normal opacity-70">소프트 & 신뢰 (라이트)</span>
                    </Link>

                    <Link
                        to="/landing/c"
                        className="block w-full py-6 px-6 bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-900 font-semibold rounded-lg shadow-sm transition duration-200"
                    >
                        Variant C<br />
                        <span className="text-sm font-normal opacity-70">미니멀 & 클린</span>
                    </Link>

                    <Link
                        to="/landing/d"
                        className="block w-full py-6 px-6 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg shadow-md border-2 border-black transition duration-200"
                    >
                        Variant D<br />
                        <span className="text-sm font-normal opacity-70">팝 & 바이브런트</span>
                    </Link>

                    <Link
                        to="/landing/e"
                        className="block w-full py-6 px-6 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-slate-800 font-bold rounded-lg shadow-md border border-slate-200 transition duration-200"
                    >
                        Variant E<br />
                        <span className="text-sm font-normal opacity-70">파티 리스트 스타일 (앱 느낌)</span>
                    </Link>

                    <Link
                        to="/landing/f"
                        className="block w-full py-6 px-6 bg-black hover:bg-gray-900 text-red-600 font-bold rounded-lg shadow-md border border-gray-800 transition duration-200"
                    >
                        Variant F<br />
                        <span className="text-sm font-normal text-gray-400">스트리밍 서비스 스타일 (OTT)</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
