import { Flex, Title } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiFindingEvent } from '../../../../../api/api'
import { getConnectorIcon } from '../../../../../components/Cards/ConnectorCard'
import DrawerPanel from '../../../../../components/DrawerPanel'

interface IFindingDetail {
    event: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingEvent | undefined
    open: boolean
    onClose: () => void
}

export default function EventDetail({ event, open, onClose }: IFindingDetail) {
    return (
        <DrawerPanel
            open={open}
            onClose={onClose}
            title={
                <Flex justifyContent="start">
                    {getConnectorIcon(event?.connector)}
                    <Title className="text-lg font-semibold ml-2 my-1">
                        {event?.providerConnectionName}
                    </Title>
                </Flex>
            }
        >
            hi
        </DrawerPanel>
    )
}
