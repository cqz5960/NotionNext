import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className }) => {
  const { locale } = useGlobal()
  
    // 豆包加上，自动让公告里的所有链接在新标签页打开
  useEffect(() => {
    const links = document.querySelectorAll('#announcement-content a')
    links.forEach(link => {
      link.target = '_blank'
      link.rel = 'noreferrer noopener'
    })
  }, [post])
  
  
  
  if (post?.blockMap) {
    return <div className={className}>
        <section id='announcement-wrapper' className="dark:text-gray-300 border dark:border-black rounded-xl lg:p-6 p-4 bg-white dark:bg-hexo-black-gray">
            <div><i className='mr-2 fas fa-bullhorn' />{locale.COMMON.ANNOUNCEMENT}</div>
            {post && (<div id="announcement-content">
            <NotionPage post={post} className='text-center' />
        </div>)}
        </section>
    </div>
  } else {
    return <></>
  }
}
export default Announcement
