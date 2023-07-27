import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    return {
        base: "./",
        resolve: {
            // 配置别名
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        css: {},
        build: {
            outDir: "dist", // 输出目录
            assetsDir: "assets", // 静态资源存放目录
            assetsInlineLimit: 4096, // 资源内联阈值
            cssCodeSplit: true, // 开启css拆分
            sourcemap: false, // 开启sourcemap
            minify: "esbuild", // 压缩工具, terser压缩率更高1%-2%,esbuild压缩更快20-40 倍
        },
        esbuild: {
            /* 打包生产环境移除 console、debugger: https://www.cnblogs.com/guangzan/p/16633753.html */
            drop: mode === "prod" ? ["console", "debugger"] : [],
        },
        plugins: [react()],
        server: {
            // 配置代理
            host: "0.0.0.0",
            port: 3000,
            open: false,
            proxy: {
                "/api": {
                    target: "",
                    changeOrigin: true,
                    secure: false,
                    rewrite: path => path.replace(/^\/cloud/, "/api"),
                },
            },
            cors: true,
        },
    };
});
