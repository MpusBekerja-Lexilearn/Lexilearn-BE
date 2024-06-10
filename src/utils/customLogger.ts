export const customLogger = (message: string, ...rest: string[]) => {
    const timeNow = new Date().toLocaleString()
    console.log(`[${timeNow}] ${message}`, ...rest)
}