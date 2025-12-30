// Updated: 2025-12-30 - Multi-language support (EN/VI)
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
  CHANNEL_ID: null,
  DEFAULT_LANGUAGE: 'en'
};

// Lưu ngôn ngữ của user
const userLanguages = {};

// Translations
const TEXTS = {
  vi: {
    welcome_title: '🎉 Chào mừng {username} đến với EA Free Trial!',
    free_license: '🎁 *Nhận FREE LICENSE KEY 30 ngày:*',
    slots: '✅ 100 slots available',
    full_features: '✅ Full features',
    expire: '✅ Hết hạn: {date}',
    to_get_key: '📢 *Để nhận key, bạn cần:*',
    step1: '1️⃣ Join channel EA của chúng tôi',
    step2: '2️⃣ Nhấn nút "✅ Đã Join" bên dưới',
    join_channel: '📢 Join Channel',
    already_joined: '✅ Đã Join, Nhận Key Ngay',
    support_title: '💬 *HỖ TRỢ*',
    support_text: 'Nếu bạn gặp vấn đề:\n• Cài đặt EA\n• Sử dụng license key\n• Lỗi kỹ thuật',
    contact_direct: '👉 Liên hệ trực tiếp: {link}',
    contact_admin: '💬 Liên hệ Admin',
    your_key: '🔑 *LICENSE KEY của bạn:*',
    download_ea: '📥 *Tải EA:* {link}',
    not_joined_yet: '❌ Bạn chưa join channel!\n\nGõ /start để nhận key.',
    download_button: '📥 Tải EA',
    channel_button: '📢 Vào Channel',
    not_joined_error: '❌ *Bạn chưa join channel!*',
    please_join: 'Vui lòng:\n1. Click nút "📢 Join Channel" bên dưới\n2. Sau khi join, quay lại nhấn "✅ Đã Join"',
    thank_you: '🎉 *Cảm ơn bạn đã join channel!*',
    license_free: '🔑 *LICENSE KEY FREE 30 NGÀY:*',
    expire_date: '📅 *Hết hạn:* {date}',
    shared_key: '👥 *Key dùng chung cho 100 người*',
    install_guide: '📥 *HƯỚNG DẪN CÀI ĐẶT:*',
    install_step1: '1. Tải EA về từ link bên dưới',
    install_step2: '2. Copy vào MT5/MQL5/Experts',
    install_step3: '3. Nhập key khi EA yêu cầu',
    follow_channel: '📢 *Theo dõi channel để:*',
    benefit1: '✅ Nhận key mới mỗi tháng',
    benefit2: '✅ Backtest & setup mới nhất',
    benefit3: '✅ Tips trading miễn phí',
    need_support: '💬 *Cần hỗ trợ?* {link}',
    change_language: '🌐 Đổi ngôn ngữ',
    language_title: '🌐 *CHỌN NGÔN NGỮ / SELECT LANGUAGE*',
    language_text: 'Vui lòng chọn ngôn ngữ của bạn:\nPlease select your language:',
    language_changed: '✅ Ngôn ngữ đã được chuyển sang Tiếng Việt!\n\nGõ /start để bắt đầu lại.'
  },
  en: {
    welcome_title: '🎉 Welcome {username} to EA Free Trial!',
    free_license: '🎁 *Get FREE LICENSE KEY for 30 days:*',
    slots: '✅ 100 slots available',
    full_features: '✅ Full features',
    expire: '✅ Expires: {date}',
    to_get_key: '📢 *To get your key:*',
    step1: '1️⃣ Join our EA channel',
    step2: '2️⃣ Click "✅ Joined" button below',
    join_channel: '📢 Join Channel',
    already_joined: '✅ Joined, Get Key Now',
    support_title: '💬 *SUPPORT*',
    support_text: 'If you have issues with:\n• EA installation\n• License key usage\n• Technical problems',
    contact_direct: '👉 Contact directly: {link}',
    contact_admin: '💬 Contact Admin',
    your_key: '🔑 *YOUR LICENSE KEY:*',
    download_ea: '📥 *Download EA:* {link}',
    not_joined_yet: '❌ You haven\'t joined the channel yet!\n\nType /start to get your key.',
    download_button: '📥 Download EA',
    channel_button: '📢 Go to Channel',
    not_joined_error: '❌ *You haven\'t joined the channel!*',
    please_join: 'Please:\n1. Click "📢 Join Channel" button below\n2. After joining, come back and click "✅ Joined"',
    thank_you: '🎉 *Thank you for joining our channel!*',
    license_free: '🔑 *FREE LICENSE KEY FOR 30 DAYS:*',
    expire_date: '📅 *Expires:* {date}',
    shared_key: '👥 *Shared key for 100 users*',
    install_guide: '📥 *INSTALLATION GUIDE:*',
    install_step1: '1. Download EA from the link below',
    install_step2: '2. Copy to MT5/MQL5/Experts',
    install_step3: '3. Enter key when EA prompts',
    follow_channel: '📢 *Follow our channel for:*',
    benefit1: '✅ New keys every month',
    benefit2: '✅ Latest backtests & setups',
    benefit3: '✅ Free trading tips',
    need_support: '💬 *Need support?* {link}',
    change_language: '🌐 Change Language',
    language_title: '🌐 *CHỌN NGÔN NGỮ / SELECT LANGUAGE*',
    language_text: 'Vui lòng chọn ngôn ngữ của bạn:\nPlease select your language:',
    language_changed: '✅ Language has been changed to English!\n\nType /start to begin.'
  }
};

