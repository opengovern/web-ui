import { useEffect, useRef, useState } from 'react'
import {
    Button,
    Card,
    Col,
    Flex,
    Grid,
    Select,
    SelectItem,
    Text,
    TextInput,
    Title,
    Accordion,
    AccordionBody,
    AccordionHeader,
    List,
    ListItem,
} from '@tremor/react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    ChevronRightIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
} from '@heroicons/react/24/outline'

import { useNavigate } from 'react-router-dom'
import { useURLParam } from '../../utilities/urlstate'
import {
    useAssistantApiV1ThreadCreate,
    useAssistantApiV1ThreadDetail,
} from '../../api/assistant.gen'
import {
    errorHandlingWithErrorMessage,
    toErrorMessage,
} from '../../types/apierror'
import { AssistantImage, AssistantProfileIcon } from '../../icons/icons'
import { useAuth } from '../../utilities/auth'

type assistantType =
    | 'kaytu-r-assistant'
    | 'kaytu-assets-assistant'
    | 'kaytu-score-assistant'
    | 'kaytu-compliance-assistant'
    | 'none'

export default function Assistant() {
    const navigate = useNavigate()
    const [selectedAssistant, setSelectedAssistant] =
        useURLParam<assistantType>('assistant', 'none')

    const assisstantDetails: {
        title: string
        name: assistantType
        description: string
    }[] = [
        {
            title: 'Query',
            name: 'kaytu-r-assistant',
            description: 'to ask things about Query',
        },
        {
            title: 'SCORE',
            name: 'kaytu-score-assistant',
            description: 'to find thing about SCORE',
        },
        {
            title: 'Cloud Inventory',
            name: 'kaytu-assets-assistant',
            description: 'to find thing about Assets',
        },
        {
            title: 'Compliance',
            name: 'kaytu-compliance-assistant',
            description: 'to find thing about Compliance',
        },
    ]

    const examplePropmts = [
        'This is question number 1 and you can click on this to ask Kaytu assistant',
        'This is question number 2 and you can click on this to ask Kaytu assistant',
        'This is question number 3 and you can click on this to ask Kaytu assistant',
        'This is question number 4 and you can click on this to ask Kaytu assistant',
    ]

    const referencesList: {
        title: string
        link: string
    }[] = [
        {
            title: 'Account Spend',
            link: '',
        },
        {
            title: 'Total Spend',
            link: '',
        },
    ]

    const [threadID, setThreadID] = useURLParam('threadID', '')
    const [runID, setRunID] = useURLParam('runID', '')
    const [content, setContent] = useState('')
    const ref = useRef<HTMLDivElement | null>(null)
    const { response, isLoading, isExecuted, sendNow } =
        useAssistantApiV1ThreadCreate(
            selectedAssistant !== 'none'
                ? selectedAssistant
                : 'kaytu-r-assistant',
            {
                thread_id: threadID.length > 0 ? threadID : undefined,
                run_id: undefined,
                content,
            },
            {},
            false
        )

    useEffect(() => {
        if (isExecuted && !isLoading) {
            if (response?.thread_id !== undefined) {
                setThreadID(response?.thread_id || '')
            }

            if (response?.run_id !== undefined) {
                setRunID(response?.run_id || '')
            }

            setContent('')
        }
    }, [isLoading])

    const {
        response: thread,
        isLoading: threadLoading,
        isExecuted: threadExecuted,
        sendNow: refresh,
        error: err,
    } = useAssistantApiV1ThreadDetail(
        threadID,
        selectedAssistant !== 'none' ? selectedAssistant : 'kaytu-r-assistant',
        runID !== undefined
            ? {
                  run_id: runID,
              }
            : {},
        {},
        threadID !== ''
    )

    const isRunning =
        thread?.status === 'queued' ||
        thread?.status === 'in_progress' ||
        thread?.status === 'requires_action'

    const lastMsgCount = useRef<number>(0)
    useEffect(() => {
        if (threadExecuted && !threadLoading) {
            if ((thread?.messages || []).length !== lastMsgCount.current) {
                ref.current?.scrollIntoView({ behavior: 'smooth' })
                lastMsgCount.current = (thread?.messages || []).length
            }
            if (isRunning) {
                setTimeout(() => refresh(), 2500)
            }
        }
    }, [threadLoading])

    const msgList = () => {
        if (threadID === '' && runID === '') {
            return []
        }
        const list = thread?.messages || []
        const reversed = [...list].reverse()
        return reversed
    }

    const { user, logout } = useAuth()

    return (
        <Flex
            flexDirection="col"
            justifyContent="between"
            className="relative h-full"
            alignItems="stretch"
        >
            {selectedAssistant !== 'none' && (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className="w-48 gap-1.5 absolute top-6 left-12"
                >
                    <Text className="text-gray-400 ml-1">Assistant</Text>
                    {msgList().length === 0 ? (
                        <Select
                            defaultValue={selectedAssistant}
                            placeholder={
                                assisstantDetails.find(
                                    (o) => o.name === selectedAssistant
                                )?.title
                            }
                            onValueChange={(value) =>
                                setSelectedAssistant(value as assistantType)
                            }
                            className="w-full"
                        >
                            {assisstantDetails.map((item) => (
                                <SelectItem value={item.name}>
                                    {item.title}
                                </SelectItem>
                            ))}
                        </Select>
                    ) : (
                        <Text className="text-gray-800 ml-1">
                            {
                                assisstantDetails.find(
                                    (o) => o.name === selectedAssistant
                                )?.title
                            }
                        </Text>
                    )}
                </Flex>
            )}

            <div
                className="w-full overflow-y-scroll py-10"
                style={{
                    height: 'calc(100vh - 100px)',
                    maxHeight: 'calc(100vh - 100px)',
                }}
            >
                <Grid numItems={10} className="gap-x-6 h-full">
                    <Col numColSpan={2} />
                    <Col numColSpan={6}>
                        {msgList().length === 0 ? (
                            <Flex
                                flexDirection="col"
                                justifyContent={
                                    msgList().length === 0 ? 'start' : 'end'
                                }
                                className="space-y-4 h-full"
                            >
                                <Flex
                                    flexDirection="col"
                                    className="gap-12 pt-40 h-full w-full"
                                >
                                    <Flex flexDirection="col" className="h-fit">
                                        <img
                                            src={AssistantImage}
                                            alt="K"
                                            className="w-[200px]"
                                        />
                                        <Title className="text-gray-400">
                                            {selectedAssistant !== 'none'
                                                ? 'How can I help you'
                                                : 'Choose your Assistant'}
                                        </Title>
                                    </Flex>
                                    <Flex
                                        flexDirection="col"
                                        justifyContent={
                                            selectedAssistant === 'none'
                                                ? 'start'
                                                : 'end'
                                        }
                                        className="h-full w-full"
                                    >
                                        {selectedAssistant === 'none' ? (
                                            <Grid
                                                numItems={2}
                                                className="gap-4"
                                            >
                                                {assisstantDetails.map(
                                                    (item) => (
                                                        <Flex
                                                            className="gap-6 px-6 py-5 rounded-xl cursor-pointer shadow-sm hover:shadow-lg bg-white"
                                                            onClick={() => {
                                                                setSelectedAssistant(
                                                                    item.name
                                                                )
                                                            }}
                                                        >
                                                            <Flex
                                                                flexDirection="col"
                                                                alignItems="start"
                                                                className="gap-2"
                                                            >
                                                                <Title>
                                                                    {item.title}
                                                                </Title>
                                                                <Text>
                                                                    {
                                                                        item.description
                                                                    }
                                                                </Text>
                                                            </Flex>
                                                            <ChevronRightIcon className="w-6 text-gray-500" />
                                                        </Flex>
                                                    )
                                                )}
                                            </Grid>
                                        ) : (
                                            <Grid
                                                numItems={2}
                                                className="gap-4 w-full"
                                            >
                                                {examplePropmts.map((item) => (
                                                    <Flex
                                                        className="gap-6 px-4 py-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200"
                                                        onClick={() => {
                                                            setContent(item)
                                                            sendNow()
                                                        }}
                                                    >
                                                        <Flex
                                                            flexDirection="col"
                                                            alignItems="start"
                                                            className="gap-2"
                                                        >
                                                            <Text className="text-gray-600">
                                                                {item}
                                                            </Text>
                                                        </Flex>
                                                    </Flex>
                                                ))}
                                            </Grid>
                                        )}
                                    </Flex>
                                </Flex>
                            </Flex>
                        ) : (
                            <Flex
                                flexDirection="col"
                                justifyContent="end"
                                className="space-y-4 h-full pb-10"
                            >
                                {msgList().map((msg) => {
                                    return (
                                        <Flex
                                            flexDirection="col"
                                            alignItems={
                                                msg.role === 'user'
                                                    ? 'end'
                                                    : 'start'
                                            }
                                        >
                                            <Card
                                                className={
                                                    msg.role === 'user'
                                                        ? 'w-fit bg-blue-50 !shadow-lg !rounded-2xl ring-blue-100 relative'
                                                        : 'w-fit bg-white !shadow-lg !rounded-2xl ring-gray-200 relative'
                                                }
                                            >
                                                {user && msg.role === 'user' ? (
                                                    <img
                                                        className="absolute h-10 w-10 -right-16 bottom-0 rounded-full !shadow-lg bg-gray-50 border border-gray-200"
                                                        src={user.picture}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <Flex
                                                        justifyContent="center"
                                                        className="absolute h-10 w-10 -left-16 bottom-0 rounded-full !shadow-lg bg-gray-50 border border-gray-200"
                                                    >
                                                        <AssistantProfileIcon />
                                                    </Flex>
                                                )}

                                                <Text className="!font-extrabold !text-base text-gray-900 mb-4">
                                                    {msg.role === 'user'
                                                        ? 'You'
                                                        : 'Kaytu Assistant'}
                                                </Text>
                                                <MarkdownPreview
                                                    source={msg.content}
                                                    className="!bg-transparent"
                                                    wrapperElement={{
                                                        'data-color-mode':
                                                            'light',
                                                    }}
                                                    rehypeRewrite={(
                                                        node,
                                                        index,
                                                        parent
                                                    ) => {
                                                        if (
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-ignore
                                                            node.tagName ===
                                                                'a' &&
                                                            parent &&
                                                            /^h(1|2|3|4|5|6)/.test(
                                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                // @ts-ignore
                                                                parent.tagName
                                                            )
                                                        ) {
                                                            // eslint-disable-next-line no-param-reassign
                                                            parent.children =
                                                                parent.children.slice(
                                                                    1
                                                                )
                                                        }
                                                    }}
                                                />
                                                {msg.role !== 'user' && (
                                                    <Flex
                                                        flexDirection="col"
                                                        alignItems="start"
                                                        className="mt-8 gap-2 w-full "
                                                    >
                                                        <hr className="w-full" />

                                                        <Accordion className="w-full border-0 -ml-3">
                                                            <AccordionHeader className="w-fit">
                                                                <Text className="!font-extrabold !text-base text-gray-900">
                                                                    References
                                                                </Text>
                                                            </AccordionHeader>
                                                            <AccordionBody>
                                                                <Flex
                                                                    flexDirection="col"
                                                                    alignItems="start"
                                                                    className="gap-4 mt-2"
                                                                >
                                                                    {referencesList.map(
                                                                        (i) => (
                                                                            <Button
                                                                                variant="light"
                                                                                onClick={() =>
                                                                                    navigate(
                                                                                        `/${i.link}`
                                                                                    )
                                                                                }
                                                                                icon={
                                                                                    ArrowTopRightOnSquareIcon
                                                                                }
                                                                                iconPosition="right"
                                                                            >
                                                                                {
                                                                                    i.title
                                                                                }
                                                                            </Button>
                                                                        )
                                                                    )}
                                                                </Flex>
                                                            </AccordionBody>
                                                        </Accordion>
                                                    </Flex>
                                                )}
                                            </Card>
                                            {msg.role !== 'user' && (
                                                <Flex
                                                    justifyContent="start"
                                                    className="mt-6 gap-4"
                                                >
                                                    <Button
                                                        variant="secondary"
                                                        icon={ArrowPathIcon}
                                                        className="shadow-none border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                                                    >
                                                        Retry
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        icon={HandThumbUpIcon}
                                                        className="shadow-none border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                                                    >
                                                        Like
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        icon={HandThumbDownIcon}
                                                        className="shadow-none border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                                                    >
                                                        Dislike
                                                    </Button>
                                                </Flex>
                                            )}
                                        </Flex>
                                    )
                                })}
                            </Flex>
                        )}

                        {/* <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={(el) => {
                            ref.current = el
                        }}
                    /> */}
                    </Col>
                    <Col numColSpan={2} />
                </Grid>
            </div>

            <Grid numItems={10} className="gap-x-6 mt-0 pr-4 w-full">
                <Col numColSpan={2} />
                <Col numColSpan={6}>
                    {selectedAssistant !== 'none' && (
                        <Flex
                            flexDirection="row"
                            justifyContent="between"
                            className="gap-4 w-full"
                        >
                            <TextInput
                                value={content}
                                placeholder="Message Kaytu Assistance..."
                                disabled={
                                    isRunning || (isExecuted && isLoading)
                                }
                                onValueChange={setContent}
                                className="w-full"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (
                                            !isRunning &&
                                            !(isExecuted && isLoading)
                                        ) {
                                            sendNow()
                                        }
                                    }
                                }}
                            />
                            <Button
                                loading={isRunning || (isExecuted && isLoading)}
                                onClick={sendNow}
                                icon={ChevronRightIcon}
                                iconPosition="right"
                            >
                                Send Message
                            </Button>
                        </Flex>
                    )}
                </Col>
                <Col numColSpan={2} />
            </Grid>

            {errorHandlingWithErrorMessage(refresh, toErrorMessage(err))}
        </Flex>
    )
}
