import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button, Flex, Grid, GridProps } from '@tremor/react'
import React, { Children, useMemo, useState } from 'react'
import { cardContainer, pagination } from './styles'

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

    const [isShown, setIsShown] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const showCarousel = (isHover || isShown) && itemsCount / pageSize > 1

    const hoverEffect = {
        opacity: showCarousel ? '100%' : '0',
        transition: showCarousel ? 'all .3s ease' : 'all 3s ease',
    }

    const paginationDeactive = {
        backgroundColor: '#C5C9D3',
        ...hoverEffect,
        ...pagination,
    }

    const paginationActive = {
        backgroundColor: '#014BFA',
        ...hoverEffect,
        ...pagination,
    }

    const previousButton = () => {
        const preventPrevious = activeSlide === 1
        return (
            <Flex
                alignItems="center"
                justifyContent="center"
                style={{
                    position: 'absolute',
                    top: '50%',
                    width: '50px',
                    height: '100%',
                    transform: 'translateY(-50%)',
                    left: '-50px',
                    cursor: 'pointer',
                    ...hoverEffect,
                }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() =>
                    !preventPrevious && setActiveSlider((prev) => prev - 1)
                }
            >
                <Button
                    aria-label="previous"
                    disabled={preventPrevious}
                    size="xl"
                    variant="light"
                    icon={ChevronLeftIcon}
                />
            </Flex>
        )
    }

    const nextButton = () => {
        const allowNext =
            itemsCount > pageSize &&
            Math.ceil(itemsCount / pageSize) > activeSlide
        return (
            <Flex
                alignItems="center"
                justifyContent="center"
                style={{
                    position: 'absolute',
                    top: '50%',
                    width: '50px',
                    height: '100%',
                    transform: 'translateY(-50%)',
                    right: '-50px',
                    cursor: 'pointer',
                    ...hoverEffect,
                }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => allowNext && setActiveSlider((prev) => prev + 1)}
            >
                <Button
                    aria-label="previous"
                    disabled={!allowNext}
                    size="xl"
                    variant="light"
                    icon={ChevronRightIcon}
                />
            </Flex>
        )
    }

    const renderItems = (slideNumber = 1) => {
        const items = Children.toArray(children).slice(
            (slideNumber - 1) * pageSize,
            slideNumber * pageSize
        )

        return Children.map(items, (child) => (
            <Grid {...gridItemProps}>{child}</Grid>
        ))
    }

    // console.log(Math.ceil(itemsCount / pageSize), itemsCount, pageSize)

    const paginationCount = () => {
        const size: any = []
        for (let i = 0; i < Math.ceil(itemsCount / pageSize); i += 1) {
            size.push(
                <button
                    type="button"
                    onClick={() => setActiveSlider(i + 1)}
                    aria-label="page"
                    style={
                        activeSlide - 1 === i
                            ? paginationActive
                            : paginationDeactive
                    }
                />
            )
        }
        return size
    }

    return (
        <span
            style={{
                position: 'relative',
                minHeight: '264px',
            }}
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
        >
            <span style={cardContainer}>
                {previousButton()}
                <Grid {...gridContainerProps}>{renderItems(activeSlide)}</Grid>
                {nextButton()}
            </span>
            <span
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {paginationCount()}
            </span>
        </span>
    )
}

export default Swiper
