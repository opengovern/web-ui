import { Card, Flex, Grid, Icon, Text } from '@tremor/react'
import { useState } from 'react'
import {
    ChevronDownIcon,
    CloudIcon,
    DocumentCheckIcon,
    ServerStackIcon,
    ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import FindingsWithFailure from './FindingsWithFailure'
import ResourcesWithFailure from './ResourcesWithFailure'

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
        icon: ServerStackIcon,
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

    const render = () => {
        switch (tab) {
            case 'findings':
                return <FindingsWithFailure />
            case 'resources':
                return <ResourcesWithFailure />
            default:
                return <FindingsWithFailure />
        }
    }

    return (
        <Layout currentPage="findings">
            <Header />
            <Grid numItems={4} className="w-full gap-4 mb-4">
                {tabs.map((t) => (
                    <Card
                        key={t.name}
                        onClick={() => setTab(t.type)}
                        className={`px-6 py-3 cursor-pointer ${
                            tab === t.type ? 'ring-kaytu-500' : ''
                        }`}
                    >
                        <Flex>
                            <Flex className="w-fit gap-3">
                                <Icon
                                    icon={t.icon}
                                    className="w-6 text-kaytu-500"
                                />
                                <Text className="!text-base">{t.name}</Text>
                            </Flex>
                            {tab === t.type ? (
                                <div />
                            ) : (
                                <ChevronDownIcon className="w-4 text-kaytu-500" />
                            )}
                        </Flex>
                    </Card>
                ))}
            </Grid>
            {render()}
        </Layout>
    )
}
