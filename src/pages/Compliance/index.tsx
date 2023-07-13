import { Flex, Metric } from '@tremor/react'
import { useAtom } from 'jotai/index'
import dayjs from 'dayjs'
import LoggedInLayout from '../../components/LoggedInLayout'
import Summary from './Summary'
import { useComplianceApiV1BenchmarksSummaryList } from '../../api/compliance.gen'
import { timeAtom } from '../../store'

export default function Compliance() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)

    // const { response: benchmarks } = useComplianceApiV1BenchmarksSummaryList({
    //     start: dayjs(activeTimeRange.start.toString()).unix(),
    //     end: dayjs(activeTimeRange.end.toString()).unix(),
    // })
    // console.log(benchmarks)
    return (
        <LoggedInLayout currentPage="compliance">
            <Flex flexDirection="col" alignItems="start">
                <Metric>Compliance</Metric>
                <Summary />
            </Flex>
        </LoggedInLayout>
    )
}
