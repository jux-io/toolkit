import { Config } from '@oclif/core';
import axios, { AxiosError, type AxiosInstance } from 'axios';
import https from 'https';
import { logger } from '../utils';
import { getNewAccessToken } from '../auth';
import {
  type APIConfig,
  createInternalConfig,
  type JuxInternalCliConfig,
  type UserTokens,
} from '../config';
import { DesignTokens } from '@juxio/design-tokens';

export interface ComponentDependencies {
  name: string;
  id: string; // The node id this component depends on (should be an instance node)
}

export interface ComponentFileStructure {
  name: string;
  dependencies: ComponentDependencies[];
  file: {
    name: string;
    content: string;
  };
}

export interface TokenSet {
  name: string;
  value: DesignTokens;
}

export class JuxAPI {
  private readonly configDir: string;
  private readonly tokens: UserTokens;
  protected readonly organizationId: number | null | undefined;
  protected axios: AxiosInstance;
  protected apiServer: string;

  constructor(
    { userAgent, configDir }: Config,
    internalConfig: JuxInternalCliConfig,
    apiConfig: APIConfig
  ) {
    // Get new access token using refresh token if access token is expired
    if (!internalConfig) {
      throw new Error(`Internal config is invalid. Please login again.`);
    }

    this.configDir = configDir;
    this.tokens = internalConfig.tokens;
    this.organizationId = internalConfig.organizationId;
    this.apiServer = apiConfig.API_SERVER;

    this.axios = axios.create({
      withCredentials: true,
      httpsAgent: new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      }),
    });

    this.axios.interceptors.request.use(async (axiosRequestConfig) => {
      let accessToken = this.tokens.access_token;
      // If token is expired, get new access token using refresh token
      // expires_at is in seconds, while Date.now() is in milliseconds. Divide it by 1000 to convert it to seconds
      if (Math.floor(Date.now()) / 1000 > this.tokens.expires_at) {
        logger.verbose(`Token has expired. Getting new access token...`);
        const tokens = await getNewAccessToken(this.tokens.refresh_token);

        // Update tokens in internal config
        createInternalConfig(this.configDir, {
          tokens: {
            ...tokens,
            refresh_token: this.tokens.refresh_token,
          },
          organizationId: this.organizationId,
        });

        accessToken = tokens.access_token;
      }

      axiosRequestConfig.headers.Authorization = `Bearer ${accessToken}`;
      axiosRequestConfig.headers['User-Agent'] = userAgent;
      return axiosRequestConfig;
    });

    this.axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error: AxiosError) {
        if (error.response) {
          let logMessage = `Request failed with error: ${error.message}`;

          switch (error.response.status) {
            case 400:
              logMessage = `Request failed with error: BAD_REQUEST (400)`;
              break;
            case 401:
              logMessage = `CLI is unauthorized (401). Please login again.`;
              break;
            case 403:
              logMessage = `Request failed with error: FORBIDDEN (403)`;
              break;
            case 404:
              logMessage = `Request failed with error: NOT_FOUND (404)`;
              break;
            case 413:
              logMessage = `Request failed with error: LARGE_FILE (413)`;
              break;
            case 500:
              logMessage = `Request failed with error: INTERNAL_SERVER_ERROR (500)`;
              break;
          }

          // 404 is not an error, so log it as verbose
          // Any status codes that falls outside the range of 2xx cause this function to trigger
          // Do something with response error
          logger[error.response.status === 404 ? 'verbose' : 'error'](
            logMessage,
            {
              status: error.response.status,
              method: error.request.method,
              path: error.request.path,
              data: error.response.data,
            }
          );
        } else {
          logger.error(`Request failed with error: ${error.message}`, {
            error,
            stack: error.stack,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  get orgId() {
    if (!this.organizationId) {
      logger.error(
        'No organization found. You need to create an organization first.'
      );
      throw new Error('No organization found.');
    }
    return this.organizationId;
  }

  async pullGeneratedComponentsCode(components: string[] = []) {
    const { data } = await this.axios.get<ComponentFileStructure[]>(
      `${this.apiServer}/library`,
      {
        params: {
          organizationId: this.orgId,
          components: components.join(','),
        },
      }
    );
    return data;
  }

  async pullDesignTokens() {
    const { data } = await this.axios.get<TokenSet[]>(
      `${this.apiServer}/themes/token-sets`,
      {
        params: {
          organizationId: this.orgId,
        },
      }
    );
    return data;
  }
}
