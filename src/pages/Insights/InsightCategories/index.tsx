import { useEffect, useState } from 'react'
import { Tab, TabGroup, TabList } from '@tremor/react'
import { useComplianceApiV1MetadataTagInsightList } from '../../../api/compliance.gen'

interface IInsightCategories {
    onChange: any
    selected: any
}

export default function InsightCategories({
    onChange,
    selected,
}: IInsightCategories) {
    const { response: categories } = useComplianceApiV1MetadataTagInsightList()
    const [selectedCategory, setSelectedCategory] = useState<string>('All')

    useEffect(() => {
        onChange(selectedCategory)
    }, [selectedCategory])

    useEffect(() => {
        setSelectedCategory('All')
    }, [selected])

    const aaa: any = categories?.category || []
    const allCategories = ['All', ...aaa]

    const handleClick = (cat: string) => {
        if (cat === 'All' || selectedCategory === cat)
            setSelectedCategory('All')
        else setSelectedCategory(cat)
    }

    return (
        <TabGroup>
            <TabList variant="solid">
                {allCategories.map((category) => (
                    <Tab
                        className="border-none"
                        onClick={() => handleClick(category)}
                    >
                        {category}
                    </Tab>
                ))}
            </TabList>
        </TabGroup>
    )
}
