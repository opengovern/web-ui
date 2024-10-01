import { Bold, Button, Flex, Text } from '@tremor/react'
import { useState } from 'react'
import Steps from '../../../../../components/Steps'

interface IOrgOrSinglePage {
    total: number
    onPrev: () => void
    onNext: (value: 'organization' | 'single') => void
}

export function OrgOrSinglePage({ total, onPrev, onNext }: IOrgOrSinglePage) {
    const [option, setOption] = useState<'organization' | 'single'>(
        'organization'
    )

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Steps steps={total} currentStep={1} />
                <Bold className="text-gray-800 font-bold mb-5">
                    <span className="text-gray-400">1/{total}.</span> What would
                    you like to onboard?
                </Bold>
                <Text className="text-gray-900 mb-4">
                    Please select the following based on your requirement
                </Text>
                <Flex flexDirection="col" className="w-full mt-2">
                    <Flex
                        flexDirection="row"
                        justifyContent="start"
                        className="mb-3 w-full"
                        onClick={() => setOption('organization')}
                    >
                        <input
                            type="radio"
                            name="aws"
                            checked={option === 'organization'}
                        />
                        <Text className="ml-3 w-4/5 text-black">
                            Onboard an AWS Organization and member accounts
                        </Text>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        justifyContent="start"
                        onClick={() => setOption('single')}
                    >
                        <input
                            type="radio"
                            name="aws"
                            checked={option === 'single'}
                        />
                        <Text className="ml-3 text-black">
                            Onboard individual AWS Accounts
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button onClick={() => onNext(option)} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
