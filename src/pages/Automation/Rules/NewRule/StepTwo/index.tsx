import { Button, Flex, Text } from '@tremor/react'
import 'react-querybuilder/dist/query-builder.css'
import { QueryBuilder, RuleGroupType } from 'react-querybuilder'
import { useState } from 'react'

interface IStep {
    onNext: () => void
    onBack: () => void
}

export default function StepTwo({ onNext, onBack }: IStep) {
    const [query, setQuery] = useState<RuleGroupType>({
        combinator: 'and',
        rules: [{ field: 'score', operator: '<', value: '80' }],
    })

    const queryCreator = () => {
        let temp = JSON.stringify(query)
        temp = temp.replaceAll('combinator', 'condition_type')
        temp = temp.replaceAll('operator', 'operator_type')
        temp = temp.replaceAll('rules', 'operator')
        return JSON.parse(temp)
    }

    return (
        <Flex flexDirection="col" className="h-full max-h-screen">
            <Flex flexDirection="col" alignItems="start">
                <Flex justifyContent="start" className="gap-1 mb-6">
                    <Text>2/4.</Text>
                    <Text className="text-gray-800 font-semibold">
                        Condition
                    </Text>
                </Flex>
                <QueryBuilder
                    fields={[
                        {
                            name: 'score',
                            label: 'Score (%)',
                            datatype: 'number',
                        },
                    ]}
                    operators={[
                        { name: '<', label: '<' },
                        { name: '>', label: '>' },
                    ]}
                    query={query}
                    onQueryChange={(q) => setQuery(q)}
                />
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={onNext}>Next</Button>
            </Flex>
        </Flex>
    )
}
