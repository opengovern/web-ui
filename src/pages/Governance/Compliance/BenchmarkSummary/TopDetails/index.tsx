import { IFilter } from '../../../../../store'
import DrawerPanel from '../../../../../components/DrawerPanel'
import CloudAccounts from './CloudAccounts'
import Services from './Services'
import Controls from './Controls'

interface ITop {
    open: boolean
    onClose: () => void
    id: string | undefined
    type: 'services' | 'accounts' | 'controls'
    connections: IFilter
    resourceId: string | undefined
}
export default function TopDetails({
    id,
    type,
    connections,
    resourceId,
    open,
    onClose,
}: ITop) {
    const renderDetail = () => {
        switch (type) {
            case 'accounts':
                return (
                    <CloudAccounts
                        id={id}
                        connections={connections}
                        resourceId={resourceId}
                    />
                )
            case 'services':
                return (
                    <Services
                        id={id}
                        connections={connections}
                        resourceId={resourceId}
                    />
                )
            case 'controls':
                return <Controls id={id} />
            default:
                return (
                    <CloudAccounts
                        id={id}
                        connections={connections}
                        resourceId={resourceId}
                    />
                )
        }
    }
    return (
        <DrawerPanel open={open} onClose={onClose} title="Contorls">
            {renderDetail()}
        </DrawerPanel>
    )
}