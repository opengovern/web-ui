import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PreRequisite } from './PreRequisite'
import Steps from '../../../../../components/Steps'
import { Finish } from '../Finish'
import { RunCloudFormation } from './RunCloudFormation'

interface IManualWizard {
    bootstrapMode: boolean
    orgOrSingle: 'organization' | 'single'
    onPrev: () => void
    onClose: () => void
}

export default function ManualWizard({
    onPrev,
    onClose,
    orgOrSingle,
    bootstrapMode,
}: IManualWizard) {
    const [step, setStep] = useState(1)

    const render = () => {
        switch (step) {
            case 1:
                return (
                    <PreRequisite
                        accountType={orgOrSingle}
                        onPrev={onPrev}
                        onNext={() => setStep(2)}
                    />
                )
            case 2:
                return (
                    <RunCloudFormation
                        bootstrapMode={bootstrapMode}
                        accountType={orgOrSingle}
                        onPrev={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                )
            default:
                return <Finish onClose={onClose} />
        }
    }
    return (
        <Flex
            flexDirection="col"
            justifyContent="start"
            alignItems="start"
            className="h-full"
        >
            <Steps steps={4} currentStep={step + 1} />
            {render()}
        </Flex>
    )
}
