declare module 'gifuct-js' {
  interface GIFHeader {
    signature: string;
    version: string;
  }

  interface GIFLogicalScreenDescriptor {
    width: number;
    height: number;
    backgroundColorIndex: number;
    pixelAspectRatio: number;
    globalColorTableFlag: boolean;
    colorResolution: number;
    sortFlag: boolean;
    globalColorTableSize: number;
  }

  interface GIFFrame {
    gce?: {
      disposalMethod: number;
      userInputFlag: boolean;
      transparencyGiven: boolean;
      delayTime: number;
      transparencyIndex: number;
    };
    image?: {
      left: number;
      top: number;
      width: number;
      height: number;
      localColorTableFlag: boolean;
      interlaceFlag: boolean;
      sortFlag: boolean;
      localColorTableSize: number;
      data: Uint8Array;
    };
  }

  interface ParsedGIF {
    header: GIFHeader;
    lsd: GIFLogicalScreenDescriptor;
    gct?: number[][];
    frames: GIFFrame[];
  }

  interface DecompressedFrame {
    dims: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
    delay: number;
    patch: Uint8ClampedArray;
    disposalType: number;
    transparentIndex?: number;
  }

  export function parseGIF(arrayBuffer: ArrayBuffer): ParsedGIF;
  export function decompressFrames(gif: ParsedGIF, buildImagePatches?: boolean): DecompressedFrame[];
}
