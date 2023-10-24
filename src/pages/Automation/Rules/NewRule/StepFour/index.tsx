import { Button, Flex, Text, TextInput } from '@tremor/react'
import { useState } from 'react'

interface IStep {
    onNext: (name: string, description: string, label: string) => void
    onBack: () => void
}

export default function StepFour({ onNext, onBack }: IStep) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [label, setLabel] = useState('')
    const [isClicked, setIsClicked] = useState(false)

    return (
        <Flex flexDirection="col" className="h-full max-h-screen">
            <Flex flexDirection="col" alignItems="start">
                <Flex justifyContent="start" className="gap-1 mb-6">
                    <Text>4/4.</Text>
                    <Text className="text-gray-800 font-semibold">
                        Metadata
                    </Text>
                </Flex>
                <Flex className="mb-6">
                    <Text className="text-gray-800">Name</Text>
                    <TextInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-2/3"
                    />
                </Flex>
                <Flex className="mb-6">
                    <Text className="text-gray-800">Description</Text>
                    <TextInput
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-2/3"
                    />
                </Flex>
                <Flex className="mb-6">
                    <Text className="text-gray-800">Label</Text>
                    <TextInput
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="w-2/3"
                    />
                </Flex>
            </Flex>
            <Flex justifyContent="end" className="gap-4">
                <Button variant="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button
                    disabled={
                        name.length < 1 ||
                        description.length < 1 ||
                        label.length < 1
                    }
                    loading={isClicked}
                    onClick={() => {
                        setIsClicked(true)
                        onNext(name, description, label)
                    }}
                >
                    Creat rule
                </Button>
            </Flex>
        </Flex>
    )
}
