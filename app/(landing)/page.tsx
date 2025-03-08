import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      Landing page
      <div>
        <Link href="/sign-in">
            <Button className='bg-orange-700 hover:bg-orange-800 hover:cursor-pointer'>
                Login
            </Button>
        </Link>

        <Link href="/sign-up">
            <Button className='bg-orange-700 hover:bg-orange-800 hover:cursor-pointer'>
                Register
            </Button>
        </Link>
      </div>
    </div>
  )
}

export default page
