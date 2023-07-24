export const isDemo = () => {
    console.log("isDemo:", process.env.RUNTIME_ENVIRONMENT, process.env.RUNTIME_ENVIRONMENT === "demo")
    return process.env.RUNTIME_ENVIRONMENT === "demo"
}