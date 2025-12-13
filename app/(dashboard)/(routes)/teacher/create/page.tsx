"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Назва обов'язкова",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  useEffect(() => {
    document.title = "Створення курсу | Edutrack";
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.success(`Курс "${values.title}" успішно створено`);
      const response = await axios.post("/api/courses", values);

      router.push(`/teacher/courses/${response.data.id}`);
    } catch (error: any) {
      if (error.response) {
        toast.error(`Сервер повернув помилку ${error.response.status}`);
      } else if (error.request) {
        toast.error("Сервер не відповів");
      } else {
        toast.error(`Помилка: ${error.message}`);
      }
    }
  };
  return (
    <div className="mx-auto flex h-full max-w-2xl items-center justify-center p-6">
      <Card className="w-full border-2 border-purple-200/70 shadow-xl dark:border-purple-700/50">
        <CardHeader className="space-y-3 border-b-2 border-purple-100/80 bg-gradient-to-r from-purple-50/60 via-white to-violet-50/60 pb-6 dark:border-purple-900/50 dark:from-purple-950/40 dark:via-gray-900 dark:to-violet-950/40">
          <CardTitle className="bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-3xl font-bold text-transparent dark:from-purple-400 dark:to-violet-400">
            Створення нового курсу
          </CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-300">
            Як би ви хотіли назвати ваш курс? Не хвилюйтеся, ви зможете змінити
            це пізніше.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Назва курсу
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="наприклад: 'Поглиблена веб-розробка'"
                        className="h-11 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                      Чому ви будете навчати в цьому курсі?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-3 border-t-2 border-purple-100/80 pt-6 dark:border-purple-900/50">
                <Link href="/teacher/courses">
                  <Button
                    variant="outline"
                    type="button"
                    className="min-w-[120px] border-2 border-purple-200/70 font-semibold shadow-sm hover:border-purple-300/80 hover:shadow-md dark:border-purple-700/50 dark:hover:border-purple-600/80"
                  >
                    Скасувати
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="min-w-[120px] bg-gradient-to-r from-purple-600 to-violet-600 font-semibold text-white shadow-md hover:from-purple-700 hover:to-violet-700 hover:shadow-lg disabled:opacity-50 dark:from-purple-700 dark:to-violet-700 dark:hover:from-purple-600 dark:hover:to-violet-600"
                >
                  {isSubmitting ? "Створення..." : "Продовжити"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePage;
