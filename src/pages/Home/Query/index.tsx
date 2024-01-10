import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    Flex,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import { useInventoryApiV1QueryList } from '../../../api/inventory.gen'
import { runQueryAtom } from '../../../store'
import { getErrorMessage } from '../../../types/apierror'

interface IQuery {
    height: any
}

export default function Query({ height }: IQuery) {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const [runQuery, setRunQuery] = useAtom(runQueryAtom)

    const {
        response: queries,
        error,
        sendNow: refresh,
    } = useInventoryApiV1QueryList({})

    return (
        <Flex flexDirection="col" alignItems="start" className="h-full">
            <Title className="font-semibold mb-4">Popular queries</Title>
            <Card
                className="max-h-full h-full pt-3 overflow-scroll"
                style={{ maxHeight: `${height}px` }}
            >
                {queries
                    ?.sort((a, b) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (a.title < b.title) {
                            return -1
                        }
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        if (a.title > b.title) {
                            return 1
                        }
                        return 0
                    })
                    .map(
                        (q, i) =>
                            i < 7 && (
                                <Accordion
                                    className="w-full border-0 border-b border-b-gray-200 !rounded-none bg-transparent"
                                    defaultOpen={i === 0}
                                >
                                    <AccordionHeader className="pl-0 pr-0.5 py-4 bg-transparent flex justify-start">
                                        <Text className="text-gray-800 !text-base line-clamp-1">
                                            {q?.title}
                                        </Text>
                                    </AccordionHeader>
                                    <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                                        <Editor
                                            onValueChange={(text) => {
                                                console.log('')
                                            }}
                                            highlight={(text) =>
                                                highlight(
                                                    text,
                                                    languages.sql,
                                                    'sql'
                                                )
                                            }
                                            value={q?.query || ''}
                                            className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm h-full"
                                            style={{
                                                minHeight: '60px',
                                                overflowY: 'scroll',
                                            }}
                                            placeholder="-- write your SQL query here"
                                        />
                                        <Button
                                            size="xs"
                                            variant="light"
                                            icon={ChevronRightIcon}
                                            iconPosition="right"
                                            className="my-3"
                                            onClick={() => {
                                                setRunQuery(q?.query || '')
                                                navigate(`/${workspace}/query`)
                                            }}
                                        >
                                            Run Query
                                        </Button>
                                    </AccordionBody>
                                </Accordion>
                            )
                    )}
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
                            <Title className="mt-6">
                                Failed to load component
                            </Title>
                            <Text className="mt-2">
                                {getErrorMessage(error)}
                            </Text>
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
        </Flex>
    )
}
