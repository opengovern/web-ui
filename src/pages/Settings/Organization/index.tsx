import React from 'react'
import {
    Card,
    Flex,
    List,
    ListItem,
    Metric,
    Select,
    SelectItem,
    Text,
    Title,
} from '@tremor/react'
import {
    BuildingOfficeIcon,
    HomeIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import LoggedInLayout from '../../../components/LoggedInLayout'
import {
    useWorkspaceApiV1WorkspaceCurrentList,
    useWorkspaceApiV1WorkspaceOrganizationCreate,
} from '../../../api/workspace.gen'
import Spinner from '../../../components/Spinner'

const SettingsOrganization: React.FC<any> = () => {
    const { user } = useAuth0()
    const { response, isLoading } = useWorkspaceApiV1WorkspaceCurrentList()

    if (isLoading) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

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
                <a className="text-blue-600" href={link}>
                    {response?.organization?.url}
                </a>
            ),
        },
        {
            key: 'Address',
            value: (
                <>
                    <p>Line1: {response?.organization?.addressLine1}</p>
                    <p>Line2: {response?.organization?.addressLine2}</p>
                    <p>Line3: {response?.organization?.addressLine3}</p>
                    <p>City: {response?.organization?.city}</p>
                    <p>
                        State/Province/Region: {response?.organization?.state}
                    </p>
                </>
            ),
        },
        {
            key: 'Country',
            value: (
                <>
                    <p>{response?.organization?.country}</p>
                </>
            ),
        },
        {
            key: 'Contact Details',
            value: (
                <>
                    <p>{response?.organization?.contactPerson}</p>
                    <p>Phone: {response?.organization?.contactPhone}</p>
                    <p>Email: {response?.organization?.contactEmail}</p>
                </>
            ),
        },
    ]
    return (
        <Card className="flex-1 flex-grow">
            <Title>Organization Info</Title>

            <List className="mt-4">
                {items.map((item) => {
                    return (
                        <ListItem key="lb">
                            <Flex justifyContent="start" flexDirection="row">
                                <Text className="text-md my-5 w-1/2 text-gray-900">
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

export default SettingsOrganization
