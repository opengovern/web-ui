import {
    AreaChart,
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
            <>
                <Metric>{metric}</Metric>{' '}
                {metricPrev && <Text>from {metricPrev}</Text>}
            </>
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
            <Flex alignItems="start">
                <Flex justifyContent="start">
                    <Text className="font-semibold mb-1.5">{title}</Text>
                    {!border && url && (
                        <ChevronRightIcon className="ml-1 h-4 text-kaytu-500" />
                    )}
                </Flex>
                {delta && (
                    <BadgeDelta deltaType={deltaType}>{delta}</BadgeDelta>
                )}
            </Flex>
            {loading ? (
                <div className="w-fit">
                    <Spinner />
                </div>
            ) : (
                <Flex justifyContent="between" alignItems="baseline">
                    <div className="flex flex-row items-baseline space-x-3 w-full">
                        {value()}
                    </div>
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
