"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { File, ImageIcon, Loader2, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@/db/schema";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Курс оновлено");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Щось пішло не так");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Вкладення видалено");
      router.refresh();
    } catch {
      toast.error("Щось пішло не так");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Вкладення курсу
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Скасувати</>}
          {!isEditing && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Додати файли
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm text-slate-500 italic">
              Поки що немає вкладень
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment, index) => (
                <div
                  key={attachment.id}
                  className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                >
                  <File className="mr-2 h-4 w-4 flex-shrink-0" />

                  <p className="line-clamp-1 text-xs">Файл {index + 1}</p>

                  {deletingId === attachment.id && (
                    <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-muted-foreground mt-4 text-xs">
            Додайте все, що може знадобитися вашим студентам для завершення
            курсу.
          </div>
        </div>
      )}
    </div>
  );
};
