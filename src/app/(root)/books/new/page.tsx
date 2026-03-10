import UploadForm from '@/src/components/UploadForm'
import { mainModule } from 'process'
import React from 'react'

const Page = () => {
  return (
    <main className="wrapper container">
        <div>
            <section>
                <h1 className="text-4xl md:text-5xl font-semibold text-black tracking-[-0.02em] leading-[54px] font-serif">Add a New Book</h1>
                <p className='text-xl text-[var(--text-secondary)] leading-7'>Upload na pdf to generate your intractive</p>
            </section>

            <UploadForm/>
        </div>
    </main>
  )
}

export default Page