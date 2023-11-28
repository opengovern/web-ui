import { useState } from 'react'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { Card, Flex, Text } from '@tremor/react'
import clipboardCopy from 'clipboard-copy'

interface ICodeBlock {
    command: string
    className?: string
    text?: string
    truncate?: boolean
}

export function CodeBlock({ command, text, className, truncate }: ICodeBlock) {
    const [showCopied, setShowCopied] = useState<boolean>(false)
    return (
        <Card
            className={`w-full text-gray-800 font-mono cursor-pointer p-2.5 ${className}`}
            onClick={() => {
                setShowCopied(true)
                setTimeout(() => {
                    setShowCopied(false)
                }, 2000)
                clipboardCopy(command)
            }}
        >
            <Flex flexDirection="row">
                <Text
                    className={`px-1.5 text-gray-800 ${
                        truncate ? 'truncate' : ''
                    }`}
                >
                    {text || command}
                </Text>
                <Flex flexDirection="col" className="h-5 w-5">
                    <DocumentDuplicateIcon className="h-5 w-5 text-kaytu-600 cursor-pointer" />
                    <Text
                        className={`${
                            showCopied ? '' : 'hidden'
                        } absolute -bottom-4 bg-kaytu-600 text-white rounded-md p-1`}
                    >
                        Copied!
                    </Text>
                </Flex>
            </Flex>
        </Card>
    )
}
