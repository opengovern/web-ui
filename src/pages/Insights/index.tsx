import {
    Col,
    DateRangePicker,
    Flex,
    Grid,
    Metric,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    TextInput,
} from '@tremor/react'
import React, { useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import LoggedInLayout from '../../components/LoggedInLayout'
import InsightCategories from './InsightCategories'
import {
    useComplianceApiV1InsightGroupList,
    useComplianceApiV1InsightList,
} from '../../api/compliance.gen'
import InsightCard from '../../components/Cards/InsightCard'
import { timeAtom } from '../../store'
import Spinner from '../../components/Spinner'
import InsightGroupCard from '../../components/Cards/InsightGroupCard'

export default function Insights() {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [searchQuery, setSearchQuery] = useState('')

    const query = {
        ...(activeTimeRange.from && {
            startTime: dayjs(activeTimeRange.from).unix(),
        }),
        ...(activeTimeRange.to && {
            endTime: dayjs(activeTimeRange.to).unix(),
        }),
    }
    const { response: insightList, isLoading: listLoading } =
        useComplianceApiV1InsightList(query)
    const { response: insightGroup, isLoading: groupLoading } =
        useComplianceApiV1InsightGroupList(query)

    return (
        <LoggedInLayout currentPage="insight">
            <Flex flexDirection="col">
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    alignItems="center"
                    className="mb-6"
                >
                    <Metric>Insights</Metric>
                    <DateRangePicker
                        className="max-w-md"
                        value={activeTimeRange}
                        onValueChange={setActiveTimeRange}
                        selectPlaceholder="Selection"
                        enableClear={false}
                        maxDate={new Date()}
                    />
                </Flex>
                <TabGroup>
                    <TabList className="mb-6">
                        <Tab>Insight list</Tab>
                        <Tab>Insight groups</Tab>
                    </TabList>
                    <Grid numItems={3} className="gap-3 mb-6">
                        <Col numColSpan={2}>
                            <InsightCategories
                                onChange={(category: string) =>
                                    setSelectedCategory(() => category)
                                }
                            />
                        </Col>
                        <Col>
                            <TextInput
                                icon={MagnifyingGlassIcon}
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Col>
                    </Grid>
                    <TabPanels>
                        <TabPanel>
                            {listLoading ? (
                                <Flex justifyContent="center" className="mt-56">
                                    <Spinner />
                                </Flex>
                            ) : (
                                <Grid
                                    numItems={1}
                                    numItemsMd={2}
                                    numItemsLg={3}
                                    className="gap-3 w-100"
                                >
                                    {insightList
                                        ?.filter(
                                            (insight) =>
                                                insight.shortTitle
                                                    ?.toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    ) ||
                                                insight.longTitle
                                                    ?.toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    )
                                        )
                                        ?.sort((a, b) => {
                                            if (
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                a.totalResultValue >
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                b.totalResultValue
                                            ) {
                                                return -1
                                            }
                                            if (
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                a.totalResultValue <
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                b.totalResultValue
                                            ) {
                                                return 1
                                            }
                                            return 0
                                        })
                                        .filter((insight) => {
                                            if (
                                                selectedCategory.length &&
                                                selectedCategory !== 'All'
                                            )
                                                return insight.tags?.category.includes(
                                                    selectedCategory
                                                )
                                            return insight
                                        })
                                        .map((insight) => (
                                            <Col numColSpan={1}>
                                                <InsightCard metric={insight} />
                                            </Col>
                                        ))}
                                </Grid>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {groupLoading ? (
                                <Flex justifyContent="center" className="mt-56">
                                    <Spinner />
                                </Flex>
                            ) : (
                                <Grid
                                    numItems={1}
                                    numItemsMd={2}
                                    numItemsLg={3}
                                    className="gap-3 w-100"
                                >
                                    {insightGroup
                                        ?.filter(
                                            (insight) =>
                                                insight.shortTitle
                                                    ?.toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    ) ||
                                                insight.longTitle
                                                    ?.toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    )
                                        )
                                        ?.filter((insight) => {
                                            if (
                                                selectedCategory.length &&
                                                selectedCategory !== 'All'
                                            )
                                                return insight.tags?.category.includes(
                                                    selectedCategory
                                                )
                                            return insight
                                        })
                                        .map((insight) => (
                                            <Col numColSpan={1}>
                                                <InsightGroupCard
                                                    metric={insight}
                                                />
                                            </Col>
                                        ))}
                                </Grid>
                            )}
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Flex>
        </LoggedInLayout>
    )
}
