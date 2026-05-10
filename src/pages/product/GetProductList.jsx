import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarPlus,
  Edit3,
  LayoutGrid,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import AddSubscriptionModal from "@/components/subscription/AddSubscriptionModal";
import AddProductModal from "@/components/product/AddProductModal";
import UpdateProductModal from "@/components/product/UpdateProductModal";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaEmptyState,
  MoaInput,
  MoaPage,
  MoaPageHeader,
} from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";
import { formatLocalizedCurrency } from "@/utils/localeFormat";
import { getProductIconUrl, getProductLogoUrl } from "@/utils/imageUtils";

const ALL_CATEGORY = "__all__";

function ProductLogo({ product, className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = product.image ? getProductIconUrl(product.image) || getProductLogoUrl(product.image) : "";

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-[var(--theme-primary-light)] text-lg font-bold text-[var(--theme-primary)] ${className}`}>
        {product.productName?.slice(0, 1) || "M"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={product.productName}
      className={`object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

function ProductDetailPanel({ product, user, locale, t, onClose, onSubscribe, onEdit, onDelete }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <MoaCard className="max-h-[88vh] w-full max-w-xl overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[var(--theme-border-light)] p-6">
          <div className="flex items-center gap-4">
            <ProductLogo product={product} className="h-16 w-16 rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)] p-3" />
            <div>
              <h2 className="text-2xl font-bold text-[var(--theme-text)]">{product.productName}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <MoaBadge tone="primary">{product.categoryName || t("product.categoryFallback")}</MoaBadge>
                {product.productStatus === "INACTIVE" && <MoaBadge tone="neutral">{t("product.inactive")}</MoaBadge>}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--theme-text-muted)] transition hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text)]"
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <p className="text-sm font-semibold text-[var(--theme-text-muted)]">{t("product.monthlyPrice")}</p>
            <p className="mt-1 text-3xl font-bold text-[var(--theme-text)]">
              {formatLocalizedCurrency(product.price, locale)}
            </p>
          </div>

          {product.description && (
            <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--theme-text-muted)]">
              {product.description}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              [t("product.benefit.schedule"), t("product.benefit.scheduleDesc")],
              [t("product.benefit.payment"), t("product.benefit.paymentDesc")],
              [t("product.benefit.settlement"), t("product.benefit.settlementDesc")],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl bg-[var(--theme-surface-muted)] p-4">
                <p className="text-sm font-bold text-[var(--theme-text)]">{title}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--theme-text-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--theme-border-light)] p-6 sm:flex-row">
          {user?.role === "ADMIN" ? (
            <>
              <MoaButton className="flex-1" onClick={() => onEdit(product)}>
                <Edit3 className="h-4 w-4" />
                {t("common.edit")}
              </MoaButton>
              <MoaButton variant="danger" className="flex-1" onClick={() => onDelete(product)}>
                <Trash2 className="h-4 w-4" />
                {t("common.delete")}
              </MoaButton>
            </>
          ) : (
            <>
              <MoaButton variant="secondary" className="flex-1" onClick={onClose}>
                {t("common.cancel")}
              </MoaButton>
              <MoaButton className="flex-[2]" onClick={() => onSubscribe(product)}>
                <CalendarPlus className="h-4 w-4" />
                {t("product.subscribe")}
              </MoaButton>
            </>
          )}
        </div>
      </MoaCard>
    </div>
  );
}

