process.loadEnvFile();

const config = {
    port: process.env.PORT || 8000,

    nodeEnv: process.env.NODE_ENV || 'development'
}

export { config };