#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {
  CloudfrontCdnTemplateStack,
} from '../lib/cdk-stack';

interface Config {
  stackName: string;
  domain: string;
  callbackUrls: string[],
  logoutUrls: string[],
  bucketName: string;
  cloudfront: {
    comment: string;
  };
}

const app = new cdk.App();

const config: Config = app.node.tryGetContext('config');

new CloudfrontCdnTemplateStack(app, config.stackName, {
  appName: 'aws-cognito-totp-example',
  domain: config.domain,
  callbackUrls: config.callbackUrls,
  logoutUrls: config.logoutUrls,
  bucketName: config.bucketName,
  cloudfront: config.cloudfront,
});

