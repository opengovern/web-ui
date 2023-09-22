import {
    Button,
    Col,
    Grid,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    Title,
} from '@tremor/react'
import { useState } from 'react'
import Menu from '../../components/Menu'
import Summary from './Summary'
import { useComplianceApiV1BenchmarksSummaryList } from '../../api/compliance.gen'
import Spinner from '../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../api/api'
import ComplianceCard from '../../components/Cards/ComplianceCard'
import Header from '../../components/Header'

export const benchmarkList = (ben: any) => {
    const connected = []
    const notConnected = []
    if (ben) {
        for (let i = 0; i < ben.length; i += 1) {
            if (
                (ben[i].checks?.criticalCount || 0) +
                (ben[i].checks?.highCount || 0) +
                (ben[i].checks?.mediumCount || 0) +
                (ben[i].checks?.lowCount || 0) +
                (ben[i].checks?.passedCount || 0) +
                (ben[i].checks?.unknownCount || 0)
            ) {
                connected.push(ben[i])
            } else {
                notConnected.push(ben[i])
            }
        }
    }
    return { connected, notConnected }
}

export default function Compliance() {
    const [selectedProvider, setSelectedProvider] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)

    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()
    console.log(benchmarks)

    return (
        <Menu currentPage="compliance">
            <Header />
            <Summary benchmark={benchmarks} loading={isLoading} />
            <Title className="font-semibold">Benchmarks</Title>
            <Grid numItems={3} className="w-full gap-4 my-4">
                <Col numColSpan={2}>
                    <TabGroup
                        index={selectedIndex}
                        onIndexChange={setSelectedIndex}
                    >
                        <TabList variant="solid" className="px-0 mb-4">
                            <Tab className="px-4 py-2">All</Tab>
                            <Tab className="px-4 py-2">Certifications</Tab>
                            <Tab className="px-4 py-2">Legal regulations</Tab>
                            <Tab className="px-4 py-2">Frameworks</Tab>
                            <Tab className="px-4 py-2">Privacy</Tab>
                        </TabList>
                    </TabGroup>
                </Col>
                <Col numColSpan={1}>
                    <Select
                        value={selectedProvider}
                        onValueChange={setSelectedProvider}
                        placeholder="Select provider..."
                    >
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value="AWS">AWS</SelectItem>
                        <SelectItem value="Azure">Azure</SelectItem>
                    </Select>
                </Col>
            </Grid>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : error === undefined ? (
                <Grid numItems={3} className="w-full gap-4">
                    {benchmarkList(benchmarks?.benchmarkSummary)
                        .connected?.sort(
                            (a, b) =>
                                (b?.checks?.passedCount || 0) -
                                (a?.checks?.passedCount || 0)
                        )
                        .filter((bm) =>
                            selectedProvider.length
                                ? bm?.tags?.service?.includes(selectedProvider)
                                : bm
                        )
                        .map(
                            (
                                bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                            ) => (
                                <ComplianceCard benchmark={bm} />
                            )
                        )}
                </Grid>
            ) : (
                <Button onClick={() => sendNow()}>Retry</Button>
            )}
        </Menu>
    )
}
