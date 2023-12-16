import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControl } from '../../../../api/api'

interface IDetail {
    control: GithubComKaytuIoKaytuEnginePkgComplianceApiControl | undefined
}

export default function Detail({ control }: IDetail) {
    const [selectedTab, setSelectedTab] = useState<
        'explanation' | 'nonCompliance' | 'example'
    >('explanation')
    return (
        <Flex>
            <Flex flexDirection="col" alignItems="start" className="w-60 gap-3">
                {!!control?.explanation && (
                    <button
                        type="button"
                        onClick={() => setSelectedTab('explanation')}
                    >
                        <Text
                            className={`cursor-pointer ${
                                selectedTab === 'explanation'
                                    ? 'text-kaytu-500'
                                    : ''
                            }`}
                        >
                            Explanation
                        </Text>
                    </button>
                )}
                {!!control?.nonComplianceCost && (
                    <button
                        type="button"
                        onClick={() => setSelectedTab('nonCompliance')}
                    >
                        <Text
                            className={`cursor-pointer ${
                                selectedTab === 'nonCompliance'
                                    ? 'text-kaytu-500'
                                    : ''
                            }`}
                        >
                            Cost fo non-compliance
                        </Text>
                    </button>
                )}
                {!!control?.usefulExample && (
                    <button
                        type="button"
                        onClick={() => setSelectedTab('example')}
                    >
                        <Text
                            className={`cursor-pointer ${
                                selectedTab === 'example'
                                    ? 'text-kaytu-500'
                                    : ''
                            }`}
                        >
                            Examples of usefulness
                        </Text>
                    </button>
                )}
            </Flex>
            <Flex>hi</Flex>
        </Flex>
    )
}
