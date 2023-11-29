import { Bold, Flex, Text } from '@tremor/react'
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

    const title = () => {
        switch (step) {
            case 1:
                return 'Prerequisite'
            case 2:
                return 'Create CloudFormation Stack'
            case 3:
                return 'Create CloudFormation StackSet'
            default:
                return 'Check your accounts'
        }
    }

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
            case 3:
                return (
                    <RunCloudFormation
                        bootstrapMode={bootstrapMode}
                        accountType={orgOrSingle}
                        onPrev={() => setStep(2)}
                        onNext={() => setStep(4)}
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
            <Bold className="text-gray-800 font-bold mb-5">
                <span className="text-gray-400">
                    {step + 1}/{4}.
                </span>{' '}
                {title()}
            </Bold>

            {render()}
        </Flex>
    )
}
