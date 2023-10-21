import { useState } from 'react'
import { Flex } from '@tremor/react'
import DrawerPanel from '../../../../components/DrawerPanel'
import Steps from '../../../../components/Steps'
import StepOne from './StepOne'

interface INewRule {
    open: boolean
    onClose: () => void
}
export default function NewRule({ open, onClose }: INewRule) {
    const [currentStep, setCurrentStep] = useState(1)

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepOne
                        onNext={() => setCurrentStep(2)}
                        onBack={onClose}
                    />
                )
            default:
                return (
                    <StepOne
                        onNext={() => setCurrentStep(2)}
                        onBack={onClose}
                    />
                )
        }
    }

    return (
        <DrawerPanel title="New rule" open={open} onClose={onClose}>
            <div className="mb-6">
                <Steps steps={4} currentStep={currentStep} />
            </div>
            {renderStep()}
        </DrawerPanel>
    )
}
