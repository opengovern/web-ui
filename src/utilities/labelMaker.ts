export const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

export const snakeCaseToLabel = (string: string) =>
    capitalizeFirstLetter(
        string
            .toLowerCase()
            .replace(/([-_][a-z])/g, (group) => group.replace('_', ' '))
    )
export const kebabCaseToLabel = (string: string) =>
    capitalizeFirstLetter(
        string
            .toLowerCase()
            .replace(/([-_][a-z])/g, (group) => group.replace('-', ' '))
    )
