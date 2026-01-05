
interface EmailData {
  name: string;
  email: string;
  projectType: string;
  timeline: string;
  message: string;
}

export const generateEmailTemplate = (data: EmailData) => {
  const { name, email, projectType, timeline, message } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #b5b5deff;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #18181b;
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px;
    }
    .field-row {
      margin-bottom: 24px;
      border-bottom: 1px solid #f4f4f5;
      padding-bottom: 16px;
    }
    .field-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #71717a;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .value {
      font-size: 16px;
      color: #18181b;
      font-weight: 500;
    }
    .message-box {
      background-color: #fafafa;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      padding: 20px;
      margin-top: 8px;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #fafafa;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #a1a1aa;
      border-top: 1px solid #f4f4f5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Project Inquiry</h1>
    </div>
    <div class="content">
      <div class="field-row">
        <div class="label">From</div>
        <div class="value">${name}</div>
      </div>
      
      <div class="field-row">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>
      </div>

      <div class="field-row">
        <div class="label">Project Type</div>
        <div class="value">${projectType}</div>
      </div>

      <div class="field-row">
        <div class="label">Timeline</div>
        <div class="value">${timeline}</div>
      </div>

      <div class="field-row" style="border-bottom: none;">
        <div class="label">Message</div>
        <div class="value message-box">${message}</div>
      </div>
    </div>
    <div class="footer">
      <p>This email was sent via your portfolio contact form.</p>
      <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} Sahid. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};
