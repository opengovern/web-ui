import { Button, Card, Flex, Grid, Text, TextInput, Title } from '@tremor/react'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Menu from '../../../components/Menu'
import {
    useComplianceApiV1InsightGroupList,
    useComplianceApiV1InsightList,
} from '../../../api/compliance.gen'
import { filterAtom, timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import Header from '../../../components/Header'
import InsightCard from '../../../components/Cards/InsightCard'
import KeyInsightCard from '../../../components/Cards/KeyInsightCard'

export default function InsightList() {
    const [searchCategory, setSearchCategory] = useState('')
    const [showFilter, setShowFilter] = useState(false)

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
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
        response: keyInsightList,
        isLoading: keyListLoading,
        sendNow: keyInsightSendNow,
        error: keyInsightError,
    } = useComplianceApiV1InsightGroupList(query)

    return (
        <Menu currentPage="insights">
            <Header datePicker filter />
            <Flex alignItems="start" className="gap-4">
                {showFilter ? (
                    <Card className="sticky w-fit">
                        <TextInput
                            className="w-56 mb-6"
                            icon={MagnifyingGlassIcon}
                            placeholder="Search..."
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        />
                    </Card>
                ) : (
                    <Flex
                        flexDirection="col"
                        justifyContent="center"
                        className="min-h-full w-fit"
                    >
                        <Button
                            variant="light"
                            onClick={() => setShowFilter(true)}
                        >
                            <Flex flexDirection="col" className="gap-4 w-4">
                                <FunnelIcon />
                                <Text className="rotate-90">Options</Text>
                            </Flex>
                        </Button>
                    </Flex>
                )}
                <Flex flexDirection="col" alignItems="start">
                    <Title className="font-semibold mb-4">Key insights</Title>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {keyListLoading ? (
                        <Flex justifyContent="center" className="my-40">
                            <Spinner />
                        </Flex>
                    ) : keyInsightError === undefined ? (
                        <Grid numItems={3} className="w-full gap-4">
                            {keyInsightList?.map((insight) => (
                                <KeyInsightCard
                                    id={insight.id}
                                    title={insight.shortTitle}
                                    count={insight.totalResultValue}
                                    prevCount={insight.oldTotalResultValue}
                                />
                            ))}
                        </Grid>
                    ) : (
                        <Button onClick={() => keyInsightSendNow()}>
                            Retry
                        </Button>
                    )}
                    <Title className="font-semibold mt-6 mb-4">
                        All insights
                    </Title>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {listLoading ? (
                        <Flex justifyContent="center" className="mt-56">
                            <Spinner />
                        </Flex>
                    ) : insightError === undefined ? (
                        <Grid numItems={4} className="w-full gap-4">
                            {insightList?.map((insight) => (
                                <InsightCard metric={insight} />
                            ))}
                        </Grid>
                    ) : (
                        <Button onClick={() => insightSendNow()}>Retry</Button>
                    )}
                </Flex>
            </Flex>
        </Menu>
    )
}
