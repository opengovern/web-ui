import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai/index'
import { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import Metrics from './Tabs/Metrics'
import { checkGranularity } from '../../../utilities/dateComparator'
import { filterAtom, spendTimeAtom } from '../../../store'
import CloudAccounts from './Tabs/CloudAccounts'

export default function SpendDetails() {
    const navigate = useNavigate()
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = useLocation().hash
    useEffect(() => {
        switch (tabs) {
            case '#metrics':
                setSelectedTab(0)
                break
            case '#cloud-accounts':
                setSelectedTab(1)
                break
            default:
                setSelectedTab(0)
                break
        }
    }, [tabs])
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
            ? 'monthly'
            : 'daily'
    )
    useEffect(() => {
        setSelectedGranularity(
            checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
                ? 'monthly'
                : 'daily'
        )
    }, [activeTimeRange])

    return (
        <Layout
            currentPage={
                tabs === '#metrics'
                    ? 'spend-detail-metric'
                    : 'spend-detail-account'
            }
            breadCrumb={['Spend detail']}
            filter
            datePicker
        >
            <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                <TabList className="mb-3">
                    <Tab onClick={() => navigate('#metrics')}>Metrics</Tab>
                    <Tab onClick={() => navigate('#cloud-accounts')}>
                        Cloud accounts
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Metrics
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            selectedGranularity={selectedGranularity}
                            onGranularityChange={setSelectedGranularity}
                            isSummary={tabs === '#category'}
                        />
                    </TabPanel>
                    <TabPanel>
                        <CloudAccounts
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            selectedGranularity={selectedGranularity}
                            onGranularityChange={setSelectedGranularity}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </Layout>
    )
}