// Lấy ngôn ngữ của user
function getUserLanguage(userId, userLangCode) {
  if (userLanguages[userId]) {
    return userLanguages[userId];
  }
  // Auto-detect từ Telegram language
  if (userLangCode && userLangCode.startsWith('vi')) {
    userLanguages[userId] = 'vi';
    return 'vi';
  }
  userLanguages[userId] = CONFIG.DEFAULT_LANGUAGE;
  return CONFIG.DEFAULT_LANGUAGE;
}

// Lấy text theo ngôn ngữ
function getText(userId, key, replacements = {}) {
  const lang = userLanguages[userId] || CONFIG.DEFAULT_LANGUAGE;
  let text = TEXTS[lang][key] || TEXTS[CONFIG.DEFAULT_LANGUAGE][key];
  
  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  
  return text;
}

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
function createKeyboard(userId) {
  return new InlineKeyboard()
    .url(getText(userId, 'join_channel'), `https://t.me/${CONFIG.CHANNEL_USERNAME.replace('@', '')}`)
    .row()
    .text(getText(userId, 'already_joined'), 'check_joined')
    .row()
    .text(getText(userId, 'change_language'), 'change_language');
}

// Keyboard chọn ngôn ngữ
function createLanguageKeyboard() {
  return new InlineKeyboard()
    .text('🇻🇳 Tiếng Việt', 'set_lang_vi')
    .text('🇬🇧 English', 'set_lang_en');
}

// Command /start
bot.command('start', async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  // Auto-detect language
  getUserLanguage(userId, ctx.from.language_code);
  
  console.log(`📥 User ${username} (${userId}) started bot - Lang: ${userLanguages[userId]}`);
  
  await ctx.reply(
    getText(userId, 'welcome_title', { username }) + '\n\n' +
    getText(userId, 'free_license') + '\n' +
    '   ' + getText(userId, 'slots') + '\n' +
    '   ' + getText(userId, 'full_features') + '\n' +
    '   ' + getText(userId, 'expire', { date: CONFIG.EXPIRE_DATE }) + '\n\n' +
    getText(userId, 'to_get_key') + '\n' +
    '   ' + getText(userId, 'step1') + '\n' +
    '   ' + getText(userId, 'step2'),
    {
      parse_mode: 'Markdown',
      reply_markup: createKeyboard(userId)
    }
  );
});

// Command /language
bot.command('language', async (ctx) => {
  await ctx.reply(
    TEXTS.vi.language_title + '\n\n' + TEXTS.vi.language_text,
    {
      parse_mode: 'Markdown',
      reply_markup: createLanguageKeyboard()
    }
  );
});

// Command /support
bot.command('support', async (ctx) => {
  const userId = ctx.from.id;
  
  await ctx.reply(
    getText(userId, 'support_title') + '\n\n' +
    getText(userId, 'support_text') + '\n\n' +
    getText(userId, 'contact_direct', { link: CONFIG.SUPPORT_TELEGRAM }),
    { 
      parse_mode: 'Markdown',
      reply_markup: new InlineKeyboard()
        .url(getText(userId, 'contact_admin'), CONFIG.SUPPORT_TELEGRAM)
    }
  );
});

