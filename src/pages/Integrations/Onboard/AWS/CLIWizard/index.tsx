import { Bold, Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { PreRequisite } from '../PreRequisite'
import { KaytuOnboard } from './KaytuOnboard'
import { Finish } from '../Finish'
import Steps from '../../../../../components/Steps'

interface ICLIWizard {
    // bootstrapMode: boolean
    orgOrSingle: 'organization' | 'single'
    onPrev: () => void
    onClose: () => void
}

export default function CLIWizard({
    onPrev,
    onClose,
    orgOrSingle,
    // bootstrapMode,
}: ICLIWizard) {
    const [step, setStep] = useState(1)

    const title = () => {
        switch (step) {
            case 1:
                return 'Prerequisite'
            case 2:
                return 'Onboard your accounts using CLI'
            default:
                return 'Check your accounts'
        }
    }

    const preRequisiteList = () => {
        if (orgOrSingle === 'organization') {
            return [
                {
                    title: (
                        <Text>
                            I understanding how no-password secure onboarding
                            works
                        </Text>
                    ),
                },
                {
                    title: (
                        <Text>
                            I have administrative access to AWS Organization
                            Account
                        </Text>
                    ),
                },
                {
                    title: (
                        <Text>
                            AWS CLI is installed & logged-in to Organization
                            master account
                        </Text>
                    ),
                },
                {
                    title: <Text>Kaytu CLI installed & logged-in</Text>,
                },
            ]
        }
        return [
            {
                title: (
                    <Text>
                        I understanding how no-password secure onboarding works
                    </Text>
                ),
            },
            {
                title: <Text>I have administrative access to AWS Account</Text>,
            },
            {
                title: <Text>AWS CLI is installed & logged-in</Text>,
            },
            {
                title: <Text>Kaytu CLI installed & logged-in</Text>,
            },
        ]
    }

    const render = () => {
        switch (step) {
            case 1:
                return (
                    <PreRequisite
                        items={preRequisiteList()}
                        onPrev={onPrev}
                        onNext={() => setStep(2)}
                    />
                )
            case 2:
                return (
                    <KaytuOnboard
                        // bootstrapMode={bootstrapMode}
                        orgOrSingle={orgOrSingle}
                        onPrev={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                )
            default:
                return (
                    <Finish onClose={onClose} 
                    // bootstrapMode={bootstrapMode}
                     />
                )
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
