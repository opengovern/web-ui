import {
    Button,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Title,
} from '@tremor/react'
import { useEffect, useState } from 'react'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import Menu from '../../../components/Menu'
import Header from '../../../components/Header'
import Spinner from '../../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import ComplianceCard from '../../../components/Cards/ComplianceCard'
import { benchmarkList } from '../Compliance'

export default function ServiceAdvisor() {
    const [selectedProvider, setSelectedProvider] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        switch (selectedIndex) {
            case 0:
                setSelectedProvider('')
                break
            case 1:
                setSelectedProvider('AWS')
                break
            case 2:
                setSelectedProvider('Azure')
                break
            default:
                setSelectedProvider('')
                break
        }
    }, [selectedIndex])

    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()

    return (
        <Menu currentPage="service-advisor">
            <Header />
            {/* eslint-disable-next-line no-nested-ternary */}
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : error === undefined ? (
                <>
                    <Flex className="mb-4">
                        <Title className="font-semibold">Service list</Title>
                        <TabGroup
                            index={selectedIndex}
                            onIndexChange={setSelectedIndex}
                            className="w-fit"
                        >
                            <TabList variant="solid" className="px-0">
                                <Tab className="px-4 py-2">All</Tab>
                                <Tab className="px-4 py-2">AWS</Tab>
                                <Tab className="px-4 py-2">Azure</Tab>
                            </TabList>
                        </TabGroup>
                    </Flex>
                    <Grid numItems={3} className="w-full gap-4">
                        {benchmarkList(benchmarks?.benchmarkSummary)
                            .notConnected?.sort(
                                (a, b) =>
                                    (b?.securityScore || 0) -
                                    (a?.securityScore || 0)
                            )
                            .filter((bm) =>
                                selectedProvider.length
                                    ? bm?.tags?.service?.includes(
                                          selectedProvider
                                      )
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
                </>
            ) : (
                <Button onClick={() => sendNow()}>Retry</Button>
            )}
        </Menu>
    )
}
