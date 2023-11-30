import { Button, Text, Flex, TextInput, Divider } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { CodeBlock } from '../../../../../../components/CodeBlock'
import { useWorkspaceApiV1WorkspacesList } from '../../../../../../api/workspace.gen'

interface IRunCloudFormation {
    loading: boolean
    errorMsg: string
    askForFields: boolean
    isStackSet: boolean

    roleARN: string
    setRoleARN: (v: string) => void
    invalidARN: boolean

    handshakeID: string
    setHandshakeID: (v: string) => void

    onPrev: () => void
    onNext: () => void
}

export function RunCloudFormation({
    loading,
    errorMsg,
    askForFields,
    isStackSet,
    roleARN,
    setRoleARN,
    invalidARN,
    handshakeID,
    setHandshakeID,
    onPrev,
    onNext,
}: IRunCloudFormation) {
    const templateURL =
        'https://raw.githubusercontent.com/kaytu-io/cli/main/cmd/onboard/template.yaml'
    const workspace = useParams<{ ws: string }>().ws

    const {
        response: workspaceList,
        isLoading,
        isExecuted,
    } = useWorkspaceApiV1WorkspacesList()
    const currentWS = workspaceList?.find(
        (w) => w.name !== undefined && w.name === workspace
    )
    useEffect(() => {
        if (isExecuted && !isLoading) {
            setHandshakeID(currentWS?.aws_unique_id || '')
        }
    }, [isLoading])

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" justifyContent="start" alignItems="start">
                <Text className="mb-4 text-gray-900">
                    <span className="text-kaytu-500">i.</span> You should
                    download the following template and run CloudFormation{' '}
                    {isStackSet ? 'StackSet' : 'Stack'} in your AWS Portal
                </Text>
                <a
                    href={templateURL}
                    target="_blank"
                    download="template.yaml"
                    rel="noreferrer"
                >
                    <Button variant="secondary">
                        <Flex flexDirection="row">
                            <ArrowDownTrayIcon className="w-4 mr-2" />
                            {isStackSet ? 'StackSet' : 'Stack'} Template
                        </Flex>
                    </Button>
                </a>
                <Divider />
                <Text className="mb-4 text-gray-900">
                    <span className="text-kaytu-500">ii.</span> Fill these
                    parameters when running {isStackSet ? 'StackSet' : 'Stack'}
                </Text>
                <Text className="font-bold mb-2">Handshake ID:</Text>
                <Flex className="mb-6">
                    <CodeBlock
                        loading={isLoading}
                        command={currentWS?.aws_unique_id || ''}
                    />
                </Flex>
                <Text className="font-bold mb-2">
                    Kaytu Management IAM User:
                </Text>
                <Flex className="">
                    <CodeBlock
                        loading={isLoading}
                        command={currentWS?.aws_user_arn || ''}
                        truncate
                    />
                </Flex>
                {askForFields && (
                    <>
                        <Divider />
                        <Text className="mb-4 text-gray-900">
                            <span className="text-kaytu-500">iii.</span> Provide
                            these information after Stack is finished, you can
                            go to Output tab of Stack to find it.
                        </Text>
                        <Text className="mb-2">Role ARN*</Text>
                        <TextInput
                            value={roleARN}
                            className="mb-2"
                            error={invalidARN}
                            onChange={(e) => setRoleARN(e.target.value)}
                        />
                    </>
                )}

                <Text className="text-red-600 mb-2">{errorMsg}</Text>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button
                    onClick={() => onNext()}
                    loading={loading}
                    disabled={
                        roleARN.length === 0 ||
                        handshakeID.length === 0 ||
                        invalidARN
                    }
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
