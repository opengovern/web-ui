import { Button, Flex, Grid } from '@tremor/react'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import Menu from '../../../components/Menu'
import { useComplianceApiV1InsightList } from '../../../api/compliance.gen'
import InsightCard from '../../../components/Cards/InsightCard'
import { timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import Header from '../../../components/Header'
import Filters from './Filters'

export default function InsightList() {
    const [selectedProvider, setSelectedProvider] = useState<string[]>([])
    const [selectedPersona, setSelectedPersona] = useState<string[]>([])

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
            <Flex className="gap-6" alignItems="start">
                <Filters
                    onProviderChange={(p) => setSelectedProvider(p)}
                    onPersonaChange={(p) => setSelectedPersona(p)}
                />
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
                                if (selectedProvider.length) {
                                    for (
                                        let i = 0;
                                        i < selectedProvider.length;
                                        i += 1
                                    ) {
                                        if (
                                            insight.connector?.includes(
                                                selectedProvider[i]
                                            )
                                        ) {
                                            return insight
                                        }
                                    }
                                    return null
                                }
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
