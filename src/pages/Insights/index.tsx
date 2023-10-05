import { Button, Flex, Grid, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router-dom'
import Menu from '../../components/Menu'
import Header from '../../components/Header'
import PersonaCard from '../../components/Cards/PersonaCard'
import { filterAtom, timeAtom } from '../../store'
import { useComplianceApiV1InsightList } from '../../api/compliance.gen'
import Spinner from '../../components/Spinner'
import InsightCard from '../../components/Cards/InsightCard'
import GoalCard from '../../components/Cards/GoalCard'

export default function Insights() {
    const navigate = useNavigate()
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

    return (
        <Menu currentPage="insights">
            <Header datePicker filter />
            <Title className="font-semibold mb-4">Personas</Title>
            <Grid numItems={9} className="w-full gap-4 mb-12">
                <PersonaCard type="Engineer" />
                <PersonaCard type="DevOps" />
                <PersonaCard type="Product" />
                <PersonaCard type="Security" />
                <PersonaCard type="Executive" />
            </Grid>
            <Title className="font-semibold mb-4">Goals</Title>
            {/* <div className="relative mb-8">
                <div className="opacity-0">
                    <GoalCard title="Find IAM issues" />
                </div>
                <Flex
                    justifyContent="start"
                    className="absolute left-0 top-0 gap-4 pb-4 overflow-scroll"
                    style={{
                        width: 'calc(100% + 500px)',
                        paddingRight: '500px',
                    }}
                >
                    <GoalCard title="Find IAM issues" />
                    <GoalCard title="Internet exposed storage" />
                    <GoalCard title="Workload without HA" />
                    <GoalCard title="Over Provisioned" />
                    <GoalCard title="Cloud Technical Debt" />
                    <GoalCard title="Cloud Native Databases" />
                </Flex>
            </div> */}
            <Grid numItems={6} className="w-full gap-4 mb-12">
                <GoalCard title="Find IAM issues" />
                <GoalCard title="Exposed storage" />
                <GoalCard title="Workload without HA" />
                <GoalCard title="Over Provisioned" />
                <GoalCard title="Cloud Technical Debt" />
                <GoalCard title="Cloud Native Databases" />
            </Grid>
            <Flex className="mb-4">
                <Title className="font-semibold">Popular insights</Title>
                <Button
                    variant="light"
                    onClick={() => navigate('insight-list')}
                >
                    View all insights
                </Button>
            </Flex>
            {/* eslint-disable-next-line no-nested-ternary */}
            {listLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : insightError === undefined ? (
                <Grid numItems={3} className="w-full gap-4">
                    {insightList?.map(
                        (insight, i) =>
                            i < 6 && <InsightCard metric={insight} />
                    )}
                </Grid>
            ) : (
                <Button onClick={() => insightSendNow()}>Retry</Button>
            )}
        </Menu>
    )
}
