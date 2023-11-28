import { Button, Card, Title, Text, Flex, Bold, TextInput } from '@tremor/react'
import { Checkbox, Switch, useCheckboxState } from 'pretty-checkbox-react'
import { useEffect, useState } from 'react'
import { CodeBlock } from '../../../../../../components/CodeBlock'

interface IKaytuOnboard {
    bootstrapMode: boolean
    onPrev: () => void
    onNext: () => void
}

export function KaytuOnboard({ bootstrapMode, onPrev, onNext }: IKaytuOnboard) {
    const [exclude, setExclude] = useState<string[]>([''])
    const [profile, setProfile] = useState('')

    const updateExclude = (idx: number, newValue: string) => {
        const newExclude: string[] = []
        exclude.forEach((element, index) => {
            const trimmed = index === idx ? newValue.trim() : element.trim()
            if (trimmed.length > 0) {
                newExclude.push(trimmed)
            }
        })
        newExclude.push('')
        setExclude(newExclude)
    }

    const renderExclude = () => {
        return exclude.map((st, idx) => {
            return (
                <TextInput
                    value={st}
                    className="mb-2"
                    placeholder="OU to exclude ..."
                    onChange={(e) => updateExclude(idx, e.target.value)}
                />
            )
        })
    }

    const command = () => {
        let txt = 'kaytu onboard aws'

        if (bootstrapMode) {
            txt = `${txt} -b`
        }

        const excludeList = exclude.filter((v) => v.trim().length > 0).join(',')
        if (excludeList.length > 0) {
            txt = `${txt} --exclude ${excludeList}`
        }
        if (profile.length > 0) {
            txt = `${txt} --profile ${profile}`
        }
        return txt
    }
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" justifyContent="start" alignItems="start">
                <Text className="mb-2">
                    Specify your profile in AWS CLI if any
                </Text>
                <TextInput
                    className="mb-4"
                    onChange={(e) => setProfile(e.target.value)}
                />
                <Text className="mb-2">
                    Provide Organization Units to exclude
                </Text>
                {renderExclude()}

                <Text className="mt-4 mb-2">
                    Run this command on your terminal
                </Text>
                <CodeBlock command={command()} text={`$ ${command()}`} />
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button onClick={() => onNext()} className="ml-3">
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
