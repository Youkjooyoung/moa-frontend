const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">고객센터</h1>
          <p className="mt-2 text-sm text-gray-500">
            공지사항, FAQ, 1:1 문의를 한 곳에서 확인하세요.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="#"
            className="block rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-900">공지사항</h2>
            <p className="mt-2 text-sm text-gray-500">
              서비스 공지와 업데이트 내용을 확인하세요.
            </p>
          </a>

          <a
            href="#"
            className="block rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
            <p className="mt-2 text-sm text-gray-500">
              자주 묻는 질문을 통해 빠르게 해결하세요.
            </p>
          </a>

          <a
            href="#"
            className="block rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-900">1:1 문의</h2>
            <p className="mt-2 text-sm text-gray-500">
              해결되지 않는 문제는 1:1 문의를 남겨주세요.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
