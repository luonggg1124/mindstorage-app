import { useEffect, useMemo, useState } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { step1Schema } from "../schema";
import type { RegisterSchema } from "../schema";

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

const presetLower = new Set(hobbySuggestions.map((s) => s.toLowerCase()));

type FirstStepProps = {
  control: Control<RegisterSchema>;
  setValue: UseFormSetValue<RegisterSchema>;
  onGateChange: (next: { canProceed: boolean; errorText: string }) => void;
};

export function FirstStep({ control, setValue, onGateChange }: FirstStepProps) {
  const [hobbyModalOpen, setHobbyModalOpen] = useState(false);
  const [hobbyDraft, setHobbyDraft] = useState("");
  /** Gợi ý do người dùng thêm (chưa = đã chọn) */
  const [extraSuggestions, setExtraSuggestions] = useState<string[]>([]);

  const fullName = useWatch({ control, name: "fullName" }) ?? "";
  const gender = useWatch({ control, name: "gender" }) ?? "";
  const hobbies = useWatch({ control, name: "hobbies" }) ?? [];

  useEffect(() => {
    const res = step1Schema.safeParse({
      fullName,
      gender,
      hobbies,
    });
    onGateChange({
      canProceed: res.success,
      errorText: res.success ? "" : res.error.issues[0]?.message ?? "Vui lòng kiểm tra lại thông tin.",
    });
  }, [fullName, gender, hobbies, onGateChange]);

  const fullNameError =
    step1Schema.safeParse({ fullName, gender: "MALE", hobbies: [] }).success ? "" : "Vui lòng nhập họ tên.";
  const genderError = gender ? "" : "Vui lòng chọn giới tính.";

  const addHobbyFromPick = (raw: string) => {
    const hobby = raw.trim();
    if (!hobby) return;
    if (hobbies.some((h) => h.toLowerCase() === hobby.toLowerCase())) return;
    setValue("hobbies", [...hobbies, hobby], { shouldDirty: true, shouldValidate: true });
  };

  const addToSuggestionPool = () => {
    const h = hobbyDraft.trim();
    if (!h) return;
    if (presetLower.has(h.toLowerCase())) return;
    if (extraSuggestions.some((e) => e.toLowerCase() === h.toLowerCase())) return;
    setExtraSuggestions((prev) => [...prev, h]);
    setHobbyDraft("");
  };

  const removeExtraSuggestion = (hobby: string) => {
    setExtraSuggestions((prev) => prev.filter((x) => x !== hobby));
  };

  const handleOpenHobbyModal = (open: boolean) => {
    setHobbyModalOpen(open);
    if (open) setHobbyDraft("");
  };

  const combinedSuggestions = useMemo(
    () => [...hobbySuggestions, ...extraSuggestions],
    [extraSuggestions]
  );

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1 text-slate-200" htmlFor="fullName">
          Họ và tên
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setValue("fullName", e.target.value, { shouldDirty: true, shouldValidate: true })}
          required
          className="h-10 rounded-full border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/30"
          placeholder="Nguyễn Văn A"
        />
        <p className={`mt-1 h-4 text-xs ${fullNameError ? "font-medium text-red-400" : "text-slate-400"}`}>
          {fullNameError || "\u00A0"}
        </p>
      </div>

      <div>
        <Label className="mb-1 text-slate-200" htmlFor="gender">
          Giới tính
        </Label>
        <Select
          value={gender || undefined}
          onValueChange={(next) => setValue("gender", next as RegisterSchema["gender"], { shouldDirty: true, shouldValidate: true })}
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
        <p className={`mt-1 h-4 text-xs ${genderError ? "font-medium text-red-400" : "text-slate-400"}`}>
          {genderError || "\u00A0"}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-slate-200">
            Sở thích <span className="text-xs text-slate-400">(không bắt buộc)</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800"
            onClick={() => handleOpenHobbyModal(true)}
          >
            Thêm
          </Button>
        </div>

        <div className="min-h-10">
          {hobbies.length > 0 && (
            <div className="max-h-24 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby) => (
              <span
                key={hobby}
                className="relative inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
              >
                <span className="pr-4">{hobby}</span>
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "hobbies",
                      hobbies.filter((h) => h !== hobby),
                      { shouldDirty: true, shouldValidate: true }
                    )
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
            </div>
          )}
        </div>

        <p className="h-8 text-xs text-slate-400">
          Bấm Thêm để mở gợi ý: thêm từ khóa vào danh sách gợi ý, rồi bấm gợi ý để chọn sở thích.
        </p>
      </div>

      <Dialog open={hobbyModalOpen} onOpenChange={handleOpenHobbyModal}>
        <DialogContent className="border-slate-800 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gợi ý sở thích</DialogTitle>
            <DialogDescription className="text-slate-400">
              Nhập từ khóa rồi bấm &quot;Thêm sở thích&quot; để đưa vào danh sách bên dưới. Bấm một gợi ý để chọn làm sở thích (có thể chọn nhiều).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex h-10 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-900 ring-offset-slate-950 focus-within:ring-2 focus-within:ring-indigo-500/30">
              <Input
                type="text"
                value={hobbyDraft}
                onChange={(e) => setHobbyDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToSuggestionPool();
                  }
                }}
                className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent px-4 text-white shadow-none placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Ví dụ: bóng đá"
              />
              <Button
                type="button"
                disabled={!hobbyDraft.trim()}
                onClick={addToSuggestionPool}
                className="h-10 shrink-0 rounded-none border-0 border-l border-slate-700 bg-indigo-500 px-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 sm:px-4"
              >
                Thêm sở thích
              </Button>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">Chọn từ gợi ý</p>
              <div className="flex flex-wrap gap-2">
                {combinedSuggestions.map((hobby) => {
                  const isPreset = hobbySuggestions.includes(hobby as (typeof hobbySuggestions)[number]);
                  const selected = hobbies.some((h) => h.toLowerCase() === hobby.toLowerCase());
                  return (
                    <span key={`${hobby}-${isPreset ? "p" : "e"}`} className="inline-flex items-center gap-0.5">
                      <Button
                        type="button"
                        variant={selected ? "secondary" : "outline"}
                        size="xs"
                        disabled={selected}
                        onClick={() => addHobbyFromPick(hobby)}
                        className={
                          selected
                            ? "rounded-full opacity-60"
                            : "rounded-full border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800/60"
                        }
                      >
                        {hobby}
                      </Button>
                      {!isPreset && (
                        <button
                          type="button"
                          onClick={() => removeExtraSuggestion(hobby)}
                          className="rounded-full p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                          aria-label={`Xóa gợi ý ${hobby}`}
                          title="Xóa khỏi gợi ý"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full border-slate-600"
              onClick={() => handleOpenHobbyModal(false)}
            >
              Hoàn thành
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
