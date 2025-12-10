import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { MOCK_PARTIES } from "@/constants/constants";
import { PartyStatus } from "@/constants/types";

function PartyCard({ party }) {
  const isRecruiting = party.status === PartyStatus.RECRUITING;

  return (
    <div className="bg-white rounded-3xl border p-6 shadow hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img
            src={`https://picsum.photos/seed/${party.serviceName}/60/60`}
            className="w-12 h-12 rounded-xl"
            alt={`${party.serviceName} icon`}
          />
          <div>
            <h3 className="font-bold">{party.serviceName}</h3>
            <p className="text-sm text-gray-400">파티장: {party.hostName}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            isRecruiting
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {isRecruiting ? "모집중" : "마감"}
        </span>
      </div>

      <h4 className="font-bold text-gray-800 mb-2">{party.title}</h4>
      <p className="text-gray-500 text-sm mb-4">{party.description}</p>

      <Link
        to={`/parties/${party.id}`}
        className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
      >
        자세히 보기 <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function TrendingParties() {
  if (MOCK_PARTIES.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-gray-900 mb-6">지금 뜨는 파티</h2>
        <p className="text-gray-500">로딩 중...</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <h2 className="text-xl font-bold text-gray-900 mb-6">지금 뜨는 파티</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_PARTIES.slice(0, 3).map((party) => (
          <PartyCard key={party.id} party={party} />
        ))}
      </div>
    </section>
  );
}
