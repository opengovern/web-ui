import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { on } from 'events'
import { CliOrManualPage } from './CLIorManual'
import { OrgOrSinglePage } from './OrgOrSingle'
import CLIWizard from './CLIWizard'
import { Credential } from './Credentials'
import DrawerPanel from '../../../../components/DrawerPanel'
import { Screen1 } from './Screen1'
import { Finish } from './Finish'

interface IOnboardDrawer {
    open: boolean
    onClose: () => void
    // bootstrapMode: boolean
}

export default function OnboardDrawer({
    open,
    onClose,
    // bootstrapMode,
}: IOnboardDrawer) {
    const [isOrg, setIsOrg] = useState<boolean | undefined>(undefined)
    const [onboarded, setOnboarded] = useState<boolean>(false)

    const close = () => {
        setIsOrg(undefined)
        setOnboarded(false)
        onClose()
    }

    const render = () => {
        if (isOrg === undefined) {
            return (
                <Screen1
                    onClose={close}
                    onNext={(isOrgVar) => {
                        console.log('isOrg set')
                        setIsOrg(isOrgVar)
                    }}
                />
            )
        }
        if (!onboarded) {
            return (
                <Credential
                    isOrg={isOrg}
                    onClose={close}
                    onNext={() => {
                        setOnboarded(true)
                    }}
                />
            )
        }
        return <Finish
        //  bootstrapMode={false} 
         onClose={close} />
    }

    return (
        <DrawerPanel title="Onboard AWS Accounts" open={open} onClose={close}>
            {render()}
        </DrawerPanel>
    )
}
