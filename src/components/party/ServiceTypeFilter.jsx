import { useEffect } from "react";
import { usePartyStore } from "../../store/party/partyStore";

export default function ServiceTypeFilter({ selectedProductId, onSelect }) {
    const products = usePartyStore((state) => state.products);
    const loadProducts = usePartyStore((state) => state.loadProducts);

    useEffect(() => {
        if (!products.length) {
            loadProducts();
        }
    }, [products, loadProducts]);

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-3">
                {/* 전체 보기 버튼 */}
                <button
                    onClick={() => onSelect(null)}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all ${selectedProductId === null
                            ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                            : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                        }`}
                >
                    <span className="font-bold whitespace-nowrap">전체</span>
                </button>

                {/* 서비스 목록 */}
                {products.map((product) => (
                    <button
                        key={product.productId}
                        onClick={() => onSelect(product.productId)}
                        className={`flex-shrink-0 flex items-center gap-3 px-5 py-2 rounded-2xl border transition-all ${selectedProductId === product.productId
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30"
                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:shadow-md"
                            }`}
                    >
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.productName}
                                className="w-6 h-6 rounded-full object-cover bg-white shadow-sm"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {product.productName?.[0]}
                            </div>
                        )}
                        <span className="font-bold whitespace-nowrap">{product.productName}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