export default function GetProductList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { locale, t } = useI18n();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [subscribingData, setSubscribingData] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        httpClient.get("/product"),
        httpClient.get("/product/categorie"),
      ]);

      if (productRes.success) setAllProducts(productRes.data || []);
      if (categoryRes.success) setCategories(categoryRes.data || []);
    } catch (error) {
      console.error("Failed to fetch product data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORY || product.categoryName === selectedCategory;
      const matchesKeyword =
        !keyword || product.productName?.toLowerCase().includes(keyword);

      return matchesCategory && matchesKeyword;
    });
  }, [allProducts, searchKeyword, selectedCategory]);

  const handleSubscribe = (product) => {
    if (!user) {
      navigate("/login", { state: { from: "/product" } });
      return;
    }

    setViewingProduct(null);
    setSubscribingData({
      productId: product.productId,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
    });
  };

  return (
    <MoaPage>
      <MoaPageHeader
        eyebrow={t("product.eyebrow")}
        title={t("product.title")}
        description={t("product.description")}
        action={
          user?.role === "ADMIN" ? (
            <MoaButton onClick={() => setIsAddProductModalOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("product.add")}
            </MoaButton>
          ) : user ? (
            <MoaButton variant="secondary" onClick={() => navigate("/subscription")}>
              {t("product.mySubscriptions")}
            </MoaButton>
          ) : null
        }
      />

      <MoaCard className="mb-8 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-text-muted)]" />
            <MoaInput
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={t("product.search")}
              className="pl-11"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <MoaButton
              size="sm"
              variant={selectedCategory === ALL_CATEGORY ? "primary" : "secondary"}
              onClick={() => setSelectedCategory(ALL_CATEGORY)}
            >
              {t("common.all")}
            </MoaButton>
            {categories.map((category) => (
              <MoaButton
                key={category.categoryId}
                size="sm"
                variant={selectedCategory === category.categoryName ? "primary" : "secondary"}
                onClick={() => setSelectedCategory(category.categoryName)}
              >
                {category.categoryName}
              </MoaButton>
            ))}
          </div>
        </div>
      </MoaCard>

      {loading ? (
        <MoaEmptyState title={t("product.loading")} />
      ) : filteredProducts.length === 0 ? (
        <MoaEmptyState
          title={t("product.empty")}
          description={t("product.emptyDescription")}
          icon={LayoutGrid}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <MoaCard
              key={product.productId}
              as="button"
              type="button"
              onClick={() => setViewingProduct(product)}
              className="flex h-full flex-col p-5 text-left transition hover:-translate-y-1 hover:border-[var(--theme-primary)] hover:shadow-[var(--theme-shadow)]"
            >
              <div className="flex items-start gap-4">
                <ProductLogo product={product} className="h-14 w-14 rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)] p-3" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold text-[var(--theme-text)]">
                    {product.productName}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <MoaBadge tone="primary">{product.categoryName || t("product.categoryFallback")}</MoaBadge>
                    {product.productStatus === "INACTIVE" && <MoaBadge>{t("product.inactive")}</MoaBadge>}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[var(--theme-surface-muted)] p-4">
                <p className="text-sm font-semibold text-[var(--theme-text-muted)]">{t("product.monthlyPrice")}</p>
                <p className="mt-1 text-2xl font-bold text-[var(--theme-text)]">
                  {formatLocalizedCurrency(product.price, locale)}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[var(--theme-text-muted)]">
                <span>{t("product.detail")}</span>
                <span className="text-[var(--theme-primary)]">{t("product.available")}</span>
              </div>
            </MoaCard>
          ))}
        </div>
      )}

      <ProductDetailPanel
        product={viewingProduct}
        user={user}
        locale={locale}
        t={t}
        onClose={() => setViewingProduct(null)}
        onSubscribe={handleSubscribe}
        onEdit={(product) => {
          setViewingProduct(null);
          setEditingProduct(product);
        }}
        onDelete={(product) => {
          setViewingProduct(null);
          navigate(`/product/${product.productId}/delete`);
        }}
      />

      {subscribingData && (
        <AddSubscriptionModal
          productId={subscribingData.productId}
          startDate={subscribingData.startDate}
          endDate={subscribingData.endDate}
          onClose={() => setSubscribingData(null)}
          onSuccess={fetchData}
          user={user}
        />
      )}

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSuccess={fetchData}
      />

      <UpdateProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        productId={editingProduct?.productId}
        initialData={editingProduct}
        onSuccess={fetchData}
      />
    </MoaPage>
  );
}
