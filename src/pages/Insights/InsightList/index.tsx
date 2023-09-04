import { Button, Col, Flex, Grid } from '@tremor/react'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import Menu from '../../../components/Menu'
import { useComplianceApiV1InsightList } from '../../../api/compliance.gen'
import InsightCard from '../../../components/Cards/InsightCard'
import { timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import Header from '../../../components/Header'
import Carousel from '../../../components/Carousel'

export default function InsightList() {
    const [selectedCategory, setSelectedCategory] = useState('')
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
    } = useComplianceApiV1InsightList(query)

    return (
        <Menu currentPage="insight">
            <Header title="Insight List" datePicker />
            <Flex>
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
                                <InsightCard metric={insight} />
                            ))}
                    </Grid>
                ) : (
                    <Button onClick={() => insightSendNow()}>Retry</Button>
                )}
            </Flex>
        </Menu>
    )
}
