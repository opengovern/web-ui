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
import { useEffect, useState } from 'react'
import DrawerPanel from '../../../components/DrawerPanel'
import { useWorkspaceApiV1WorkspaceCreate } from '../../../api/workspace.gen'

interface ICreateWorkspace {
    open: boolean
    onClose: any
}

const inputRegex = /^[a-zA-Z0-9-]+$/
export default function CreateWorkspace({ open, onClose }: ICreateWorkspace) {
    const [name, setName] = useState('')
    const [tier, setTier] = useState('')

    const { isLoading, sendNow, isExecuted, error } =
        useWorkspaceApiV1WorkspaceCreate({ name, tier }, {}, false)

    const inputValid = name.length === 0 || inputRegex.test(name)

    useEffect(() => {
        if (!isLoading && isExecuted) {
            onClose()
        }
    }, [isLoading])

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
                    <Flex flexDirection="row" justifyContent="between">
                        <Text className="w-2/5">Name *</Text>
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="w-3/5"
                        >
                            <TextInput
                                value={name}
                                error={!inputValid}
                                errorMessage={
                                    inputValid
                                        ? ''
                                        : 'only characters, numbers and - is allowed'
                                }
                                pattern="[a-zA-Z0-9]"
                                onChange={(e) => setName(e.target.value)}
                                className="w-full"
                            />
                        </Flex>
                    </Flex>
                    <Divider />
                    <Flex flexDirection="row">
                        <Text>Tier *</Text>
                        <Select
                            value={tier}
                            className="w-3/5"
                            onChange={(e) => setTier(String(e))}
                        >
                            <SelectItem value="FREE">FREE</SelectItem>
                            <SelectItem value="TEAMS">TEAMS</SelectItem>
                            <SelectItem value="ENTERPRISE">
                                ENTERPRISE
                            </SelectItem>
                        </Select>
                    </Flex>
                </Flex>
                <Flex flexDirection="row" justifyContent="end">
                    <Button variant="secondary" onClick={() => onClose()}>
                        Cancel
                    </Button>
                    <Button
                        className="ml-3"
                        disabled={
                            !inputValid || name.length < 1 || tier.length < 1
                        }
                        loading={isLoading && isExecuted}
                        onClick={() => sendNow()}
                    >
                        Create Workspace
                    </Button>
                </Flex>
            </Flex>
        </DrawerPanel>
    )
}
