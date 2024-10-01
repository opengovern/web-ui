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
                <Bold className="text-gray-800 font-bold">
                    How would you like to perform your onboarding?
                </Bold>
                <Text className=" mb-5">
                    Both of the methods have identical outcomes. Click here for
                    more information
                </Text>
                <Flex flexDirection="col" className="w-full">
                    <Flex
                        flexDirection="row"
                        justifyContent="start"
                        className="mb-3 w-full"
                        alignItems="start"
                        onClick={() => setOption('cli')}
                    >
                        <input
                            type="radio"
                            name="aws"
                            className="mt-1"
                            checked={option === 'cli'}
                        />
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                        >
                            <Text className="ml-3 w-4/5 text-black">
                                Automated onboarding with CLI
                            </Text>
                            <Text className="ml-3 w-full">
                                Utilizes AWS CLI and Kaytu CLI for a seamless
                                onboarding experience.
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        justifyContent="start"
                        alignItems="start"
                        onClick={() => setOption('manual')}
                    >
                        <input
                            type="radio"
                            name="aws"
                            className="mt-1"
                            checked={option === 'manual'}
                        />
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                        >
                            <Text className="ml-3 w-4/5 text-black">
                                Manual Onboarding with AWS Console
                            </Text>
                            <Text className="ml-3 w-full">
                                Onboarding though AWS Console by running
                                CloudFormation Stacks and StackSets.
                            </Text>
                        </Flex>
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
