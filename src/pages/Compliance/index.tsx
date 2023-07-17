import { Col, Flex, Grid, Metric, TextInput, Title } from '@tremor/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import LoggedInLayout from '../../components/LoggedInLayout'
import Summary from './Summary'
import { useComplianceApiV1BenchmarksSummaryList } from '../../api/compliance.gen'
import Spinner from '../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../api/api'
import ComplianceCard from '../../components/Cards/ComplianceCard'

export default function Compliance() {
    const { response: benchmarks, isLoading } =
        useComplianceApiV1BenchmarksSummaryList()

    const [search, setSearch] = useState('')
    console.log(benchmarks)
    return (
        <LoggedInLayout currentPage="compliance">
            <Flex flexDirection="col" alignItems="start">
                <Metric>Compliance</Metric>
                <Summary />
                <Grid
                    numItems={1}
                    numItemsMd={2}
                    numItemsLg={3}
                    className="w-full gap-4 mb-3"
                >
                    <Col numColSpan={1} numColSpanMd={2}>
                        <Title>Benchmarks</Title>
                    </Col>
                    <Col numColSpan={1}>
                        <TextInput
                            placeholder="Search Benchmark"
                            icon={MagnifyingGlassIcon}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Col>
                </Grid>
                {isLoading ? (
                    <Spinner className="mt-56" />
                ) : (
                    <Grid
                        numItems={1}
                        numItemsMd={2}
                        numItemsLg={3}
                        className="w-full gap-4"
                    >
                        {benchmarks?.benchmarkSummary
                            ?.sort(
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
                )}
            </Flex>
        </LoggedInLayout>
    )
}