import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Button, Card, Flex, Text, TextInput } from '@tremor/react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import TopHeader from '../../components/Layout/Header'
import { ssTokenAtom, workspaceAtom } from '../../store'
import { useURLParam } from '../../utilities/urlstate'
import {
    useAssistantApiV1ThreadCreate,
    useAssistantApiV1ThreadDetail,
} from '../../api/assistant.gen'

export default function Assistant() {
    const [threadID, setThreadID] = useURLParam('threadID', '')
    const [runID, setRunID] = useURLParam('runID', '')
    const [content, setContent] = useState('')
    const { response, isLoading, isExecuted, sendNow } =
        useAssistantApiV1ThreadCreate(
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
        }
    }, [isLoading])

    const {
        response: thread,
        isLoading: threadLoading,
        isExecuted: threadExecuted,
        sendNow: refresh,
    } = useAssistantApiV1ThreadDetail(
        threadID,
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

    useEffect(() => {
        if (threadExecuted && !threadLoading) {
            if (isRunning) {
                setTimeout(() => refresh(), 1000)
            }
        }
    }, [threadLoading])

    return (
        <>
            <TopHeader />

            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col" className="space-y-4">
                    {thread?.messages?.reverse().map((msg) => {
                        return (
                            <Card>
                                <MarkdownPreview
                                    source={msg.content}
                                    className="!bg-transparent"
                                    wrapperElement={{
                                        'data-color-mode': 'light',
                                    }}
                                    rehypeRewrite={(node, index, parent) => {
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
                        )
                    })}
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
                    />
                    <Button
                        loading={isRunning || (isExecuted && isLoading)}
                        onClick={sendNow}
                    >
                        Send
                    </Button>
                </Flex>
            </Flex>
        </>
    )
}
