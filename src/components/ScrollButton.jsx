import React, { useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa';

const ScrollButton = ({ onClick }) => {
    const onButtonClick = () => {
        onClick()
    }
    return (
        <div className='scrollToTop'>
            <button
                className='fixed bottom-5 right-7 z-50 cursor-pointer p-4'
                onClick={onButtonClick}
            >
                <div className='text-black border-2 border-yellow-300 p-2 rounded-full'>
                    <FaArrowUp size={24} />
                </div>
            </button>
        </div>
    )
}

export default ScrollButton
