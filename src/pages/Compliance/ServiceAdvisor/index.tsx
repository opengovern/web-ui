import { Button, Flex, Grid, Title } from '@tremor/react'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import Spinner from '../../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import ComplianceCard from '../../../components/Cards/ComplianceCard'
import { benchmarkList } from '../index'

export default function ServiceAdvisor() {
    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()

    return (
        <Menu currentPage="service-advisor">
            <Header />
            <Flex className="mb-4">
                <Title className="font-semibold">Service list</Title>
            </Flex>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : error === undefined ? (
                <Grid numItems={3} className="w-full gap-4">
                    {benchmarkList(benchmarks?.benchmarkSummary)
                        .notConnected?.sort(
                            (a, b) =>
                                (b?.checks?.passedCount || 0) -
                                (a?.checks?.passedCount || 0)
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
