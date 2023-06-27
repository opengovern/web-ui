import { Col, DateRangePicker, Flex, Grid, Title } from '@tremor/react'
import React, { useState } from 'react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import LoggedInLayout from '../../components/LoggedInLayout'
import InsightCategories from './InsightCategories'
import { useComplianceApiV1InsightList } from '../../api/compliance.gen'
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
                <InsightCategories
                    onChange={(category: string) =>
                        setSelectedCategory(() => category)
                    }
                />
                <Grid
                    numItems={1}
                    numItemsSm={2}
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
            </Flex>
        </LoggedInLayout>
    )
}