// Command /key - Xem lại key
bot.command('key', async (ctx) => {
  const userId = ctx.from.id;
  const hasJoined = await checkUserJoined(userId);
  
  if (hasJoined) {
    await ctx.reply(
      getText(userId, 'your_key') + '\n' +
      `\`${CONFIG.LICENSE_KEY}\`\n\n` +
      getText(userId, 'expire_date', { date: CONFIG.EXPIRE_DATE }) + '\n\n' +
      getText(userId, 'download_ea', { link: CONFIG.EA_DOWNLOAD_LINK }),
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
          .url(getText(userId, 'download_button'), CONFIG.EA_DOWNLOAD_LINK)
          .row()
          .url(getText(userId, 'channel_button'), `https://t.me/${CONFIG.CHANNEL_USERNAME.replace('@', '')}`)
      }
    );
  } else {
    await ctx.reply(
      getText(userId, 'not_joined_yet'),
      { reply_markup: createKeyboard(userId) }
    );
  }
});

// Callback: Đổi ngôn ngữ
bot.callbackQuery('change_language', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageReplyMarkup({
    reply_markup: createLanguageKeyboard()
  });
});

// Callback: Set Vietnamese
bot.callbackQuery('set_lang_vi', async (ctx) => {
  const userId = ctx.from.id;
  userLanguages[userId] = 'vi';
  
  await ctx.answerCallbackQuery('✅ Đã chuyển sang Tiếng Việt');
  await ctx.editMessageText(
    TEXTS.vi.language_changed,
    { parse_mode: 'Markdown' }
  );
});

// Callback: Set English
bot.callbackQuery('set_lang_en', async (ctx) => {
  const userId = ctx.from.id;
  userLanguages[userId] = 'en';
  
  await ctx.answerCallbackQuery('✅ Changed to English');
  await ctx.editMessageText(
    TEXTS.en.language_changed,
    { parse_mode: 'Markdown' }
  );
});

// Callback: Check joined
bot.callbackQuery('check_joined', async (ctx) => {
  await ctx.answerCallbackQuery();
  
  const userId = ctx.from.id;
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  
  console.log(`🔍 Checking if user ${username} joined channel...`);
  
  const hasJoined = await checkUserJoined(userId);
  
  if (!hasJoined) {
    console.log(`❌ User ${username} has NOT joined yet`);
    await ctx.editMessageText(
      getText(userId, 'not_joined_error') + '\n\n' +
      getText(userId, 'please_join'),
      {
        parse_mode: 'Markdown',
        reply_markup: createKeyboard(userId)
      }
    );
  } else {
    console.log(`✅ User ${username} (${userId}) đã nhận key`);
    await ctx.editMessageText(
      getText(userId, 'thank_you') + '\n\n' +
      getText(userId, 'license_free') + '\n' +
      `\`${CONFIG.LICENSE_KEY}\`\n\n` +
      getText(userId, 'expire_date', { date: CONFIG.EXPIRE_DATE }) + '\n' +
      getText(userId, 'shared_key') + '\n\n' +
      getText(userId, 'install_guide') + '\n' +
      getText(userId, 'install_step1') + '\n' +
      getText(userId, 'install_step2') + '\n' +
      getText(userId, 'install_step3') + '\n\n' +
      getText(userId, 'follow_channel') + '\n' +
      '   ' + getText(userId, 'benefit1') + '\n' +
      '   ' + getText(userId, 'benefit2') + '\n' +
      '   ' + getText(userId, 'benefit3') + '\n\n' +
      getText(userId, 'need_support', { link: CONFIG.SUPPORT_TELEGRAM }),
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
          .url(getText(userId, 'download_button'), CONFIG.EA_DOWNLOAD_LINK)
          .row()
          .url(getText(userId, 'channel_button'), `https://t.me/${CONFIG.CHANNEL_USERNAME.replace('@', '')}`)
          .row()
          .url(getText(userId, 'contact_admin'), CONFIG.SUPPORT_TELEGRAM)
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
    console.log('🌐 Default language:', CONFIG.DEFAULT_LANGUAGE);
    getChannelId();
  })
  .catch((err) => {
    console.error('❌ Failed to start bot:', err);
    process.exit(1);
  });
