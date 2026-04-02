import type { RegisterDraft } from "./types";

type SecondStepProps = {
  value: RegisterDraft;
  onChange: (next: RegisterDraft) => void;
};

export function SecondStep({ value, onChange }: SecondStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={value.username}
          onChange={(e) => onChange({ ...value, username: e.target.value })}
          required
          className="w-full rounded-full border border-slate-700 bg-slate-900 p-3 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
          placeholder="username"
          autoCapitalize="none"
          autoCorrect="off"
        />
        <p className="mt-1 text-xs text-slate-400">Gợi ý: 4–20 ký tự, chỉ chữ/số và dấu gạch dưới.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="password">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          value={value.password}
          onChange={(e) => onChange({ ...value, password: e.target.value })}
          required
          className="w-full rounded-full border border-slate-700 bg-slate-900 p-3 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
          placeholder="********"
        />
        <p className="mt-1 text-xs text-slate-400">Gợi ý: nên dùng tối thiểu 6 ký tự.</p>
      </div>
    </div>
  );
}

