---
title: 'Write A Script To Templatize Astro Blog Posts'
slug: 'script-astro-blog-template'
description: 'Learn how to write a bash script to automate creating posts in your astro blog and templatize your frontmatter.'
publishDate: 2023-09-19
tags: ['recipe', 'bash', 'astro']
draft: false
---

I am fully onboard team "Astro for content sites" and flirting with team "Astro for apps" (I am particularly curious to explore Astro + Elm for the whole "islands of interactivity" thing). I started this blog on the Astro framework and the DX and out-of-the-box tooling that Astro provides is :chefs-kiss:. As somebody who is trying to create a writing habit, I am pulling up my Astro projects frequently to draft and ideate posts. And as a lazy developer, instead of my standard find an old post -> copy file -> create new file -> paste file -> delete most of the file workflow, I wrote a script to normalize this process and in the process, made discovering and organizing my blog posts a little easier as well.

## TLDR;
Here is a link to the [shell script](https://github.com/johnmcguin/blog/blob/main/scripts/new-blog.sh) I am using.

## Goals
- Organize my posts (I want them sort ordered)
- Normalize the creation
- Avoid the copy / paste tedium

## Script
Pick a place to put your script(s). I usually like a `/scripts` directory. Make a new file for your script to create a new blog post. I called mine `new-blog.sh`. You can create both by executing
```bash
mkdir ./scripts && touch $_/new-blog.sh
```
The `$_` is a magical variable within the bash shell which holds the value of the last argument of the last command. So, in this example our `touch` command is `touch ./scripts/new-blog.sh`. The script utilizes the `$_` magic as well so stick that in your back pocket for a sec.

Take a peek at the script in whole, and then we will break it down into smaller pieces.
```bash
#!/bin/bash
SLUG=$1

mkdir "./src/content/post/$(date +%s)-$SLUG" \
&& cat <<EOF > "$_/index.md"
---
title: '$SLUG'
slug: '$SLUG'
description: ''
publishDate: $(date +%Y-%m-%d)
tags: []
draft: true
---
EOF
```

### Obtain A Reference To The Slug
```bash
SLUG=$1
```
This script gets executed with an argument that we're calling the slug. For this post, I executed the command `./scripts/new-blog.sh script-astro-blog-template`.

### Make A Dynamic Directory
```bash
mkdir "./src/content/post/$(date +%s)-$SLUG"
```
This initial command creates a directory at `/content/post/<timestamp>-<slug>`. The timestamp used is seconds passed since the Unix epoch. This is similar to how database migrations are often stored in the file system and give an easy way to sort the filesystem by dates. As an example, the directory that got created for this blog post is `/content/post/1694568442-script-astro-blog-template`. It's also automatically the bottom most directory in my `post` directory, making it easy to know the timeline of the blog from within the repo.

### Create A Dynamic Template
Let's first look indepedently at a portion of the next section:
```bash
cat <<EOF
---
title: '$SLUG'
slug: '$SLUG'
description: ''
publishDate: $(date +%Y-%m-%d)
tags: []
draft: true
---
EOF
```
Here, we are `cat`ing something called a Here Document. This allows us to interpolate variables and preserve formatting. The `<<` syntax within a bash script begins the here doc syntax and its followed by a delimeter. In our case, this is `EOF`. `EOF` is likely the most common delimiter you will see in the wild. As you can see, I am not doing much with the template; I am only templatizing the frontmatter, but it allows me to create a post quickly and most importantly without the Astro dev server yelling at me that my frontmatter validation is not passing. Now, I am immediately ready to write, instead of fixing the dev server errors around required frontmatter fields and the like.

## Writing The Template To The Blog Post
```bash
&& cat <<EOF > "$_/index.md"
---
title: '$SLUG'
slug: '$SLUG'
description: ''
publishDate: $(date +%Y-%m-%d)
tags: []
draft: true
---
EOF
```
The syntax of writing the output of a Here Doc to a file is admittedly a little strange. Instead of writing the file at the end of the HereDoc, you do so right after the delimeter (`cat <<EOF > "$_/index.md"`). Here we are again using the wonderful `$_` variable which refers to the directory path we previously created.

## The Directory Layout
As you might guess or know if you've run this, our posts are created as `index.md` under the timestamped directory. The reason I chose to do this is to easily group assets like images that relate only to this post under the posts directory. My current `post` directory, for example, looks like this:

```bash
.
├── 1693948700-bitwarden-jq
│   ├── bw-list-jq.png
│   ├── bw-list.png
│   └── index.md
├── 1694016765-bitwarden-session
│   └── index.md
├── 1694018806-cleanup-local-git
│   └── index.md
├── 1694548221-flypg-migration
│   └── index.md
└── 1694568442-script-astro-blog-template
    └── index.md

6 directories, 7 files

```

## Extending
There is plenty of room to extend the script and I hope that you do if you find this useful. You could pass tags, a description, write an initial note that captures your idea and immediately commits it. Plenty of options! For me, this simple script is fitting my needs and workflows so far but you might find something else fits your ideal workflow a little better. Happy coding!
