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
import {
    useComplianceApiV1InsightDetail,
    useComplianceApiV1InsightList,
} from '../../../api/compliance.gen'
import { getErrorMessage } from '../../../types/apierror'

export default function Insight() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const start = dayjs.utc().subtract(1, 'week').startOf('day')
    const end = dayjs.utc().endOf('day')

    const {
        response,
        isLoading,
        error,
        sendNow: refresh,
    } = useComplianceApiV1InsightList({
        startTime: start.unix(),
        endTime: end.unix(),
    })

    const result = response
        ?.sort((a, b) => {
            if ((a.totalResultValue || 0) === (b.totalResultValue || 0)) {
                return 0
            }
            return (a.totalResultValue || 0) < (b.totalResultValue || 0)
                ? 1
                : -1
        })
        .slice(0, 5)

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
                <Title>Insights</Title>
            </Flex>

            <Flex flexDirection="col" className="mt-2">
                <Flex flexDirection="row" className="my-2">
                    <Text className="font-bold">Title</Text>
                    <Text className="font-bold">Count</Text>
                </Flex>
                <Divider className="m-0 p-0" />
                {isLoading || getErrorMessage(error).length > 0
                    ? [1, 2, 3, 4, 5].map((i) => {
                          return (
                              <>
                                  <Flex flexDirection="row" className="my-2">
                                      <div className="h-3 w-72 my-1 bg-slate-200 rounded" />
                                      <div className="h-3 w-12 my-1 bg-slate-200 rounded" />
                                  </Flex>
                                  <Divider className="m-0 p-0" />
                              </>
                          )
                      })
                    : result?.map((item) => {
                          return (
                              <>
                                  <Flex flexDirection="row" className="my-2">
                                      <Text className="text-gray-900">
                                          {item.shortTitle}
                                      </Text>
                                      <Text className="text-gray-900">
                                          {item.totalResultValue}
                                      </Text>
                                  </Flex>
                                  <Divider className="m-0 p-0" />
                              </>
                          )
                      })}
            </Flex>
            {/* 
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
            </Table> */}
            <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 absolute rounded-b-lg">
                <Button
                    icon={ArrowsPointingOutIcon}
                    className="bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                    onClick={() => navigate(`/${workspace}/insights`)}
                >
                    See more
                </Button>
            </div>
            {error && (
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="absolute top-0 w-full left-0 h-full backdrop-blur"
                >
                    <Flex
                        flexDirection="col"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Title className="mt-6">Failed to load component</Title>
                        <Text className="mt-2">{getErrorMessage(error)}</Text>
                    </Flex>
                    <Button
                        variant="secondary"
                        className="mb-6"
                        color="slate"
                        onClick={refresh}
                    >
                        Try Again
                    </Button>
                </Flex>
            )}
        </Card>
    )
}
