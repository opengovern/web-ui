import { RadioGroup } from '@headlessui/react'
import { Bold, Button, Flex, Text } from '@tremor/react'

interface ICliOrManualPage {
    onClose: () => void
    onNext: (value: 'manual' | 'cli') => void
}

export function CliOrManualPage({ onClose, onNext }: ICliOrManualPage) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Text>
                    Do you want to proceed with a CLI based Automated Wizard or
                    Manually onboard through a Guided Wizard?
                </Text>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => onNext('manual')} className="ml-3">
                    Manual Onboarding
                </Button>
                <Button onClick={() => onNext('cli')} className="ml-3">
                    CLI based Automated Wizard
                </Button>
            </Flex>
        </Flex>
    )
}
