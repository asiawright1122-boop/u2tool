/**
 * 库加载器
 * 
 * 统一管理大型库的动态加载，实现：
 * - 库实例缓存（避免重复加载）
 * - 加载状态追踪
 * - 错误处理和重试
 */

type LibraryName = 'xlsx' | 'pdf-lib' | 'pdfjs' | 'echarts' | 'mammoth' | 'jspdf' | 'jszip';

interface LibraryCache {
  instance: any;
  loadTime: number;
  accessCount: number;
}

class LibraryLoader {
  private static instance: LibraryLoader;
  private cache: Map<LibraryName, LibraryCache> = new Map();
  private loading: Map<LibraryName, Promise<any>> = new Map();

  private constructor() {}

  static getInstance(): LibraryLoader {
    if (!LibraryLoader.instance) {
      LibraryLoader.instance = new LibraryLoader();
    }
    return LibraryLoader.instance;
  }

  /**
   * 加载 XLSX 库
   */
  async loadXLSX(): Promise<typeof import('xlsx')> {
    return this.loadLibrary('xlsx', async () => {
      const XLSX = await import('xlsx');
      return XLSX;
    });
  }

  /**
   * 加载 PDF-lib 库
   */
  async loadPDFLib(): Promise<typeof import('pdf-lib')> {
    return this.loadLibrary('pdf-lib', async () => {
      const pdfLib = await import('pdf-lib');
      return pdfLib;
    });
  }

  /**
   * 加载 PDF.js 库
   */
  async loadPDFJS(): Promise<typeof import('pdfjs-dist')> {
    return this.loadLibrary('pdfjs', async () => {
      const pdfjs = await import('pdfjs-dist');
      // 设置 worker
      if (typeof window !== 'undefined') {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      }
      return pdfjs;
    });
  }

  /**
   * 加载 Mammoth 库（Word 文档处理）
   */
  async loadMammoth(): Promise<typeof import('mammoth')> {
    return this.loadLibrary('mammoth', async () => {
      const mammoth = await import('mammoth');
      return mammoth;
    });
  }

  /**
   * 加载 jsPDF 库
   */
  async loadJsPDF(): Promise<typeof import('jspdf')> {
    return this.loadLibrary('jspdf', async () => {
      const jspdf = await import('jspdf');
      return jspdf;
    });
  }

  /**
   * 加载 JSZip 库
   */
  async loadJSZip() {
    return this.loadLibrary('jszip', async () => {
      const jszip = await import('jszip');
      return jszip.default || jszip;
    });
  }

  /**
   * 通用库加载方法
   */
  private async loadLibrary<T>(
    name: LibraryName,
    loader: () => Promise<T>
  ): Promise<T> {
    // 如果已缓存，直接返回
    const cached = this.cache.get(name);
    if (cached) {
      cached.accessCount++;
      return cached.instance as T;
    }

    // 如果正在加载，等待
    const existingPromise = this.loading.get(name);
    if (existingPromise) {
      return existingPromise as Promise<T>;
    }

    // 开始加载
    const startTime = Date.now();
    const loadingPromise = loader();
    this.loading.set(name, loadingPromise);

    try {
      const instance = await loadingPromise;
      const loadTime = Date.now() - startTime;

      // 缓存实例
      this.cache.set(name, {
        instance,
        loadTime,
        accessCount: 1,
      });

      // 记录加载时间
      if (loadTime > 500) {
        console.log(`📦 Library ${name} loaded in ${loadTime}ms`);
      }

      return instance;
    } catch (error) {
      console.error(`Failed to load library ${name}:`, error);
      throw error;
    } finally {
      this.loading.delete(name);
    }
  }

  /**
   * 检查库是否已加载
   */
  isLoaded(name: LibraryName): boolean {
    return this.cache.has(name);
  }

  /**
   * 释放库实例
   */
  release(name: LibraryName) {
    this.cache.delete(name);
  }

  /**
   * 释放所有库实例
   */
  releaseAll() {
    this.cache.clear();
  }

  /**
   * 获取加载统计
   */
  getStats() {
    const stats: Record<string, { loadTime: number; accessCount: number }> = {};
    this.cache.forEach((value, key) => {
      stats[key] = {
        loadTime: value.loadTime,
        accessCount: value.accessCount,
      };
    });
    return stats;
  }

  /**
   * 预加载常用库
   */
  async preloadCommon() {
    // 在空闲时预加载常用库
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        // 不预加载任何库，按需加载
        // 这里可以根据用户行为预测需要的库
      });
    }
  }
}

// 导出单例
export const libraryLoader = LibraryLoader.getInstance();

// 导出便捷函数
export async function loadXLSX() {
  return libraryLoader.loadXLSX();
}

export async function loadPDFLib() {
  return libraryLoader.loadPDFLib();
}

export async function loadPDFJS() {
  return libraryLoader.loadPDFJS();
}

export async function loadMammoth() {
  return libraryLoader.loadMammoth();
}

export async function loadJsPDF() {
  return libraryLoader.loadJsPDF();
}

export async function loadJSZip() {
  return libraryLoader.loadJSZip();
}

export function isLibraryLoaded(name: LibraryName) {
  return libraryLoader.isLoaded(name);
}

export function releaseLibrary(name: LibraryName) {
  libraryLoader.release(name);
}

export function getLibraryStats() {
  return libraryLoader.getStats();
}
