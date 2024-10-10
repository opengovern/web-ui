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
import { Modal } from '@cloudscape-design/components'
import KButton from '@cloudscape-design/components/button'
import Wizard from '@cloudscape-design/components/wizard'
import StatusIndicator from '@cloudscape-design/components/status-indicator'

interface INewAzureSubscription {
    spns: GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential[]
    open: boolean
    onClose: () => void
    credintalsSendNow?: Function
    accountSendNow?: Function

}

export default function NewAzureSubscription({
    spns,
    open,
    onClose,
    credintalsSendNow,
    accountSendNow
}: INewAzureSubscription) {
    const [stepNum, setStepNum] = useState(0)
    const [spnID, setSpnID] = useState('')
    const [isNew, setIsNew] = useState(false)
    const [choiced, setChoiced] = useState(false)
    const [openPrencipal, setOpenPrencipal] = useState(false)

    const {
        response: autoOnboardResult,
        isLoading,
        isExecuted,
        sendNow,
    } = useIntegrationApiV1CredentialsAzureAutoonboardCreate(spnID, {}, false)

    const close = () => {
        if(!choiced){
            onClose()
        }
        if(isNew){
            onClose()
            return
        }
        if (stepNum == 0) {
            setChoiced(false)
        } else {
            setStepNum(0)
            setChoiced(false)
            onClose()
        }
        setSpnID('')
    }

    useEffect(() => {
        if (stepNum === 1) {
            sendNow()
        }
    }, [stepNum])

  
     const handleNext = (step: number) => {
       if(step == 1 || step == 0 ){
        
           setStepNum(step)
       }

     }

    return (
        <Modal
            header="Add new Azure Subscription"
            visible={open}
            onDismiss={close}
        >
            {choiced ? (
                <>
                    {isNew ? (
                        <>
                            <NewPrincipal
                                useDrawer={false}
                                open={openPrencipal}
                                credintalsSendNow={credintalsSendNow}
                                onClose={() => {
                                    setOpenPrencipal(false)
                                    setIsNew(false)
                                    if (accountSendNow) {
                                        accountSendNow()
                                    }
                                }}
                                onCancel={() => {
                                    setChoiced(false)
                                    setIsNew(false)
                                }}
                                onSubmit={close}
                            />
                        </>
                    ) : (
                        <>
                            <Wizard
                                i18nStrings={{
                                    stepNumberLabel: (stepNumber) =>
                                        `Step ${stepNumber}`,
                                    collapsedStepsLabel: (
                                        stepNumber,
                                        stepsCount
                                    ) => `Step ${stepNumber} of ${stepsCount}`,
                                    skipToButtonLabel: (step, stepNumber) =>
                                        `Skip to ${step.title}`,
                                    navigationAriaLabel: 'Steps',
                                    cancelButton: 'Cancel',
                                    previousButton: 'Previous',
                                    nextButton: 'Next',
                                    submitButton: 'Close',
                                    optional: 'optional',
                                }}
                                isLoadingNextStep={spnID == ''}
                                onSubmit={close}
                                onNavigate={
                                    ({ detail }) =>
                                        handleNext(detail.requestedStepIndex)
                                    // setActiveStepIndex(detail.requestedStepIndex)
                                }
                                activeStepIndex={stepNum}
                                // allowSkipTo
                                steps={[
                                    {
                                        title: 'Select SPN',

                                        description: (
                                            <>
                                                Select the Service Principal
                                                Name (SPN) that you want to use
                                                for the integration.
                                            </>
                                        ),
                                        content: (
                                            <FirstStep
                                                onPrevious={close}
                                                onNext={(v) => {
                                                    setSpnID(v)
                                                }}
                                                spns={spns}
                                            />
                                        ),
                                    },
                                    {
                                        title:
                                            isLoading && isExecuted
                                                ? 'Onboarding In proccess'
                                                : 'Onboarding Done',

                                        description: <></>,
                                        content: (
                                            <>
                                                {isLoading && isExecuted ? (
                                                    <Spinner />
                                                ) : (
                                                    <>
                                                        <StatusIndicator type="success">
                                                            Done
                                                        </StatusIndicator>
                                                    </>
                                                )}
                                            </>
                                        ),
                                    },
                                ]}
                            />
                            {/* <Flex
                                flexDirection="col"
                                justifyContent="between"
                                className="h-full"
                            >
                                <Steps steps={2} currentStep={stepNum} />
                                {showStep(stepNum)}
                            </Flex> */}
                        </>
                    )}
                </>
            ) : (
                <Flex
                    flexDirection="row"
                    justifyContent="center"
                    className="gap-x-4  h-full "
                    alignItems="center"
                >
                    <KButton
                        onClick={() => {
                            setIsNew(false)
                            setChoiced(true)
                        }}
                        disabled={false}
                        loading={false}

                        // loadingText="Running"
                    >
                        Use Existing SPN
                    </KButton>
                    <KButton
                        onClick={() => {
                            setIsNew(true)
                            setChoiced(true)
                        }}
                        disabled={false}
                        loading={false}
                        // variant="primary"
                        // loadingText="Running"
                    >
                        Add New SPN
                    </KButton>
                </Flex>
            )}
        </Modal>
    )
}
