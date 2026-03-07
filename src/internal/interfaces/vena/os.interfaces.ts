export interface VenaOS {
  platform: NodeJS.Platform;
  arch: NodeJS.Process["arch"];

  isWindows: boolean;
  isLinux: boolean;
}
