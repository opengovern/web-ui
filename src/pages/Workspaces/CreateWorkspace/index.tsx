import {
    Button,
    Divider,
    Flex,
    Select,
    SelectItem,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { useState } from 'react'
import DrawerPanel from '../../../components/DrawerPanel'

interface ICreateWorkspace {
    open: boolean
    onClose: any
}

export default function CreateWorkspace({ open, onClose }: ICreateWorkspace) {
    const [name, setName] = useState('')
    const [tier, setTier] = useState('')

    return (
        <DrawerPanel open={open} onClose={onClose} title="Create Workspace">
            <Flex
                flexDirection="col"
                justifyContent="between"
                className="h-full"
            >
                <Flex flexDirection="col" alignItems="start">
                    <Text className="mb-12">
                        Your workspace is your company or team’s shared account.
                        You’ll be able to create multiple projects within your
                        org, as well as invite team members to join.
                    </Text>
                    <Title>Required Info</Title>
                    <Divider />
                    <Flex flexDirection="row">
                        <Text>Name *</Text>
                        <TextInput
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-3/5"
                        />
                    </Flex>
                    <Divider />
                    <Flex flexDirection="row">
                        <Text>Tier *</Text>
                        <Select
                            value={tier}
                            className="w-3/5"
                            onChange={(e) => setTier(String(e))}
                        >
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                        </Select>
                    </Flex>
                </Flex>
                <Flex flexDirection="row" justifyContent="end">
                    <Button variant="secondary" onClick={() => onClose()}>
                        Cancel
                    </Button>
                    <Button className="ml-3">Create Workspace</Button>
                </Flex>
            </Flex>
        </DrawerPanel>
    )
}
