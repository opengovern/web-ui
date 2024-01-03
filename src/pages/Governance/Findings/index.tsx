import { Card, Flex, Grid, Icon, Text } from '@tremor/react'
import { useState } from 'react'
import {
    CloudIcon,
    DocumentCheckIcon,
    ServerIcon,
    ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'

const tabs = [
    {
        type: 'findings',
        icon: ShieldExclamationIcon,
        name: 'Findings with failure',
    },
    {
        type: 'resources',
        icon: DocumentCheckIcon,
        name: 'Resources with failure',
    },
    {
        type: 'controls',
        icon: ServerIcon,
        name: 'Controls with failure',
    },
    {
        type: 'accounts',
        icon: CloudIcon,
        name: 'Failing cloud accounts',
    },
]

export default function Findings() {
    const [tab, setTab] = useState('findings')

    return (
        <Layout currentPage="findings">
            <Header />
            <Grid numItems={4} className="w-full gap-4 mb-4">
                {tabs.map((t) => (
                    <Card
                        key={t.name}
                        onClick={() => setTab(t.type)}
                        className={`cursor-pointer ${
                            tab === t.type ? 'ring-kaytu-500' : ''
                        }`}
                    >
                        <Flex>
                            <Flex className="w-fit gap-3">
                                <Icon
                                    icon={t.icon}
                                    className="w-5 text-kaytu-500"
                                />
                                <Text>{t.name}</Text>
                            </Flex>
                        </Flex>
                    </Card>
                ))}
            </Grid>
        </Layout>
    )
}
