'use client'

import Image from 'next/image'
import { useState } from 'react'

type ProfileImageProps = {
  src?: string
  alt: string
  containerClassName?: string
}

export function ProfileImage({ 
  src = '/images/default-avatar.png', 
  alt,
  containerClassName = "w-32 h-32"
}: ProfileImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  const handleError = () => {
    setImgSrc('/images/default-avatar.png')
  }

  return (
    <div className={`relative rounded-full overflow-hidden ${containerClassName}`}>
      <Image 
        src={imgSrc}
        alt={alt} 
        fill
        className="object-cover"
        onError={handleError}
      />
    </div>
  )
}
