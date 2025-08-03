import React from 'react'

const Footer = () => {
  return (
    <footer className='py-5 bg-card relative border-t border-border flex flex-wrap justify-center items-center'>
      <p className='text-sm text-primary/70'>
        &copy; {new Date().getFullYear()} Pollap.co, All Rights Reserved
      </p>
    </footer>
  )
}

export default Footer
