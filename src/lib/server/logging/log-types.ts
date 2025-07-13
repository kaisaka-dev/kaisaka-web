
import chalk from 'chalk'
import winston from 'winston'
import {LEVEL, MESSAGE, SPLAT} from 'triple-beam'
import { type TransformableInfo }from 'logform'
// Side options for logging
export interface LogSidecarOptions {
  maxFileSize?: string;
  maxFiles?: string;
  maxTotalSize?: number;
  enableSupabaseShipping?: boolean;
  logDir?: string;
  logLevel?: string;
  compressionEnabled?: boolean;
  sizeCheckInterval?: number// 5 minutes
}

// Entry Logs 
export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  meta?: Record<string, unknown>;
  service?: string;
  user_id?: string;
  session_id?: string;
}

// All http methods available to be recorded
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

// All log types
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' ;

export interface HttpLogData {
  method: HttpMethod;
  url: string;
  status: number;
  responseTime?: number;
  ip?: string;
  userAgent?: string;
  userId?: string | number;
  [key: string]: unknown;
}

export interface CRUDLogData {
  method: HttpMethod;
  resource: string;
  status: number;
  userId?: string | number;
  id?: string | number;
  [key: string]: unknown;
}

export interface CustomLogData {
  method?: HttpMethod;
  url?: string;
  status?: number;
  [key: string]: unknown;
}

// Status code type guards
const isSuccessStatus = (status: number): boolean => status >= 200 && status < 300;
const isRedirectStatus = (status: number): boolean => status >= 300 && status < 400;
const isClientErrorStatus = (status: number): boolean => status >= 400 && status < 500;
const isServerErrorStatus = (status: number): boolean => status >= 500;

// Color configuration
export const colors = {
  GET: chalk.green,
  POST: chalk.blue,
  PUT: chalk.yellow,
  DELETE: chalk.red,
  PATCH: chalk.magenta,
  HEAD: chalk.gray,
  OPTIONS: chalk.cyan,
  status: {
    success: chalk.green,
    redirect: chalk.yellow,
    clientError: chalk.red,
    serverError: chalk.red.bold
  },
  url: chalk.cyan,
  time: chalk.gray
} as const;


export const statusPairs = [
    { check: isSuccessStatus, color: colors.status.success},
    { check: isRedirectStatus, color: colors.status.redirect},
    { check: isClientErrorStatus, color: colors.status.clientError},
    { check: isServerErrorStatus, color: colors.status.serverError}
  ]
  
type metaData = {
    [LEVEL]?: string;
    [MESSAGE]?: unknown;
    [SPLAT]?: unknown;
    [key: string | symbol]: unknown;
}

// Function to get status color based on status code
export const getStatusColor = (status: number): chalk.Chalk => {
  // For each status pair, find if its check function returns true based on the status, return that
  const mapping = statusPairs.find(({ check }) => check(status));
  return mapping ? mapping.color : chalk.white;
};


export const appendLogMetadata = (meta: metaData) => {
  // Add any additional metadata (excluding winston internal fields)
  const cleanMeta = Object.fromEntries(
    Object.entries(meta).filter(([key]) => 
      !['level', 'message', 'timestamp', 'method', 'url', 'status', 'responseTime'].includes(key)
    )
  );
  

  return (Object.keys(cleanMeta).length > 0) ? `${JSON.stringify(cleanMeta)}` : ``;
}

// Custom format for console (shows time only)
export const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf((info: TransformableInfo) => {
    const { timestamp, level, message, method , url, status, responseTime, ...meta } = info;
    
    const methodHTTP = method as HttpMethod

    let logMessage = `${colors.time(timestamp)} [${level.toUpperCase()}]`;
    
    logMessage += (method && colors[methodHTTP]) ? ` ${colors[methodHTTP](method)}` : ``;
    
    logMessage += url           ? ` '${colors.url(url)}'` : ``;
    
    logMessage += status        ? ` ${getStatusColor(Number(status))(status)}` : ` ---`;
    
    logMessage += responseTime  ? ` ${colors.time(`${responseTime}ms`)}` : ``;
    
    logMessage += ` ${message} ${appendLogMetadata(meta)}`;
    
    return logMessage;
  })
);
