import { Card, Flex, List, ListItem, Text, Title } from '@tremor/react'
import { useWorkspaceApiV1WorkspaceCurrentList } from '../../../api/workspace.gen'
import Spinner from '../../../components/Spinner'

export default function SettingsOrganization() {
    const { response, isLoading } = useWorkspaceApiV1WorkspaceCurrentList()

    let link = response?.organization?.url || ''
    if (!link.startsWith('http')) {
        link = `http://${link}`
    }

    const items = [
        {
            key: 'Company Name',
            value: response?.organization?.companyName,
        },
        {
            key: 'Website',
            value: (
                <a className="text-kaytu-600" href={link}>
                    {response?.organization?.url}
                </a>
            ),
        },
        {
            key: 'Address',
            value: (
                <>
                    <p className="truncate">
                        Address: {response?.organization?.address}
                    </p>
                    <p>City: {response?.organization?.city}</p>
                    <p>
                        State/Province/Region: {response?.organization?.state}
                    </p>
                </>
            ),
        },
        {
            key: 'Country',
            value: <p>{response?.organization?.country}</p>,
        },
        {
            key: 'Contact Details',
            value: (
                <>
                    <p>Name: {response?.organization?.contactName}</p>
                    <p>Phone: {response?.organization?.contactPhone}</p>
                    <p>Email: {response?.organization?.contactEmail}</p>
                </>
            ),
        },
    ]
    return isLoading ? (
        <Flex justifyContent="center" className="mt-56">
            <Spinner />
        </Flex>
    ) : (
        <Card>
            <Title>Organization Info</Title>
            <List className="mt-4">
                {items.map((item) => {
                    return (
                        <ListItem key={item.key}>
                            <Flex
                                alignItems="start"
                                flexDirection="row"
                                className="py-2"
                            >
                                <Text className="text-md w-1/2 text-gray-900">
                                    {item.key}
                                </Text>
                                <Text className="text-md text-start w-1/2 text-gray-500">
                                    {item.value}
                                </Text>
                            </Flex>
                        </ListItem>
                    )
                })}
            </List>
        </Card>
    )
}
