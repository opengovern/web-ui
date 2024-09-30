import { RadioGroup } from '@headlessui/react'
import { Bold, Button, Flex, Text, Title } from '@tremor/react'
import { useState } from 'react'

interface IScreen1 {
    onClose: () => void
    onNext: (isOrg: boolean) => void
}

export function Screen1({ onClose, onNext }: IScreen1) {
    const [isOrg, setIsOrg] = useState<boolean>(true)
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start" className="gap-2">
                <Title>
                    To onboard, Login to your AWS Organization Account with AWS
                    CLI and run the following commands
                </Title>
                <Text>1. Find your Organization Root ID </Text>
                <Text className="bg-gray-200 p-1 rounded">
                    aws organizations list-roots
                </Text>
                <Text>2. Deploy CFT</Text>
                <Text className="bg-gray-200 p-1 rounded">
                    aws cloudformation create-stack \ <br />
                    --stack-name SimpleStack-Deploy \ <br />
                    --template-url
                    https://cloudops-deploy-automation.s3.amazonaws.com/AWSOrganizationDeployment.yml
                    \ <br />
                    --capabilities CAPABILITY_NAMED_IAM \ <br />
                    --parameters
                    ParameterKey=OrganizationUnitList,ParameterValue=r-a1b2enter
                    code here <br />
                </Text>
                <Text>3. Generate IAM Credentials</Text>
                <Text className="bg-gray-200 p-1 rounded">
                    aws iam create-access-key --user-name SimpleStackIAMUser
                </Text>
                <Text>
                    For advanced deployment options,{' '}
                    <a href="https://docs.opengovernance.io/oss/how-to-guide/setup-integrations/setup-aws-integration">
                        click here
                    </a>
                    .
                </Text>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => onNext(isOrg)} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
