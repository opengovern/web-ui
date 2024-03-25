import { useEffect, useRef, useState } from 'react'
import {
    Button,
    Card,
    Flex,
    Tab,
    TabGroup,
    TabList,
    Text,
    TextInput,
} from '@tremor/react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import TopHeader from '../../components/Layout/Header'
import { useURLParam } from '../../utilities/urlstate'
import {
    useAssistantApiV1ThreadCreate,
    useAssistantApiV1ThreadDetail,
} from '../../api/assistant.gen'
import {
    errorHandlingWithErrorMessage,
    toErrorMessage,
} from '../../types/apierror'

export default function Assistant() {
    const [assistantIdx, setAssistantIdx] = useURLParam(
        'assistantIdx',
        0,
        (v) => String(v),
        (v) => parseInt(v, 10)
    )
    const assistantName = () => {
        switch (assistantIdx) {
            case 0:
                return 'kaytu-assets-assistant'
            case 1:
                return 'kaytu-score-assistant'
            default:
                return 'kaytu-r-assistant'
        }
    }
    const [threadID, setThreadID] = useURLParam('threadID', '')
    const [runID, setRunID] = useURLParam('runID', '')
    const [content, setContent] = useState('')
    const ref = useRef<HTMLDivElement | null>(null)
    const { response, isLoading, isExecuted, sendNow } =
        useAssistantApiV1ThreadCreate(
            assistantName(),
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
        assistantName(),
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

    return (
        <>
            <TopHeader />
            <Flex
                flexDirection="col"
                justifyContent="start"
                className="relative h-full"
            >
                <Flex flexDirection="row" className="mb-2">
                    <TabGroup
                        defaultIndex={0}
                        index={assistantIdx}
                        onIndexChange={setAssistantIdx}
                    >
                        <TabList variant="solid" defaultValue="compliance">
                            <Tab value="compliance">Compliance Assistant</Tab>
                            <Tab value="score">Score Assistant</Tab>
                            <Tab value="query">Query Assistant</Tab>
                        </TabList>
                    </TabGroup>
                </Flex>
                <Flex flexDirection="col" className="space-y-4">
                    {msgList().map((msg) => {
                        return (
                            <Flex
                                flexDirection="row"
                                justifyContent={
                                    msg.role === 'user' ? 'start' : 'end'
                                }
                            >
                                <Card
                                    className={
                                        msg.role === 'user'
                                            ? 'w-fit bg-gray-50'
                                            : 'w-fit bg-green-50'
                                    }
                                >
                                    <Text className="!font-extrabold !text-sm text-black mb-5">
                                        {msg.role === 'user'
                                            ? 'You:'
                                            : 'Kaytu Assistant:'}
                                    </Text>
                                    <MarkdownPreview
                                        source={msg.content}
                                        className="!bg-transparent"
                                        wrapperElement={{
                                            'data-color-mode': 'light',
                                        }}
                                        rehypeRewrite={(
                                            node,
                                            index,
                                            parent
                                        ) => {
                                            if (
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                node.tagName === 'a' &&
                                                parent &&
                                                /^h(1|2|3|4|5|6)/.test(
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    parent.tagName
                                                )
                                            ) {
                                                // eslint-disable-next-line no-param-reassign
                                                parent.children =
                                                    parent.children.slice(1)
                                            }
                                        }}
                                    />
                                </Card>
                            </Flex>
                        )
                    })}
                    <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={(el) => {
                            ref.current = el
                        }}
                    />
                </Flex>
                <Flex
                    flexDirection="row"
                    justifyContent="between"
                    className="mt-4"
                >
                    <TextInput
                        value={content}
                        disabled={isRunning || (isExecuted && isLoading)}
                        onValueChange={setContent}
                        className="mr-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (!isRunning && !(isExecuted && isLoading)) {
                                    sendNow()
                                }
                            }
                        }}
                    />
                    <Button
                        variant="secondary"
                        className="mr-2"
                        onClick={() => {
                            setThreadID('')
                            setRunID('')
                        }}
                    >
                        New Chat
                    </Button>
                    <Button
                        loading={isRunning || (isExecuted && isLoading)}
                        onClick={sendNow}
                    >
                        Send
                    </Button>
                </Flex>
                {errorHandlingWithErrorMessage(refresh, toErrorMessage(err))}
            </Flex>
        </>
    )
}
