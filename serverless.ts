import type { AWS } from '@serverless/typescript';
import shoppingbot from '@functions/shoppingbot';
import * as dotenv from 'dotenv';

dotenv.config();

const { TELEGRAM_TOKEN, CURR_LINK } = process.env;

const serverlessConfiguration: AWS = {
  service: 'simple-shopping-bot-2',
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
    runtime: 'nodejs18.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TELEGRAM_URI: `https://api.telegram.org/bot${TELEGRAM_TOKEN}`,
      CURR_LINK,
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    shoppingbot,
  },
};

module.exports = serverlessConfiguration;
