import React, { useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import LoggedInLayout from '../../components/LoggedInLayout'
import { filterAtom, timeAtom } from '../../store'
import { useInventoryApiV2ResourcesTagList } from '../../api/inventory.gen'
import { useOnboardApiV1SourcesList } from '../../api/onboard.gen'

const Settings: React.FC<any> = () => {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const [openDrawer, setOpenDrawer] = useState(false)
    const { response: connections } = useOnboardApiV1SourcesList()
    const { response: inventoryCategories } =
        useInventoryApiV2ResourcesTagList()

    const categoryOptions = useMemo(() => {
        if (!inventoryCategories)
            return [{ label: 'no data', value: 'no data' }]
        return [{ label: 'All Categories', value: 'All Categories' }].concat(
            inventoryCategories.category.map((categoryName) => ({
                label: categoryName,
                value: categoryName,
            }))
        )
    }, [inventoryCategories])

    const handleDrawer = (data: any) => {
        if (openDrawer) {
            setSelectedConnections(data)
            setOpenDrawer(false)
        } else setOpenDrawer(true)
    }

    return (
        <LoggedInLayout currentPage="settings">
            <main />
        </LoggedInLayout>
    )
}

export default Settings
