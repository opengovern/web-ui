import { useAtomValue } from 'jotai'
import { Button, Flex, Grid, Tab, TabGroup, TabList } from '@tremor/react'
import { useEffect, useState } from 'react'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import { useComplianceApiV1InsightGroupList } from '../../../api/compliance.gen'
import { filterAtom, timeAtom } from '../../../store'
import Spinner from '../../../components/Spinner'
import InsightGroupCard from '../../../components/Cards/InsightGroupCard'

export default function KeyInsights() {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [selectedPersona, setSelectedPersona] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        switch (selectedIndex) {
            case 0:
                setSelectedPersona('')
                break
            case 1:
                setSelectedPersona('DevOps')
                break
            case 2:
                setSelectedPersona('Executive')
                break
            case 3:
                setSelectedPersona('FinOps')
                break
            case 4:
                setSelectedPersona('Product')
                break
            case 5:
                setSelectedPersona('Security')
                break
            default:
                setSelectedPersona('')
                break
        }
    }, [selectedIndex])

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
    } = useComplianceApiV1InsightGroupList(query)

    return (
        <Menu currentPage="key-insights">
            <Header datePicker filter />
            {/* eslint-disable-next-line no-nested-ternary */}
            {listLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : insightError === undefined ? (
                <>
                    <TabGroup
                        index={selectedIndex}
                        onIndexChange={setSelectedIndex}
                    >
                        <TabList variant="solid" className="px-0 mb-4">
                            <Tab className="px-4 py-2">All</Tab>
                            <Tab className="px-4 py-2">DevOps</Tab>
                            <Tab className="px-4 py-2">Executive</Tab>
                            <Tab className="px-4 py-2">FinOps</Tab>
                            <Tab className="px-4 py-2">Product</Tab>
                            <Tab className="px-4 py-2">Security</Tab>
                        </TabList>
                    </TabGroup>
                    <Grid numItems={3} className="w-full gap-4">
                        {insightList
                            ?.sort(
                                (a, b) =>
                                    (b.totalResultValue || 0) -
                                    (a.totalResultValue || 0)
                            )
                            .filter((insight) =>
                                selectedPersona.length > 0
                                    ? insight.tags?.persona.includes(
                                          selectedPersona
                                      )
                                    : insight
                            )
                            .map((insight) => (
                                <InsightGroupCard
                                    id={insight.id}
                                    title={insight.shortTitle}
                                    description={insight.longTitle}
                                    count={insight.totalResultValue}
                                    prevCount={insight.oldTotalResultValue}
                                />
                            ))}
                    </Grid>
                </>
            ) : (
                <Button onClick={() => insightSendNow()}>Retry</Button>
            )}
        </Menu>
    )
}
