import {
    Button,
    Col,
    Flex,
    Grid,
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
    isSameDay?: boolean
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
    isSameDay = false,
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
            <Grid numItems={1} numItemsMd={3} className="gap-4 mb-3">
                <Col numColSpan={2}>
                    <Flex>
                        <Flex justifyContent="start">
                            <Title>{name} metrics</Title>
                            <Button
                                variant="light"
                                className="ml-2"
                                onClick={() =>
                                    seeMoreUrl && navigate(seeMoreUrl)
                                }
                            >
                                <Text color="blue">(See all)</Text>
                            </Button>
                        </Flex>
                        <Flex justifyContent="end">
                            {scopes && scopes.length > 0 && (
                                <TabGroup
                                    className="w-fit border rounded-lg"
                                    index={selectedScopeIdx}
                                    onIndexChange={onScopeChange}
                                >
                                    <TabList variant="solid">
                                        {scopes.map((item) => (
                                            <Tab className="pt-0.5 pb-1">
                                                <Text>{item}</Text>
                                            </Tab>
                                        ))}
                                    </TabList>
                                </TabGroup>
                            )}
                        </Flex>
                    </Flex>
                </Col>
                <SearchSelect
                    onValueChange={onChangeCategory}
                    value={selectedCategory}
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
            </Grid>
            {isLoading ? (
                <Spinner className="mt-48" />
            ) : (
                <Swiper
                    gridContainerProps={{
                        numItemsSm: 2,
                        numItemsMd: 3,
                        className: 'gap-4 w-full',
                    }}
                >
                    {metrics?.map((metric) => (
                        <MetricCard
                            title={metric.name}
                            metric={metric.displayedValue}
                            metricPrev={
                                metric.oldValue && !hideFrom && !isSameDay
                                    ? String(
                                          numericDisplay(metric.oldValue || 0)
                                      )
                                    : undefined
                            }
                            delta={
                                !isSameDay
                                    ? `${Math.abs(
                                          percentage(
                                              metric.newValue,
                                              metric.oldValue
                                          )
                                      ).toFixed(2)}`
                                    : undefined
                            }
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
