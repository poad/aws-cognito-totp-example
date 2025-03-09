import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as deployment from 'aws-cdk-lib/aws-s3-deployment';
import { buildFrontend } from './process/setup';
import { Construct } from 'constructs';


export interface CdkStackProps extends cdk.StackProps {
  appName: string;
  s3bucketName: string;
  userPoolId: string;
  identityPoolId: string,
  clientId: string,
  cognitoDomain: string,
  callbackUrls: string[],
  logoutUrls: string[],
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkStackProps) {
    super(scope, id, props);

    const {
      appName,
      s3bucketName,
      userPoolId,
      identityPoolId,
      clientId,
      cognitoDomain,
      callbackUrls,
      logoutUrls,
    } = props;

    const s3bucket = s3.Bucket.fromBucketName(this, 'Bucket', s3bucketName);

    buildFrontend({
      userPoolId,
      identityPoolId,
      clientId,
      cognitoDomain,
      callbackUrls,
      logoutUrls,
    });

    const deployRole = new iam.Role(this, 'DeployWebsiteRole', {
      roleName: `${appName}-deploy-role`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        's3-policy': new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['s3:*'],
              resources: [`${s3bucket.bucketArn}/`, `${s3bucket.bucketArn}/*`],
            }),
          ],
        }),
      },
    });

    new deployment.BucketDeployment(this, 'DeployWebsite', {
      sources: [deployment.Source.asset(`${process.cwd()}/../dist`)],
      destinationBucket: s3bucket,
      destinationKeyPrefix: '/',
      exclude: ['.DS_Store', '*/.DS_Store'],
      prune: true,
      retainOnDelete: false,
      role: deployRole,
    });
  }
}
