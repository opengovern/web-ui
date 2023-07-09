import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../api/api'
import { RenderObject } from '../../../../../../components/RenderObject'

type IProps = {
    connection: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    index: number
}

export function ConnectionDetails({ connection, index }: IProps) {
    return (
        <div>
            <RenderObject obj={connection[index]} />
        </div>
    )
}
