import { Button, Card, Flex, Icon, Text, Title } from '@tremor/react'
import {
    ArrowRightIcon,
    ArrowsPointingOutIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import { useInventoryApiV1QueryList } from '../../../api/inventory.gen'
import { runQueryAtom } from '../../../store'

interface IQuery {
    id: string
}

export default function Query({ id }: IQuery) {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const [runQuery, setRunQuery] = useAtom(runQueryAtom)

    const [code, setCode] = useState('')
    const [open, setOpen] = useState(false)
    const {
        response: queries,
        isExecuted,
        isLoading: queryLoading,
    } = useInventoryApiV1QueryList({})
    const v = queries?.filter((m) => m.id === id).at(0)

    useEffect(() => {
        if (isExecuted && !queryLoading) {
            setCode(v?.query || '')
        }
    }, [queryLoading])

    return (
        <Card
            key={v?.id}
            className={`relative max-w-xl mx-auto ${
                open ? 'h-fit' : 'h-80'
            } overflow-hidden`}
        >
            <Flex
                flexDirection="col"
                justifyContent="between"
                alignItems="start"
            >
                <Flex flexDirection="row" justifyContent="start">
                    <Icon
                        variant="light"
                        icon={MagnifyingGlassIcon}
                        size="lg"
                        color="blue"
                        className="mr-2"
                    />
                    <Title>Query</Title>
                </Flex>
                {queryLoading ? (
                    <>
                        <div className="h-2 w-72 my-3 bg-slate-200 rounded" />
                        <div className="h-2 w-72 my-3 bg-slate-200 rounded" />
                    </>
                ) : (
                    <Title className="mt-2">{v?.title}</Title>
                )}

                <Card className="relative overflow-hidden mt-4">
                    <Editor
                        onValueChange={(text) => {
                            setCode(text)
                        }}
                        highlight={(text) =>
                            highlight(text, languages.sql, 'sql')
                        }
                        value={code}
                        className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm h-full"
                        style={{
                            minHeight: '60px',
                            overflowY: 'scroll',
                        }}
                        placeholder="-- write your SQL query here"
                    />
                </Card>

                <Flex flexDirection="row" justifyContent="end">
                    <Button
                        size="xs"
                        variant="light"
                        icon={ArrowRightIcon}
                        iconPosition="right"
                        className="mt-2"
                        onClick={() => {
                            setRunQuery(code)
                            navigate(`/${workspace}/query`)
                        }}
                    >
                        Run Query
                    </Button>
                </Flex>
            </Flex>
            {!open && (
                <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 absolute rounded-b-lg">
                    <Button
                        icon={ArrowsPointingOutIcon}
                        className="bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                        onClick={() => setOpen(true)}
                    >
                        Show query
                    </Button>
                </div>
            )}
        </Card>
    )
}
