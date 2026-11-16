"use server";

import { Resend } from "resend";

interface LoginTokenData {
  code: string;
  email: string;
  expiresAt: number;
}

// In-memory token store (valid for 15 minutes)
let activeTokens: LoginTokenData[] = [];

function getAllowedAdminEmails(): string[] {
  const allowed = new Set<string>();

  // Configured emails from environment
  if (process.env.ADMIN_EMAIL) allowed.add(process.env.ADMIN_EMAIL.toLowerCase().trim());
  if (process.env.MY_EMAIL) allowed.add(process.env.MY_EMAIL.toLowerCase().trim());

  // Default known admin addresses
  allowed.add("sahidofficial.dev@gmail.com");
  allowed.add("iamsahidofficial99@gmail.com");

  return Array.from(allowed);
}

export async function sendLoginCode(emailInput: string) {
  const cleanEmail = emailInput.trim().toLowerCase();
  const allowed = getAllowedAdminEmails();

  if (!allowed.includes(cleanEmail)) {
    return {
      success: false,
      error: "This email is not authorized for admin access.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: "Missing RESEND_API_KEY in environment variables.",
    };
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  // Clean old tokens and save
  activeTokens = activeTokens.filter((t) => t.expiresAt > Date.now());
  activeTokens.push({ code, email: cleanEmail, expiresAt });

  const resend = new Resend(apiKey);

  // Attempt sending to user's entered email, fallback to Resend verified account email if needed
  let targetEmail = cleanEmail;
  try {
    let sendResult = await resend.emails.send({
      from: "Portfolio Admin <onboarding@resend.dev>",
      to: [targetEmail],
      subject: `Admin Login Code: ${code}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #050505; color: #f4f4f5; padding: 40px 20px; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto; background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
            <div style="display: inline-block; width: 50px; height: 50px; line-height: 50px; border-radius: 14px; background: linear-gradient(135deg, #8001ff, #9832ff); color: white; font-weight: bold; font-size: 22px; margin-bottom: 20px;">
              A
            </div>
            <h2 style="margin: 0 0 10px; color: #ffffff; font-size: 22px; font-weight: 700;">Admin Sign In</h2>
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Here is your one-time verification code to log into the portfolio Admin Dashboard:
            </p>
            <div style="background: rgba(128, 1, 255, 0.12); border: 1px solid rgba(152, 50, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
              <span style="font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #c084fc;">
                ${code}
              </span>
            </div>
            <p style="color: #71717a; font-size: 13px; margin: 0;">
              This code will expire in <strong style="color: #e4e4e7;">15 minutes</strong>. If you did not request this login code, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (sendResult.error) {
      // If error indicates unverified domain recipient limitation, fallback to registered account email
      if (targetEmail !== "sahidofficial.dev@gmail.com") {
        targetEmail = "sahidofficial.dev@gmail.com";
        const retryResult = await resend.emails.send({
          from: "Portfolio Admin <onboarding@resend.dev>",
          to: [targetEmail],
          subject: `Admin Login Code: ${code}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #050505; color: #f4f4f5; padding: 40px 20px; text-align: center;">
              <div style="max-width: 480px; margin: 0 auto; background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
                <div style="display: inline-block; width: 50px; height: 50px; line-height: 50px; border-radius: 14px; background: linear-gradient(135deg, #8001ff, #9832ff); color: white; font-weight: bold; font-size: 22px; margin-bottom: 20px;">
                  A
                </div>
                <h2 style="margin: 0 0 10px; color: #ffffff; font-size: 22px; font-weight: 700;">Admin Sign In</h2>
                <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                  Here is your one-time verification code to log into the portfolio Admin Dashboard:
                </p>
                <div style="background: rgba(128, 1, 255, 0.12); border: 1px solid rgba(152, 50, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                  <span style="font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #c084fc;">
                    ${code}
                  </span>
                </div>
                <p style="color: #71717a; font-size: 13px; margin: 0;">
                  This code will expire in <strong style="color: #e4e4e7;">15 minutes</strong>. If you did not request this login code, you can safely ignore this email.
                </p>
              </div>
            </div>
          `,
        });

        if (retryResult.error) {
          return { success: false, error: retryResult.error.message };
        }
      } else {
        return { success: false, error: sendResult.error.message };
      }
    }

    return {
      success: true,
      message: `Verification code sent to ${targetEmail}. Please check your inbox.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to send verification email.",
    };
  }
}

export async function verifyLoginCode(code: string) {
  const cleanCode = code.trim();

  // Filter expired tokens
  activeTokens = activeTokens.filter((t) => t.expiresAt > Date.now());

  const tokenIndex = activeTokens.findIndex((t) => t.code === cleanCode);
  if (tokenIndex === -1) {
    return { success: false, error: "Invalid or expired verification code." };
  }

  // Remove used token
  activeTokens.splice(tokenIndex, 1);

  return { success: true };
}
