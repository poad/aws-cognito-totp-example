#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

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
const s3bucketName = app.node.tryGetContext('s3bucketName');
const userPoolId = app.node.tryGetContext('userPoolId');
const clientId = app.node.tryGetContext('clientId');
const identityPoolId = app.node.tryGetContext('identityPoolId');
const cognitoDomain = app.node.tryGetContext('cognitoDomain');
const cfUrl = app.node.tryGetContext('cfUrl');

new CdkStack(app, 'aws-cognito-totp-example-deploy', {
  appName: 'aws-cognito-totp-example',
  s3bucketName,
  userPoolId,
  identityPoolId,
  clientId,
  cognitoDomain,
  callbackUrls: [...config.callbackUrls, cfUrl],
  logoutUrls: [...config.logoutUrls, cfUrl],
});
