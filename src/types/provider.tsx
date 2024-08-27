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
        case 'azuread':
            v = 'Azure'
            break
        default:
            v = ''
    }
    return v
}

export function ConnectorToCredentialType(
    str: string
):
    | (
          | 'auto-azure'
          | 'auto-aws'
          | 'manual-aws-org'
          | 'manual-azure-spn'
          | 'manual-azure-entra-id'
      )[]
    | undefined {
    switch (str.toLowerCase()) {
        case 'azure':
            return ['manual-azure-spn', 'auto-azure']
        case 'azuread':
            return ['manual-azure-entra-id']
        default:
            return undefined
    }
}
