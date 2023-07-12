import { Button, Flex, Text } from '@tremor/react'
import { useState } from 'react'
import FromScratch from './FromScratch'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import FromExisting from './FromExisting'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../../api/api'

interface INewAWSAccount {
    open: boolean
    onClose: () => void
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    organizations: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
}

export default function NewAWSAccount({
    open,
    onClose,
    accounts,
    organizations,
}: INewAWSAccount) {
    const [option, setOption] = useState('')
    const [show, setShow] = useState('')

    const close = () => {
        onClose()
        setShow('')
        setOption('')
    }

    const render = (tab: string) => {
        if (tab === 'scratch') return <FromScratch close={close} />
        if (tab === 'existing')
            return (
                <FromExisting
                    organizations={organizations}
                    accounts={accounts}
                    onClose={close}
                />
            )
        return (
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="row" alignItems="start" className="mt-6">
                    <Text className="w-1/2 text-black">AWS Account</Text>
                    <Flex flexDirection="col" className="w-1/2">
                        <Flex
                            flexDirection="row"
                            justifyContent="start"
                            className="mb-3"
                            onClick={() => setOption('scratch')}
                        >
                            <input type="radio" name="aws" />
                            <Text className="ml-3 text-black">
                                Standalone AWS Account
                            </Text>
                        </Flex>
                        <Flex
                            flexDirection="row"
                            justifyContent="start"
                            onClick={() => setOption('existing')}
                        >
                            <input type="radio" name="aws" />
                            <Text className="ml-3 text-black">
                                Discover new Accounts from an AWS Organization
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexDirection="row" justifyContent="end">
                    <Button variant="secondary" onClick={close}>
                        Cancel
                    </Button>
                    <Button className="ml-3" onClick={() => setShow(option)}>
                        Next
                    </Button>
                </Flex>
            </Flex>
        )
    }

    return (
        <DrawerPanel title="Onboard AWS Account" open={open} onClose={close}>
            {render(show)}
        </DrawerPanel>
    )
}
