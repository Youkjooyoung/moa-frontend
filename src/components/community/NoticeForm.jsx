import { useNavigate } from "react-router-dom";
import {
  MoaButton,
  MoaField,
  MoaInput,
  MoaTextarea,
} from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";

const NoticeForm = ({ formData, setFormData, onSubmit, submitText, cancelPath }) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <MoaField label={t("community.form.title")}>
        <MoaInput
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={t("community.form.titlePlaceholder")}
        />
      </MoaField>

      <MoaField label={t("community.form.content")}>
        <MoaTextarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder={t("community.form.contentPlaceholder")}
          rows={12}
        />
      </MoaField>

      <div className="flex items-center justify-end gap-3 pt-2">
        <MoaButton
          type="button"
          variant="secondary"
          onClick={() => navigate(cancelPath)}
        >
          {t("community.form.cancel")}
        </MoaButton>
        <MoaButton type="submit">{submitText}</MoaButton>
      </div>
    </form>
  );
};

export default NoticeForm;
