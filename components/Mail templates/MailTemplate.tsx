import * as React from 'react';

interface EmailTemplateProps {
  userName: string;
  message: string;
}

export function EmailTemplate({ userName, message }: { userName: string; message: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
      <h1 style="color: #333;">Hey, ${userName}!</h1>
      <p style="font-size: 16px; color: #555;">${message}</p>
    </div>
  `;
}
