# Streaming Platform MVP Specification

## Project Overview

This project is a clean, minimal movie streaming and discovery platform.

The platform focuses on:

• Fast UI
• Movie exploration
• Streaming embed support
• SEO optimized pages
• Scalable architecture

The site will not initially include ads or AI features.

Future phases will introduce AI recommendations and donation support.

---

# Technology Stack

Frontend:

* Next.js (App Router)
* TypeScript
* Tailwind CSS

Infrastructure:

* Vercel hosting
* Cloudflare CDN and DNS

Movie Data:

* TMDB API

Streaming:

* Vidfast embed player

---

# Core Pages

## Homepage

Sections:

* Featured Movie
* Trending Movies
* Popular Movies
* Recently Added
* Explore button

Layout style:

Poster grid with horizontal scroll rows similar to modern streaming platforms.

---

## Explore Page

The Explore page is the discovery engine of the platform.

Sections:

Trending Movies

Top Rated Movies

Recently Added

Browse by Genre

Curated Sections:

* Mind-Bending Movies
* Space Movies
* Hidden Gems
* Critically Acclaimed

Each section displays posters in a grid layout.

---

## Movie Page

Each movie has a dedicated page.

URL structure:

/movie/[movie-name]-[year]

Example:

/movie/inception-2010

Page includes:

Movie Poster

Movie Title

Release Year

Genres

Overview

Cast list

Streaming Player

Server selection

Similar Movies section

---

# Streaming Player

The streaming player embeds external providers.

Initial server configuration:

Server 1 — Primary (Vidfast)

Future servers may include backups or mirrors.

Server switching UI:

Fast
Backup
Mirror

Switching servers replaces the iframe source.

---

# Search System

Implement fast movie search.

Features:

Instant results dropdown

Poster preview

Movie titles

Search page results

---

# Data Integration

Movie data is pulled from TMDB API.

Fields stored:

movie_id

title

release_year

poster

overview

genres

cast

rating

Implement caching layer to reduce repeated API calls.

---

# SEO Requirements

Each movie page must include:

Title tag

Meta description

Open Graph tags

Structured schema for Movie

Generate sitemap automatically.

Example URLs:

/movie/inception-2010

/genre/sci-fi

/genre/action

/explore

---

# Performance Requirements

Page load target:

< 2 seconds

Optimizations required:

Image optimization

Lazy loading

Poster placeholders

API caching

---

# UI Design Guidelines

Design style:

Dark theme

Minimal interface

Poster-focused browsing

Large movie thumbnails

Hover interactions for desktop

Responsive grid for mobile

Poster ratio:

2:3

Spacing between posters:

20px

Background color:

#0f0f0f

Text color:

#ffffff

Accent color:

#e50914

---

# Folder Structure

/app
/components
/lib
/services
/styles
/types

Components should include:

Navbar

MovieCard

MovieRow

Player

ServerSelector

SearchBar

---

# Future Features (Not Implemented Yet)

AI movie recommendations

User watchlist

Continue watching

Donation system

Multiple streaming providers

These should not be implemented yet but architecture should allow future expansion.

---

# Deployment

The project must deploy easily to Vercel.

Environment variables:

TMDB_API_KEY

Streaming provider URLs

---

# Deliverables

Antigravity agents should produce:

Complete project source code

Deployment instructions

Environment setup

README documentation
