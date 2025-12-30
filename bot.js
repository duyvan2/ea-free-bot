// Updated: 2025-12-30 - Fix token loading & Add direct support contact
const { Bot, InlineKeyboard } = require('grammy');

// Kiểm tra token trước khi khởi tạo bot
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ CRITICAL ERROR: BOT_TOKEN is not set!');
  console.error('Please add BOT_TOKEN to Railway Variables');
  process.exit(1);
}

console.log('✅ BOT_TOKEN loaded successfully');
console.log('Token starts with:', BOT_TOKEN.substring(0, 10) + '...');

// Khởi tạo bot
const bot = new Bot(BOT_TOKEN);

// Thông tin cấu hình
const CONFIG = {
  CHANNEL_USERNAME: '@ea_mql5',
  LICENSE_KEY: 'EA-FREE-2025-ABCDE',
  EXPIRE_DATE: '30/01/2026',
  EA_DOWNLOAD_LINK: 'https://www.mql5.com/',
  SUPPORT_TELEGRAM: 'https://t.me/DuyVanNguy',
  CHANNEL_ID: null
};

// Lấy Channel ID từ username
async function getChannelId() {
  try {
    const chat = await bot.api.getChat(CONFIG.CHANNEL_USERNAME);
    CONFIG.CHANNEL_ID = chat.id;
    console.log('✅ Channel ID:', CONFIG.CHANNEL_ID);
  } catch (error) {
    console.error('❌ Không thể lấy Channel ID:', error.message);
    console.error('⚠️ Kiểm tra bot đã được thêm vào channel chưa!');
  }
}

// Kiểm tra user đã join channel chưa
async function checkUserJoined(userId) {
  try {
    const member = await bot.api.getChatMember(CONFIG.CHANNEL_USERNAME, userId);
    return ['creator', 'administrator', 'member'].includes(member.status);
  } catch (error) {
    console.error(`Error checking user ${userId}:`, error.message);
    return false;
  }
}

// Tạo keyboard với 2 nút
function createKeyboard() {
  return new InlineKeyboard()
    .url('📢 Join Channel', `https://t.me/${CONFIG.CHANNEL_USERNAME.replace('@', '')}`)
    .row()
    .text('✅ Đã Join, Nhận Key Ngay', 'check_joined');
}

// Command /start
bot.command('start', async (ctx) => {
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  console.log(`📥 User ${username} (${ctx.from.id}) started bot`);
  
  await ctx.reply(
    `🎉 *Chào mừng ${username} đến với EA Free Trial!*

🎁 *Nhận FREE LICENSE KEY 30 ngày:*
   ✅ 100 slots available
   ✅ Full features
   ✅ Hết hạn: ${CONFIG.EXPIRE_DATE}

📢 *Để nhận key, bạn cần:*
   1️⃣ Join channel EA của chúng tôi
   2️⃣ Nhấn nút "✅ Đã Join" bên dưới`,
    {
      parse_mode: 'Markdown',
      reply_markup: createKeyboard()
    }
  );
});

// Command /support
bot.command('support', async (ctx) => {
  await ctx.reply(
    `💬 *HỖ TRỢ*

Nếu bạn gặp vấn đề:
• Cài đặt EA
• Sử dụng license key
• Lỗi kỹ thuật

👉 Liên hệ trực tiếp: ${CONFIG.SUPPORT_TELEGRAM}`,
    { 
      parse_mode: 'Markdown',
      reply_markup: new InlineKeyboard()
        .url('💬 Liên hệ Admin', CONFIG.SUPPORT_TELEGRAM)
    }
  );
});

// Command /key - Xem lại key (nếu đã nhận)
bot.command('key', async (ctx) => {
  const hasJoined = await checkUserJoined(ctx.from.id);
  
  if (hasJoined) {
    await ctx.reply(
      `🔑 *LICENSE KEY của bạn:*
\`${CONFIG.LICENSE_KEY}\`

📅 *Hết hạn:* ${CONFIG.EXPIRE_DATE}

📥 *Tải EA:* ${CONFIG.EA_DOWNLOAD_LINK}`,
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
          .url('📥 Tải EA', CONFIG.EA_DOWNLOAD_LINK)
          .row()
          .url('📢 Vào Channel', `https://t.me/${CONFIG.CHANNEL_USERNAME.replace('@', '')}`)
      }
    );
  } else {
    await ctx.reply(
      '❌ Bạn chưa join channel!\n\nGõ /start để nhận key.',
      { reply_markup: createKeyboard() }
    );
  }
});

// Xử lý callback khi user nhấn nút "✅ Đã Join"
bot.callbackQuery('check_joined', async (ctx) => {
  await ctx.answerCallbackQuery();
  
  const userId = ctx.from.id;
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  console.log(`🔍 Checking if user ${username} joined channel...`);
  
  const hasJoined = await checkUserJoined(userId);
  
  if (!hasJoined) {
    console.log(`❌ User ${username} has NOT joined yet`);
    await ctx.editMessageText(
      `❌ *Bạn chưa join channel!*

Vui lòng:
1. Click nút "📢 Join Channel" bên dưới
2. Sau khi join, quay lại nhấn "✅ Đã Join"`,
      {
        parse_mode: 'Markdown',
        reply_markup: createKeyboard()
      }
    );
  } else {
    console.log(`✅ User ${username} (${userId}) đã nhận key`);
    await ctx.editMessageText(
      `🎉 *Cảm ơn bạn đã join channel!*

🔑 *LICENSE KEY FREE 30 NGÀY:*
\`${CONFIG.LICENSE_KEY}\`

📅 *Hết hạn:* ${CONFIG.EXPIRE_DATE}
👥 *Key dùng chung cho 100 người*

📥 *HƯỚNG DẪN CÀI ĐẶT:*
1. Tải EA về từ link bên dưới
2. Copy vào MT5/MQL5/Experts
3. Nhập key khi EA yêu cầu

📢 *Theo dõi channel để:*
   ✅ Nhận key mới mỗi tháng
   ✅ Backtest & setup mới nhất
   ✅ Tips trading miễn phí

💬 *Cần hỗ trợ?* ${CONFIG.SUPPORT_TELEGRAM}`,
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
          .url('📥 Tải EA', CONFIG.EA_DOWNLOAD_LINK)
          .row()
          .url('📢 Vào Channel', `https://t.me/${CONFIG.CHANNEL_USERNAME.replace('@', '')}`)
          .row()
          .url('💬 Liên hệ Admin', CONFIG.SUPPORT_TELEGRAM)
      }
    );
  }
});

// Xử lý lỗi
bot.catch((err) => {
  console.error('❌ Lỗi bot:', err);
});

// Khởi động bot
console.log('🚀 Starting bot...');
bot.start()
  .then(() => {
    console.log('🤖 Bot đang chạy...');
    console.log('📡 Bot username:', bot.botInfo.username);
    getChannelId();
  })
  .catch((err) => {
    console.error('❌ Failed to start bot:', err);
    process.exit(1);
  });
