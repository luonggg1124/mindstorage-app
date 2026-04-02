"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

type ImagePickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (image: File | string) => void;
  title?: string;
};

export default function ImagePickerModal({
  open,
  onClose,
  onSelect,
  title = "Chọn hình ảnh",
}: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = React.useState("upload");
  const [url, setUrl] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onSelect(file);
    onClose();
  };

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onSelect(url.trim());
      setUrl("");
      onClose();
    }
  };

  React.useEffect(() => {
    if (!open) {
      setUrl("");
      setActiveTab("upload");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="w-[92vw] max-w-[1100px]  max-h-[85vh] overflow-y-auto">
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors pointer-events-auto ${
                  activeTab === "upload"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors pointer-events-auto ${
                  activeTab === "url"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors pointer-events-auto ${
                  activeTab === "library"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Thư viện
              </button>
            </div>

            {activeTab === "upload" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-8">
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors w-fit min-w-50"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Chọn file
                  </button>
                  <p className="text-xs text-muted-foreground text-center max-w-md">
                    Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF, etc.), kích thước tối đa 4MB
                  </p>
                </div>
              </div>
            )}

            {activeTab === "url" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-8">
                  <Label htmlFor="image-url" className="text-center">
                    Nhập URL hình ảnh
                  </Label>
                  <div className="w-full flex justify-center">
                    <input
                      id="image-url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUrlSubmit();
                        }
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUrlSubmit}
                    disabled={!url.trim()}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors w-fit min-w-[200px] ${
                      !url.trim()
                        ? "opacity-50 pointer-events-none bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    Sử dụng URL này
                  </button>
                </div>
              </div>
            )}

            {activeTab === "library" && (
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Chức năng thư viện đang được phát triển</p>
                  <p className="text-xs mt-2">Sẽ cho phép chọn từ thư viện hình ảnh đã upload trước đó</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
