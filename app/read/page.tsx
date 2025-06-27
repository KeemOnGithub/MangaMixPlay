"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MangaCard } from "@/components/manga-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import axios from "axios";
import { Search } from "lucide-react"
import { WelcomeCard } from "@/components/welcome-card"
import { ModeToggle } from "@/components/mode-toggle"
import { ReaderSidebar } from "@/components/reader-sidebar"
import { useRouter, useSearchParams } from "next/navigation";

export default function Reader() {
  const searchParams = useSearchParams()
  const mangaId = searchParams.get('id')
  const mangaTitle = (searchParams.get('title') || "")
  const [chapterData, setChapterData] = useState<any>(null)
  const [mangaFeed, setMangaFeed] = useState<any>(null)
  const [pageImages, setPageImages] = useState<string[]>([])
  const [count, setCount] = useState(0);

  //first step
  useEffect(() => {
    if (mangaId) {
      console.log('Manga ID: ', mangaId);
      handleGetMangaFeed(mangaId);
    }
  }, [mangaId]);

  //second step
  useEffect(() => {
    if (mangaFeed?.data) {
      handleGetChapterData()
    }
  }, [mangaFeed]);
  
  //third step
  useEffect(() => {
    if (chapterData) {
      handleGetChapterImage()
    }
  }, [chapterData]);

  function handleGetMangaFeed(id: string) {
    axios
      .get(`https://api.mangadex.org/manga/${id}/feed`)
      .then((response) => {
        console.log('MANGA FEED:', response.data);
        setMangaFeed(response.data);
      })
      .catch((error) => {
        console.error('API error:', error);
      });
  }

  //want to be able to handle different chapters in future - save user's current chapter in memory
  function handleGetChapterData(chapterId: string = "placeholder") {
    const englishChapters = mangaFeed?.data?.filter(
      (chapter: any) =>
        chapter?.attributes?.translatedLanguage === "en"
    );

    const firstChapter = englishChapters.sort(
      (a: any,b: any) => a.attributes?.chapter - b.attributes?.chapter
    )[0]

    console.log(englishChapters)
    console.log(firstChapter)

    axios
      .get(`https://api.mangadex.org/at-home/server/${firstChapter.id}`)
      .then((response) => {
        console.log('CHAPTER DATA:', response.data);
        console.log(firstChapter.attributes.chapter);
        setChapterData(response.data);
        // handleGetChapterImage();
      })
      .catch((error) => {
        console.error('API error:', error);
      });
  }

  //download images
    function handleGetChapterImage(chapterId: string = "placeholder") {
      const baseUrl: string = chapterData?.baseUrl
      const images: string[] = chapterData?.chapter?.data
      const hash: string = chapterData?.chapter?.hash
      let pageImageArray: string[] = []
      console.log(images)

      for(let i=0; i < images.length; i++){
        const link = (`${baseUrl}/data/${hash}/${images[i]}`)
        pageImageArray.push(link)
      }

      setPageImages(pageImageArray)
  }

  return (
    <SidebarProvider>
      <ReaderSidebar
        mangaTitle={mangaTitle} />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
          <div style={{ marginLeft: "auto" }}>
            <ModeToggle />
          </div>
          {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {
            pageImages ?
              pageImages?.map((img: string, index: number) => (
                <img
                  key = {index}
                  src = {img}
                />
              ))
              :
              <p>No image</p>
          }
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

