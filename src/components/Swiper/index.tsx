import { Flex, Grid, GridProps } from '@tremor/react'
import React, { Children, useMemo, useState } from 'react'
import Pagination from './Pagination'

interface IProps {
    children: React.ReactNode
    pageSize?: number
    gridContainerProps?: any
    gridItemProps?: GridProps
}

const Swiper = ({
    children,
    pageSize = 9,
    gridContainerProps,
    gridItemProps,
}: IProps) => {
    const [activeSlide, setActiveSlider] = useState<number>(1)

    const itemsCount = useMemo(
        () => Children.toArray(children).length,
        [children]
    )

    const renderItems = (slideNumber = 1) => {
        const items = Children.toArray(children).slice(
            (slideNumber - 1) * pageSize,
            slideNumber * pageSize
        )

        return Children.map(items, (child) => (
            <Grid className=" w-full" {...gridItemProps}>
                {child}
            </Grid>
        ))
    }

    const handlePageChange = (page: number) => {
        const pageCount = Math.ceil(itemsCount / pageSize)
        if (activeSlide + page > pageCount) {
            setActiveSlider(activeSlide)
        } else if (activeSlide + page <= 0) {
            setActiveSlider(1)
        } else {
            setActiveSlider(activeSlide + page)
        }
    }

    return (
        <Flex flexDirection="col" className="min-h-[265px]  w-full">
            <Grid className="min-h-[265px] w-full" {...gridContainerProps}>
                {renderItems(activeSlide)}
            </Grid>
            <Pagination
                onClickNext={() => handlePageChange(1)}
                onClickPrevious={() => handlePageChange(-1)}
                currentPage={activeSlide}
                pageCount={Math.ceil(itemsCount / pageSize)}
            />
        </Flex>
    )
}

export default Swiper
