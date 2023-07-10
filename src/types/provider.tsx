export type KaytuProvider = 'AWS' | 'Azure' | ''

export function StringToProvider(str: string) {
    let v: KaytuProvider = ''
    switch (str.toLowerCase()) {
        case 'aws':
            v = 'AWS'
            break
        case 'azure':
            v = 'Azure'
            break
        default:
            v = ''
    }
    return v
}
