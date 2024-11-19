import dotenv from 'dotenv'
dotenv.config()

export const githubConfig = {
  username: process.env.GITHUB_USERNAME
}

export const XConfig = {
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_SECRET!,
}

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  retryStrategy: (times: number) => {
      return Math.min(times * 50, 2000);
  },
};

export const BullMQConfig = {
  timezone: process.env.BULL_TIMEZONE,
  cronPattern: process.env.BULL_CRON_PATTERN
}