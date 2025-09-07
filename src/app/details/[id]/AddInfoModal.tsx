// components/AddInfoModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Upload } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function maskPhone(v: string) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4}).*/, "$1-$2");
}

function maskDate(v: string) {
  return v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/(\/\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

export function AddInfoModal({ open, onOpenChange }: Props) {
  const [seenAt, setSeenAt] = useState("");
  const [seenDate, setSeenDate] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // gera/limpa Object URLs
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  // ---- RESET TOTAL ----
  const resetForm = () => {
    // revoga previews atuais antes de limpar
    previews.forEach((u) => URL.revokeObjectURL(u));
    setSeenAt("");
    setSeenDate("");
    setPhone("");
    setNotes("");
    setFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // intercepta mudança de open (close por X/overlay/esc)
  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const onPickFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const arr = e.target.files ? Array.from(e.target.files) : [];
    if (arr.length) setFiles((prev) => [...prev, ...arr]);
    e.currentTarget.value = "";
  };

  const removeAt = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0">
        <div className="max-h-[80vh] overflow-auto p-6">
          <DialogHeader>
            <DialogTitle>Adicionar informações</DialogTitle>
            <DialogDescription>
              Registre um avistamento recente, anexe fotos e dados de contato.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // enviar ficará desabilitado por enquanto
            }}
            className="mt-4 space-y-4"
          >
            <div className="grid gap-2">
              <span className="text-sm font-medium">Local avistado</span>
              <Input
                placeholder="Ex.: Praça Popular, Cuiabá/MT"
                value={seenAt}
                onChange={(e) => setSeenAt(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">Data do avistamento</span>
              <Input
                placeholder="dd/mm/aaaa"
                inputMode="numeric"
                value={seenDate}
                onChange={(e) => setSeenDate(maskDate(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">Telefone para contato</span>
              <Input
                placeholder="(65) 9XXXX-XXXX"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">Observações</span>
              <Textarea
                placeholder="Descreva o avistamento, vestimentas, horário, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">Anexar fotos</span>

              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onPickFiles}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Escolher arquivos
                </Button>
                <span className="text-xs text-slate-500">
                  {files.length
                    ? `${files.length} arquivo(s) selecionado(s)`
                    : "Nenhum arquivo selecionado"}
                </span>
              </div>

              {previews.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="max-h-64 overflow-auto pr-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {previews.map((src, i) => (
                        <div
                          key={src}
                          className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50"
                        >
                          <img
                            src={src}
                            alt={`Prévia ${i + 1}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <button
                            type="button"
                            onClick={() => removeAt(i)}
                            className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow hover:bg-white"
                            aria-label="Remover imagem"
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled className="gap-2">
                <ImagePlus className="h-4 w-4" />
                Enviar (indisponível)
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
