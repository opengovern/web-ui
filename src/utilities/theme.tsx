import { GithubComKaytuIoKaytuEnginePkgAuthApiTheme } from '../api/api'

export const parseTheme = (v: string) => {
    switch (v) {
        case 'light':
            return GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeLight
        case 'dark':
            return GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeDark
        default:
            return GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeSystem
    }
}

export const currentTheme = () => {
    if (!('theme' in localStorage)) {
        return GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeSystem
    }

    return parseTheme(localStorage.theme)
}

export const applyTheme = (v: GithubComKaytuIoKaytuEnginePkgAuthApiTheme) => {
    if (
        v === GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeDark ||
        (v === GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeSystem &&
            window.matchMedia('(prefers-color-scheme:dark)').matches)
    ) {
        document.documentElement.classList.add('dark')
        localStorage.theme = 'light'
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.theme = 'light'
    }

    switch (v) {
        case GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeDark:
            localStorage.theme = 'dark'
            break
        case GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeLight:
            localStorage.theme = 'light'
            break
        default:
            localStorage.removeItem('theme')
    }
}
