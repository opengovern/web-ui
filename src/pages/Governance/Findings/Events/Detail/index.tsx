import { Flex, Title } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiFindingEvent } from '../../../../../api/api'
import { getConnectorIcon } from '../../../../../components/Cards/ConnectorCard'
import DrawerPanel from '../../../../../components/DrawerPanel'

interface IFindingDetail {
    finding: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingEvent | undefined
    open: boolean
    onClose: () => void
}

export default function EventDetail({
    finding,
    open,
    onClose,
}: IFindingDetail) {
    return (
        <DrawerPanel
            open={open}
            onClose={onClose}
            title={
                <Flex justifyContent="start">
                    {getConnectorIcon(finding?.connector)}
                    <Title className="text-lg font-semibold ml-2 my-1">
                        {finding?.id}
                    </Title>
                </Flex>
            }
        >
            hi
        </DrawerPanel>
    )
}
