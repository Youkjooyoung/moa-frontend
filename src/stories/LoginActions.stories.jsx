import { SocialLoginButtons } from "@/pages/user/login/components/SocialLoginButtons";

const meta = {
  title: "MOA/Login/Social Actions",
  component: SocialLoginButtons,
  parameters: {
    layout: "centered",
  },
  args: {
    loginLoading: false,
    onKakao: () => {},
    onGoogle: () => {},
  },
};

export default meta;

export const Ready = {
  render: (args) => (
    <div className="w-[360px] rounded-[32px] bg-[var(--theme-surface)] p-6">
      <SocialLoginButtons {...args} />
    </div>
  ),
};

export const Loading = {
  args: {
    loginLoading: true,
  },
  render: Ready.render,
};
