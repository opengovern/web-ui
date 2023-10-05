import {
    BadgeDelta,
    Button,
    Card,
    DeltaType,
    Flex,
    Metric,
    Text,
} from '@tremor/react'
import { ArrowPathIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../Spinner'
import { numberDisplay } from '../../../utilities/numericDisplay'
import ChangeDelta from '../../ChangeDelta'

type IProps = {
    title: string
    metric: string | number | undefined
    metricPrev?: string | number | undefined
    delta?: string
    deltaType?: DeltaType
    url?: string
    loading?: boolean
    border?: boolean
    blueBorder?: boolean
    error?: string
    onRefresh?: () => void
}

export default function SummaryCard({
    title,
    metric,
    metricPrev,
    delta,
    deltaType,
    url,
    loading = false,
    border = true,
    blueBorder = false,
    error,
    onRefresh,
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
            <Flex
                justifyContent="start"
                alignItems="end"
                className="gap-1 mb-1"
            >
                <Metric>
                    {Number(metric) ? numberDisplay(metric, 0) : metric}
                </Metric>
                {!!metricPrev && (
                    <Text className="mb-0.5">
                        from{' '}
                        {Number(metricPrev)
                            ? numberDisplay(metricPrev, 0)
                            : metricPrev}
                    </Text>
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
                <>
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
                    {delta && !delta.includes('Infinity') && (
                        <ChangeDelta deltaType={deltaType} change={delta} />
                    )}
                </>
            )}
        </Card>
    )
}
