import { Flex, Grid, Icon, Tab, TabGroup, TabList, TabPanel, TabPanels, Title } from '@tremor/react'
import TopHeader from '../../../../components/Layout/Header'
import { useState } from 'react'
import AllControls from '../All Controls';
import AllBenchmarks from '../All Benchmarks';

export default function Library() {
    const [tab, setTab] = useState<number>(0)
    return (
        <>
            <TopHeader />
            <TabGroup>
                <TabList>
                    <Tab
                        onClick={() => {
                            setTab(0)
                        }}
                    >
                        Controls
                    </Tab>
                    <Tab
                        onClick={() => {
                            setTab(1)
                        }}
                    >
                        Benchmarks
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {tab == 0 && (
                            <>
                                <AllControls />
                            </>
                        )}
                    </TabPanel>
                    <TabPanel>
                        {tab == 1 && (
                            <>
                                <AllBenchmarks />
                            </>
                        )}
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
