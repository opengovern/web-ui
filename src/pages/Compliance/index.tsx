import {
    Button,
    Col,
    Divider,
    Flex,
    Grid,
    TextInput,
    Title,
} from '@tremor/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Menu from '../../components/Menu'
import Summary from './Summary'
import { useComplianceApiV1BenchmarksSummaryList } from '../../api/compliance.gen'
import Spinner from '../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../api/api'
import ComplianceCard from '../../components/Cards/ComplianceCard'
import Header from '../../components/Header'

const benchmarkList = (ben: any) => {
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
    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()

    const [search, setSearch] = useState('')

    return (
        <Menu currentPage="compliance">
            <Header />
            <Flex flexDirection="col" alignItems="start">
                <Summary benchmark={benchmarks} loading={isLoading} />
                <Grid
                    numItems={1}
                    numItemsMd={2}
                    numItemsLg={3}
                    className="w-full gap-4 mb-3"
                >
                    <Col numColSpan={1} numColSpanMd={2}>
                        <Title className="font-semibold">Benchmarks</Title>
                    </Col>
                    <Col numColSpan={1}>
                        <TextInput
                            placeholder="Search Benchmark"
                            icon={MagnifyingGlassIcon}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Col>
                </Grid>
                {/* eslint-disable-next-line no-nested-ternary */}
                {isLoading ? (
                    <Spinner className="mt-56" />
                ) : error === undefined ? (
                    <>
                        <Grid
                            numItems={1}
                            numItemsMd={2}
                            numItemsLg={3}
                            className="w-full gap-4"
                        >
                            {benchmarkList(benchmarks?.benchmarkSummary)
                                .connected?.sort(
                                    (a, b) =>
                                        (b?.checks?.passedCount || 0) -
                                        (a?.checks?.passedCount || 0)
                                )
                                .filter((bm) =>
                                    bm?.title
                                        ?.toLowerCase()
                                        .includes(search.toLowerCase())
                                )
                                .map(
                                    (
                                        bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                    ) => (
                                        <ComplianceCard benchmark={bm} />
                                    )
                                )}
                        </Grid>
                        <Divider />
                        {!!benchmarkList(benchmarks?.benchmarkSummary)
                            .notConnected.length && (
                            <Title className="font-semibold mb-4">
                                Not Assigned
                            </Title>
                        )}
                        <Grid
                            numItems={1}
                            numItemsMd={2}
                            numItemsLg={3}
                            className="w-full gap-4"
                        >
                            {benchmarkList(benchmarks?.benchmarkSummary)
                                .notConnected?.sort(
                                    (a, b) =>
                                        (b?.checks?.passedCount || 0) -
                                        (a?.checks?.passedCount || 0)
                                )
                                .filter((bm) =>
                                    bm?.title
                                        ?.toLowerCase()
                                        .includes(search.toLowerCase())
                                )
                                .map(
                                    (
                                        bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                    ) => (
                                        <ComplianceCard benchmark={bm} />
                                    )
                                )}
                        </Grid>
                    </>
                ) : (
                    <Button onClick={() => sendNow()}>Retry</Button>
                )}
            </Flex>
        </Menu>
    )
}
