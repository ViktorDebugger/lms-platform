"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Chapter, Course, MuxData } from "@/db/schema";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Розділ оновлено");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Щось пішло не так");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Відео розділу
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Скасувати</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Додати відео
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Редагувати відео
            </>
          )}
        </Button>
      </div>

      {!isEditing && !initialData.videoUrl && (
        <div className="mt-2 flex h-60 items-center justify-center rounded-md bg-slate-200">
          <Video className="h-10 w-10 text-slate-500" />
        </div>
      )}
      {!isEditing && initialData.videoUrl && (
        <div className="relative mt-2 aspect-video overflow-hidden rounded-md">
          {initialData?.muxData?.playbackId ? (
            <MuxPlayer
              playbackId={initialData.muxData.playbackId}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-800">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                <p className="text-sm text-white">
                  Відео обробляється. Будь ласка, зачекайте...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-muted-foreground mt-4 text-xs">
            Завантажте відео для цього розділу
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-muted-foreground mt-2 text-xs">
          Відео може оброблятися кілька хвилин. Оновіть сторінку, якщо відео не
          з'являється.
        </div>
      )}
    </div>
  );
};
