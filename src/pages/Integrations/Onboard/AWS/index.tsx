import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { on } from 'events'
import { CliOrManualPage } from './CLIorManual'
import { OrgOrSinglePage } from './OrgOrSingle'
import CLIWizard from './CLIWizard'
import ManualWizard from './ManualWizard'
import DrawerPanel from '../../../../components/DrawerPanel'

interface IOnboardDrawer {
    open: boolean
    onClose: () => void
    bootstrapMode: boolean
}

export default function OnboardDrawer({
    open,
    onClose,
    bootstrapMode,
}: IOnboardDrawer) {
    const [cliOrManual, setCliOrManual] = useState<string | undefined>(
        undefined
    )
    const [orgOrSingle, setOrgOrSingle] = useState<
        'organization' | 'single' | undefined
    >(undefined)

    const close = () => {
        setCliOrManual(undefined)
        setOrgOrSingle(undefined)
        onClose()
    }

    const render = () => {
        if (cliOrManual === undefined) {
            return <CliOrManualPage onClose={close} onNext={setCliOrManual} />
        }
        if (orgOrSingle === undefined) {
            return (
                <OrgOrSinglePage
                    total={cliOrManual === 'cli' ? 4 : 5}
                    onPrev={() => setCliOrManual(undefined)}
                    onNext={setOrgOrSingle}
                />
            )
        }

        if (cliOrManual === 'cli') {
            return (
                <CLIWizard
                    bootstrapMode={bootstrapMode}
                    orgOrSingle={orgOrSingle}
                    onPrev={() => setOrgOrSingle(undefined)}
                    onClose={close}
                />
            )
        }
        return (
            <ManualWizard
                bootstrapMode={bootstrapMode}
                orgOrSingle={orgOrSingle}
                onPrev={() => setOrgOrSingle(undefined)}
                onClose={close}
            />
        )
    }

    return (
        <DrawerPanel title="Onboard AWS Accounts" open={open} onClose={close}>
            {render()}
        </DrawerPanel>
    )
}
