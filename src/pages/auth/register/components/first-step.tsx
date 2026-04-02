import type { RegisterDraft } from "./types";
import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const hobbySuggestions = [
  "Đọc sách",
  "Nghe nhạc",
  "Chơi game",
  "Du lịch",
  "Nấu ăn",
  "Gym",
  "Chụp ảnh",
  "Vẽ",
] as const;

type FirstStepProps = {
  value: RegisterDraft;
  onChange: (next: RegisterDraft) => void;
};

export function FirstStep({ value, onChange }: FirstStepProps) {
  const hobbiesInputId = useId();
  const [hobbyDraft, setHobbyDraft] = useState("");

  const addHobby = (raw: string) => {
    const hobby = raw.trim();
    if (!hobby) return;
    if (value.hobbies.some((h) => h.toLowerCase() === hobby.toLowerCase())) return;
    onChange({ ...value, hobbies: [...value.hobbies, hobby] });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1 text-slate-200" htmlFor="fullName">
          Họ và tên
        </Label>
        <Input
          id="fullName"
          type="text"
          value={value.fullName}
          onChange={(e) => onChange({ ...value, fullName: e.target.value })}
          required
          className="h-10 rounded-full border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/30"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <Label className="mb-1 text-slate-200" htmlFor="gender">
          Giới tính
        </Label>
        <Select
          value={value.gender || undefined}
          onValueChange={(next) => onChange({ ...value, gender: next as RegisterDraft["gender"] })}
        >
          <SelectTrigger
            id="gender"
            className="h-10 w-full rounded-full border-slate-700 bg-slate-900 px-4 text-white focus-visible:border-indigo-400 focus-visible:ring-indigo-500/30 data-placeholder:text-slate-500"
          >
            <SelectValue placeholder="Chọn giới tính" />
          </SelectTrigger>
          <SelectContent className="border-slate-800 bg-slate-950 text-slate-100">
            <SelectItem value="MALE">Nam</SelectItem>
            <SelectItem value="FEMALE">Nữ</SelectItem>
            <SelectItem value="OTHER">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-slate-200" htmlFor={hobbiesInputId}>
            Sở thích <span className="text-xs text-slate-400">(không bắt buộc)</span>
          </Label>
        </div>

        {value.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="relative inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
              >
                <span className="pr-4">{hobby}</span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...value,
                      hobbies: value.hobbies.filter((h) => h !== hobby),
                    })
                  }
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  aria-label={`Xóa sở thích ${hobby}`}
                  title="Xóa"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id={hobbiesInputId}
            type="text"
            value={hobbyDraft}
            onChange={(e) => setHobbyDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addHobby(hobbyDraft);
                setHobbyDraft("");
              }
            }}
            className="h-10 rounded-full border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/30"
            placeholder="Nhập sở thích (vd: bóng đá)"
          />
          <Button
            type="button"
            onClick={() => {
              addHobby(hobbyDraft);
              setHobbyDraft("");
            }}
            className="h-10 rounded-full bg-indigo-500 px-5 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Thêm
          </Button>
        </div>

        <div className="pt-1 text-xs font-medium text-slate-400">Gợi ý</div>
        <div className="flex flex-wrap gap-2">
          {hobbySuggestions.map((hobby) => {
            const active = value.hobbies.includes(hobby);
            return (
              <Button
                key={hobby}
                type="button"
                onClick={() => {
                  addHobby(hobby);
                }}
                variant={active ? "secondary" : "outline"}
                size="xs"
                className={
                  active
                    ? "rounded-full bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/25"
                    : "rounded-full border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800/60"
                }
              >
                {hobby}
              </Button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400">
          Sở thích là một input (tùy chọn). Bạn có thể nhập tay hoặc bấm gợi ý để thêm nhanh.
        </p>
      </div>
    </div>
  );
}

