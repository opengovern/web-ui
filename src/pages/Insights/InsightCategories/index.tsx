import { useEffect, useState } from 'react'
import { Button, Flex } from '@tremor/react'
import { useComplianceApiV1MetadataTagInsightList } from '../../../api/compliance.gen'

interface IInsightCategories {
    onChange: any
}

export default function InsightCategories({ onChange }: IInsightCategories) {
    const { response: categories } = useComplianceApiV1MetadataTagInsightList()
    const [selectedCategory, setSelectedCategory] = useState<string>('All')

    useEffect(() => {
        onChange(selectedCategory)
    }, [selectedCategory])

    const aaa: any = categories?.category || []
    const allCategories = ['All', ...aaa]

    const handleClick = (cat: string) => {
        if (cat === 'All' || selectedCategory === cat)
            setSelectedCategory('All')
        else setSelectedCategory(cat)
    }

    return (
        <Flex flexDirection="row" justifyContent="start">
            {allCategories.map((category) => (
                <Button
                    size="xs"
                    variant={
                        selectedCategory === category ? 'primary' : 'secondary'
                    }
                    onClick={() => handleClick(category)}
                    className="mr-2"
                >
                    {category}
                </Button>
            ))}
        </Flex>
    )
}
