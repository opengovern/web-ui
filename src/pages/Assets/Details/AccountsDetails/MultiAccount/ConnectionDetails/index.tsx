import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../api/api'
import { RenderObject } from '../../../../../../components/RenderObject'

type IProps = {
    connection: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    index: number
}

export function ConnectionDetails({ connection, index }: IProps) {
    return <RenderObject obj={connection[index]} />
}
