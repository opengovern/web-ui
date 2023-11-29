import { Button, Text, Flex, TextInput, Divider, Bold } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { CodeBlock } from '../../../../../../components/CodeBlock'
import {
    useWorkspaceApiV1BootstrapCredentialCreate,
    useWorkspaceApiV1WorkspacesList,
} from '../../../../../../api/workspace.gen'
import { SourceType } from '../../../../../../api/api'
import { getErrorMessage } from '../../../../../../types/apierror'
import {
    useOnboardApiV1ConnectionsAwsCreate,
    useOnboardApiV2CredentialCreate,
} from '../../../../../../api/onboard.gen'

interface IRunCloudFormation {
    bootstrapMode: boolean
    accountType: 'organization' | 'single'
    onPrev: () => void
    onNext: () => void
}

export function RunCloudFormation({
    bootstrapMode,
    accountType,
    onPrev,
    onNext,
}: IRunCloudFormation) {
    const workspace = useParams<{ ws: string }>().ws
    const {
        response: workspaceList,
        isLoading,
        isExecuted,
    } = useWorkspaceApiV1WorkspacesList()
    const currentWS = workspaceList?.find(
        (w) => w.name !== undefined && w.name === workspace
    )
    const [accountID, setAccountID] = useState<string>('')
    const [roleName, setRoleName] = useState<string>(
        'KaytuOrganizationCrossAccountRole'
    )
    const [handshakeID, setHandshakeID] = useState<string>('')

    useEffect(() => {
        if (isExecuted && !isLoading) {
            setHandshakeID(currentWS?.aws_unique_id || '')
        }
    }, [isLoading])

    const templateURL =
        'https://raw.githubusercontent.com/kaytu-io/cli/main/cmd/onboard/template.yaml'

    const {
        isLoading: scIsLoading,
        isExecuted: scIsExecuted,
        error: scError,
        sendNow: scSendNow,
    } = useOnboardApiV1ConnectionsAwsCreate(
        {
            name: '',
            awsConfig: {
                accountID,
                assumeRoleName: roleName,
                externalId: handshakeID,
            },
        },
        {},
        false
    )

    const {
        isLoading: cIsLoading,
        isExecuted: cIsExecuted,
        error: cError,
        sendNow: cSendNow,
    } = useOnboardApiV2CredentialCreate(
        {
            connector: SourceType.CloudAWS,
            awsConfig: {
                accountID,
                assumeRoleName: roleName,
                externalId: handshakeID,
            },
        },
        {},
        false
    )

    const {
        isLoading: bcIsLoading,
        isExecuted: bcIsExecuted,
        error: bcError,
        sendNow: bcSendNow,
    } = useWorkspaceApiV1BootstrapCredentialCreate(
        workspace || '',
        {
            singleConnection: accountType === 'single',
            connectorType: SourceType.CloudAWS,
            awsConfig: {
                accountID,
                assumeRoleName: roleName,
                externalId: handshakeID,
            },
        },
        {},
        false
    )

    useEffect(() => {
        if (bcIsExecuted && !bcIsLoading) {
            if (bcError === undefined || bcError === null) {
                onNext()
            }
        }
    }, [bcIsLoading])

    useEffect(() => {
        if (cIsExecuted && !cIsLoading) {
            if (cError === undefined || cError === null) {
                onNext()
            }
        }
    }, [cIsLoading])

    useEffect(() => {
        if (scIsExecuted && !scIsLoading) {
            if (scError === undefined || scError === null) {
                onNext()
            }
        }
    }, [scIsLoading])

    const sendNow = () => {
        if (bootstrapMode) {
            bcSendNow()
        } else if (accountType === 'single') {
            scSendNow()
        } else {
            cSendNow()
        }
    }

    const isCreateLoading = () => {
        if (bootstrapMode) {
            return bcIsExecuted && bcIsLoading
        }
        if (accountType === 'single') {
            return scIsExecuted && scIsLoading
        }
        return cIsExecuted && cIsLoading
    }

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" justifyContent="start" alignItems="start">
                <Text className="mb-4 text-gray-900">
                    <span className="text-kaytu-500">i.</span> You should
                    download the following template and run CloudFormation Stack
                    in your AWS Portal
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
                            Stack Template
                        </Flex>
                    </Button>
                </a>
                <Divider />
                <Text className="mb-4 text-gray-900">
                    <span className="text-kaytu-500">ii.</span> Fill these
                    parameters when running Stack
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
                    />
                </Flex>
                <Divider />
                <Text className="mb-4 text-gray-900">
                    <span className="text-kaytu-500">iii.</span> Provide these
                    information after Stack is finished, you can go to Output
                    tab of Stack to find it.
                </Text>
                <Text className="mb-2">Role Name*</Text>
                <TextInput
                    value={roleName}
                    className="mb-2"
                    onChange={(e) => setRoleName(e.target.value)}
                />
                <Text className="mb-2">Account ID*</Text>
                <TextInput
                    value={accountID}
                    className="mb-2"
                    onChange={(e) => setAccountID(e.target.value)}
                />
                <Text className="mb-2">Handshake ID*</Text>
                <TextInput
                    value={handshakeID}
                    className="mb-2"
                    onChange={(e) => setHandshakeID(e.target.value)}
                />
                <Text className="text-red-600 mb-2">
                    {getErrorMessage(bcError)}
                    {getErrorMessage(cError)}
                </Text>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button
                    onClick={() => sendNow()}
                    loading={isCreateLoading()}
                    disabled={
                        accountID.length === 0 ||
                        roleName.length === 0 ||
                        handshakeID.length === 0
                    }
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
