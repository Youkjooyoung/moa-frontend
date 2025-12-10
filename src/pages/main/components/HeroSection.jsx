import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-center md:text-left max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            혼자 내면 부담,
            <br />
            <span className="text-white drop-shadow-lg">같이 내면 반값!</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            모든 OTT를 저렴하게 함께 이용하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/parties"
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl text-lg font-bold shadow hover:bg-indigo-50 transition-all"
            >
              파티 찾기
            </Link>

            <Link
              to="/parties/create"
              className="px-8 py-3 bg-white/20 text-white border border-white rounded-xl text-lg font-bold backdrop-blur hover:bg-white/30 transition-all"
            >
              파티 만들기
            </Link>
          </div>
        </div>

        <div className="hidden md:block relative w-96 h-96">
          <div className="absolute top-0 right-10 bg-white p-4 rounded-2xl shadow-xl transform rotate-6">
            <img
              src="https://picsum.photos/id/1/60/60"
              className="w-12 h-12 rounded-xl mb-2"
              alt="Netflix"
            />
          </div>
          <div className="absolute left-10 bottom-10 bg-white p-4 rounded-2xl shadow-xl transform -rotate-3">
            <img
              src="https://picsum.photos/id/4/60/60"
              className="w-12 h-12 rounded-xl mb-2"
              alt="Youtube"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
