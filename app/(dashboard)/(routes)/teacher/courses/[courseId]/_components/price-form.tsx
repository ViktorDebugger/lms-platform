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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@/db/schema";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z
    .number()
    .min(0, {
      message: "Ціна повинна бути додатнім числом",
    })
    .optional(),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price ? parseFloat(initialData.price) : undefined,
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
        Ціна курсу
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Скасувати</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Редагувати ціну
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {initialData.price
            ? formatPrice(parseFloat(initialData.price))
            : "Безкоштовно"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Встановіть ціну для вашого курсу"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === null) {
                          field.onChange(undefined);
                        } else {
                          const numValue = parseFloat(value);
                          field.onChange(
                            isNaN(numValue) ? undefined : numValue
                          );
                        }
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Зберегти
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
