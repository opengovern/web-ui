import React from 'react'
import { Card, Flex, List, ListItem, Metric, Text, Title } from '@tremor/react'
import {
    BuildingOfficeIcon,
    HomeIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import LoggedInLayout from '../../components/LoggedInLayout'
import {
    useWorkspaceApiV1WorkspaceCurrentList,
    useWorkspaceApiV1WorkspaceOrganizationCreate,
} from '../../api/workspace.gen'
import Spinner from '../../components/Spinner'

const SettingsOrganization: React.FC<any> = () => {
    const { user } = useAuth0()
    const { response, isLoading } = useWorkspaceApiV1WorkspaceCurrentList()

    if (isLoading) {
        return <Spinner />
    }

    const items = [
        {
            key: 'Company Name',
            value: response?.organization?.companyName,
        },
        {
            key: 'Website',
            value: response?.organization?.url,
        },
        {
            key: 'Address',
            value: (
                <Flex justifyContent="start">
                    <div>Line1: {response?.organization?.addressLine1}</div>
                    <div>Line2: {response?.organization?.addressLine2}</div>
                    <div>Line3: {response?.organization?.addressLine3}</div>
                    <div>City: {response?.organization?.city}</div>
                    <div>
                        State/Province/Region: {response?.organization?.state}
                    </div>
                </Flex>
            ),
        },
        {
            key: 'Country',
            value: response?.organization?.country,
        },
        {
            key: 'Contact Details',
            value: (
                <Flex justifyContent="start">
                    <div>{response?.organization?.contactPerson}</div>
                    <div>Phone: {response?.organization?.contactPhone}</div>
                    <div>Email: {response?.organization?.contactEmail}</div>
                </Flex>
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
                            <Flex justifyContent="between">
                                <Text className="text-md my-5">{item.key}</Text>
                                <Text className="text-md">{item.value}</Text>
                            </Flex>
                        </ListItem>
                    )
                })}
            </List>
        </Card>
    )
}

export default SettingsOrganization
