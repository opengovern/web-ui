import {
    Button,
    Flex,
    SearchSelect,
    SearchSelectItem,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import Swiper from '../Swiper'
import MetricCard from '../Cards/MetricCard'
import { numericDisplay } from '../../utilities/numericDisplay'
import Spinner from '../Spinner'

export interface IMetric {
    name: string
    displayedValue: string
    newValue: number
    oldValue?: number
    onClick?: () => void
}

interface IMetricsList {
    name: string
    seeMoreUrl?: string
    metrics: IMetric[]
    isLoading: boolean

    selectedCategory: string
    onChangeCategory: (category: string) => void
    categories: {
        label: string
        value: string
    }[]

    scopes?: string[]
    selectedScopeIdx?: number
    onScopeChange?: (scopeIdx: number) => void

    hideFrom?: boolean
}

export default function MetricsList({
    name,
    seeMoreUrl,
    metrics,
    isLoading,
    categories,
    selectedCategory,
    onChangeCategory,
    scopes,
    selectedScopeIdx,
    onScopeChange,
    hideFrom = false,
}: IMetricsList) {
    const navigate = useNavigate()
    const percentage = (a?: number, b?: number): number => {
        return a && b ? ((a - b) / b) * 100 : 0
    }

    const deltaType = (delta: number) => {
        if (delta > 0) {
            return 'moderateIncrease'
        }
        if (delta < 0) {
            return 'moderateDecrease'
        }
        return 'unchanged'
    }

    return (
        <div>
            <Flex className="gap-x-2 mb-6">
                <Flex flexDirection="row" justifyContent="start">
                    <Title>{name} metrics</Title>
                    <Button
                        variant="light"
                        className="ml-2"
                        onClick={() => seeMoreUrl && navigate(seeMoreUrl)}
                    >
                        <Text color="blue">(See all)</Text>
                    </Button>
                </Flex>
                <SearchSelect
                    onValueChange={onChangeCategory}
                    value={selectedCategory}
                    placeholder="Source Selection"
                    className="max-w-xs"
                >
                    {categories.map((category) => (
                        <SearchSelectItem
                            key={category.label}
                            value={category.value}
                        >
                            {category.value}
                        </SearchSelectItem>
                    ))}
                </SearchSelect>
                {scopes && scopes.length > 0 && (
                    <span className="ml-5">
                        <TabGroup
                            index={selectedScopeIdx}
                            onIndexChange={onScopeChange}
                        >
                            <TabList variant="solid">
                                {scopes.map((item) => (
                                    <Tab>{item}</Tab>
                                ))}
                            </TabList>
                        </TabGroup>
                    </span>
                )}
            </Flex>
            {isLoading ? (
                <div className="flex items-center justify-center mt-48">
                    <Spinner />
                </div>
            ) : (
                <Swiper
                    gridContainerProps={{
                        numItemsSm: 2,
                        numItemsMd: 3,
                        className: 'gap-3 w-full',
                    }}
                >
                    {metrics?.map((metric) => (
                        <MetricCard
                            title={metric.name}
                            metric={metric.displayedValue}
                            metricPrev={
                                metric.oldValue && !hideFrom
                                    ? String(
                                          numericDisplay(metric.oldValue || 0)
                                      )
                                    : undefined
                            }
                            delta={`${Math.abs(
                                percentage(metric.newValue, metric.oldValue)
                            ).toFixed(2)}`}
                            deltaType={deltaType(
                                percentage(metric.newValue, metric.oldValue)
                            )}
                            onClick={metric.onClick}
                        />
                    ))}
                </Swiper>
            )}
        </div>
    )
}
