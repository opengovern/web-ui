import { GithubComKaytuIoKaytuEnginePkgAuthApiTheme } from "../api/api"

export interface Auth0AppMetadata {
    "https://app.kaytu.io/colorBlindMode": boolean
    "https://app.kaytu.io/theme": GithubComKaytuIoKaytuEnginePkgAuthApiTheme
    "https://app.kaytu.io/memberSince": string
    "https://app.kaytu.io/userLastLogin": string
    "https://app.kaytu.io/workspaceAccess": Record<string,string>
}