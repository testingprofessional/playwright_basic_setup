import process from 'node:process';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env and provide a value.`,
    );
  }

  return value;
}

export const users = {
  standard: {
    username: requiredEnv('STANDARD_USER_USERNAME'),
    password: requiredEnv('STANDARD_USER_PASSWORD'),
  },

  lockedOut: {
    username: requiredEnv('LOCKED_OUT_USER_USERNAME'),
    password: requiredEnv('LOCKED_OUT_USER_PASSWORD'),
  },

  invalid: {
    username: requiredEnv('INVALID_USER_USERNAME'),
    password: requiredEnv('INVALID_USER_PASSWORD'),
  },
};
