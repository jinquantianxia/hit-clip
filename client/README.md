# 桌面端

## 技术栈

Tauri + React + Rust + Typescipt + Less + Vite

## 调试说明

请在 src-tauri 下新建 local_service 目录，在目录下放置 ffmpeg 程序(程序文件名：ffmpeg-x86_64-pc-windows-msvc.exe)和打包好的 service 端程序(程序文件名：yinyu-service-x86_64-pc-windows-msvc.exe)。

## 浏览器调试

```sh
yarn dev
```

## tauri 桌面调试

```sh
yarn tauri-dev
```

## 发布

```sh
yarn tauri-build
```
