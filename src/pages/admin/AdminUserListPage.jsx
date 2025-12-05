import { useState } from "react";
import { useAdminUserListLogic } from "@/services/logic/admin/adminUserListLogic";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { Search, Filter, AlertTriangle } from "lucide-react";

export default function AdminUserListPage() {
  const {
    users,
    page,
    totalPages,
    totalCount,
    filters,
    loading,
    error,
    handleSearchInputChange,
    handleStatusChange,
    handleJoinStartChange,
    handleJoinEndChange,
    handleSearchSubmit,
    handleSearchEnter,
    handlePageClick,
    changePageBlock,
    getPageNumbers,
    handleEmailClick,
    handleReset,
  } = useAdminUserListLogic();

  const [searchValue, setSearchValue] = useState(filters.q);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearchInputChange(value);
  };

  const handleSearchKeyDown = async (e) => {
    if (e.key === "Enter") {
      await handleSearchEnter(searchValue);
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return value.length > 10 ? value.substring(0, 10) : value;
  };

  const renderStatusBadge = (status, blacklisted) => {
    if (blacklisted) {
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-xs font-semibold">
          블랙리스트
        </Badge>
      );
    }
    if (status === "BLOCK") {
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-xs font-semibold">
          이용제한
        </Badge>
      );
    }
    if (status === "WITHDRAW") {
      return (
        <Badge className="bg-slate-400 hover:bg-slate-500 text-xs font-semibold">
          탈퇴
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold">
        정상
      </Badge>
    );
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-slate-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8">
          회원 목록
        </h1>

        <Card className="shadow-md border-slate-200">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 bg-slate-50/70">
            <CardTitle className="text-lg font-semibold text-slate-900">
              전체 회원
              <span className="ml-2 text-sm font-normal text-slate-500">
                {totalCount.toLocaleString()}명
              </span>
            </CardTitle>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select
                  value={filters.status}
                  onValueChange={(v) => handleStatusChange(v)}
                >
                  <SelectTrigger className="w-32 h-9 text-sm">
                    <SelectValue placeholder="회원상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">전체</SelectItem>
                    <SelectItem value="ACTIVE">정상</SelectItem>
                    <SelectItem value="BLOCK">이용제한</SelectItem>
                    <SelectItem value="WITHDRAW">탈퇴</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  className="h-9 w-36 text-xs"
                  value={filters.joinStart}
                  onChange={(e) => handleJoinStartChange(e.target.value)}
                />
                <span className="text-xs text-slate-400">~</span>
                <Input
                  type="date"
                  className="h-9 w-36 text-xs"
                  value={filters.joinEnd}
                  onChange={(e) => handleJoinEndChange(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-56">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-9 pr-3 h-9 text-sm rounded-full bg-slate-100 focus:bg-white"
                    placeholder="이메일 검색..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
                <Button
                  className="h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
                  onClick={handleSearchSubmit}
                >
                  검색
                </Button>
                <Button
                  variant="outline"
                  className="h-9 px-3 rounded-full text-xs border-slate-200 text-slate-600"
                  onClick={handleReset}
                >
                  초기화
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {error && (
              <div className="px-6 py-3 flex items-center gap-2 bg-red-50 border-b border-red-100 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="w-72 text-center text-slate-700 text-sm">
                      이메일(아이디)
                    </TableHead>
                    <TableHead className="w-32 text-center text-slate-700 text-sm">
                      회원상태
                    </TableHead>
                    <TableHead className="w-40 text-center text-slate-700 text-sm">
                      최근 로그인 일자
                    </TableHead>
                    <TableHead className="w-40 text-center text-slate-700 text-sm">
                      가입일자
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading &&
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="py-4">
                          <Skeleton className="h-4 w-48" />
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Skeleton className="h-4 w-20 mx-auto" />
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Skeleton className="h-4 w-20 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))}

                  {!loading && users.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-sm text-slate-500"
                      >
                        조회된 회원이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    users.map((user) => (
                      <TableRow key={user.userId} className="hover:bg-slate-50">
                        <TableCell className="py-3 text-sm">
                          <button
                            type="button"
                            className={`text-left font-medium ${
                              user.blacklisted
                                ? "text-red-500 hover:underline"
                                : "text-slate-900 hover:text-blue-600 hover:underline"
                            }`}
                            onClick={() => handleEmailClick(user.userId)}
                          >
                            {user.userId}
                          </button>
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          {renderStatusBadge(user.status, user.blacklisted)}
                        </TableCell>
                        <TableCell className="py-3 text-center text-sm text-slate-600">
                          {formatDate(user.lastLoginDate)}
                        </TableCell>
                        <TableCell className="py-3 text-center text-sm text-slate-600">
                          {formatDate(user.regDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/70">
              <div className="text-xs text-slate-500">
                페이지 {page} / {totalPages || 1}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  disabled={page <= 1}
                  onClick={() => changePageBlock("first")}
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  disabled={page <= 1}
                  onClick={() => changePageBlock("prevBlock")}
                >
                  {"<"}
                </Button>

                {pageNumbers.map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 text-xs ${
                      p === page
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-slate-700"
                    }`}
                    onClick={() => handlePageClick(p)}
                  >
                    {p}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  disabled={page >= (totalPages || 1)}
                  onClick={() => changePageBlock("nextBlock")}
                >
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  disabled={page >= (totalPages || 1)}
                  onClick={() => changePageBlock("last")}
                >
                  {">>"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
