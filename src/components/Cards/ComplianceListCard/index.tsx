import {
    Button,
    Card,
    CategoryBar,
    Col,
    Flex,
    Grid,
    List,
    ListItem,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import { benchmarkChecks } from '../ComplianceCard'
import SummaryCard from '../SummaryCard'
import { getConnectorIcon } from '../ConnectorCard'
import SeverityBar from '../../SeverityBar'

interface IComplianceCard {
    benchmark:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
}

export default function ComplianceListCard({ benchmark }: IComplianceCard) {
    const navigate = useNavigate()

    const connector = () => {
        if (benchmark?.tags?.plugin) {
            if (benchmark?.tags?.plugin[0] === 'azure') {
                return 'Azure'
            }
            return 'AWS'
        }
        return undefined
    }

    return (
        <Card
            key={benchmark?.id}
            className="cursor-pointer"
            onClick={() =>
                navigate(
                    `${benchmark?.id}${
                        benchmarkChecks(benchmark).total
                            ? ''
                            : '/details#assignments'
                    }`
                )
            }
        >
            <Flex className="mb-3">
                <Flex justifyContent="start" className="w-3/4 gap-3">
                    {getConnectorIcon(connector())}
                    <Title className="truncate">{benchmark?.title}</Title>
                </Flex>
                <Button
                    variant="light"
                    icon={ChevronRightIcon}
                    iconPosition="right"
                >
                    See detail
                </Button>
            </Flex>
            <Grid numItems={5}>
                <SummaryCard
                    title="Security score"
                    metric={
                        ((benchmark?.conformanceStatusSummary?.okCount || 0) /
                            benchmarkChecks(benchmark).total || 0) * 100
                    }
                    isPercent
                    border={false}
                />
                <Col numColSpan={2} className="px-6 border-x border-x-gray-200">
                    <Text className="font-semibold mb-4">Severity</Text>
                    <SeverityBar benchmark={benchmark} />
                </Col>
                <Col numColSpan={2} className="pl-6">
                    <Text className="font-semibold">Top accounts</Text>
                    <List>
                        {benchmark?.topConnections?.map((c) => (
                            <ListItem>
                                <Text>
                                    {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        c.Connection?.providerConnectionName
                                    }
                                </Text>
                                <Text>{c.count}</Text>
                            </ListItem>
                        ))}
                    </List>
                </Col>
            </Grid>
        </Card>
    )
}
