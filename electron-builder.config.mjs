// @ts-check

import { existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

/** @type {import('electron-builder').Configuration} */
const config = {
  appId: "com.codedrill.app",
  productName: "CodeDrill",
  directories: {
    output: "dist/electron",
    buildResources: "resources",
  },
  files: [
    "electron/**/*",
    "package.json",
  ],
  extraResources: [
    {
      from: "dist/web",
      to: "web",
    },
    {
      from: "core/",
      to: "core/",
      filter: ["**/*.json"],
    },
  ],
  win: {
    target: [
      {
        target: "portable",
        arch: ["x64"],
      },
    ],
  },
  portable: {
    artifactName: "CodeDrill-便携版.exe",
  },
  mac: {
    target: ["dmg"],
  },
  linux: {
    target: ["AppImage"],
  },
};

// 动态添加图标（如果存在）
const iconIco = join(ROOT, "resources", "icon.ico");
const iconIcns = join(ROOT, "resources", "icon.icns");
const iconPng = join(ROOT, "resources", "icon.png");

if (existsSync(iconIco)) {
  config.win.icon = "resources/icon.ico";
  config.nsis.installerIcon = "resources/icon.ico";
  config.nsis.uninstallerIcon = "resources/icon.ico";
  config.nsis.installerHeaderIcon = "resources/icon.ico";
}

if (existsSync(iconIcns)) {
  config.mac.icon = "resources/icon.icns";
}

if (existsSync(iconPng)) {
  config.linux.icon = "resources/icon.png";
}

export default config;
