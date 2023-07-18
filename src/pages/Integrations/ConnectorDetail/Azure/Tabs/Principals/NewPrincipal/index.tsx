import { useEffect, useState } from 'react'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import Steps from '../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import { useOnboardApiV1CredentialCreate } from '../../../../../../../api/onboard.gen'
import { SourceType } from '../../../../../../../api/api'
import FinalStep from './FinalStep'
import Spinner from '../../../../../../../components/Spinner'
import { getErrorMessage } from '../../../../../../../types/apierror'

interface INewPrinciple {
    open: boolean
    onClose: () => void
}

export default function NewPrincipal({ open, onClose }: INewPrinciple) {
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState({
        tenId: '',
        secId: '',
        appId: '',
        objectId: '',
        clientSecret: '',
        subscriptionId: '',
    })

    const {
        response: principal,
        isLoading,
        isExecuted,
        error,
        sendNow,
    } = useOnboardApiV1CredentialCreate(
        {
            config: {
                clientId: data.appId,
                secretId: data.secId,
                tenantId: data.appId,
                objectId: data.objectId,
                clientSecret: data.clientSecret,
                subscriptionId: data.subscriptionId,
            },
            source_type: SourceType.CloudAzure,
        },
        {},
        false
    )

    const close = () => {
        setStepNum(1)
        onClose()
    }

    useEffect(() => {
        if (isExecuted && !isLoading && error) {
            setStepNum(2)
        }
    }, [isLoading])

    useEffect(() => {
        if (stepNum === 3) {
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
                        onNext={() => setStepNum(2)}
                    />
                )
            case 2:
                return (
                    <SecondStep
                        onPrevious={() => setStepNum(1)}
                        error={getErrorMessage(error)}
                        onNext={(
                            appId,
                            tenId,
                            secId,
                            objectId,
                            clientSecret,
                            subscriptionId
                        ) => {
                            setData({
                                appId,
                                tenId,
                                secId,
                                objectId,
                                clientSecret,
                                subscriptionId,
                            })
                            setStepNum(3)
                        }}
                    />
                )
            case 3:
                return <FinalStep data={data} health="" onNext={close} />
            default:
                return null
        }
    }
    return (
        <DrawerPanel title="New Service Principle" open={open} onClose={close}>
            <Steps steps={3} currentStep={stepNum} />
            {showStep(stepNum)}
        </DrawerPanel>
    )
}
