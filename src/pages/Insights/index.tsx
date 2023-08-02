import {
    Col,
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
import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai/index'
import { useNavigate, useLocation } from 'react-router-dom'
import LoggedInLayout from '../../components/LoggedInLayout'
import InsightCategories from './InsightCategories'
import {
    useComplianceApiV1InsightGroupList,
    useComplianceApiV1InsightList,
} from '../../api/compliance.gen'
import InsightCard from '../../components/Cards/InsightCard'
import DateRangePicker from '../../components/DateRangePicker'
import { timeAtom } from '../../store'
import Spinner from '../../components/Spinner'
import InsightGroupCard from '../../components/Cards/InsightGroupCard'

export default function Insights() {
    const navigate = useNavigate()
    const tabs = useLocation().hash
    const [selectedCategory, setSelectedCategory] = useState('')
    const activeTimeRange = useAtomValue(timeAtom)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTab, setSelectedTab] = useState(0)
    const query = {
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }
    const { response: insightList, isLoading: listLoading } =
        useComplianceApiV1InsightList(query)
    const { response: insightGroup, isLoading: groupLoading } =
        useComplianceApiV1InsightGroupList(query)

    useEffect(() => {
        if (tabs === '#groups') {
            setSelectedTab(1)
        } else {
            setSelectedTab(0)
        }
    }, [tabs])

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
                    <DateRangePicker />
                </Flex>
                <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                    <TabList className="mb-6">
                        <Tab onClick={() => navigate('#list')}>
                            Insight list
                        </Tab>
                        <Tab onClick={() => navigate('#groups')}>
                            Insight groups
                        </Tab>
                    </TabList>
                    <Grid numItems={3} className="gap-4 mb-6">
                        <Col numColSpan={2}>
                            <InsightCategories
                                selected={selectedTab + 1}
                                onChange={(category: string) =>
                                    setSelectedCategory(() => category)
                                }
                            />
                        </Col>
                        <Col>
                            <TextInput
                                icon={MagnifyingGlassIcon}
                                placeholder="Search Insights"
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
                                    className="gap-4 w-full"
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
                                        ?.sort(
                                            (a, b) =>
                                                (b.totalResultValue || 0) -
                                                (a.totalResultValue || 0)
                                        )
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
                                    className="gap-4 w-full"
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
