import { Bold, Flex, Text } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PreRequisite } from '../PreRequisite'
import Steps from '../../../../../components/Steps'
import { Finish } from '../Finish'
import { RunCloudFormation } from './RunCloudFormation'
import { SourceType } from '../../../../../api/api'
import { useWorkspaceApiV1BootstrapCredentialCreate } from '../../../../../api/workspace.gen'
import { getErrorMessage } from '../../../../../types/apierror'
import {
    useIntegrationApiV1ConnectionsAwsCreate,
    useIntegrationApiV1CredentialsAwsCreate,
} from '../../../../../api/integration.gen'

interface IManualWizard {
    // bootstrapMode: boolean
    orgOrSingle: 'organization' | 'single'
    onPrev: () => void
    onClose: () => void
}

export default function ManualWizard({
    onPrev,
    onClose,
    orgOrSingle,
    // bootstrapMode,
}: IManualWizard) {
    const workspace = useParams<{ ws: string }>().ws
    const [step, setStep] = useState(1)
    const [roleARN, setRoleARN] = useState<string>('')
    const [invalidARN, setInvalidARN] = useState<boolean>(false)
    const [handshakeID, setHandshakeID] = useState<string>('')

    const awsConfig = () => {
        let accountID = ''
        let roleName = ''
        let isInvalid = false

        if (roleARN.trim().length > 0) {
            let arr = roleARN.split('/')
            if (arr.length === 2) {
                roleName = arr.at(1) || ''
                arr = roleARN.split(':')
                if (arr.length === 6) {
                    accountID = arr.at(4) || ''
                } else {
                    isInvalid = true
                }
            } else {
                isInvalid = true
            }
        }

        if (isInvalid !== invalidARN) {
            setInvalidARN(isInvalid)
        }
        return {
            accountID,
            assumeRoleName: roleName,
            externalId: handshakeID,
        }
    }

    const awsConf = awsConfig()
    const {
        isLoading: scIsLoading,
        isExecuted: scIsExecuted,
        error: scError,
        sendNow: scSendNow,
    } = useIntegrationApiV1ConnectionsAwsCreate(
        {
            config: {
                accountID: awsConf.accountID,
                assumeRoleName: awsConf.assumeRoleName,
                externalId: awsConf.externalId,
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
    } = useIntegrationApiV1CredentialsAwsCreate(
        {
            config: {
                accountID: awsConf.accountID,
                assumeRoleName: awsConf.assumeRoleName,
                externalId: awsConf.externalId,
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
            singleConnection: orgOrSingle === 'single',
            connectorType: SourceType.CloudAWS,
            awsConfig: awsConfig(),
        },
        {},
        false
    )

    useEffect(() => {
        if (bcIsExecuted && !bcIsLoading) {
            if (bcError === undefined || bcError === null) {
                setStep(4)
            }
        }
    }, [bcIsLoading])

    useEffect(() => {
        if (cIsExecuted && !cIsLoading) {
            if (cError === undefined || cError === null) {
                setStep(4)
            }
        }
    }, [cIsLoading])

    useEffect(() => {
        if (scIsExecuted && !scIsLoading) {
            if (scError === undefined || scError === null) {
                setStep(4)
            }
        }
    }, [scIsLoading])

    const sendNow = () => {
        // if (bootstrapMode) {
        //     bcSendNow()
        // } else 
        if (orgOrSingle === 'single') {
            scSendNow()
        } else {
            cSendNow()
        }
    }

    const errorMessage = () => {
        // if (bootstrapMode) {
        //     return getErrorMessage(bcError)
        // }
        if (orgOrSingle === 'single') {
            return getErrorMessage(scError)
        }
        return getErrorMessage(cError)
    }

    const isCreateLoading = () => {
        // if (bootstrapMode) {
        //     return bcIsExecuted && bcIsLoading
        // }
        if (orgOrSingle === 'single') {
            return scIsExecuted && scIsLoading
        }
        return cIsExecuted && cIsLoading
    }

    const title = () => {
        switch (step) {
            case 1:
                return 'Prerequisites'
            case 2:
                if (orgOrSingle === 'single') {
                    return 'Deploying OpenGovernance Configuration to AWS Account'
                }
                return 'Onboard AWS Organization Account'
            case 3:
                return 'Deploying Configuration to Member Accounts'
            default:
                return 'Check your accounts'
        }
    }

    const preRequisites = () => {
        if (orgOrSingle === 'organization') {
            return [
                {
                    title: (
                        <Text className="text-kaytu-600 underline cursor-pointer">
                            I understanding how no-password secure onboarding
                            works
                        </Text>
                    ),
                    expanded: (
                        <Text>
                            In the process of onboarding your account no
                            credentials will be passed to OpenGovernance.
                            OpenGovernance only has Read-only access to your
                            resources{' '}
                            <a
                                className="text-kaytu-600 underline"
                                target="_blank"
                                href="https://repost.aws/knowledge-center/cross-account-access-iam"
                                rel="noreferrer"
                            >
                                using a trust relationship created on your
                                account.
                            </a>
                        </Text>
                    ),
                },
                {
                    title: (
                        <Text>
                            I have administrative access to AWS Organization
                            Account
                        </Text>
                    ),
                },
                {
                    title: (
                        <Text>
                            I have the ability to run AWS Stacks and AWS
                            StackSets
                        </Text>
                    ),
                },
            ]
        }
        return [
            {
                title: (
                    <Text>
                        I understanding how no-password secure onboarding works
                    </Text>
                ),
            },
            {
                title: <Text>I have administrative access to AWS Account</Text>,
            },
            {
                title: <Text>I have the ability to run AWS Stacks</Text>,
            },
        ]
    }

    const render = () => {
        switch (step) {
            case 1:
                return (
                    <PreRequisite
                        items={preRequisites()}
                        onPrev={onPrev}
                        onNext={() => setStep(2)}
                    />
                )
            case 2:
                return (
                    <RunCloudFormation
                        roleARN={roleARN}
                        setRoleARN={setRoleARN}
                        invalidARN={invalidARN}
                        handshakeID={handshakeID}
                        setHandshakeID={setHandshakeID}
                        loading={isCreateLoading()}
                        errorMsg={
                            orgOrSingle === 'single' ? errorMessage() : ''
                        }
                        askForFields
                        isStackSet={false}
                        onPrev={() => setStep(1)}
                        onNext={() => {
                            if (orgOrSingle === 'single') {
                                sendNow()
                            } else {
                                setStep(3)
                            }
                        }}
                    />
                )
            case 3:
                return (
                    <RunCloudFormation
                        roleARN={roleARN}
                        setRoleARN={setRoleARN}
                        invalidARN={invalidARN}
                        handshakeID={handshakeID}
                        setHandshakeID={setHandshakeID}
                        loading={isCreateLoading()}
                        errorMsg={errorMessage()}
                        askForFields={false}
                        isStackSet
                        onPrev={() => setStep(2)}
                        onNext={() => sendNow()}
                    />
                )
            default:
                return (
                    <Finish onClose={onClose}
                    //  bootstrapMode={bootstrapMode}
                      />
                )
        }
    }
    return (
        <Flex
            flexDirection="col"
            justifyContent="start"
            alignItems="start"
            className="h-full"
        >
            <Steps
                steps={orgOrSingle === 'organization' ? 5 : 4}
                currentStep={step + 1}
            />
            <Bold className="text-gray-800 font-bold mb-5">
                <span className="text-gray-400">
                    {step + 1}/{orgOrSingle === 'organization' ? 5 : 4}.
                </span>{' '}
                {title()}
            </Bold>

            {render()}
        </Flex>
    )
}
