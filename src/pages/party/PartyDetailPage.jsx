import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import { requestPayment } from "../../utils/paymentHandler";
import LeavePartyWarningModal from "../../components/party/LeavePartyWarningModal";
import UpdateOttModal from "../../components/party/UpdateOttModal";
import { fetchPartyMembers, leaveParty } from "../../hooks/party/partyService";
import {
  Eye,
  EyeOff,
  Users,
  Calendar,
  Crown,
  Shield,
  ArrowLeft,
  Lock,
  Check,
} from "lucide-react";

export default function PartyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Zustand Store
  const {
    currentParty: party,
    loading,
    loadPartyDetail,
  } = usePartyStore();

  const [members, setMembers] = useState([]);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOttModalOpen, setIsOttModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [showOttInfo, setShowOttInfo] = useState(false);

  useEffect(() => {
    loadPartyDetail(id);
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadMembers = async () => {
    try {
      const data = await fetchPartyMembers(id);
      setMembers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const perPersonFee = party.monthlyFee;
      const totalAmount = perPersonFee * 2;

      localStorage.setItem("pendingPayment", JSON.stringify({ type: "JOIN_PARTY", partyId: id }));
      await requestPayment(`${party.productName} 파티 가입`, totalAmount, user.nickname);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("pendingPayment");
      alert(error.message || "가입에 실패했습니다.");
    }
  };

  const handleLeaveConfirm = async () => {
    try {
      await leaveParty(id);
      alert("파티에서 탈퇴했습니다.");
      navigate("/my-parties");
    } catch (error) {
      console.error(error);
      alert("탈퇴 처리에 실패했습니다.");
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  const handleDepositRetry = async () => {
    if (!user) return;
    try {
      const amount = party.monthlyFee;
      localStorage.setItem("pendingPayment", JSON.stringify({ type: "RETRY_DEPOSIT", partyId: id }));
      await requestPayment(`${party.productName} 보증금 재결제`, amount, user.nickname);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading.detail || !party) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const isMember = members.some((m) => m.userId === user?.userId);
  const isLeader = party.partyLeaderId === user?.userId;
  const isFull = party.currentMembers >= party.maxMembers;
  const perPersonFee = party.monthlyFee;
  const availableSlots = party.maxMembers - party.currentMembers;

  const getStatusBadge = (status) => {
    const badges = {
      RECRUITING: { bg: "bg-indigo-50 text-indigo-700 border-indigo-100", text: "모집중", icon: "✨" },
      ACTIVE: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", text: "진행중", icon: "🚀" },
      PENDING_PAYMENT: { bg: "bg-amber-50 text-amber-700 border-amber-100", text: "결제대기", icon: "⏳" },
      CLOSED: { bg: "bg-slate-100 text-slate-500 border-slate-200", text: "마감", icon: "🔒" },
    };
    return badges[status] || badges.RECRUITING;
  };

  const badge = getStatusBadge(party.partyStatus);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white border-b border-indigo-100">
        <div className="absolute inset-0 bg-slate-50 opacity-50"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate("/party")}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">목록으로</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${badge.bg}`}>
                  {badge.icon} {badge.text}
                </span>
                {isLeader && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-bold uppercase tracking-wide">
                    <Crown className="w-3.5 h-3.5" /> 파티장
                  </span>
                )}
                {isMember && !isLeader && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold uppercase tracking-wide">
                    <Check className="w-3.5 h-3.5" /> 파티원
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                {party.productName}
              </h1>

              <div className="flex items-center gap-3 text-slate-500">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-white">
                  <span className="text-xs font-bold">{party.leaderNickname?.[0]}</span>
                </div>
                <span className="font-medium">파티장: <span className="text-slate-900 font-bold">{party.leaderNickname}</span></span>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-indigo-200 transition-all min-w-[300px]">
              <p className="text-sm text-slate-500 mb-1 font-medium">월 분담금</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 tracking-tight">{perPersonFee.toLocaleString()}</span>
                <span className="text-lg text-slate-500">원</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">보증금</span>
                  <span className="font-mono text-slate-900 font-bold">{perPersonFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">첫 결제 총액</span>
                  <span className="font-mono text-indigo-600 font-bold">{(perPersonFee * 2).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Party Info */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                파티 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Members Progress */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" /> 사용 인원
                    </span>
                    <span className="text-slate-900 font-black">{party.currentMembers} / {party.maxMembers}</span>
                  </div>
                  {/* Avatars */}
                  <div className="flex -space-x-3 mb-4">
                    {[...Array(party.currentMembers)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                        {i + 1}
                      </div>
                    ))}
                    {[...Array(availableSlots)].map((_, i) => (
                      <div key={`e-${i}`} className="w-10 h-10 rounded-full bg-white border-2 border-white border-dashed flex items-center justify-center shadow-sm">
                        <span className="text-slate-400 text-xs">+</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div style={{ width: `${(party.currentMembers / party.maxMembers) * 100}%` }} className="h-full bg-indigo-500 rounded-full" />
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">시작일</p>
                      <p className="font-bold text-slate-900">{party.startDate ? new Date(party.startDate).toLocaleDateString() : '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">종료일</p>
                      <p className="font-bold text-slate-900">{party.endDate ? new Date(party.endDate).toLocaleDateString() : '미정'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OTT Credentials (Light Style) */}
            {(isMember || isLeader) && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-600" />
                    계정 정보
                  </h2>
                  {isLeader && (
                    <button onClick={() => setIsOttModalOpen(true)} className="text-xs bg-white hover:bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 transition font-bold shadow-sm">
                      수정
                    </button>
                  )}
                </div>

                <div className="grid gap-4 relative z-10">
                  <div className="bg-white/80 p-5 rounded-2xl border border-indigo-100 flex justify-between items-center group shadow-sm">
                    <span className="text-slate-500 text-sm font-medium">아이디</span>
                    <div className="font-mono font-bold text-slate-900">
                      {showOttInfo ? (party.ottId || <span className="text-slate-400 font-normal italic">미등록</span>) : <span className="blur-sm group-hover:blur-md transition-all text-slate-400">user@example.com</span>}
                    </div>
                  </div>
                  <div className="bg-white/80 p-5 rounded-2xl border border-indigo-100 flex justify-between items-center group shadow-sm">
                    <span className="text-slate-500 text-sm font-medium">비밀번호</span>
                    <div className="font-mono font-bold text-slate-900">
                      {showOttInfo ? (party.ottPassword || <span className="text-slate-400 font-normal italic">미등록</span>) : <span className="blur-sm group-hover:blur-md transition-all text-slate-400">••••••••••</span>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowOttInfo(!showOttInfo)}
                  className="w-full mt-6 py-3 bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl font-bold transition-all shadow-sm relative z-10 flex items-center justify-center gap-2"
                >
                  {showOttInfo ? <><EyeOff className="w-4 h-4" /> 정보 숨기기</> : <><Eye className="w-4 h-4" /> 정보 보기</>}
                </button>
              </div>
            )}

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Members List (Leader) */}
            {isLeader && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-slate-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Users className="w-4 h-4" /> 멤버 목록
                </h3>
                <div className="space-y-2">
                  {members.map((m, i) => (
                    <div key={m.partyMemberId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{m.nickname}</p>
                        {m.role === 'LEADER' && <p className="text-[10px] text-yellow-600 font-bold">파티장</p>}
                      </div>
                    </div>
                  ))}
                  {[...Array(availableSlots)].map((_, i) => (
                    <div key={`e-${i}`} className="p-3 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                      대기중...
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
              {isLeader && party.partyStatus === "PENDING_PAYMENT" && (
                <button onClick={handleDepositRetry} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all mb-2">
                  보증금 재결제
                </button>
              )}

              {party.memberStatus === 'INACTIVE' ? (
                <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-center cursor-not-allowed border border-gray-200">
                  재가입이 불가능한 파티입니다
                </div>
              ) : !isMember && !isLeader && !isFull && (
                <button onClick={() => setIsJoinModalOpen(true)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-1">
                  파티 가입하기
                </button>
              )}

              {isMember && !isLeader && (
                <button onClick={() => setIsLeaveModalOpen(true)} className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold transition-all">
                  파티 탈퇴하기
                </button>
              )}

              {isFull && !isMember && (
                <div className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-bold text-center cursor-not-allowed">
                  모집 마감
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LeavePartyWarningModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
      />

      <UpdateOttModal
        isOpen={isOttModalOpen}
        onClose={(success) => { setIsOttModalOpen(false); if (success) loadPartyDetail(id); }}
        partyId={id}
        currentOttId={party.ottId}
      />

      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">파티 가입 확인</h3>
            <p className="text-slate-500 text-center mb-6">결제 정보를 확인해주세요</p>

            <div className="space-y-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                <span className="text-slate-500 text-sm">보증금 + 첫달 구독료</span>
                <span className="font-bold text-indigo-600">{(perPersonFee * 2).toLocaleString()} 원</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                <span className="text-slate-500 text-sm">월 정기결제</span>
                <span className="font-bold text-slate-900">{(perPersonFee).toLocaleString()} 원</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsJoinModalOpen(false)} className="flex-1 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">취소</button>
              <button onClick={() => { setIsJoinModalOpen(false); handleJoin(); }} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20">확인 및 가입</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
