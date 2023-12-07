import { Button, Card, Flex, Metric, Text } from '@tremor/react'
import { ArrowPathIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../Spinner'
import {
    numberDisplay,
    numericDisplay,
} from '../../../utilities/numericDisplay'
import ChangeDelta from '../../ChangeDelta'
import { badgeTypeByDelta } from '../../../utilities/deltaType'

type IProps = {
    title: string
    metric: string | number | undefined
    metricPrev?: string | number | undefined
    unit?: string
    url?: string
    loading?: boolean
    border?: boolean
    blueBorder?: boolean
    error?: string
    onRefresh?: () => void
    isExact?: boolean
    isPrice?: boolean
    isPercent?: boolean
}

export default function SummaryCard({
    title,
    metric,
    metricPrev,
    unit,
    url,
    loading = false,
    border = true,
    blueBorder = false,
    error,
    onRefresh,
    isExact = false,
    isPrice = false,
    isPercent = false,
}: IProps) {
    const navigate = useNavigate()

    const value = () => {
        if (error !== undefined && error.length > 0) {
            return (
                <Flex
                    justifyContent="start"
                    alignItems="start"
                    className="cursor-pointer w-full"
                    onClick={onRefresh}
                >
                    <Text className="text-gray-400 mr-2 w-auto">
                        Error loading
                    </Text>
                    <Flex
                        flexDirection="row"
                        justifyContent="end"
                        className="w-auto"
                    >
                        <ArrowPathIcon className="text-blue-500 w-4 h-4 mr-1" />
                        <Text className="text-blue-500">Reload</Text>
                    </Flex>
                </Flex>
            )
        }
        return (
            <Flex flexDirection="col">
                <Flex
                    justifyContent="start"
                    alignItems="end"
                    className="gap-1 mb-1"
                >
                    <Metric>
                        {isExact
                            ? `${isPrice ? '$' : ''}${numberDisplay(
                                  metric,
                                  isExact && !isPrice ? 2 : 0
                              )}${isPercent ? '%' : ''}`
                            : `${isPrice ? '$' : ''}${numericDisplay(metric)}${
                                  isPercent ? '%' : ''
                              }`}
                    </Metric>
                    {!!unit && <Text className="mb-0.5">{unit}</Text>}
                    {!!metricPrev && (
                        <Text className="mb-0.5">
                            from{' '}
                            {isExact
                                ? `${isPrice ? '$' : ''}${numberDisplay(
                                      metricPrev,
                                      isExact && isPrice ? 2 : 0
                                  )}${isPercent ? '%' : ''}`
                                : `${isPrice ? '$' : ''}${numericDisplay(
                                      metricPrev
                                  )}${isPercent ? '%' : ''}`}
                        </Text>
                    )}
                </Flex>
                {!!metricPrev && (
                    <Flex className="mt-1">
                        <ChangeDelta
                            change={
                                ((Number(metric) - Number(metricPrev)) /
                                    Number(metricPrev)) *
                                100
                            }
                        />
                    </Flex>
                )}
            </Flex>
        )
    }

    return (
        <Card
            key={title}
            onClick={() => (url ? navigate(url) : null)}
            className={`${border ? '' : 'ring-0 shadow-transparent p-0'} ${
                url ? 'cursor-pointer' : ''
            } ${blueBorder ? 'border-l-kaytu-500 border-l-2' : ''}`}
        >
            <Flex justifyContent="start" className="mb-1.5">
                <Text className="font-semibold">{title}</Text>
                {!border && url && (
                    <ChevronRightIcon className="ml-1 h-4 text-kaytu-500" />
                )}
            </Flex>
            {loading ? (
                <div className="w-fit">
                    <Spinner />
                </div>
            ) : (
                <Flex alignItems="baseline">
                    <Flex>{value()}</Flex>
                    {border && (
                        <div className="justify-self-end">
                            {url && (
                                <Button
                                    size="xs"
                                    variant="light"
                                    icon={ChevronRightIcon}
                                    iconPosition="right"
                                >
                                    See more
                                </Button>
                            )}
                        </div>
                    )}
                </Flex>
            )}
        </Card>
    )
}
