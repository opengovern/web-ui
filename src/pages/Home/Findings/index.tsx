import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    Icon,
    Text,
    Title,
} from '@tremor/react'
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom'
import { useComplianceApiV1ControlsSummaryList } from '../../../api/compliance.gen'
import { TypesFindingSeverity } from '../../../api/api'
import { severityBadge } from '../../Governance/Compliance/BenchmarkSummary/Controls'

export default function Findings() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const { response, isLoading, isExecuted } =
        useComplianceApiV1ControlsSummaryList()

    const criticals =
        response?.filter(
            (item) =>
                item.control?.severity ===
                    TypesFindingSeverity.FindingSeverityCritical &&
                item.passed === false
        ) || []

    const high =
        response?.filter(
            (item) =>
                item.control?.severity ===
                    TypesFindingSeverity.FindingSeverityHigh &&
                item.passed === false
        ) || []

    const medium =
        response?.filter(
            (item) =>
                item.control?.severity ===
                    TypesFindingSeverity.FindingSeverityMedium &&
                item.passed === false
        ) || []

    const controls = criticals.concat(high).concat(medium).slice(0, 3)

    return (
        <Card>
            <Flex flexDirection="row" justifyContent="start">
                <Icon
                    variant="light"
                    icon={ShieldCheckIcon}
                    size="lg"
                    color="blue"
                    className="mr-2"
                />
                <Title>Findings</Title>
            </Flex>

            <Flex
                flexDirection="col"
                className={`mt-4 ${isLoading ? 'animate-pulse' : ''}`}
            >
                {isLoading
                    ? [1, 2, 3].map((i, idx, arr) => {
                          return (
                              <>
                                  <Flex
                                      flexDirection="col"
                                      justifyContent="start"
                                      alignItems="start"
                                      className="w-full pt-2 pb-3"
                                  >
                                      <div className="h-2 w-72 my-1 bg-slate-200 rounded" />
                                      <Flex flexDirection="row" className="">
                                          <div className="h-6 w-16 my-1 bg-slate-200 rounded-md" />
                                          <div className="h-6 w-36 my-1 bg-slate-200 rounded-md" />
                                      </Flex>
                                  </Flex>
                                  {idx + 1 < arr.length && (
                                      <Divider className="m-0 p-0" />
                                  )}
                              </>
                          )
                      })
                    : controls.map((item, idx, arr) => {
                          return (
                              <>
                                  <Flex
                                      flexDirection="col"
                                      justifyContent="start"
                                      alignItems="start"
                                      className="w-full pt-2 pb-3 hover:bg-gray-100 rounded-md cursor-pointer"
                                      onClick={() =>
                                          navigate(
                                              `/${workspace}/compliance/${
                                                  item.benchmarks?.at(0)?.id
                                              }/${item.control?.id}`
                                          )
                                      }
                                  >
                                      <Text className="w-full truncate text-black">
                                          {item.control?.title}
                                      </Text>
                                      <Flex
                                          flexDirection="row"
                                          className="mt-1"
                                      >
                                          {severityBadge(
                                              item.control?.severity
                                          )}
                                          <Badge color="rose">
                                              {item.failedResourcesCount} failed
                                              resources
                                          </Badge>
                                      </Flex>
                                  </Flex>
                                  {idx + 1 < arr.length && (
                                      <Divider className="m-0 mb-0 p-0" />
                                  )}
                              </>
                          )
                      })}
            </Flex>
            <Flex flexDirection="row" justifyContent="end" className="mt-2">
                <Button
                    size="xs"
                    variant="light"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                    className="mt-2"
                    onClick={() => navigate(`/${workspace}/findings`)}
                >
                    See more
                </Button>
            </Flex>
        </Card>
    )
}
