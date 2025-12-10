import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { PartyStatus } from "@/constants/types";

export default function TrendingPartiesSection({ parties }) {
  const visibleParties = Array.isArray(parties) ? parties.slice(0, 3) : [];

  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <h2 className="text-xl font-bold text-gray-900 mb-6">지금 뜨는 파티</h2>

      {visibleParties.length === 0 ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleParties.map((party) => (
            <div
              key={party.id}
              className="bg-white rounded-3xl border p-6 shadow hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://picsum.photos/seed/${party.serviceName}/60/60`}
                    className="w-12 h-12 rounded-xl"
                    alt="icon"
                  />
                  <div>
                    <h3 className="font-bold">{party.serviceName}</h3>
                    <p className="text-sm text-gray-400">
                      파티장: {party.hostName}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    party.status === PartyStatus.RECRUITING
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {party.status === PartyStatus.RECRUITING ? "모집중" : "마감"}
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
          ))}
        </div>
      )}
    </section>
  );
}
