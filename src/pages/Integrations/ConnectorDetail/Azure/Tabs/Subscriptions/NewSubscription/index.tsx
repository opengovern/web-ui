import { useEffect, useState } from 'react'
import { Flex } from '@tremor/react'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import Steps from '../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import { useOnboardApiV1CredentialAutoonboardCreate } from '../../../../../../../api/onboard.gen'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiCredential } from '../../../../../../../api/api'
import FinalStep from './FinalStep'
import Spinner from '../../../../../../../components/Spinner'

interface INewAzureSubscription {
    spns: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    open: boolean
    onClose: () => void
}

export default function NewAzureSubscription({
    spns,
    open,
    onClose,
}: INewAzureSubscription) {
    const [stepNum, setStepNum] = useState(1)
    const [spnID, setSpnID] = useState('')

    const {
        response: autoOnboardResult,
        isLoading,
        isExecuted,
        sendNow,
    } = useOnboardApiV1CredentialAutoonboardCreate(spnID, {}, false)

    const close = () => {
        setSpnID('')
        setStepNum(1)
        onClose()
    }

    useEffect(() => {
        if (stepNum === 2) {
            sendNow()
        }
    }, [stepNum])

    const showStep = (s: number) => {
        if (isLoading && isExecuted) {
            return <Spinner />
        }
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={close}
                        onNext={(v) => {
                            setSpnID(v)
                            setStepNum(2)
                        }}
                        spns={spns}
                    />
                )
            case 2:
                return (
                    <FinalStep
                        subscriptions={autoOnboardResult || []}
                        onNext={close}
                    />
                )
            default:
                return ' '
        }
    }

    return (
        <DrawerPanel
            title="Add new Azure Subscription"
            open={open}
            onClose={close}
        >
            <Flex
                flexDirection="col"
                justifyContent="between"
                className="h-full"
            >
                <Steps steps={2} currentStep={stepNum} />
                {showStep(stepNum)}
            </Flex>
        </DrawerPanel>
    )
}
