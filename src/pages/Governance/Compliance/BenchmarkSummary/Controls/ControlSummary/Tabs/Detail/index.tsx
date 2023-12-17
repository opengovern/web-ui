import { Card, Flex, Subtitle, Text } from '@tremor/react'
import { useState } from 'react'
import parse from 'html-react-parser'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControl } from '../../../../../../../../api/api'

interface IDetail {
    control: GithubComKaytuIoKaytuEnginePkgComplianceApiControl | undefined
}

export default function Detail({ control }: IDetail) {
    const [selectedTab, setSelectedTab] = useState<
        'explanation' | 'nonComplianceCost' | 'usefulExample'
    >('explanation')
    return (
        <Flex alignItems="start" className="mt-4">
            <Flex flexDirection="col" alignItems="start" className="w-56 gap-3">
                {!!control?.explanation && (
                    <button
                        type="button"
                        onClick={() => setSelectedTab('explanation')}
                    >
                        <Subtitle
                            className={`text-gray-500 cursor-pointer ${
                                selectedTab === 'explanation'
                                    ? 'text-kaytu-500'
                                    : ''
                            }`}
                        >
                            Explanation
                        </Subtitle>
                    </button>
                )}
                {!!control?.nonComplianceCost && (
                    <button
                        type="button"
                        onClick={() => setSelectedTab('nonComplianceCost')}
                    >
                        <Subtitle
                            className={`text-gray-500 cursor-pointer ${
                                selectedTab === 'nonComplianceCost'
                                    ? 'text-kaytu-500'
                                    : ''
                            }`}
                        >
                            Cost of non-compliance
                        </Subtitle>
                    </button>
                )}
                {!!control?.usefulExample && (
                    <button
                        type="button"
                        onClick={() => setSelectedTab('usefulExample')}
                    >
                        <Subtitle
                            className={`text-gray-500 cursor-pointer ${
                                selectedTab === 'usefulExample'
                                    ? 'text-kaytu-500'
                                    : ''
                            }`}
                        >
                            Examples of usefulness
                        </Subtitle>
                    </button>
                )}
            </Flex>
            <div
                className="pl-8 border-l border-l-gray-200"
                style={{ width: 'calc(100% - 224px)' }}
            >
                <Subtitle className="text-gray-800">
                    {parse(control?.[selectedTab] || '')}
                </Subtitle>
            </div>
        </Flex>
    )
}
