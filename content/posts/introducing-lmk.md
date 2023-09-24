---
title: Introducing LMK
subtitle: Stop watching your code run
date: '2023-09-22'
description: "In this post I discuss a new tool I've created called LMK that helps you monitor long-running processes and notify yourself when they finish. I talk about the pain I've experienced with long-running jobs that motivated building it."
---

Writing code is fun. Waiting for code to finish running is not. In a lot of situations, especially when I'm working with data in some way, I often find myself running scripts or notebooks that take a long time to finish. There are a range of reasons for why this might be the case, and sometimes it makes sense to solve the problem at its source and just make the code faster, but sometimes there's nothing to do but wait.

When this happens, I've always found it to be frustrating. I'm not frustrated because the code is slow; I might be doing something that can't be easily optimized like training a machine learning model or downloading a bunch of data from a rate-limited data source. Whatever the reason, the act of sitting at my computer waiting for code to finish running is pretty unpleasant.

Nothing interesting is happening other than a progress bar slowly inching forward if you're lucky, but the risk of not paying attention to it at all is worse. If the code runs into an error, you need to make sure to fix the issue and restart the run. If you don't, it's easy to waste hours only to not make any progress on the problem you're trying to solve at all.

Just as bad, every time you go check to see how your notebook or script is doing you're switching contexts, which means that anything else you're trying to do at the same time is being frequently interrupted. This makes it difficult to make progress on other things.

I've encountered this dilemma countless times, and decided I wanted to write a tool to solve this problem for myself once and for all. The result is [`LMK`](https://www.lmkapp.dev), a set of tools that allows anyone to monitor their long-running processes remotely. The key feature of LMK is that it allows you to notify yourself when things finish running, either no matter what or only if it encounters some sort of error. With LMK, I've found that when doing work that requires any sort of long-running script, I can work in a more event-driven way. Rather than "polling" my jobs, checking back constantly until something happens, I just start the job, configure LMK to monitor me when it finishes, and then get a notification when I actually _should_ go check on it, whether that be because it finishes successfully and I want to go see the results, or because it failed, and I need to go fix the issue and restart it.

If you work with code that often takes a long time to run, I highly recommend trying it out. It's been a big quality of life improvement for me; it reduces the amount of anxiety I have when running scripts that take a long time, and helps me focus on the fun problem-solving parts.

If you want to try  for yourself, the best place to start is by looking at the [documentation](https://docs.lmkapp.dev); you can set it up in a minute or two. If you have any questions, feedback, or run into any issues using LMK, please reach out to [support@lmkapp.dev](mailto:support@lmkapp.dev)  or open a [github issue](https://github.com/lmkapp/lmk/issues/new) and I'll do my best to help address your concern as quickly as possible.
