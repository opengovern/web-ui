import {
    ArrowsPointingOutIcon,
    DocumentChartBarIcon,
} from '@heroicons/react/24/outline'
import {
    Button,
    Card,
    Divider,
    Flex,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useComplianceApiV1InsightDetail } from '../../../api/compliance.gen'

interface IInsight {
    insightID: number
}
export default function Insight({ insightID }: IInsight) {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const start = dayjs.utc().subtract(1, 'week').startOf('day')
    const end = dayjs.utc().endOf('day')

    const { response: insightDetail, isLoading } =
        useComplianceApiV1InsightDetail(String(insightID), {
            startTime: start.unix(),
            endTime: end.unix(),
        })

    const result = insightDetail?.result?.at(0)
    const table = result?.details

    return (
        <Card className="relative max-w-xl mx-auto h-72 overflow-hidden">
            <Flex flexDirection="row" justifyContent="start">
                <Icon
                    variant="light"
                    icon={DocumentChartBarIcon}
                    size="lg"
                    color="blue"
                    className="mr-2"
                />
                <Title>Insight</Title>
            </Flex>
            {isLoading ? (
                <div className="h-2 w-52 mt-5 bg-slate-200 rounded animate-pulse" />
            ) : (
                <Title className="mt-2">{insightDetail?.longTitle}</Title>
            )}

            <Table className="mt-4">
                <TableHead>
                    <TableRow>
                        {isLoading
                            ? [1, 2, 3].map((i) => (
                                  <TableHeaderCell className="p-0 m-0">
                                      <div className="h-2 w-12 mr-12 mt-5 bg-slate-200 rounded animate-pulse" />
                                  </TableHeaderCell>
                              ))
                            : table?.headers?.map((header) => {
                                  return (
                                      <TableHeaderCell className="p-0 m-0">
                                          {header}
                                      </TableHeaderCell>
                                  )
                              })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading
                        ? [1, 2, 3].map((i) => (
                              <TableRow>
                                  {[1, 2, 3].map((j) => (
                                      <TableCell className="p-0 py-2 my-2">
                                          <div className="h-2 w-12 mr-12 mt-5 bg-slate-200 rounded animate-pulse" />
                                      </TableCell>
                                  ))}
                              </TableRow>
                          ))
                        : table?.rows?.map((row, index) => (
                              <TableRow>
                                  {row.map((v) => {
                                      return (
                                          <TableCell className="p-0 py-2 my-2">
                                              {v}
                                          </TableCell>
                                      )
                                  })}
                              </TableRow>
                          ))}
                </TableBody>
            </Table>
            <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 absolute rounded-b-lg">
                <Button
                    icon={ArrowsPointingOutIcon}
                    className="bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                    onClick={() =>
                        navigate(`/${workspace}/insights/${insightID}`)
                    }
                >
                    Show more
                </Button>
            </div>
        </Card>
    )
}
