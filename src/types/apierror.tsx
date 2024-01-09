// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const toErrorMessage = (...errs: any[]) => {
    const msgs = errs
        .map((err) => {
            const msg = getErrorMessage(err)
            if (msg.length > 0) {
                return msg
            }
            return undefined
        })
        .filter((v) => v !== undefined)

    return msgs.length > 0 ? msgs.join(',') : undefined
}
