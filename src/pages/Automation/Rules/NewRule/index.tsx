import { useState } from 'react'
import DrawerPanel from '../../../../components/DrawerPanel'
import Steps from '../../../../components/Steps'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'

interface INewRule {
    open: boolean
    onClose: () => void
}

export default function NewRule({ open, onClose }: INewRule) {
    const [currentStep, setCurrentStep] = useState(1)
    const [event, setEvent] = useState('')
    const [compliance, setCompliance] = useState('')

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepOne
                        onNext={(e, c) => {
                            setEvent(e)
                            setCompliance(c)
                            setCurrentStep(2)
                        }}
                        onBack={onClose}
                    />
                )
            case 2:
                return (
                    <StepTwo
                        onNext={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                    />
                )
            case 3:
                return (
                    <StepThree
                        onNext={() => setCurrentStep(4)}
                        onBack={() => setCurrentStep(2)}
                    />
                )
            default:
                return <div />
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
