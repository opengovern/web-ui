import { Button, Flex, Grid, Text, Title } from '@tremor/react'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import ConnectorCard from '../../components/Cards/ConnectorCard'
import Spinner from '../../components/Spinner'
import { useIntegrationApiV1ConnectorsList } from '../../api/integration.gen'
import TopHeader from '../../components/Layout/Header'

export default function Integrations() {
    const [pageNo, setPageNo] = useState<number>(0)
    const { response: responseConnectors, isLoading: connectorsLoading } =
        useIntegrationApiV1ConnectorsList()

    const connectorList = (
        Array.isArray(responseConnectors) ? responseConnectors : []
    ).sort((a, b) => ((a.label || '') > (b.label || '') ? 1 : -1))

    const availableConnectors = connectorList?.filter(
        (f) => (f.connection_count || 0) === 0
    )
    const installedConnectors = connectorList?.filter(
        (f) =>
            (f.connection_count || 0) > 0 ||
            f.name === 'AWS' ||
            f.name === 'Azure' ||
            f.name === 'EntraID'
    )
    const totalPages = availableConnectors.length / 9
    const availableConnectorsPage = availableConnectors.slice(
        pageNo * 9,
        (pageNo + 1) * 9
    )
    return (
        <>
            <TopHeader />
            {/* <Grid numItems={3} className="gap-4 mb-10">
                <OnboardCard
                    title="Active Accounts"
                    active={topMetrics?.connectionsEnabled}
                    inProgress={topMetrics?.inProgressConnections}
                    healthy={topMetrics?.healthyConnections}
                    unhealthy={topMetrics?.unhealthyConnections}
                    loading={metricsLoading}
                />
            </Grid> */}
            {connectorsLoading ? (
                <Flex className="mt-36">
                    <Spinner />
                </Flex>
            ) : (
                <>
                    {/* <Title className="font-semibold">Installed</Title> */}
                    <Grid numItemsMd={3} numItemsLg={4} className="gap-[30px] mt-6">
                        {connectorList.map((connector) => {
                            return (
                                <>
                                    <ConnectorCard
                                        connector={connector.name}
                                        title={connector.label}
                                        status={connector.status}
                                        count={connector.connection_count}
                                        description={connector.description}
                                        tier={connector.tier}
                                        logo={connector.logo}
                                    />
                                </>
                            )
                        })}
                    </Grid>
                    {/* <Title className="font-semibold mt-8">Available</Title> */}
                    {/* <Grid numItemsMd={2} numItemsLg={3} className="gap-14 mt-6">
                        {availableConnectorsPage.map((connector) => (
                            <ConnectorCard
                                connector={connector.name}
                                title={connector.label}
                                status={connector.status}
                                count={connector.connection_count}
                                description={connector.description}
                                tier={connector.tier}
                                logo={connector.logo}
                            />
                        ))}
                    </Grid> */}
                    <Flex
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        className="mt-4 space-x-4"
                    >
                        <Text className="font-normal">
                            Page{' '}
                            <span className="font-extrabold text-black">
                                {pageNo + 1}
                            </span>{' '}
                            out of{' '}
                            <span className="font-extrabold text-black">
                                {totalPages}
                            </span>
                        </Text>
                        <Flex flexDirection="row" className="w-fit">
                            <Button
                                variant="light"
                                disabled={pageNo === 0}
                                onClick={() => setPageNo(pageNo - 1)}
                                className="px-2 py-2 !text-3xl bg-white border border-gray-300 rounded-l-full"
                            >
                                <ChevronLeftIcon className="h-4 w-6 text-black" />
                            </Button>
                            <Button
                                variant="light"
                                disabled={pageNo >= totalPages - 1}
                                onClick={() => setPageNo(pageNo + 1)}
                                className="px-2 py-2 !text-3xl bg-white border border-gray-300 rounded-r-full"
                            >
                                <ChevronRightIcon className="h-4 w-6 text-black" />
                            </Button>
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    )
}
