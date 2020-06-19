module.exports = {
    mode: "development",
    entry: {
        acceleration: "./acceleration/sketch.js"
    },
    devServer: {
        https: true,
        http2: true,
        port: 4000,
        host: "0.0.0.0"
    },
};