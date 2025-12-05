import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:8443/api/community",
  withCredentials: true,
});

const PAGE_SIZE = 10;

const getCategoryChipClass = (categoryName) => {
  switch (categoryName) {
    case "시스템":
      return "bg-blue-50 text-blue-600 border border-blue-100";
    case "결제":
      return "bg-amber-50 text-amber-600 border border-amber-100";
    case "구독":
      return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    case "파티":
      return "bg-violet-50 text-violet-600 border border-violet-100";
    case "정산":
      return "bg-sky-50 text-sky-600 border border-sky-100";
    case "회원":
    default:
      return "bg-slate-50 text-slate-600 border border-slate-100";
  }
};

const formatDate = (dateTimeString) => {
  if (!dateTimeString) {
    return "";
  }

  const date = new Date(dateTimeString);
  if (Number.isNaN(date.getTime())) {
    return dateTimeString.split("T")[0] ?? dateTimeString;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ListNotice({
  faqPath = "/support/faq",
  noticePath = "/support/notice",
  inquiryPath = "/support/inquiry",
  noticeDetailBasePath = "/support/notice",
}) {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = useMemo(() => {
    if (!total) {
      return 1;
    }
    const pages = Math.ceil(total / PAGE_SIZE);
    return pages > 0 ? pages : 1;
  }, [total]);

  const fetchNotices = async (targetPage, currentKeyword) => {
    setLoading(true);
    setError("");

    try {
      const trimmedKeyword = currentKeyword.trim();
      const isSearch = trimmedKeyword.length > 0;

      const url = isSearch ? "/notice/search" : "/notice";

      const response = await api.get(url, {
        params: {
          page: targetPage,
          size: PAGE_SIZE,
          ...(isSearch ? { keyword: trimmedKeyword } : {}),
        },
      });

      const data = response.data || {};

      setNotices(Array.isArray(data.content) ? data.content : []);
      setPage(data.page || targetPage);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch (e) {
      setError("공지사항 목록을 불러오는 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(1, "");
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setKeyword(searchInput);
    fetchNotices(1, searchInput);
  };

  const handleChangePage = (targetPage) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === page) {
      return;
    }
    fetchNotices(targetPage, keyword);
  };

  const handleClickNotice = (communityId) => {
    if (!communityId) {
      return;
    }
    navigate(`${noticeDetailBasePath}/${communityId}`);
  };

  const renderPageNumbers = () => {
    const pages = [];

    const windowSize = 5;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    let end = start + windowSize - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - windowSize + 1);
    }

    for (let p = start; p <= end; p += 1) {
      pages.push(p);
    }

    return pages.map((p) => (
      <button
        key={p}
        type="button"
        onClick={() => handleChangePage(p)}
        className={`min-w-[32px] h-8 px-2 rounded-md text-sm border transition-colors ${
          p === page
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
        }`}
      >
        {p}
      </button>
    ));
  };

  const calcRowNumber = (index) => {
    if (!total) {
      return index + 1;
    }
    return total - (page - 1) * PAGE_SIZE - index;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
          고객센터
        </h1>

        <div className="mt-8 flex justify-center space-x-2 md:space-x-4">
          <Link
            to={faqPath}
            className="px-5 py-2 rounded-full text-sm md:text-base text-gray-500 bg-white border border-transparent hover:border-blue-100 hover:text-blue-500"
          >
            FAQ
          </Link>
          <Link
            to={noticePath}
            className="px-5 py-2 rounded-full text-sm md:text-base bg-blue-500 text-white shadow-sm"
          >
            공지사항
          </Link>
          <Link
            to={inquiryPath}
            className="px-5 py-2 rounded-full text-sm md:text-base text-gray-500 bg-white border border-transparent hover:border-blue-100 hover:text-blue-500"
          >
            문의하기
          </Link>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">공지사항</h2>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-4 flex flex-col md:flex-row gap-3"
            >
              <div className="flex items-center gap-2 flex-1">
                <select className="h-10 px-3 rounded-md border border-gray-300 text-sm text-gray-700 bg-white">
                  <option value="title">제목</option>
                </select>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="h-10 flex-1 rounded-md border border-gray-300 px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-6 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                검색
              </button>
            </form>
          </div>

          <div className="divide-y divide-gray-100">
            {loading && (
              <div className="px-6 py-10 text-center text-sm text-gray-500">
                공지사항을 불러오는 중이에요...
              </div>
            )}

            {!loading && error && (
              <div className="px-6 py-10 text-center text-sm text-red-500">
                {error}
              </div>
            )}

            {!loading && !error && notices.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-gray-500">
                등록된 공지사항이 없습니다.
              </div>
            )}

            {!loading &&
              !error &&
              notices.map((notice, index) => (
                <button
                  key={notice.communityId || index}
                  type="button"
                  onClick={() => handleClickNotice(notice.communityId)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-6 text-sm text-gray-400 mt-[2px]">
                      {calcRowNumber(index)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryChipClass(
                            notice.categoryName
                          )}`}
                        >
                          {notice.categoryName || "기타"}
                        </span>
                        <p className="text-sm md:text-base text-gray-900 truncate">
                          {notice.title}
                        </p>
                      </div>

                      <div className="mt-1 text-xs text-gray-400 flex flex-wrap gap-x-2 gap-y-1">
                        <span>관리자</span>
                        <span>·</span>
                        <span>작성일 {formatDate(notice.createdAt)}</span>
                        <span>·</span>
                        <span>조회 {notice.viewCount ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>

          <div className="px-6 py-5 border-t border-gray-100 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleChangePage(page - 1)}
                disabled={page <= 1}
                className="min-w-[32px] h-8 px-2 rounded-md text-sm border border-gray-200 bg-white text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ‹
              </button>

              {renderPageNumbers()}

              <button
                type="button"
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages}
                className="min-w-[32px] h-8 px-2 rounded-md text-sm border border-gray-200 bg-white text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
