"use server";

import { Resend } from "resend";
import { generateEmailTemplate } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  name: string;
  email: string;
  projectType: string;
  timeline: string;
  message: string;
}

export async function sendEmail(data: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Missing RESEND_API_KEY environment variable" };
  }

  const myEmail = process.env.MY_EMAIL || "delivered@resend.dev";

  try {
    const { name, email, projectType, timeline, message } = data;

    const { data: id, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [myEmail],
      replyTo: email,
      subject: `New Project Inquiry from ${name}`,
      html: generateEmailTemplate({ name, email, projectType, timeline, message }),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: id };
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
