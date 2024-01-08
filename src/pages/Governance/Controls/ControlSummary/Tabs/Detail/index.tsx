import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControl } from '../../../../../../api/api'

interface IDetail {
    control: GithubComKaytuIoKaytuEnginePkgComplianceApiControl | undefined
}

export default function Detail({ control }: IDetail) {
    const [selectedTab, setSelectedTab] = useState<
        'explanation' | 'nonComplianceCost' | 'usefulExample'
    >('explanation')

    return (
        <Flex alignItems="start" className="mt-6">
            <Flex flexDirection="col" alignItems="start" className="w-56 gap-3">
                {!!control?.explanation && (
                    <button
                        type="button"
                        onClick={() => setSelectedTab('explanation')}
                    >
                        <Text
                            className={`text-gray-500 cursor-pointer ${
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
                        onClick={() => setSelectedTab('nonComplianceCost')}
                    >
                        <Text
                            className={`text-gray-500 cursor-pointer ${
                                selectedTab === 'nonComplianceCost'
                                    ? 'text-kaytu-500'
                                    : ''
                            }`}
                        >
                            Cost of non-compliance
                        </Text>
                    </button>
                )}
                {!!control?.usefulExample && (
                    <button
                        type="button"
                        onClick={() => setSelectedTab('usefulExample')}
                    >
                        <Text
                            className={`text-gray-500 cursor-pointer ${
                                selectedTab === 'usefulExample'
                                    ? 'text-kaytu-500'
                                    : ''
                            }`}
                        >
                            Examples of usefulness
                        </Text>
                    </button>
                )}
            </Flex>
            <div
                className="pl-8 border-l border-l-gray-200"
                style={{ width: 'calc(100% - 224px)' }}
            >
                <Markdown remarkPlugins={[remarkGfm]}>
                    {control?.[selectedTab]}
                </Markdown>
            </div>
        </Flex>
    )
}
