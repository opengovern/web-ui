import { RadioGroup } from '@headlessui/react'
import { Bold, Button, Flex, Text } from '@tremor/react'
import { useState } from 'react'

interface ICliOrManualPage {
    onClose: () => void
    onNext: (value: 'manual' | 'cli') => void
}

export function CliOrManualPage({ onClose, onNext }: ICliOrManualPage) {
    const [option, setOption] = useState<'manual' | 'cli'>('cli')
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Text className="text-gray-900 mb-4">
                    Do you want to proceed with a CLI based Automated Wizard or
                    Manually onboard through a Guided Wizard?
                </Text>
                <Flex flexDirection="col" className="w-full">
                    <Flex
                        flexDirection="row"
                        justifyContent="start"
                        className="mb-3 w-full"
                        onClick={() => setOption('cli')}
                    >
                        <input
                            type="radio"
                            name="aws"
                            checked={option === 'cli'}
                        />
                        <Text className="ml-3 w-4/5 text-black">
                            CLI based Automated Wizard
                        </Text>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        justifyContent="start"
                        onClick={() => setOption('manual')}
                    >
                        <input
                            type="radio"
                            name="aws"
                            checked={option === 'manual'}
                        />
                        <Text className="ml-3 text-black">
                            Manual Onboarding
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => onNext(option)} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
