---
title: 'Statey'
date: '2022-09-12'
description: 'Statey is a fully-functioning infrastructure as code tool and library that I wrote in 2019.' 
repo: cfeenstra67/statey
live: https://pypi.org/project/statey
---
Statey is a project that I created after I got a taste of working with Terraform and became obsessed with understanding how it worked. If you've used Terraform you're probably familiar with the fact that it has lots of sharp edges--there are lots of times where you end up repeating logic or using "external data sources" to run a basic bit of code in a programming language. There are tools that help improve the experience like Atlantis, but I didn't find any of them very intuitive and it seemed like more of a band-aid fix.

I set out to make an infrastructure-as-code framework of my own. The primary insight I had was that the mathematical concept of a [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine) was the perfect way to think about each "resource" that an infrastructure as code tool managed. And in fact, the entire graph of resources that comprise the "state" that the tool manages can be defined as a finite state machine itself. If you like reading relatively messy mathematical proofs, I actually wrote a [proof](/Context-Migration-Machine.pdf) that shows that a DAG of finite state machines which are technically non-deterministic because they depend on one another (where the edges are the dependencies between them) is itself a deterministic finite state machine while I was playing around with these ideas.

Once I had this conceptual understanding of how to implement an infra-as-code framework, I spent a couple months implementing statey. I'm really proud of it; it's a simple, lightweight Python library with very few dependencies, and yet it has most of the features of commonly used tools like Terraform and Pulumi, while being significantly more extensible as almost all of the behavior is defined by plugins (using the excellent `pluggy` library). While resource definitions (like an EC2 instance resource on AWS) can be written using the framework directly, it also is able to interoperate with Pulumi resource providers, which opens up an entire ecosystem of potential resources that can be managed (it uses the [`pylumi`](https://github.com/cfeenstra67/pylumi) library, which I wrote for the purpose, to do this).

Once I had it working, I realized that Pulumi had a lot of the same ideas. I still think statey has some advantages over Pulumi, especially for being embedded into an application (though now they have the "Automation API" which enables this), however Pulumi was already battle-tested and had a whole organization behind it. I decided I wouldn't try too hard to get `statey` out there because it didn't have enough uniquely good features to move the needle. I still may come back to it some day though, and it might be my favorite piece of software that I've written.

I personally use Pulumi to do all of my deployments these days.
