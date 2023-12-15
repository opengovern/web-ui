import { Flex, Switch, Text, Title } from '@tremor/react'
import { useParams } from 'react-router-dom'
import { GridOptions, ValueFormatterParams } from 'ag-grid-community'
import { useEffect, useState } from 'react'
import Layout from '../../../../components/Layout'
import Header from '../../../../components/Header'
import Table, { IColumn } from '../../../../components/Table'
import { useScheduleApiV1DiscoveryResourcetypesListList } from '../../../../api/schedule.gen'
import AxiosAPI from '../../../../api/ApiConfig'
import {
    useMetadataApiV1MetadataCreate,
    useMetadataApiV1MetadataDetail,
} from '../../../../api/metadata.gen'
import { Api } from '../../../../api/api'

const columns = () => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'resource_type',
            headerName: 'Resource Type',
            type: 'string',
            enableRowGroup: false,
            sortable: true,
            filter: true,
            valueFormatter: (param: ValueFormatterParams<string>) =>
                param.data || '',
        },
    ]
    return temp
}

export default function ConnectorResourceTypes() {
    const { connector } = useParams()

    const {
        response,
        isLoading,
        sendNow: refreshList,
    } = useScheduleApiV1DiscoveryResourcetypesListList()

    const metadataKey = () => {
        if (connector === 'AWS') {
            return 'aws_discovery_required_only'
        }
        if (connector === 'Azure') {
            return 'azure_discovery_required_only'
        }
        return ''
    }

    const {
        response: metadata,
        isLoading: isMetadataLoading,
        sendNow: refresh,
    } = useMetadataApiV1MetadataDetail(metadataKey())

    const options: GridOptions = {
        sideBar: false,
        enableGroupEdit: false,
        columnTypes: {
            dimension: {
                enableRowGroup: false,
                enablePivot: false,
            },
        },
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: false,
    }

    const list = () => {
        if (connector === 'AWS') {
            return response?.awsResourceTypes || []
        }
        if (connector === 'Azure') {
            return response?.azureResourceTypes || []
        }
        return []
    }

    const api = new Api()
    api.instance = AxiosAPI

    return (
        <Layout currentPage="integrations">
            <Flex flexDirection="col" alignItems="start">
                <Header breadCrumb={['Resource Types']} />
                <Flex flexDirection="row">
                    <Title className="font-semibold">{connector}</Title>
                </Flex>
                <Flex
                    flexDirection="row"
                    justifyContent="start"
                    className="my-4"
                >
                    <Text>Only discover required resources</Text>
                    <Switch
                        id="switch"
                        name="switch"
                        className="ml-4 mt-2"
                        checked={(metadata?.value || '') === 'true'}
                        onChange={(e) => {
                            api.metadata
                                .apiV1MetadataCreate({
                                    key: metadataKey(),
                                    value: e,
                                })
                                .then((resp) => {
                                    refresh()
                                    refreshList()
                                })
                        }}
                    />
                </Flex>
                <Table
                    id="jobs"
                    columns={columns()}
                    rowData={list()}
                    options={options}
                    onGridReady={(e) => {
                        if (isLoading) {
                            e.api.showLoadingOverlay()
                        }
                    }}
                    loading={isLoading}
                />
            </Flex>
        </Layout>
    )
}
