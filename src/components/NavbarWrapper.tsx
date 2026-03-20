"use client"

import { Home, Compass, Bookmark } from "lucide-react"
import { AnimeNavBar } from "@/components/ui/anime-navbar"

const navItems = [
  {
    name: "Home",
    url: "/",
    icon: Home,
  },
  {
    name: "Explore",
    url: "/explore",
    icon: Compass,
  },
  {
    name: "Watchlist",
    url: "/watchlist",
    icon: Bookmark,
  },
]

export default function NavbarWrapper() {
  return <AnimeNavBar items={navItems} defaultActive="Home" />
}
