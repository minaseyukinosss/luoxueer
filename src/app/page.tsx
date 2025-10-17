'use client';

import { useLocale } from '@/components/LocaleProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start justify-center min-h-[calc(100vh-12rem)]">
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            {t.welcome}
          </h1>
          <p className="text-foreground/60 text-xl md:text-2xl max-w-2xl mb-12">
            {t.description}
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <Button asChild>
              <a href="/musicbox">
                {t.music}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/about">
                {t.about}
              </a>
            </Button>
          </div>
          
          {/* shadcn/ui 组件测试区域 */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>按钮组件</CardTitle>
                <CardDescription>各种样式的按钮组件</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap">
                  <Button>默认按钮</Button>
                  <Button variant="secondary">次要按钮</Button>
                  <Button variant="destructive">危险按钮</Button>
                  <Button variant="outline">轮廓按钮</Button>
                  <Button variant="ghost">幽灵按钮</Button>
                  <Button variant="link">链接按钮</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>输入组件</CardTitle>
                <CardDescription>表单输入组件示例</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">用户名</label>
                  <Input placeholder="请输入用户名" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">邮箱</label>
                  <Input type="email" placeholder="请输入邮箱" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge>默认标签</Badge>
                  <Badge variant="secondary">次要标签</Badge>
                  <Badge variant="destructive">危险标签</Badge>
                  <Badge variant="outline">轮廓标签</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
