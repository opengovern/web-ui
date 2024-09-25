export interface WizarData {
    azureData?: {
        applicationId?: string
        objectId?: string
        directoryId?: string
        secretValue?: string
    }
    awsData?: {
        accessKey?: string
        accessSecret?: string
        role?: string
    }
    sampleLoaded?: string
    userData?: {
        email?: string
        password?: string
    }
}