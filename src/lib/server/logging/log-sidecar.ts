import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import type { ConsoleTransportInstance } from 'winston/lib/winston/transports/index.js';
import { consoleFormat, type LogEntry, type LogSidecarOptions } from './log-types.js';



export class LogSidecar {
  private logger!: winston.Logger;
  private options: Required<LogSidecarOptions>;
  private sizeCheckInterval: NodeJS.Timeout | null = null;

  constructor(options: Partial<LogSidecarOptions> = {}){
    // Default Settings
    this.options = {
      maxFileSize:                options.maxFileSize             ?? '1m',  
      maxFiles:                   options.maxFiles                ?? '3d',
      maxTotalSize:               options.maxTotalSize            ?? 5 * 1024 * 1024, // 5MB
      logDir:                     options.logDir                  || './logs',
      enableSupabaseShipping:     options.enableSupabaseShipping  ?? true,
      logLevel:                   options.logLevel                || 'info',
      compressionEnabled:         options.compressionEnabled      ?? true,
      sizeCheckInterval:          options.sizeCheckInterval       ?? 5 * 60 * 1000,
      enableMetaData:             options.enableMetaData          ?? false,
    };


    this.initializeLogger();
    this.startSizeMonitoring();
  }

  
  private createDailyFileTransport(): DailyRotateFile {
    const fileTransport = new DailyRotateFile({
      filename: path.join(this.options.logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: this.options.maxFileSize,
      maxFiles: this.options.maxFiles,
      zippedArchive: this.options.compressionEnabled,
      auditFile: path.join(this.options.logDir, 'audit.json'),
      level: this.options.logLevel
    }); 

    fileTransport.on('rotate', (oldFilename: string, newFilename: string) => {
      const rotateText = `[Logger] Logs rotated to new daily file: ${oldFilename} --> ${newFilename}`
      console.log(rotateText)
    })

    fileTransport.on('logRemoved', (removedFilename: string) => {
      const removeText = `[Logger] Old Log Removed for clean-up: ${removedFilename}`
      console.log(removeText)
    })
    return fileTransport
  }
  
  private createFileTransport(fileLocation: string) {
    return new winston.transports.File({ 
          filename: path.join(this.options.logDir, fileLocation) 
        })
  }

  private createConsoleTransport(): ConsoleTransportInstance {
    return new winston.transports.Console({ format: consoleFormat})
  }

  private initializeLogger(){
    const transports: winston.transport[] = [];

    // Local file transport with rotation

    const logFormat = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )

    // transports.push(this.createDailyFileTransport())

    if (process.env.NODE_ENV === 'development') 
      transports.push(this.createConsoleTransport());
    
    this.logger = winston.createLogger({
      level: this.options.logLevel,
      format: logFormat,
      transports,
      exceptionHandlers: [  ], // this.createFileTransport('exceptions.log')
      rejectionHandlers: [  ], // this.createFileTransport('rejections.log')
    });
  }

  private startSizeMonitoring(): void{
    this.sizeCheckInterval = setInterval(() => {

      this.checkAndManageSize();
    }, this.options.sizeCheckInterval);
  }

  private async getTotalLogSize(): Promise<number> {
    if (!fs.existsSync(this.options.logDir)) {
      return 0;
    }

    const files = fs.readdirSync(this.options.logDir);
    let totalSize = 0;

    for (const file of files) {
      const filePath = path.join(this.options.logDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    }

    return totalSize;
  }

  public async checkAndManageSize(): Promise<void> {
    try {
      const totalSize = await this.getTotalLogSize();
      
      if (totalSize > this.options.maxTotalSize) {
        await this.cleanupOldLogs();
        
      }
    } catch (error) {
      this.logger.error('[Logger]: Error during size management:', error);
    }
  }

   private parseLogFile(filePath: string): LogEntry[] {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      return lines.map(line => {
        try {
          return JSON.parse(line) as LogEntry;
        } catch {
          return {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: line,
            service: 'sveltekit-app'
          };
        }
      });
    } catch (error) {
      this.logger.error(`[Logger]: Failed to parse log file ${filePath}:`, error);
      return [];
    }
  }

  private getLogs(){
    return fs.readdirSync(this.options.logDir)
      .filter(file => file.includes('.log') && !file.includes('audit'))
      .map(file => ({
        name: file,
        path: path.join(this.options.logDir, file),
        mtime: fs.statSync(path.join(this.options.logDir, file)).mtime
      }))
      .sort((a, b) => a.mtime.getTime() - b.mtime.getTime());
  }

  private async cleanupOldLogs(): Promise<void> {
    if (!fs.existsSync(this.options.logDir)) return;
    
    const files = this.getLogs()

    const targetSize = this.options.maxTotalSize * 0.8;
    
    for (const file of files) {
      if (await this.getTotalLogSize() <= targetSize) break;
      
      
      try {
        fs.unlinkSync(file.path);
        this.logger.info(`[Logger]: Cleaned up old log file: ${file.name}`);
      } catch (error) {
        this.logger.error(`[Logger]: Failed to remove log file ${file.name}:`, error);
      }
    }
  }


  public log(level: string, message: string, meta?: Record<string, unknown>): void {
    this.logger.log(level, message, meta);
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, meta);
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  public async shutdown(): Promise<void> {
    if (this.sizeCheckInterval) {
      clearInterval(this.sizeCheckInterval);
    }

    // Close winston logger
    this.logger.close();
  }
}

let logSidecar: LogSidecar | null = null;

export function createLogSidecar(options?: LogSidecarOptions): LogSidecar {
  if (!logSidecar) {
    logSidecar = new LogSidecar(options);
  }
  return logSidecar;
}

export function getLogSidecar(): LogSidecar {
  if (!logSidecar) {
    throw new Error('Log sidecar not initialized. Call createLogSidecar() first.');
  }
  return logSidecar;
}

export type { LogEntry, LogSidecarOptions };
