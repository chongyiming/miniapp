const { Telegraf } = require("telegraf");
const TOKEN = "7238888035:AAFK2SjJmpLADB--_8qPpPAJYwSMAv8jm5U";
const bot = new Telegraf(TOKEN);

const web_link = "https://tgtestingbot.netlify.app/";

bot.start((ctx) =>
  ctx.reply("Welcome! Click the button below to open the Mini App:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open Now", // Label for the button
            web_app: { url: web_link }, // Opens the link as a Telegram Mini App
          },
        ],
      ],
    },
  })
);

bot.launch();
