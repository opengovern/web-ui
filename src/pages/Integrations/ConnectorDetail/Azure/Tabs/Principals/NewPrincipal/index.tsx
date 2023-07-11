import { useState } from 'react'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import Steps from '../../../../../../../components/Steps'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import { useOnboardApiV1CredentialCreate } from '../../../../../../../api/onboard.gen'
import { SourceType } from '../../../../../../../api/api'
import FinalStep from './FinalStep'

interface INewPrinciple {
    open: boolean
    onClose: any
}

export default function NewPrincipal({ open, onClose }: INewPrinciple) {
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState({
        tenId: '',
        secId: '',
        appId: '',
    })

    const { response: principal, sendNow } = useOnboardApiV1CredentialCreate({
        config: {
            clientId: data.appId,
            secretId: data.secId,
            tenantId: data.appId,
        },
        source_type: SourceType.CloudAzure,
    })

    const showStep = (s: number) => {
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={() => onClose()}
                        onNext={() => setStepNum(2)}
                    />
                )
            case 2:
                return (
                    <SecondStep
                        onPrevious={() => onClose()}
                        onNext={(a: any) => {
                            setData(a)
                            sendNow()
                            setStepNum(3)
                        }}
                    />
                )
            case 3:
                return <FinalStep data={principal} onNext={() => onClose()} />
            default:
                return null
        }
    }
    return (
        <DrawerPanel
            title="New Setvice Principle"
            open={open}
            onClose={() => onClose()}
        >
            <Steps steps={3} currentStep={stepNum} />
            {showStep(stepNum)}
        </DrawerPanel>
    )
}
