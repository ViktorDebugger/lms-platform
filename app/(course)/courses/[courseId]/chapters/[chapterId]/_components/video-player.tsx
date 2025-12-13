"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  playbackId?: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  useEffect(() => {
    if (playbackId && !isLocked) {
      setIsLoading(true);
      setHasError(false);
      setIsReady(false);
    }
  }, [playbackId, isLocked]);

  useEffect(() => {
    if (!playbackId || isLocked) return;

    const timeout = setTimeout(() => {
      if (isLoading && !isReady) {
        setHasError(true);
        setIsLoading(false);
        toast.error(
          "Відео занадто довго завантажується. Можливо, воно ще обробляється. Спробуйте оновити сторінку через кілька хвилин."
        );
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [playbackId, isLocked, isLoading, isReady]);

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Прогрес оновлено");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Щось пішло не так");
    }
  };

  const handleCanPlay = () => {
    setIsReady(true);
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    toast.error("Помилка завантаження відео. Спробуйте оновити сторінку.");
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  if (isLocked) {
    return (
      <div className="text-secondary relative flex aspect-video w-full flex-col items-center justify-center gap-y-3 rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Lock className="h-10 w-10 text-gray-400" />
        <p className="text-base font-medium text-gray-300">
          Цей розділ заблоковано
        </p>
      </div>
    );
  }

  if (!playbackId) {
    return (
      <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-y-3 rounded-xl bg-white shadow-2xl dark:bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-black dark:text-white" />
        <p className="text-base font-medium text-black dark:text-white">
          Завантаження
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm dark:bg-gray-950/95">
          <Loader2 className="h-10 w-10 animate-spin text-black dark:text-white" />
          <p className="mt-3 text-base font-medium text-black dark:text-white">
            Завантаження
          </p>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-y-3 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm dark:from-gray-950/95 dark:via-gray-900/95 dark:to-gray-950/95">
          <Play className="h-10 w-10 text-gray-400" />
          <p className="text-base font-medium text-gray-300">
            Помилка завантаження відео
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              window.location.reload();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring mt-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
          >
            Оновити сторінку
          </button>
        </div>
      )}
      <MuxPlayer
        title={title}
        className={cn(
          "h-full w-full min-w-0 rounded-xl",
          (!isReady || isLoading || hasError) && "opacity-0"
        )}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        onError={handleError}
        onEnded={onEnd}
        playbackId={playbackId}
        streamType="on-demand"
        metadata={{
          video_title: title,
          video_id: chapterId,
        }}
      />
    </div>
  );
};
