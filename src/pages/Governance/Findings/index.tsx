import {
    Card,
    Flex,
    Icon,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
} from '@tremor/react'
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
import ControlsWithFailure from './ControlsWithFailure'
import FailingCloudAccounts from './FailingCloudAccounts'
import { numberDisplay } from '../../../utilities/numericDisplay'

export default function Findings() {
    const [tab, setTab] = useState(0)
    const [findingCount, setFindingCount] = useState(0)
    const [resourceCount, setResourceCount] = useState(0)
    const [controlCount, setControlCount] = useState(0)
    const [accountCount, setAccountCount] = useState(0)

    const tabs = [
        {
            type: 0,
            icon: ShieldExclamationIcon,
            name: 'Findings with failure',
            count: findingCount,
        },
        {
            type: 1,
            icon: DocumentCheckIcon,
            name: 'Resources with failure',
            count: resourceCount,
        },
        {
            type: 2,
            icon: ServerStackIcon,
            name: 'Controls with failure',
            count: controlCount,
        },
        {
            type: 3,
            icon: CloudIcon,
            name: 'Failing cloud accounts',
            count: accountCount,
        },
    ]

    return (
        <Layout currentPage="findings">
            <Header />
            <TabGroup index={tab} onIndexChange={setTab}>
                <TabList className="border-0">
                    {tabs.map((t) => (
                        <Tab
                            key={t.name}
                            className="p-0 w-1/4 rounded-lg"
                            id={t.name}
                        >
                            <Card
                                className="px-4 py-3"
                                style={{
                                    width: document?.getElementById(t.name)
                                        ?.offsetWidth,
                                }}
                            >
                                <Flex>
                                    <Flex className="w-fit gap-2">
                                        <Icon
                                            icon={t.icon}
                                            className="w-6 text-kaytu-500"
                                        />
                                        <Text className="text-gray-800">
                                            {t.name}
                                        </Text>
                                        <Text className="!text-xs">
                                            ({numberDisplay(t.count, 0)})
                                        </Text>
                                    </Flex>
                                    {tab === t.type ? (
                                        <div />
                                    ) : (
                                        <ChevronDownIcon className="w-4 text-kaytu-500" />
                                    )}
                                </Flex>
                            </Card>
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-4">
                    <TabPanel>
                        <FindingsWithFailure
                            count={(x) => setFindingCount(x)}
                        />
                    </TabPanel>
                    <TabPanel>
                        <ResourcesWithFailure
                            count={(x) => setResourceCount(x)}
                        />
                    </TabPanel>
                    <TabPanel>
                        <ControlsWithFailure
                            count={(x) => setControlCount(x)}
                        />
                    </TabPanel>
                    <TabPanel>
                        <FailingCloudAccounts
                            count={(x) => setAccountCount(x)}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Layout>
    )
}
