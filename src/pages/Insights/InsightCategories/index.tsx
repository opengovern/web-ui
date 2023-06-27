import { useEffect, useState } from 'react'
import { Button, Flex } from '@tremor/react'
import { useComplianceApiV1MetadataTagInsightList } from '../../../api/compliance.gen'

interface IInsightCategories {
    onChange: any
}

// const tabs = (cat: any) => {
//     const categories = []
//     if (cat) {
//         for (let i = 0; i < cat.length; i += 1) {
//             categories.push({ name: cat, href: '#', current: false })
//         }
//     }
//     return categories
// }
//
// function classNames(...classes: any) {
//     return classes.filter(Boolean).join(' ')
// }

export default function InsightCategories({ onChange }: IInsightCategories) {
    const { response: categories } = useComplianceApiV1MetadataTagInsightList()
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    useEffect(() => {
        onChange(selectedCategory)
    }, [selectedCategory])

    const aaa: any = categories?.category || []
    return (
        <Flex flexDirection="row" justifyContent="start" className="mb-6">
            {categories?.category.map((category) => (
                <Button
                    size="xs"
                    variant={
                        selectedCategory === category ? 'primary' : 'secondary'
                    }
                    onClick={() => {
                        if (selectedCategory === category)
                            setSelectedCategory('')
                        else setSelectedCategory(category)
                    }}
                    className="mr-2"
                >
                    {category}
                </Button>
            ))}
        </Flex>
        // <nav className="flex space-x-4" aria-label="Tabs">
        //     {aaa.map((tab: any) => (
        //         // eslint-disable-next-line jsx-a11y/anchor-is-valid
        //         <a
        //             key={tab}
        //             href="#"
        //             className={classNames(
        //                 selectedCategory.includes(tab)
        //                     ? 'bg-indigo-100 text-indigo-700'
        //                     : 'text-gray-500 hover:text-gray-700',
        //                 'rounded-md px-3 py-2 text-sm font-medium'
        //             )}
        //             aria-current={
        //                 selectedCategory.includes(tab) ? 'page' : undefined
        //             }
        //         >
        //             {tab.name}
        //         </a>
        //     ))}
        // </nav>
    )
}
