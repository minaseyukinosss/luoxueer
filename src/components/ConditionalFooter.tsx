'use client';

import { usePathname } from 'next/navigation';
import FooterWrapper from './FooterWrapper';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // 只在首页显示页脚
  if (pathname !== '/') {
    return null;
  }
  
  return <FooterWrapper />;
}

