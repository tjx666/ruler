export const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const __DEV__ = ENV === 'development';