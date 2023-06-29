import {
    Col,
    DateRangePicker,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Title,
} from '@tremor/react'
import React, { useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import LoggedInLayout from '../../components/LoggedInLayout'
import InsightCategories from './InsightCategories'
import {
    useComplianceApiV1InsightGroupList,
    useComplianceApiV1InsightList,
} from '../../api/compliance.gen'
import InsightCard from '../../components/Cards/InsightCard'
import { timeAtom } from '../../store'

export default function Insights() {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)

    const query = {
        ...(activeTimeRange.from && {
            startTime: dayjs(activeTimeRange.from).unix(),
        }),
        ...(activeTimeRange.to && {
            endTime: dayjs(activeTimeRange.to).unix(),
        }),
    }
    const { response: insightList } = useComplianceApiV1InsightList(query)
    const { response: insightGroup } = useComplianceApiV1InsightGroupList(query)
    console.log(insightGroup)

    return (
        <LoggedInLayout currentPage="insight">
            <Flex flexDirection="col">
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="center"
                    className="mb-6"
                >
                    <Title>Insights</Title>
                    <DateRangePicker
                        className="max-w-md"
                        value={activeTimeRange}
                        onValueChange={setActiveTimeRange}
                        selectPlaceholder="Selection"
                    />
                </Flex>
                <TabGroup>
                    <TabList className="mb-6">
                        <Tab>Insight list</Tab>
                        <Tab>Insight groups</Tab>
                    </TabList>
                    <InsightCategories
                        onChange={(category: string) =>
                            setSelectedCategory(() => category)
                        }
                    />
                    <TabPanels>
                        <TabPanel>
                            <Grid
                                numItems={1}
                                numItemsMd={2}
                                numItemsLg={3}
                                className="gap-3 w-100"
                            >
                                {insightList
                                    ?.filter((insight) => {
                                        if (selectedCategory.length)
                                            return insight.tags?.category.includes(
                                                selectedCategory
                                            )
                                        return insight
                                    })
                                    .map((insight) => (
                                        <Col numColSpan={1}>
                                            <InsightCard
                                                metric={insight}
                                                showTitle
                                                showDetails
                                                isClickable
                                            />
                                        </Col>
                                    ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel>
                            {insightGroup
                                ?.filter((insight) => {
                                    if (selectedCategory.length)
                                        return insight.tags?.category.includes(
                                            selectedCategory
                                        )
                                    return insight
                                })
                                .map((insight) => (
                                    <Col numColSpan={1}>
                                        <InsightCard
                                            metric={insight}
                                            showTitle
                                            showDetails
                                            isClickable
                                        />
                                    </Col>
                                ))}
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Flex>
        </LoggedInLayout>
    )
}
