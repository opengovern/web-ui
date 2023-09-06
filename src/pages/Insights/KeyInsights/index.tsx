import { useAtomValue } from 'jotai'
import { Button, Col, Flex, Grid } from '@tremor/react'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import { useComplianceApiV1InsightGroupList } from '../../../api/compliance.gen'
import { timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import InsightCard from '../../../components/Cards/InsightCard'
import InsightGroupCard from '../../../components/Cards/InsightGroupCard'

export default function KeyInsights() {
    const activeTimeRange = useAtomValue(timeAtom)

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
    } = useComplianceApiV1InsightGroupList(query)
    console.log(insightList)
    return (
        <Menu currentPage="key-insights">
            <Header datePicker />
            {/* eslint-disable-next-line no-nested-ternary */}
            {listLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : insightError === undefined ? (
                <Grid numItems={3} className="w-full gap-4">
                    {insightList
                        ?.sort(
                            (a, b) =>
                                (b.totalResultValue || 0) -
                                (a.totalResultValue || 0)
                        )
                        .map((insight) => (
                            <InsightGroupCard
                                title={insight.shortTitle}
                                description={insight.longTitle}
                                count={insight.totalResultValue}
                                prevCount={insight.oldTotalResultValue}
                            />
                        ))}
                </Grid>
            ) : (
                <Button onClick={() => insightSendNow()}>Retry</Button>
            )}
        </Menu>
    )
}
