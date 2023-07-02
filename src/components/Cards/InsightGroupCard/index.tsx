import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    BadgeDelta,
    Card,
    Divider,
    Flex,
    Subtitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { numericDisplay } from '../../../utilities/numericDisplay'

interface IInsightGroupCard {
    metric: any
}

const calculatePercent = (inputData: any) => {
    if (
        Number(inputData.oldTotalResultValue) &&
        Number(inputData.totalResultValue)
    ) {
        return (
            ((inputData.totalResultValue - inputData.oldTotalResultValue) /
                inputData.oldTotalResultValue) *
                100 || 0
        )
    }
    return 0
}

export default function InsightGroupCard({ metric }: IInsightGroupCard) {
    const navigate = useNavigate()
    const navigateToAssetsInsightsDetails = (id: any) => {
        navigate(`${id}`)
    }
    console.log(metric)

    return (
        <Card key={metric.id}>
            <Flex
                flexDirection="col"
                alignItems="start"
                justifyContent="between"
                className="h-full"
            >
                <Flex flexDirection="col" alignItems="start">
                    <Title className="my-2">{metric?.shortTitle}</Title>
                    <Flex flexDirection="row" className="mb-2">
                        <Flex
                            flexDirection="row"
                            alignItems="end"
                            className="w-fit"
                        >
                            <Title className="mr-1">
                                {metric?.totalResultValue
                                    ? numericDisplay(
                                          metric?.totalResultValue || 0
                                      )
                                    : 'N/A'}
                            </Title>
                            <Subtitle>
                                {`from ${
                                    metric?.oldTotalResultValue
                                        ? numericDisplay(
                                              metric?.oldTotalResultValue || 0
                                          )
                                        : 'N/A'
                                }`}
                            </Subtitle>
                        </Flex>
                        <BadgeDelta
                            deltaType={
                                calculatePercent(metric) > 0
                                    ? 'moderateIncrease'
                                    : 'moderateDecrease'
                            }
                            className={`opacity-${
                                calculatePercent(metric) !== 0 ? 1 : 0
                            } cursor-pointer`}
                        >
                            {`${
                                calculatePercent(metric) > 0
                                    ? Math.ceil(calculatePercent(metric))
                                    : -1 * Math.floor(calculatePercent(metric))
                            }%`}
                        </BadgeDelta>
                    </Flex>
                    <Text>{metric?.description}</Text>
                    <Table className="w-full mt-5">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell className="px-0">
                                    Insight
                                </TableHeaderCell>
                                <TableHeaderCell className="px-0 flex justify-end">
                                    Total
                                </TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {metric.insights
                                .filter((insight: any, i: number) => i < 2)
                                .map((insight: any) => (
                                    <TableRow
                                        onClick={() =>
                                            (insight?.totalResultValue ||
                                                insight?.oldTotalResultValue) &&
                                            navigateToAssetsInsightsDetails(
                                                insight.id
                                            )
                                        }
                                        className={`${
                                            insight?.totalResultValue ||
                                            insight?.oldTotalResultValue
                                                ? 'cursor-pointer'
                                                : 'bg-slate-50'
                                        }`}
                                    >
                                        <TableCell className="px-0">
                                            <Text>{insight.shortTitle}</Text>
                                        </TableCell>
                                        <TableCell className="px-0 flex justify-end">
                                            <Text
                                                color={
                                                    insight.totalResultValue -
                                                        insight.oldTotalResultValue >
                                                    0
                                                        ? 'green'
                                                        : 'red'
                                                }
                                            >
                                                {numericDisplay(
                                                    insight.totalResultValue
                                                ) || 'N/A'}
                                            </Text>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <Accordion className="w-full border-0">
                        <AccordionBody className="p-0 w-full">
                            <Divider className="p-0 m-0" />
                            <Table className="w-full">
                                <TableBody>
                                    {metric.insights
                                        .filter(
                                            (insight: any, i: number) => i > 1
                                        )
                                        .map((insight: any) => (
                                            <TableRow
                                                onClick={() =>
                                                    (insight?.totalResultValue ||
                                                        insight?.oldTotalResultValue) &&
                                                    navigateToAssetsInsightsDetails(
                                                        insight.id
                                                    )
                                                }
                                                className={`${
                                                    insight?.totalResultValue ||
                                                    insight?.oldTotalResultValue
                                                        ? 'cursor-pointer'
                                                        : 'bg-slate-50'
                                                }`}
                                            >
                                                <TableCell className="px-0">
                                                    <Text>
                                                        {insight.shortTitle}
                                                    </Text>
                                                </TableCell>
                                                <TableCell className="px-0 flex justify-end">
                                                    <Text
                                                        color={
                                                            insight.totalResultValue -
                                                                insight.oldTotalResultValue >
                                                            0
                                                                ? 'green'
                                                                : 'red'
                                                        }
                                                    >
                                                        {numericDisplay(
                                                            insight.totalResultValue
                                                        ) || 'N/A'}
                                                    </Text>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </AccordionBody>
                        <AccordionHeader
                            color="blue"
                            className={`p-0 w-full pr-0.5 ${
                                metric.insights.length > 2
                                    ? 'opacity-100'
                                    : 'opacity-0 cursor-default'
                            }`}
                        >
                            <Flex justifyContent="end">
                                <Text color="blue" className="-mr-2">
                                    see more
                                </Text>
                            </Flex>
                        </AccordionHeader>
                    </Accordion>
                </Flex>
            </Flex>
        </Card>
    )
}
