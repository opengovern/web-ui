import { useEffect, useState } from 'react'
import { Button, Flex, Text } from '@tremor/react'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import Steps from '../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../../../api/api'
import FinalStep from './FinalStep'
import Spinner from '../../../../../../../components/Spinner'
import { useIntegrationApiV1CredentialsAzureAutoonboardCreate } from '../../../../../../../api/integration.gen'
import NewPrincipal from '../../Principals/NewPrincipal'

interface INewAzureSubscription {
    spns: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
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
    const [isNew,setIsNew] = useState(false)
    const [choiced, setChoiced] = useState(false)
    const [openPrencipal,setOpenPrencipal] = useState(false)

    const {
        response: autoOnboardResult,
        isLoading,
        isExecuted,
        sendNow,
    } = useIntegrationApiV1CredentialsAzureAutoonboardCreate(spnID, {}, false)

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
            {choiced ? (
                <>
                    {isNew ? (
                        <>
                            <NewPrincipal useDrawer={false} open={openPrencipal}  onClose={()=> {
                                
                                setOpenPrencipal(false)
                                setIsNew(false)
                                }}/>
                        </>
                    ) : (
                        <Flex
                            flexDirection="col"
                            justifyContent="between"
                            className="h-full"
                        >
                            <Steps steps={2} currentStep={stepNum} />
                            {showStep(stepNum)}
                        </Flex>
                    )}
                </>
            ) : (
                <Flex
                    flexDirection="row"
                    justifyContent="center"
                    className="gap-x-4  h-full "
                    alignItems="center"
                >
                    <Button
                        onClick={() => {
                            setIsNew(false)
                            setChoiced(true)
                        }}
                        disabled={false}
                        loading={false}
                        // loadingText="Running"
                    >
                        <Text className="text-xl text-white">
                            Use Existing SPN
                        </Text>
                    </Button>
                    <Button
                        onClick={() => {
                            setIsNew(true)
                            setChoiced(true)
                        }}
                        disabled={false}
                        loading={false}
                        // loadingText="Running"
                    >
                        <Text className="text-xl text-white">Add New SPN</Text>
                    </Button>
                </Flex>
            )}
        </DrawerPanel>
    )
}
