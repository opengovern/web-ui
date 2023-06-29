import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    BadgeDelta,
    Card,
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

const insightRows = (insights: any) => {
    const rows = []
    if (insights) {
        for (let i = 0; i < insights.length; i = +1) {
            rows.push({
                name: insights[i].shortTitle || '',
                value: insights[i].totalResultValue || 0,
                isPositive:
                    insights[i].totalResultValue -
                        insights[i].oldTotalResultValue >
                    0,
                num: i,
                id: insights[i].id,
            })
        }
    }
    return rows
}

export default function InsightGroupCard({ metric }: IInsightGroupCard) {
    const navigate = useNavigate()
    const navigateToAssetsInsightsDetails = (id: any) => {
        navigate(`${id}`)
    }

    return (
        <Card key={metric}>
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
                                {numericDisplay(metric?.totalResultValue || 0)}
                            </Title>
                            <Subtitle>
                                {`from ${numericDisplay(
                                    metric?.oldTotalResultValue || 0
                                )}`}
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
                            {insightRows(metric.insights)
                                .filter((insight) => insight.num < 2)
                                .map((insight) => (
                                    <TableRow
                                        onClick={() =>
                                            navigateToAssetsInsightsDetails(
                                                insight.id
                                            )
                                        }
                                        className="cursor-pointer"
                                    >
                                        <TableCell className="px-0">
                                            <Text>{insight.name}</Text>
                                        </TableCell>
                                        <TableCell className="px-0 flex justify-end">
                                            <Text
                                                color={
                                                    insight.isPositive
                                                        ? 'green'
                                                        : 'red'
                                                }
                                            >
                                                {insight.value}
                                            </Text>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <Accordion className="w-full border-0">
                        <AccordionBody className="p-0 w-full">
                            <Table className="w-full">
                                <TableBody>
                                    {insightRows(metric.insights)
                                        .filter((insight) => insight.num > 1)
                                        .map((insight) => (
                                            <TableRow
                                                onClick={() =>
                                                    navigateToAssetsInsightsDetails(
                                                        insight.id
                                                    )
                                                }
                                                className="cursor-pointer"
                                            >
                                                <TableCell className="px-0">
                                                    <Text>{insight.name}</Text>
                                                </TableCell>
                                                <TableCell className="px-0 flex justify-end">
                                                    <Text
                                                        color={
                                                            insight.isPositive
                                                                ? 'green'
                                                                : 'red'
                                                        }
                                                    >
                                                        {insight.value}
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
                                insightRows(metric.insights).length > 2
                                    ? 'opacity-100'
                                    : 'opacity-0 cursor-default'
                            }`}
                        >
                            <Flex justifyContent="end">see more</Flex>
                        </AccordionHeader>
                    </Accordion>
                </Flex>
            </Flex>
        </Card>
    )
}
