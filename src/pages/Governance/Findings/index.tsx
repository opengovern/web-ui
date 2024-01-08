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
import FindingsWithFailure from './FindingsWithFailure'
import ResourcesWithFailure from './ResourcesWithFailure'
import ControlsWithFailure from './ControlsWithFailure'
import FailingCloudAccounts from './FailingCloudAccounts'
import { numberDisplay } from '../../../utilities/numericDisplay'

export default function Findings() {
    const [tab, setTab] = useState(0)
    const [findingCount, setFindingCount] = useState<number | undefined>(
        undefined
    )
    const [resourceCount, setResourceCount] = useState<number | undefined>(
        undefined
    )
    const [controlCount, setControlCount] = useState<number | undefined>(
        undefined
    )
    const [accountCount, setAccountCount] = useState<number | undefined>(
        undefined
    )

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
            <TabGroup index={tab} onIndexChange={setTab}>
                <TabList className="border-0">
                    {tabs.map((t) => (
                        <Tab
                            key={t.name}
                            className="p-0 w-1/4 rounded-lg compliance-fix"
                            id={t.name}
                        >
                            <Card className="px-4 py-3">
                                <Flex>
                                    <Flex className="w-fit gap-2">
                                        <Icon
                                            icon={t.icon}
                                            className="w-6 max-w-[24px] text-kaytu-500"
                                        />
                                        <Text className="text-gray-800 w-fit">
                                            {t.name}
                                        </Text>
                                        {Number(t.count) > -1 ? (
                                            <Text className="!text-xs">
                                                ({numberDisplay(t.count, 0)})
                                            </Text>
                                        ) : (
                                            <div className="animate-pulse">
                                                <div className="h-4 w-10 rounded bg-slate-200" />
                                            </div>
                                        )}
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
