# 本地服务端

在客户端启动时会主动拉起本地服务端程序，默认端口 8099

## 技术栈

Actix-web + Rust

## 调试说明

ffmpeg 程序请自行打包好并放在 service 路径下，程序名改为：ffmpeg.exe

## 调试

```sh
cargo run
```

## 打包

```sh
cargo build --release
```
