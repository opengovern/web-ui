import { Button, Text, Flex, TextInput, Divider, Bold } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
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
    const [template, setTemplate] = useState('')
    const workspace = useParams<{ ws: string }>().ws

    useEffect(() => {
        axios
            .get(
                'https://raw.githubusercontent.com/kaytu-io/cli/main/cmd/onboard/template.yaml'
            )
            .then((resp) => {
                setTemplate(resp.data)
            })
            .catch((e) => {
                console.log(e)
            })
    }, [])

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

    const buildTemplate = () => {
        const bt = template
            .replaceAll(
                // eslint-disable-next-line no-template-curly-in-string
                '${KaytuManagementIAMUser}',
                currentWS?.aws_user_arn || ''
            )
            .replaceAll(
                // eslint-disable-next-line no-template-curly-in-string
                '${KaytuHandshakeID}',
                currentWS?.aws_unique_id || ''
            )
        const file = new Blob([bt], { type: 'text/plain' })
        return URL.createObjectURL(file)
    }

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" justifyContent="start" alignItems="start">
                <Bold>i. Download & Create</Bold>
                <Text className="mb-4 text-gray-900">
                    You should download the following template and run
                    CloudFormation {isStackSet ? 'StackSet' : 'Stack'} in your
                    AWS Portal
                </Text>
                <a
                    href={buildTemplate()}
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
                {askForFields && (
                    <>
                        <Divider />
                        <Bold>ii. Provide Information</Bold>
                        <Text className="mb-4 text-gray-900">
                            Provide these information after Stack is finished,
                            you can go to Output tab of Stack to find it.
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
