export const getErrorMessage = (err: any) => {
    if (err) {
        try {
            return `Error: ${String(err.response.data.message)}`
        } catch {
            return String(err)
        }
    }
    return ''
}
