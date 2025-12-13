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
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@/db/schema";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Зображення обов'язкове",
  }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Курс оновлено");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Щось пішло не так");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Зображення курсу
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Скасувати</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Додати зображення
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Редагувати зображення
            </>
          )}
        </Button>
      </div>

      {!isEditing && !initialData.imageUrl && (
        <div className="mt-2 flex h-60 items-center justify-center rounded-md bg-slate-200">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>
      )}
      {!isEditing && initialData.imageUrl && (
        <div className="relative mt-2 aspect-video">
          <Image
            alt="Зображення курсу"
            fill
            className="rounded-md object-cover"
            src={initialData.imageUrl}
          />
        </div>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-muted-foreground mt-4 text-xs">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
