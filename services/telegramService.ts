
/**
 * Telegram Notification Service for Telicom Bangla
 */

// @ts-ignore
const BOT_TOKEN = import.meta.env?.VITE_TELEGRAM_BOT_TOKEN; 
// @ts-ignore
const ADMIN_CHAT_ID = import.meta.env?.VITE_TELEGRAM_CHAT_ID;

/**
 * Sends a message to the Telegram Admin Chat
 */
export const sendAdminNotification = async (message: string) => {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.warn('Telegram Notification Error: Missing BOT_TOKEN or ADMIN_CHAT_ID in environment variables.');
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
        disable_web_page_preview: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API Error:', errorData);
    }
  } catch (error) {
    console.error('Network Error sending Telegram notification:', error);
  }
};

/**
 * Formats a message for New User Registration
 */
export const formatRegistrationMsg = (data: any) => {
  return `
<b>🆕 নতুন ইউজার জয়েন করেছেন!</b>
━━━━━━━━━━━━━━━━━━
<b>👤 নাম:</b> ${data.name || 'নাম নেই'}
<b>📱 মোবাইল:</b> <code>${data.mobile}</code>
<b>📧 ইমেইল:</b> ${data.email || 'N/A'}
<b>🏷️ টাইপ:</b> ${data.type}
<b>🆔 ডিভাইস:</b> <code>${data.deviceId}</code>
<b>📅 সময়:</b> ${new Date().toLocaleString('bn-BD')}
━━━━━━━━━━━━━━━━━━
<i>#NewUser #Registration #TelicomBangla</i>
`;
};

/**
 * Formats a message for Add Money Request
 */
export const formatAddMoneyMsg = (data: any) => {
  return `
<b>💰 নতুন অ্যাড মানি রিকোয়েস্ট!</b>
━━━━━━━━━━━━━━━━━━
<b>👤 ইউজার মোবাইল:</b> <code>${data.userMobile}</code>
<b>💵 টাকার পরিমাণ:</b> <b>৳${data.amount}</b>
<b>💳 মেথড:</b> ${data.method}
<b>📞 প্রেরক নাম্বার:</b> <code>${data.senderMobile}</code>
<b>🆔 TrxID:</b> <code>${data.transactionId}</code>
<b>⏳ স্ট্যাটাস:</b> Pending
<b>📅 সময়:</b> ${new Date().toLocaleString('bn-BD')}
━━━━━━━━━━━━━━━━━━
<i>অ্যাডমিন প্যানেল থেকে দ্রুত ভেরিফাই করুন।</i>
`;
};

/**
 * Formats a message for Service Orders (Recharge/Packs)
 */
export const formatOrderMsg = (data: any) => {
  const icon = data.type.includes('রিচার্জ') || data.type.includes('ফ্লেক্সিলোড') ? '⚡' : '📦';
  return `
<b>${icon} নতুন সার্ভিস অর্ডার!</b>
━━━━━━━━━━━━━━━━━━
<b>🏷️ সার্ভিসের নাম:</b> ${data.type}
<b>📶 অপারেটর:</b> <b>${data.operator}</b>
<b>📱 কাস্টমার নাম্বার:</b> <code>${data.targetNumber}</code>
<b>💵 মূল্য:</b> <b>৳${data.amount}</b>
<b>👤 অর্ডারকারী:</b> <code>${data.userMobile}</code>
<b>⏳ স্ট্যাটাস:</b> Pending
<b>📅 সময়:</b> ${new Date().toLocaleString('bn-BD')}
━━━━━━━━━━━━━━━━━━
<i>#NewOrder #${data.operator} #Pending</i>
`;
};
