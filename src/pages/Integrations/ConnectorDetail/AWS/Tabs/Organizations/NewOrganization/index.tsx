import { Button, Flex, Text } from '@tremor/react'
import { useState } from 'react'
import FromScratch from './FromScratch'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import FromExisting from './FromExisting'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../api/api'

interface INewOrganization {
    open: boolean
    onClose: () => void
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    forceFromScratch?: boolean
    bootstrapMode?: boolean
}

export default function NewOrganization({
    open,
    onClose,
    accounts,
    forceFromScratch = false,
    bootstrapMode = false,
}: INewOrganization) {
    const [option, setOption] = useState('')
    const [show, setShow] = useState(forceFromScratch ? 'scratch' : '')

    const close = () => {
        setOption('')
        setShow(forceFromScratch ? 'scratch' : '')
        onClose()
    }

    const render = (tab: string) => {
        if (tab === 'scratch')
            return <FromScratch bootstrapMode={bootstrapMode} onClose={close} />
        if (tab === 'existing')
            return <FromExisting accounts={accounts} onClose={close} />
        return (
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="row" alignItems="start" className="mt-6">
                    <Text className="w-1/2 text-black">
                        Create new organization from
                    </Text>
                    <Flex flexDirection="col" className="w-1/2">
                        <Flex
                            flexDirection="row"
                            justifyContent="start"
                            className="mb-3"
                            onClick={() => setOption('existing')}
                        >
                            <input type="radio" name="aws" />
                            <Text className="ml-3 text-black">
                                Existing AWS account
                            </Text>
                        </Flex>
                        <Flex
                            flexDirection="row"
                            justifyContent="start"
                            onClick={() => setOption('scratch')}
                        >
                            <input type="radio" name="aws" />
                            <Text className="ml-3 text-black">
                                New AWS account
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
        <DrawerPanel title="New Organization" open={open} onClose={close}>
            {render(show)}
        </DrawerPanel>
    )
}
