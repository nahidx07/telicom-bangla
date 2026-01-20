
/**
 * Telegram Notification Service for Telicom Bangla
 * Uses Telegram Bot API to send real-time alerts to Admin
 */

// @ts-ignore
const BOT_TOKEN = import.meta.env?.VITE_TELEGRAM_BOT_TOKEN; 
// @ts-ignore
const ADMIN_CHAT_ID = import.meta.env?.VITE_TELEGRAM_CHAT_ID;

/**
 * Sends a formatted message to the Telegram Admin Chat
 */
export const sendAdminNotification = async (message: string) => {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.warn('Telegram Notification: BOT_TOKEN or CHAT_ID is missing.');
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    console.error('Notification failed:', error);
  }
};

/**
 * Registration Message Template
 */
export const formatRegistrationMsg = (data: any) => {
  return `
<b>🆕 নতুন ইউজার রেজিস্ট্রেশন!</b>
━━━━━━━━━━━━━━━━━━
<b>👤 নাম:</b> ${data.name || 'N/A'}
<b>📱 মোবাইল:</b> <code>${data.mobile}</code>
<b>📧 ইমেইল:</b> ${data.email || 'N/A'}
<b>🏷️ টাইপ:</b> ${data.type}
<b>🎁 রেফার কোড:</b> ${data.referCode || 'None'}
<b>🆔 আইডি:</b> <code>${data.id}</code>
<b>📅 সময়:</b> ${new Date().toLocaleString('bn-BD')}
━━━━━━━━━━━━━━━━━━
<i>#Registration #NewUser #TelicomBangla</i>
`;
};

/**
 * Add Money Message Template
 */
export const formatAddMoneyMsg = (data: any) => {
  return `
<b>💰 ব্যালেন্স অ্যাড রিকোয়েস্ট!</b>
━━━━━━━━━━━━━━━━━━
<b>💵 পরিমাণ:</b> <b>৳${data.amount}</b>
<b>💳 মেথড:</b> ${data.method}
<b>📱 ইউজার:</b> <code>${data.userMobile}</code>
<b>📞 প্রেরক নাম্বার:</b> <code>${data.senderMobile}</code>
<b>🆔 TrxID:</b> <code>${data.transactionId}</code>
<b>⏳ স্ট্যাটাস:</b> Pending
<b>📅 সময়:</b> ${new Date().toLocaleString('bn-BD')}
━━━━━━━━━━━━━━━━━━
<i>অ্যাডমিন প্যানেল থেকে দ্রুত ভেরিফাই করুন।</i>
`;
};

/**
 * Service Order (Recharge/Pack) Message Template
 */
export const formatOrderMsg = (data: any) => {
  const icon = data.type === 'Recharge' ? '⚡' : '📦';
  return `
<b>${icon} নতুন অর্ডার রিকোয়েস্ট!</b>
━━━━━━━━━━━━━━━━━━
<b>📂 ক্যাটাগরি:</b> ${data.category || data.type}
<b>📶 অপারেটর:</b> <b>${data.operator}</b>
<b>📱 টার্গেট নাম্বার:</b> <code>${data.targetNumber}</code>
<b>💵 মূল্য:</b> <b>৳${data.amount}</b>
<b>👤 অর্ডারকারী:</b> <code>${data.userMobile}</code>
<b>⏳ স্ট্যাটাস:</b> Pending
<b>📅 সময়:</b> ${new Date().toLocaleString('bn-BD')}
━━━━━━━━━━━━━━━━━━
<i>#NewOrder #OrderPending #${data.operator}</i>
`;
};
