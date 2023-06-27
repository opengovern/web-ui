import { useEffect, useState } from 'react'
import { Button, Flex } from '@tremor/react'
import { useComplianceApiV1MetadataTagInsightList } from '../../../api/compliance.gen'

interface IInsightCategories {
    onChange: any
}

export default function InsightCategories({ onChange }: IInsightCategories) {
    const { response: categories } = useComplianceApiV1MetadataTagInsightList()
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    useEffect(() => {
        onChange(selectedCategory)
    }, [selectedCategory])

    return (
        <Flex flexDirection="row">
            {categories?.category.map((category) => (
                <Button
                    size="xs"
                    value={category}
                    variant={
                        selectedCategory === category ? 'primary' : 'secondary'
                    }
                    onClick={() => {
                        if (selectedCategory === category)
                            setSelectedCategory('')
                        else setSelectedCategory(category)
                    }}
                />
            ))}
        </Flex>
    )
}
