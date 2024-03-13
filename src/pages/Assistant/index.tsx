import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Button, Card, Flex, Text, TextInput } from '@tremor/react'
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
                thread_id: threadID,
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

    useEffect(() => {
        if (threadExecuted && !threadLoading) {
            if (
                thread?.status === 'queued' ||
                thread?.status === 'in_progress' ||
                thread?.status === 'requires_action'
            ) {
                setTimeout(() => refresh(), 1000)
            }
        }
    }, [threadLoading])

    return (
        <>
            <TopHeader />

            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col">
                    {thread?.messages?.map((msg) => {
                        return (
                            <Card>
                                <Text>{msg.content}</Text>
                            </Card>
                        )
                    })}
                </Flex>
                <Flex flexDirection="row" justifyContent="between">
                    <TextInput value={content} onValueChange={setContent} />
                    <Button onClick={sendNow}>Send</Button>
                </Flex>
            </Flex>
        </>
    )
}
