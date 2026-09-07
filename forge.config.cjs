"use strict";

module.exports = {
  appId: "com.coread.game",
  productName: "共读伙伴",
  asar: true,
  electronVersion: "44.1.1",
  electronDist: "node_modules/electron/dist",
  directories: {
    output: "dist"
  },
  files: [
    "electron-main.cjs",
    "v1.html",
    "v1.css",
    "app-v1.js",
    "assets/**/*",
    "package.json",
    "node_modules/electron-squirrel-startup/**/*",
    "node_modules/debug/**/*",
    "node_modules/ms/**/*"
  ],
  win: {
    executableName: "CoRead",
    artifactName: "CoRead-Setup-${version}.${ext}",
    target: [
      {
        target: "nsis",
        arch: ["x64"]
      }
    ]
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "共读伙伴",
    uninstallDisplayName: "共读伙伴"
  },
  publish: null
};
