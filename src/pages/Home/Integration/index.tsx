import { Button, Card, Divider, Flex, Icon, Text, Title } from '@tremor/react'
import { CpuChipIcon } from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom'
import { AWSIcon, AzureIcon } from '../../../icons/icons'
import { useIntegrationApiV1ConnectorsList } from '../../../api/integration.gen'
import { getErrorMessage } from '../../../types/apierror'

export default function Integration() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()

    const {
        response: responseConnectors,
        isLoading: connectorsLoading,
        error,
        sendNow: refresh,
    } = useIntegrationApiV1ConnectorsList()

    return (
        <Card>
            <Flex flexDirection="row" justifyContent="start">
                <Icon
                    variant="light"
                    icon={CpuChipIcon}
                    size="lg"
                    color="blue"
                    className="mr-2"
                />
                <Title>Integrations</Title>
            </Flex>
            <Flex
                flexDirection="row"
                className={`mt-2 ${connectorsLoading ? 'animate-pulse' : ''}`}
            >
                {connectorsLoading || getErrorMessage(error).length > 0
                    ? [1, 2]?.map((i) => {
                          return (
                              <Flex flexDirection="col" className=" rounded-md">
                                  <div className="bg-slate-200 rounded-full w-24 h-24 border-none" />
                                  <div className="h-2 w-24 my-3 bg-slate-200 rounded" />
                                  <div className="h-2 w-24 my-1 bg-slate-200 rounded" />
                              </Flex>
                          )
                      })
                    : responseConnectors?.map((connector) => {
                          return (
                              <Flex
                                  flexDirection="col"
                                  className="cursor-pointer hover:bg-gray-100 rounded-md"
                                  onClick={() => {
                                      navigate(
                                          `/${workspace}/integrations/${connector.name}`
                                      )
                                  }}
                              >
                                  <img
                                      id={`home-integration-${connector.name}`}
                                      src={
                                          connector.name === 'AWS'
                                              ? AWSIcon
                                              : AzureIcon
                                      }
                                      className="w-24 rounded-full border shadow-sm"
                                      alt="aws"
                                  />
                                  <Title>{connector.label}</Title>
                                  <Text>
                                      # of Accounts:{' '}
                                      {connector.connection_count}
                                  </Text>
                              </Flex>
                          )
                      })}
            </Flex>
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
