import * as React from "react"
import { ChevronRight } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

// This is sample data.
let data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Introduction",
      url: "#"
    },
    {
      title: "Vol. 1",
      url: "#",
      items: [
        {
          title: "Chapter 1",
          url: "#",
          isActive: true
        },
        {
          title: "Chapter 2",
          url: "#",
        },
      ],
    },
    {
      title: "Vol. 2",
      url: "#",
      items: [
        {
          title: "Chapter 1",
          url: "#",
        },
        {
          title: "Chapter 2",
          url: "#",
        },
        {
          title: "Chapter 3",
          url: "#",
        },
      ],
    },
  ],
}

export function ReaderSidebar({ mangaTitle, mangaFeedRead, ...props }: { mangaTitle: string, mangaFeedRead: any } & React.ComponentProps<typeof Sidebar>) {
  const searchParams = useSearchParams()
  const mangaId = searchParams.get('id')
  const [mangaFeed, setMangaFeed] = useState<any>(null)
  const [chapterList, setChapterList] =
    useState<{ volume: number; items: { chapter: number; id: string }[] }[]>([]);


  //create an object array containing chapter, sorted by volume if it exists.
  //volumes at the top, standalone chapters at the bottom

  //create an object array containing chapter, sorted by volume if it exists.
  //volumes at the top, standalone chapters at the bottom
  const data2 = useMemo(() => {
    return mangaFeed ?
      mangaFeed?.data
        ?.filter((chapter: any) => chapter?.attributes?.translatedLanguage === "en")
        .map((chapter: any) => ({
          volume: chapter?.attributes?.volume,
          chapter: chapter?.attributes?.chapter,
          id: chapter?.id
        }))
      : [];
  }, [mangaFeed]);

  //first step
  useEffect(() => {
      handleGetMangaFeed();
  }, [handleGetMangaFeed]);

  useEffect(() => {
    if (data2) {
      console.log(data2);
      setChapterList(cleanData())
    }
  }, [data2]);

  function handleGetMangaFeed() {
    setMangaFeed(mangaFeedRead)
    console.log(mangaFeedRead)
  }

  function cleanData() {
    let chapterList: { volume: number; items: { chapter: number; id: string; }[] }[] = [];

    data2.forEach((item: any) => {
      const volume = item.volume ?? -1;
      const chapter = item.chapter;
      const id = item.id;

      // Find if this volume already exists in chapterList
      let volumeGroup = chapterList.find(group => group.volume === volume);

      if (!volumeGroup) {
        // If not, add it
        chapterList.push({
          volume,
          items: [{ chapter, id }],
        });
        // chapterList.sort(
        //   function (a, b) {
        //     if (a.volume < b.volume) {
        //       return -1
        //     };
        //     if (a.volume > b.volume) {
        //       return 1
        //     };
        //     return 0;
        //   }
        // );
      } else {
        // If exists, push chapter into its items
        volumeGroup.items.push({ chapter, id });
        // volumeGroup.items.sort(
        //   function (a, b) {
        //     if (a.chapter < b.chapter) {
        //       return -1
        //     };
        //     if (a.chapter > b.chapter) {
        //       return 1
        //     };
        //     return 0;
        //   }
        // );
      }
    });

    chapterList.sort((a, b) => a.volume - b.volume);

    // ✅ Sort chapters inside each volume
    chapterList.forEach(group => {
      group.items.sort((a, b) => a.chapter - b.chapter);
    });

    return chapterList;
  }

  return (
    <Sidebar {...props}>
      <div style={{ marginBottom: "20px", marginTop: "20px", textAlign: "center" }}>
        <h3>{mangaTitle}</h3>
      </div>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {chapterList.map((item: any) => (
          <Collapsible
            key={item.volume}
            title={item.volume}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {`Volume ${item.volume}`}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items?.map((item: any) => (
                      <SidebarMenuItem key={item.chapter}>
                        <SidebarMenuButton asChild
                          // isActive={item.isActive}
                          isActive={false}
                        >
                          <Link href={{pathname: "/read", query: { id: mangaId, title: mangaTitle, chapterId: item.id }}}>{`Chapter ${item.chapter}`}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
