import * as childProcess from 'child_process';
import * as fs from 'fs';

export function buildFrontend(params: {
  userPoolId: string,
  identityPoolId: string,
  clientId: string,
  cognitoDomain: string,
  logoutUrls: string[],
  callbackUrls: string[],
}) {

  const amolifyOutputs = {
    auth: {
      'user_pool_id': params.userPoolId,
      'aws_region': 'us-west-2',
      'user_pool_client_id': params.clientId,
      'identity_pool_id': params.identityPoolId,
      'mfa_methods': [
        'TOTP',
      ],
      'standard_required_attributes': [
        'email',
      ],
      'username_attributes': [
        'email',
      ],
      'user_verification_types': [
        'email',
      ],
      'groups': [],
      'mfa_configuration': 'REQUIRED',
      'password_policy': {
        'min_length': 8,
        'require_lowercase': true,
        'require_numbers': true,
        'require_symbols': true,
        'require_uppercase': true,
      },
      'unauthenticated_identities_enabled': true,
      oauth: {
        domain: params.cognitoDomain,
        scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        redirect_sign_in_uri: params.callbackUrls,
        redirect_sign_out_uri: params.logoutUrls,
        response_type: 'code',
      },

    },
    'version': '1.3',
  };

  fs.writeFileSync('../amplify_outputs.json', JSON.stringify(amolifyOutputs, null, 2));

  [`${process.cwd()}/../dist`].forEach(
    (dir) => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, {
          recursive: true,
        });
      }
    },
  );

  ['pnpm build'].forEach((cmd) => {
    childProcess.execSync(cmd, {
      cwd: `${process.cwd()}/..`,
      stdio: ['ignore', 'inherit', 'inherit'],
      env: { ...process.env },
      shell: 'bash',
    });
  });
};
