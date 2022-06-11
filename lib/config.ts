export interface Config {
  JOIN_MAILING_LIST_URL?: string;
  MY_NAME: string;
  GOOGLE_ANALYTICS_MEASUREMENT_ID?: string;
}

export function Config(): Config {
  return {
    JOIN_MAILING_LIST_URL: process.env.JOIN_MAILING_LIST_URL,
    MY_NAME: 'Cam Feenstra',
    GOOGLE_ANALYTICS_MEASUREMENT_ID:
      process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
  };
}

export default Config;
