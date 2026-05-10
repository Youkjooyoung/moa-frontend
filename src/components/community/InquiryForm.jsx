import { useRef } from "react";
import { X } from "lucide-react";
import {
  MoaButton,
  MoaCard,
  MoaField,
  MoaInput,
  MoaSelect,
  MoaTextarea,
} from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

const InquiryForm = ({
  formData,
  setFormData,
  imagePreview,
  setImageFile,
  setImagePreview,
  onSubmit,
}) => {
  const fileInputRef = useRef(null);
  const { t } = useI18n();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("JPG, PNG 파일만 업로드 가능합니다.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("파일 크기는 10MB 이하만 가능합니다.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <MoaCard className="p-5 sm:p-6">
      <div className="space-y-5">
        <MoaField label={t("community.form.category")}>
          <MoaSelect
            name="communityCodeId"
            value={formData.communityCodeId}
            onChange={handleChange}
          >
            <option value="1">{t("category.member")}</option>
            <option value="2">{t("category.payment")}</option>
            <option value="3">{t("category.etc")}</option>
          </MoaSelect>
        </MoaField>

        <MoaField label={t("community.form.title")}>
          <MoaInput
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t("community.inquiry.titlePlaceholder")}
            maxLength="200"
          />
        </MoaField>

        <MoaField label={t("community.form.content")}>
          <MoaTextarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder={t("community.inquiry.contentPlaceholder")}
            rows={7}
            maxLength="500"
          />
        </MoaField>

        <MoaField label={t("community.inquiry.attachment")} hint={t("community.inquiry.imageHint")}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            className="block w-full text-sm font-semibold text-[var(--theme-text-muted)] file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--theme-primary)] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
          />
        </MoaField>

        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="미리보기"
              className="max-h-24 max-w-40 rounded-xl border border-[var(--theme-border)] object-contain"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#f04452] text-white"
              aria-label="첨부 이미지 삭제"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <MoaButton onClick={onSubmit} className="w-full">
          {t("community.inquiry.submit")}
        </MoaButton>
      </div>
    </MoaCard>
  );
};

export default InquiryForm;
