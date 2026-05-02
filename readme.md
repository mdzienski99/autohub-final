# Web Development Final Project - AutoHub

Submitted by: **Michal Dzienski Z23472823 **

This web app: **AutoHub is a themed car community forum where users can create garage posts, upload car images through URLs, comment on discussions, upvote builds, customize profiles with avatars, and generate AI-powered summaries of discussions using OpenAI. The app also includes a bonus HaulSnake mini-game where players control a growing semi truck hauling cargo.**

Time spent: **13** hours

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - [x] Form requires users to add a post title
  - [x] Forms have the option for users to add:
    - [x] additional textual content
    - [x] an image added as an external image URL

- [x] **Web app includes a home feed displaying previously created posts**
  - [x] Web app includes a home feed displaying previously created posts
  - [x] By default, each post on the posts feed shows:
    - [x] creation time
    - [x] title
    - [x] upvotes count
  - [x] Clicking on a post directs the user to a separate post page

- [x] **Users can view posts in different ways**
  - [x] Users can sort posts by:
    - [x] creation time
    - [x] upvotes count
  - [x] Users can search for posts by title

- [x] **Users can interact with each post in different ways**
  - [x] The app includes a separate post page for each created post where additional information is displayed:
    - [x] content
    - [x] image
    - [x] comments
  - [x] Users can leave comments underneath posts
  - [x] Each post includes an upvote button
    - [x] Each click increases the post upvote count
    - [x] Users can upvote posts any number of times

- [x] **A post that a user previously created can be edited or deleted from its post page**
  - [x] Users can edit their own posts
  - [x] Users can delete their own posts

## The following **optional** features are implemented:

- [x] Web app implements pseudo-authentication
  - [x] Users create accounts using Supabase Authentication
  - [x] Only the original creator of a post can edit or delete it
  - [x] User profiles include custom display names and themed avatars

- [x] Users can customize the interface
  - [x] Users can customize their profile avatar
  - [x] App uses a custom AutoHub themed UI and responsive design

- [x] Users can add more characteristics to their posts
  - [x] Users can assign categories/flags to posts:
    - [x] Build
    - [x] Question
    - [x] Review
    - [x] Showcase
    - [x] Repair
    - [x] Detailing
  - [x] Users can filter posts by category
  - [x] Users can share external image URLs

- [x] Web app displays loading states while fetching data

## The following **additional** features are implemented:

* [x] Full AutoHub car-community themed redesign
* [x] AI-generated summaries powered by OpenAI API and Netlify Functions
* [x] Trending posts section
* [x] Profile avatar system
* [x] Responsive mobile-friendly layout
* [x] Animated hover effects and modern UI styling
* [x] Comment system with usernames and avatars
* [x] Custom AI Garage Assistant prompt engineering
* [x] Bonus HaulSnake mini-game inspired by Snake using a growing semi truck and trailers
* [x] WASD + Arrow Key controls for the mini-game
* [x] Start screen and restart system for the mini-game
* [x] Dynamic game score and trailer growth system

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='./src/assets/finaldemo.gif' title='Video Walkthrough' width='600' alt='Video Walkthrough' />

GIF created with ScreenToGif


## Notes

One challenge during development was integrating OpenAI summaries securely through Netlify Functions while keeping API keys hidden from the frontend. Another challenge was designing a themed UI that still kept all required CRUD functionality clean and responsive. The HaulSnake mini-game also required additional state management and collision logic to work smoothly inside the React app.

## License

    Copyright 2026 Michal Dzienski 

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.

    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.