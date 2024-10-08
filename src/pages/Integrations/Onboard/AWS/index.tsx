import { Flex, Text } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { on } from 'events'
import { CliOrManualPage } from './CLIorManual'
import { OrgOrSinglePage } from './OrgOrSingle'
import CLIWizard from './CLIWizard'
import { Credential } from './Credentials'
import DrawerPanel from '../../../../components/DrawerPanel'
import { Screen1 } from './Screen1'
import { Finish } from './Finish'
import { Link, Modal, StatusIndicator } from '@cloudscape-design/components'
import Wizard from '@cloudscape-design/components/wizard'
import { useIntegrationApiV1CredentialsAwsCreate } from '../../../../api/integration.gen'
import { getErrorMessage } from '../../../../types/apierror'

interface IOnboardDrawer {
    open: boolean
    onClose: () => void
    accountSendNow?: Function
    // bootstrapMode: boolean
}

export default function OnboardDrawer({
    open,
    onClose,
    accountSendNow,
}: // bootstrapMode,
IOnboardDrawer) {
    const [isOrg, setIsOrg] = useState<boolean | undefined>(undefined)
    const [onboarded, setOnboarded] = useState<boolean>(false)
    const [activeStepIndex, setActiveStepIndex] = useState(0)
    const [errorField, setErrorField] = useState<string>('')
    const [credentials, setCredentials] = useState<any>({
        accessKey: undefined,
        secretKey: undefined,
        roleName: undefined,
        externalID: undefined,
    })
    const { isLoading, isExecuted, error, sendNow } =
        useIntegrationApiV1CredentialsAwsCreate(
            {
                config: {
                    assumeRoleName: credentials?.roleName,
                    // externalId: externalID,
                    accessKey: credentials?.accessKey,
                    secretKey: credentials?.secretKey,
                },
            },
            {},
            false
        )
    const errorMsg = getErrorMessage(error)

    useEffect(() => {
        if (isExecuted && !isLoading) {
            if (errorMsg === '') {
                setActiveStepIndex(1)

                //  onNext()
            }
        }
    }, [isLoading])
    const close = () => {
        setIsOrg(undefined)
        setOnboarded(false)
        
        onClose()
    }

    const handleNext = (step: number) => {
        if (step == 1 || step === 0) {
            setActiveStepIndex(step)
        }
        if (step == 2) {
            if(
                credentials?.accessKey === undefined ||
                credentials?.secretKey === undefined ||
                credentials?.roleName === undefined
            ){
                setErrorField('Please fill all the fields')
                return
            }
            
            sendNow()
        }
        if (step == 3) {
            if(accountSendNow){
            accountSendNow()

            }
            close()
        }
    }
    useEffect(() => {
            setErrorField('')
    }, [credentials]);
    return (
        <>
            <Modal
                className="p-2"
                header="Onboard AWS Accounts"
                visible={open}
                onDismiss={close}
            >
                <Wizard
                    i18nStrings={{
                        stepNumberLabel: (stepNumber) => `Step ${stepNumber}`,
                        collapsedStepsLabel: (stepNumber, stepsCount) =>
                            `Step ${stepNumber} of ${stepsCount}`,
                        skipToButtonLabel: (step, stepNumber) =>
                            `Skip to ${step.title}`,
                        navigationAriaLabel: 'Steps',
                        cancelButton: 'Cancel',
                        previousButton: 'Previous',
                        nextButton: 'Next',
                        submitButton: 'Done',
                        optional: 'optional',
                    }}
                    onNavigate={
                        ({ detail }) => handleNext(detail.requestedStepIndex)
                        // setActiveStepIndex(detail.requestedStepIndex)
                    }
                    onSubmit={()=>{
                        if (accountSendNow) {
                            accountSendNow()
                        }
                        close()
                    }}
                    onCancel={close}
                    activeStepIndex={activeStepIndex}
                    // allowSkipTo
                    steps={[
                        {
                            title: 'Setup Integration',
                            info: (
                                <Link
                                    variant="info"
                                    external={true}
                                    href="https://docs.opengovernance.io/oss/how-to-guide/setup-integrations"
                                >
                                    Info
                                </Link>
                            ),
                            description: (
                                <>
                                    <a
                                        className=" cursor-pointer "
                                        href="https://docs.opengovernance.io/oss/how-to-guide/setup-integrations"
                                        target="__blank"
                                    >
                                        AWS Accounts needs to be configured with
                                        roles for Integration to work. Click
                                        here for documentation.
                                    </a>
                                </>
                            ),
                            content: '',
                        },
                        {
                            title: 'Account Credentials',
                            info: '',
                            description: (
                                <>Please enter your Account credentials</>
                            ),
                            content: (
                                <>
                                    <Credential
                                        // @ts-ignore
                                        isOrg={isOrg}
                                        errormsg={errorMsg}
                                        credentials={credentials}
                                        errorField={errorField}
                                        setCredentials={setCredentials}
                                        onClose={close}
                                        onNext={() => {
                                            setOnboarded(true)
                                        }}
                                    />
                                </>
                            ),
                        },
                        {
                            title: 'Done',
                            info: '',
                            description: (
                                <StatusIndicator>
                                    On Board Successfull
                                </StatusIndicator>
                            ),
                            content: <></>,
                        },
                    ]}
                />
            </Modal>
        </>
    )
}
