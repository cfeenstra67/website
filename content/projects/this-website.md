---
title: 'This Website'
date: '2022-06-09'
description: 'This website exists as a place for me to share anys I want to publish, and for others to consume if they want to get to know me a little bit. Also, I bought camfeenstra.com and figured I should do something with it 🙂.'
repo: cfeenstra67/website
live: https://www.camfeenstra.com
---
I have this website primarily just for fun--it's a nice, low-stakes project for me to play with every now and then. It's been very good practice with CSS (though my skills still aren't amazing) and was my first project using Next.js as well, so it's been a good learning experience for sure.

I've written some [blog posts](/posts) that I'm hosting here as well, go check them out if you're interested!

## Stack

- Next.js is the framework I'm using the write the actual app. Just using basic CSS (w/ CSS modules) for the styling.
- It's being deployed on `www.camfeenstra.com` using AWS cloudfront and ACM for certificate verification.
    - It's an entirely static site so the hosting cost is basically free, and ACM ensure that there's no need to worry about certificates either
    - This deployment method is great--there's nothing for me to worry about, including costs.
    - I'm using Pulumi to do the deployment--you can find the actual config in the `infra` directory of the repo above. I use pulumi to deploy almost everything these days--it can be slow, but overall the experience is great and uniform across any type of project.
- Airtable for the "Join mailing list" form. Still waiting for someone to actually use that 😂 .

Pretty simple! I love working with infrastructure, but no need to introduce complexity where it isn't needed.
