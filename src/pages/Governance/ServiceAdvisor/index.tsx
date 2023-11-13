import {
    Button,
    Col,
    Flex,
    Grid,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
} from '@tremor/react'
import { useState } from 'react'
import {
    useComplianceApiV1BenchmarksSummaryList,
    useComplianceApiV1MetadataTagComplianceList,
} from '../../../api/compliance.gen'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import Spinner from '../../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import ComplianceCard from '../../../components/Cards/ComplianceCard'
import { benchmarkList } from '../Compliance'

export default function ServiceAdvisor() {
    const [selectedProvider, setSelectedProvider] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()
    const { response: categories } =
        useComplianceApiV1MetadataTagComplianceList()

    return (
        <Layout currentPage="service-advisor">
            <Header />
            <Grid numItems={3} className="w-full gap-4 mb-4">
                <Col numColSpan={2}>
                    <TabGroup>
                        <TabList variant="solid" className="px-0">
                            <Tab
                                className="px-4 py-2"
                                onClick={() => setSelectedCategory('')}
                            >
                                All
                            </Tab>
                            {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
                            <>
                                {categories?.kaytu_category.map((cat) => (
                                    <Tab
                                        className="px-4 py-2"
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </Tab>
                                ))}
                            </>
                        </TabList>
                    </TabGroup>
                </Col>
                <Col numColSpan={1}>
                    <Flex className="h-full">
                        <Select
                            value={selectedProvider}
                            onValueChange={setSelectedProvider}
                            placeholder="Select provider..."
                        >
                            <SelectItem value="">All</SelectItem>
                            <SelectItem value="AWS">AWS</SelectItem>
                            <SelectItem value="Azure">Azure</SelectItem>
                        </Select>
                    </Flex>
                </Col>
            </Grid>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : error === undefined ? (
                <Grid numItems={3} className="w-full gap-4">
                    {benchmarkList(benchmarks?.benchmarkSummary)
                        .serviceAdvisor?.sort(
                            (a, b) =>
                                (b?.checks?.passedCount || 0) -
                                (a?.checks?.passedCount || 0)
                        )
                        .filter((bm) =>
                            selectedProvider.length
                                ? bm?.tags?.service?.includes(selectedProvider)
                                : bm
                        )
                        .filter((bm) =>
                            selectedCategory.length
                                ? bm?.tags?.kaytu_category?.includes(
                                      selectedCategory
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
            ) : (
                <Button onClick={() => sendNow()}>Retry</Button>
            )}
        </Layout>
    )
}
