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
import {
    ArrowRightIcon,
    ChevronRightIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom'
import { useComplianceApiV1ControlsSummaryList } from '../../../api/compliance.gen'
import { TypesFindingSeverity } from '../../../api/api'
import { severityBadge } from '../../Governance/Controls'
import { getErrorMessage } from '../../../types/apierror'

export default function Findings() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const {
        response,
        isLoading,
        isExecuted,
        error,
        sendNow: refresh,
    } = useComplianceApiV1ControlsSummaryList()

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
        <>
            <Title>Findings</Title>
            <Flex
                flexDirection="col"
                className={`mt-1 ${isLoading ? 'animate-pulse' : ''}`}
            >
                {isLoading || getErrorMessage(error).length > 0
                    ? [1, 2, 3].map((i, idx, arr) => {
                          return (
                              <>
                                  <Flex
                                      flexDirection="col"
                                      justifyContent="start"
                                      alignItems="start"
                                      className="w-full py-4"
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
                                      className="py-4 hover:bg-gray-100 rounded-md cursor-pointer"
                                      onClick={() =>
                                          navigate(
                                              `/${workspace}/compliance/${
                                                  item.benchmarks?.at(0)?.id
                                              }/${item.control?.id}`
                                          )
                                      }
                                  >
                                      <Flex
                                          flexDirection="col"
                                          alignItems="start"
                                      >
                                          <Text className="w-3/4 line-clamp-1 text-black mb-2">
                                              {item.control?.title}
                                          </Text>
                                          <Text>
                                              # of failed resources:{' '}
                                              {item.failedResourcesCount}
                                          </Text>
                                      </Flex>
                                      {severityBadge(item.control?.severity)}
                                  </Flex>
                                  {idx + 1 < arr.length && (
                                      <Divider className="m-0 mb-0 p-0" />
                                  )}
                              </>
                          )
                      })}
            </Flex>
            <Button
                size="xs"
                variant="light"
                icon={ChevronRightIcon}
                iconPosition="right"
                onClick={() => navigate(`/${workspace}/findings`)}
            >
                View details
            </Button>
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
        </>
    )
}
