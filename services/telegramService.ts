/**
 * Telegram Notification Service
 */

// Vite requires the full static string 'import.meta.env.VITE_...' for build-time replacement.
// Optional chaining added to prevent TypeError if import.meta.env is undefined.
// @ts-ignore
const BOT_TOKEN = import.meta.env?.VITE_TELEGRAM_BOT_TOKEN; 
// @ts-ignore
const ADMIN_CHAT_ID = import.meta.env?.VITE_TELEGRAM_CHAT_ID;

export const sendAdminNotification = async (message: string) => {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.warn('Telegram Notification: Missing credentials. Please check environment variables.');
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram notification');
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};

export const formatRegistrationMsg = (data: any) => {
  return `
<b>🔔 নতুন ইউজার রেজিস্ট্রেশন!</b>
━━━━━━━━━━━━━━━━━━
<b>👤 নাম:</b> ${data.name || 'N/A'}
<b>📱 মোবাইল:</b> ${data.mobile}
<b>📧 ইমেইল:</b> ${data.email}
<b>🆔 ডিভাইস:</b> ${data.deviceId}
<b>📅 সময়:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`;
};

export const formatAddMoneyMsg = (data: any) => {
  return `
<b>💰 অ্যাড মানি রিকোয়েস্ট!</b>
━━━━━━━━━━━━━━━━━━
<b>👤 ইউজার:</b> ${data.userMobile}
<b>💵 পরিমাণ:</b> ৳${data.amount}
<b>💳 মেথড:</b> ${data.method}
<b>📞 প্রেরক নাম্বার:</b> ${data.senderMobile}
<b>🆔 TrxID:</b> <code>${data.transactionId}</code>
<b>📅 সময়:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`;
};

export const formatOrderMsg = (data: any) => {
  return `
<b>⚡ নতুন সার্ভিস অর্ডার!</b>
━━━━━━━━━━━━━━━━━━
<b>👤 ইউজার:</b> ${data.userMobile}
<b>📱 কাস্টমার নাম্বার:</b> ${data.targetNumber}
<b>📶 অপারেটর:</b> ${data.operator}
<b>🏷️ ধরণ:</b> ${data.type}
<b>💵 পরিমাণ:</b> ৳${data.amount}
<b>📅 সময়:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`;
};
