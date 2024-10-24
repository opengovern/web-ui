import React, { useEffect, useState } from 'react'
import { Button, Card, Flex, Text, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import {
    useAuthApiV1KeyDeleteDelete,
    useAuthApiV1KeysList,
} from '../../../api/auth.gen'
import Spinner from '../../../components/Spinner'
import DrawerPanel from '../../../components/DrawerPanel'
// import CreateAPIKey from './CreateAPIKey'
// import APIKeyRecord from './APIKeyRecord'
import Notification from '../../../components/Notification'
import TopHeader from '../../../components/Layout/Header'
import {
    Alert,
    Box,
    Header,
    Input,
    KeyValuePairs,
    Link,
    Modal,
    RadioGroup,
    Select,
    SpaceBetween,
    Table,
    Toggle,
} from '@cloudscape-design/components'
import KButton from '@cloudscape-design/components/button'
import { TrashIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import CreateConnector from './CreateConnector'
import { useSetAtom } from 'jotai'
import { notificationAtom } from '../../../store'
export default function SettingsConnectors() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const [drawerOpenEdit, setDrawerOpenEdit] = useState<boolean>(false)
    const [deletModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [editLoading, setEditLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>()
    const [response, setResponse] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    const [error, setError] = useState('')
    const [editError, setEditError] = useState<any>()
    const setNotification = useSetAtom(notificationAtom)

    const openCreateMenu = () => {
        setDrawerOpen(true)
    }

    const EditConnector = () => {
        if (
            !selectedItem.id ||
            !selectedItem.name ||
            !selectedItem.client_id ||
            !selectedItem.client_secret ||
            !selectedItem.connector_sub_type
        ) {
            setEditError('Please fill all the fields')
            return
        }
        if (
            selectedItem.connector_sub_type?.value === 'entraid' &&
            !selectedItem.tenant_id
        ) {
            setEditError('Please fill all the fields')
            return
        }
        setEditLoading(true)
        let url = ''
        if (window.location.origin === 'http://localhost:3000') {
            url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
        } else {
            url = window.location.origin
        }
        // @ts-ignore
        const token = JSON.parse(localStorage.getItem('openg_auth')).token

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        const body = {
            connector_type: selectedItem?.type,
            connector_sub_type: selectedItem?.connector_sub_type?.value,
            id: selectedItem?.id,
            name: selectedItem?.name,
            tenant_id: selectedItem?.tenant_id,
            client_id: selectedItem?.client_id,
            client_secret: selectedItem?.client_id,
        }
        axios
            .put(`${url}/main/auth/api/v1/connector`, body, config)
            .then((res) => {
                setEditLoading(false)

                GetRows()
                setDrawerOpenEdit(false)
                setNotification({
                    type: 'success',
                    text: 'Connector created successfully',
                })
            })
            .catch((err) => {
                console.log(err)

                var error = err.response.data.message
                if (!error) {
                    error = 'Failed to create connector'
                }
                setNotification({
                    type: 'error',
                    text: error,
                })
                setEditLoading(false)

                setEditError(error)
            })
    }
    const DeleteConnector = () => {
        setIsDeleteLoading(true)
        let url = ''
        if (window.location.origin === 'http://localhost:3000') {
            url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
        } else {
            url = window.location.origin
        }
        // @ts-ignore
        const token = JSON.parse(localStorage.getItem('openg_auth')).token

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }

        axios
            .delete(
                `${url}/main/auth/api/v1/connector/${selectedItem?.id}`,

                config
            )
            .then((res) => {
                setIsDeleteLoading(false)
                GetRows()
                setDeleteModalOpen(false)
            })
            .catch((err) => {
                console.log(err)
                setIsDeleteLoading(false)
                setError('Error while deleting Connector')
            })
    }
    const GetRows = () => {
        setIsLoading(true)
        let url = ''
        if (window.location.origin === 'http://localhost:3000') {
            url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
        } else {
            url = window.location.origin
        }
        // @ts-ignore
        const token = JSON.parse(localStorage.getItem('openg_auth')).token

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }

        axios
            .get(
                `${url}/main/auth/api/v1/connectors`,

                config
            )
            .then((res) => {
                setResponse(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        GetRows()
    }, [])

    return (
        <>
            {/* <TopHeader /> */}

            <Modal
                visible={drawerOpen}
                header="Create new OIDC Connector"
                onDismiss={() => {
                    setDrawerOpen(false)
                }}
            >
                <CreateConnector
                    close={() => {
                        setDrawerOpen(false)
                        GetRows()
                    }}
                />
            </Modal>
            <Modal
                visible={drawerOpenEdit}
                header={selectedItem?.name}
                onDismiss={() => {
                    setDrawerOpenEdit(false)
                }}
            >
                {selectedItem ? (
                    <>
                        <Flex
                            flexDirection="col"
                            justifyContent="start"
                            alignItems="start"
                            className="gap-2 w-full mb-4"
                        >
                            <Input
                                onChange={({ detail }) => {
                                    setSelectedItem({
                                        ...selectedItem,
                                        id: detail.value,
                                    })
                                    setEditError(null)
                                }}
                                className="w-full"
                                value={selectedItem?.id}
                                placeholder="Id"
                            />
                            <Input
                                onChange={({ detail }) => {
                                    setSelectedItem({
                                        ...selectedItem,
                                        name: detail.value,
                                    })
                                    setEditError(null)
                                }}
                                value={selectedItem?.name}
                                placeholder="Name"
                                className="w-full"
                            />
                            <Select
                                selectedOption={
                                    selectedItem?.connector_sub_type
                                }
                                onChange={({ detail }) => {
                                    setSelectedItem({
                                        ...selectedItem,
                                        connector_sub_type:
                                            detail.selectedOption,
                                    })
                                    setEditError(null)
                                }}
                                options={[
                                    { label: 'General', value: 'general' },
                                    { label: 'Entra Id', value: 'entraid' },
                                    {
                                        label: 'Google Workspace',
                                        value: 'google-workspace',
                                    },
                                ]}
                                placeholder="Select Connector Sub Type"
                                className="w-full"
                            />
                            <Input
                                onChange={({ detail }) => {
                                    setSelectedItem({
                                        ...selectedItem,
                                        client_id: detail.value,
                                    })
                                    setEditError(null)
                                }}
                                value={selectedItem?.client_id}
                                placeholder="Client Id"
                                className="w-full"
                            />
                            <Input
                                onChange={({ detail }) => {
                                    setSelectedItem({
                                        ...selectedItem,
                                        client_secret: detail.value,
                                    })
                                    setEditError(null)
                                }}
                                value={selectedItem?.client_secret}
                                placeholder="Client Secret"
                                className="w-full"
                            />
                            {selectedItem?.connector_sub_type?.value ===
                                'entraid' && (
                                <>
                                    <Input
                                        onChange={({ detail }) => {
                                            setSelectedItem({
                                                ...selectedItem,
                                                tenant_id: detail.value,
                                            })
                                            setEditError(null)
                                        }}
                                        value={selectedItem?.tenant_id}
                                        placeholder="Tenant Id"
                                        className="w-full"
                                    />
                                </>
                            )}
                        </Flex>
                        {editError && (
                            <Alert className="w-full mb-3" type="error">
                                {editError}
                            </Alert>
                        )}
                        <Flex className="w-full justify-end mt-2 gap-3">
                            <KButton
                                loading={isDeleteLoading}
                                disabled={isDeleteLoading}
                                onClick={(event) => {
                                    setDeleteModalOpen(true)
                                    setDrawerOpenEdit(false)
                                }}
                            >
                                <TrashIcon className="h-5 w-5" color="rose" />
                            </KButton>
                            <KButton
                                loading={editLoading}
                                onClick={() => EditConnector()}
                                variant="primary"
                            >
                                Update Changes
                            </KButton>
                        </Flex>
                    </>
                ) : (
                    <Spinner />
                )}
            </Modal>
            <Modal
                visible={deletModalOpen}
                header="Delete Connector"
                onDismiss={() => {
                    setDeleteModalOpen(false)
                }}
                footer={
                    <Flex className="gap-2 w-full" flexDirection="row">
                        <KButton
                            onClick={() => {
                                setDeleteModalOpen(false)
                            }}
                        >
                            Cancel
                        </KButton>
                        <KButton
                            onClick={() => {
                                DeleteConnector()
                            }}
                            variant="primary"
                        >
                            Delete
                        </KButton>
                    </Flex>
                }
            >
                <>{`Are you sure you want to delete  ${selectedItem?.name}?`}</>
                {error && error !== '' && (
                    <>
                        <Alert
                            className="mt-2 mb-2"
                            header="failed"
                            type="error"
                        >
                            Failed to delete Connector
                        </Alert>
                    </>
                )}
            </Modal>
            <Table
                className="mt-2"
                onRowClick={(event) => {
                    const row = event.detail.item
                    if (row && row.id != 'local') {
                        setSelectedItem(row)
                        setDrawerOpenEdit(true)
                    }
                }}
                columnDefinitions={[
                    {
                        id: 'id',
                        header: 'ID',
                        cell: (item: any) => item.id,
                    },
                    {
                        id: 'name',
                        header: 'Name',
                        cell: (item: any) => item.name,
                    },
                    {
                        id: 'type',
                        header: 'Type',
                        cell: (item: any) => item?.type,
                    },
                    {
                        id: 'sub_type',
                        header: 'Connector Sub Type',
                        cell: (item: any) => item?.connector_sub_type,
                    },
                    {
                        id: 'client_id',
                        header: 'Client Id',
                        cell: (item: any) => item?.client_id,
                    },
                    {
                        id: 'issuer',
                        header: 'Issuer',
                        cell: (item: any) => item?.issuer,
                    },
                ]}
                columnDisplay={[
                    { id: 'id', visible: true },
                    { id: 'name', visible: true },
                    { id: 'type', visible: true },
                    { id: 'sub_type', visible: false },
                    { id: 'client_id', visible: true },
                    { id: 'issuer', visible: false },
                ]}
                loading={isLoading}
                // @ts-ignore
                items={response ? response : []}
                empty={
                    <Box
                        margin={{ vertical: 'xs' }}
                        textAlign="center"
                        color="inherit"
                    >
                        <SpaceBetween size="m">
                            <b>No resources</b>
                            {/* <Button>Create resource</Button> */}
                        </SpaceBetween>
                    </Box>
                }
                header={
                    <Header
                        actions={
                            <>
                                <KButton
                                    className="float-right"
                                    variant="primary"
                                    onClick={() => {
                                        openCreateMenu()
                                    }}
                                >
                                    Create Connector
                                </KButton>
                            </>
                        }
                        className="w-full"
                    >
                        Connectors{' '}
                    </Header>
                }
            />
            {/* <Card key="summary">
                <Flex className="mb-6">
                    <Title className="font-semibold">API Keys</Title>
                    <Button
                        className="float-right"
                        onClick={() => {
                            openCreateMenu()
                        }}
                        icon={PlusIcon}
                    >
                        Create API Key
                    </Button>
                </Flex>
                <Flex
                    justifyContent="start"
                    flexDirection="row"
                    className="mb-6"
                >
                    <Text className="w-1/4">Key Name</Text>
                    <Text className="w-1/4">Role Name & Key</Text>
                    <Text className="w-1/4">Created by</Text>
                    <Text className="w-1/4">Create Date</Text>
                </Flex>
                {response?.map((item) => (
                    <APIKeyRecord
                        item={item}
                        refresh={() => {
                            sendNow()
                        }}
                    />
                ))}
            </Card> */}
        </>
    )
}
