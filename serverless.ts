import type { AWS } from '@serverless/typescript';
import shoppingbot from '@functions/shoppingbot';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  PG_HOST,
  PG_DATABASE,
  PG_USERNAME,
  PG_PASSWORD,
  BOT_TOKEN,
  FORBIDDEN_KEYS_ARRAY,
  POLAND_INFO_CHAT_ID,
} = process.env;

const serverlessConfiguration: AWS = {
  service: 'simple-shopping-bot',
  frameworkVersion: '3',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: PG_HOST,
      PG_PORT: '5432',
      PG_DATABASE: PG_DATABASE,
      PG_USERNAME: PG_USERNAME,
      PG_PASSWORD: PG_PASSWORD,
      TELEGRAM_URI: `https://api.telegram.org/bot${BOT_TOKEN}`,
      FORBIDDEN_KEYS_ARRAY,
      BOT_TOKEN,
      CHAT_ID: POLAND_INFO_CHAT_ID,
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    shoppingbot,
  },
};

module.exports = serverlessConfiguration;
