import clc from 'cli-color';
import { errors, Issuer, TokenSet } from 'openid-client';
import open from 'open';
import * as util from 'util';
import enquirer from 'enquirer';
import { logger } from './utils';
import type { UserTokens } from './config';
import { getCliConfigEnv } from './config';
import ora from 'ora';

async function generateClient() {
  const cliConfig = getCliConfigEnv();

  // fetches the .well-known endpoint for endpoints, issuer value etc.
  const auth0 = await Issuer.discover(`https://${cliConfig.AUTH_DOMAIN}`);

  // instantiates a client
  return new auth0.Client({
    client_id: cliConfig.CLIENT_ID,
    token_endpoint_auth_method: 'none',
    id_token_signed_response_alg: 'RS256',
  });
}

export async function getNewAccessToken(
  refreshToken: string
): Promise<UserTokens> {
  const client = await generateClient();

  const tokenSet = await client.refresh(refreshToken);

  if (!tokenSet.access_token || !tokenSet.expires_at) {
    throw new Error('Token set is invalid. Could not refresh token.');
  }

  return {
    access_token: tokenSet.access_token,
    refresh_token: refreshToken,
    expires_at: tokenSet.expires_at,
  };
}

export const auth = async (): Promise<UserTokens | null> => {
  const cliConfig = getCliConfigEnv();

  const scope = ['openid', 'profile', 'email', 'offline_access'].join(' ');

  const client = await generateClient();

  // Device Authorization Request - https://tools.ietf.org/html/rfc8628#section-3.1
  const handle = await client.deviceAuthorization({
    scope,
    audience: cliConfig.API_AUDIENCE,
  });

  // Device Authorization Response - https://tools.ietf.org/html/rfc8628#section-3.2
  const { verification_uri_complete, user_code, expires_in } = handle;

  // User Interaction - https://tools.ietf.org/html/rfc8628#section-3.3
  await enquirer.prompt([
    {
      type: 'invisible',
      name: 'prompt',
      // eslint-disable-next-line max-len
      message: util.format(
        `${clc.underline(
          'Press any key'
        )} to open up the browser to login or press ctrl-c to abort. You should see the following code: ${clc.green.bgWhite.underline(
          user_code
        )}. It expires in ${
          expires_in % 60 === 0
            ? `${expires_in / 60} minutes`
            : `${expires_in} seconds`
        }.`
      ),
    },
  ]);

  // opens the verification_uri_complete URL using the system-register handler for web links (browser)
  open(verification_uri_complete);

  const spinner = ora(`Waiting for confirmation...`).start();

  // Device Access Token Request - https://tools.ietf.org/html/rfc8628#section-3.4
  // Device Access Token Response - https://tools.ietf.org/html/rfc8628#section-3.5
  let tokens: TokenSet;
  try {
    tokens = await handle.poll();
    spinner.succeed('Done');
  } catch (err) {
    switch (err.error) {
      case 'access_denied': // end-user declined the device confirmation prompt, consent or rules failed
        // logger.warn(`Confirmation was not granted.`);
        spinner.fail('Confirmation was not granted. Aborting.');
        break;
      case 'expired_token': // end-user did not complete the interaction in time
        logger.warn(`Token has expired, you need to login again.`);
        spinner.warn('Token has expired, you need to login again.');
        break;
      default:
        if (err instanceof errors.OPError) {
          logger.error(
            util.format(
              `Login failed. error = ${err.error}; error_description = ${err.error_description}`
            )
          );
          spinner.fail(
            `Login failed. Error description: ${err.error_description}`
          );
        } else {
          throw err;
        }
    }

    return null;
  }

  if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
    throw new Error('Token set is invalid. Could not refresh token.');
  }

  return {
    access_token: tokens.access_token as string,
    refresh_token: tokens.refresh_token as string,
    expires_at: tokens.expires_at as number,
  };
};
