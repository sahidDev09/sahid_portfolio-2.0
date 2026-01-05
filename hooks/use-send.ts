import { useState } from "react";
import { sendEmail } from "@/app/actions/send-email";

export type FormData = {
  name: string;
  email: string;
  projectType: string;
  timeline: string;
  message: string;
};

export const useSend = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (data: FormData) => {
    setIsSending(true);
    setIsSuccess(false);
    setError(null);

    try {
      const result = await sendEmail(data);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error as string);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  return { send, isSending, isSuccess, error };
};
