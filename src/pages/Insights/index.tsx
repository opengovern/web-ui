import {
    Button,
    Col,
    Flex,
    Grid,
    Metric,
    Subtitle,
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
import Menu from '../../components/Menu'
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
    const {
        response: insightList,
        isLoading: listLoading,
        sendNow: insightSendNow,
        error: insightError,
    } = useComplianceApiV1InsightList(query)
    const {
        response: insightGroup,
        isLoading: groupLoading,
        sendNow: insightGroupSendNow,
        error: insightGroupError,
    } = useComplianceApiV1InsightGroupList(query)

    useEffect(() => {
        if (tabs === '#groups') {
            setSelectedTab(1)
        } else {
            setSelectedTab(0)
        }
    }, [tabs])

    return (
        <Menu currentPage="insight">
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
                            <Subtitle className="text-gray-600">
                                Insight list
                            </Subtitle>
                        </Tab>
                        <Tab onClick={() => navigate('#groups')}>
                            <Subtitle className="text-gray-600">
                                Insight groups
                            </Subtitle>
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
                            {/* eslint-disable-next-line no-nested-ternary */}
                            {listLoading ? (
                                <Flex justifyContent="center" className="mt-56">
                                    <Spinner />
                                </Flex>
                            ) : insightError === undefined ? (
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
                            ) : (
                                <Button onClick={() => insightSendNow()}>
                                    Retry
                                </Button>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {/* eslint-disable-next-line no-nested-ternary */}
                            {groupLoading ? (
                                <Flex justifyContent="center" className="mt-56">
                                    <Spinner />
                                </Flex>
                            ) : insightGroupError === undefined ? (
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
                            ) : (
                                <Button onClick={() => insightGroupSendNow()}>
                                    Retry
                                </Button>
                            )}
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </Flex>
        </Menu>
    )
}
