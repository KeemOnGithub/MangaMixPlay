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
import { useState } from "react"
import axios from "axios";
import { Search } from "lucide-react"
import { WelcomeCard } from "@/components/welcome-card"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const [searchInput, setSearchInput] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)

  function handleSearchInputChange(event: any) {
    setSearchInput(event.target.value)
  }

  function handleCompleteSearchInput(event: any) {
    if (event.key == "Enter") {
      console.log(event.target.value)
      if(searchInput == "") {
        setSearchResults(null)
      }
      else {
        axios.get(`https://api.mangadex.org/manga?title=${event.target.value}&includes[]=author&includes[]=cover_art`)
        .then(function (response) {
          // handle success
          console.log(response.data);
          setSearchResults(response.data);
          console.log(searchResults);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
      }
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <ModeToggle />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <label className="relative h-10 w-full">
            <Search className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            <Input
              placeholder="Type the title here..."
              value={searchInput}
              onChange={(event) => handleSearchInputChange(event)}
              onKeyDown={(event) => handleCompleteSearchInput(event)}
            />
          </label>
          {
            searchResults ?
              searchResults?.data?.map((el: any, index: number) => (
                <MangaCard
                  key={index}
                  title={el?.attributes?.title?.en || "Loading..."}
                  description={el?.attributes?.description?.en || "Loading..."}
                  author={(el.relationships?.find((rel: any) => rel.type === "author"))?.attributes?.name || "Loading..."}
                  image={`https://uploads.mangadex.org/covers/${el?.id}/${(el.relationships?.find((rel: any) => rel.type === "cover_art"))?.attributes?.fileName}`}
                />
              ))
              :
              <WelcomeCard />
          }
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

