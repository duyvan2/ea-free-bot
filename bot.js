const { Bot, InlineKeyboard } = require('grammy');

// Khởi tạo bot với token từ environment variable
const bot = new Bot(process.env.BOT_TOKEN);

// Thông tin cấu hình
const CONFIG = {
  CHANNEL_USERNAME: '@ea_mql5',
  LICENSE_KEY: 'EA-FREE-2025-ABCDE',
  EXPIRE_DATE: '30/01/2026',
  EA_DOWNLOAD_LINK: 'https://www.mql5.com/',
  CHANNEL_ID: null // Sẽ được lấy tự động
};

// Lấy Channel ID từ username
async function getChannelId() {
  try {
    const chat = await bot.api.getChat(CONFIG.CHANNEL_USERNAME);
    CONFIG.CHANNEL_ID = chat.id;
    console.log('✅ Channel ID:', CONFIG.CHANNEL_ID);
  } catch (error) {
    console.error('❌ Không thể lấy Channel ID. Kiểm tra bot đã được thêm vào channel chưa!');
  }
}

// Kiểm tra user đã join channel chưa
async function checkUserJoined(userId) {
  try {
    const member = await bot.api.getChatMember(CONFIG.CHANNEL_USERNAME, userId);
    // Status có thể là: creator, administrator, member
    return ['creator', 'administrator', 'member'].includes(member.status);
  } catch (error) {
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

👉 Liên hệ admin trong channel ${CONFIG.CHANNEL_USERNAME}`,
    { parse_mode: 'Markdown' }
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
  await ctx.answerCallbackQuery(); // Tắt loading icon
  
  const userId = ctx.from.id;
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  // Kiểm tra đã join chưa
  const hasJoined = await checkUserJoined(userId);
  
  if (!hasJoined) {
    // Chưa join
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
    // Đã join → Gửi key
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

💬 *Cần hỗ trợ?* Gõ /support`,
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
          .url('📥 Tải EA', CONFIG.EA_DOWNLOAD_LINK)
          .row()
          .url('📢 Vào Channel', `https://t.me/${CONFIG.CHANNEL_USERNAME.replace('@', '')}`)
      }
    );
    
    console.log(`✅ User ${username} (${userId}) đã nhận key`);
  }
});

// Xử lý lỗi
bot.catch((err) => {
  console.error('❌ Lỗi bot:', err);
});

// Khởi động bot
bot.start().then(() => {
  console.log('🤖 Bot đang chạy...');
  getChannelId(); // Lấy channel ID khi bot khởi động
});
