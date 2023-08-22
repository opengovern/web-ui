import { Button, Col, Flex, Grid, Select, SelectItem } from '@tremor/react'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import Menu from '../../components/Menu'
import InsightCategories from './InsightCategories'
import {
    useComplianceApiV1InsightGroupList,
    useComplianceApiV1InsightList,
} from '../../api/compliance.gen'
import InsightCard from '../../components/Cards/InsightCard'
import { timeAtom } from '../../store'
import Spinner from '../../components/Spinner'
import Header from '../../components/Header'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup } from '../../api/api'

export default function Insights() {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedGroup, setSelectedGroup] = useState('')
    const [selectedGroupObj, setSelectedGroupObj] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup | undefined
    >(undefined)
    const activeTimeRange = useAtomValue(timeAtom)

    const query = {
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }

    const {
        response: insightList,
        isLoading: listLoading,
        sendNow: insightSendNow,
        error: insightError,
    } = useComplianceApiV1InsightList(query)
    const {
        response: insightGroup,
        isLoading: groupLoading,
        sendNow: insightGroupSendNow,
        error: insightGroupError,
    } = useComplianceApiV1InsightGroupList(query)

    const generateGroupSelect = () => {
        return (
            <Select
                value={selectedGroup}
                onChange={(v) =>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setSelectedGroup(v)
                }
                placeholder={`${
                    selectedGroup.length
                        ? selectedGroup
                        : 'Select insight group...'
                }`}
            >
                <>
                    <SelectItem
                        value=""
                        onClick={() => setSelectedGroupObj(undefined)}
                    >
                        Show all insights
                    </SelectItem>
                    {insightGroup?.map((insight) => (
                        <SelectItem
                            key={insight.id}
                            value={insight.shortTitle || ''}
                            onClick={() => setSelectedGroupObj(insight)}
                        >
                            {insight.shortTitle}
                        </SelectItem>
                    ))}
                </>
            </Select>
        )
    }

    return (
        <Menu currentPage="insight">
            <Header title="Insights" datePicker />
            <Flex flexDirection="col">
                <Grid numItems={3} className="w-full gap-4 mb-6">
                    <Col numColSpan={2}>
                        <InsightCategories
                            selected={1}
                            onChange={(category: string) =>
                                setSelectedCategory(() => category)
                            }
                        />
                    </Col>
                    <Col>{generateGroupSelect()}</Col>
                </Grid>
                {/* eslint-disable-next-line no-nested-ternary */}
                {listLoading ? (
                    <Flex justifyContent="center" className="mt-56">
                        <Spinner />
                    </Flex>
                ) : insightError === undefined ? (
                    <Grid
                        numItems={1}
                        numItemsMd={2}
                        numItemsLg={3}
                        className="gap-4 w-full"
                    >
                        {selectedGroupObj
                            ? selectedGroupObj.insights
                                  ?.sort(
                                      (a, b) =>
                                          (b.totalResultValue || 0) -
                                          (a.totalResultValue || 0)
                                  )
                                  .filter((insight) => {
                                      if (
                                          selectedCategory.length &&
                                          selectedCategory !== 'All'
                                      )
                                          return insight.tags?.category.includes(
                                              selectedCategory
                                          )
                                      return insight
                                  })
                                  .map((insight) => (
                                      <Col numColSpan={1}>
                                          <InsightCard metric={insight} />
                                      </Col>
                                  ))
                            : insightList
                                  ?.sort(
                                      (a, b) =>
                                          (b.totalResultValue || 0) -
                                          (a.totalResultValue || 0)
                                  )
                                  .filter((insight) => {
                                      if (
                                          selectedCategory.length &&
                                          selectedCategory !== 'All'
                                      )
                                          return insight.tags?.category.includes(
                                              selectedCategory
                                          )
                                      return insight
                                  })
                                  .map((insight) => (
                                      <Col numColSpan={1}>
                                          <InsightCard metric={insight} />
                                      </Col>
                                  ))}
                    </Grid>
                ) : (
                    <Button onClick={() => insightSendNow()}>Retry</Button>
                )}
            </Flex>
        </Menu>
    )
}
