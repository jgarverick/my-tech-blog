---
title: "BeeBot Makes his Debut"
description: "Today I had a really great opportunity to see my daughter in action. She had a special show-and-share day in her kindergarten class, and the item she wanted to…"
pubDate: "2015-06-16T02:50:00Z"
updatedDate: "2016-04-18T23:14:05.031Z"
tags: ["Node.js","Raspberry Pi","Nodebot","Arduino"]
bloggerPath: "/2015/06/beebot-makes-his-debut.html"
---
Today I had a really great opportunity to see my daughter in action. She had a special show-and-share day in her kindergarten class, and the item she wanted to show off was a robot that she and I designed, programmed and built.

That’s right. She’s in kindergarten. And she helped me design and build a robot. Now for a little backstory. About three months ago, my daughter came to me and said “Daddy, I want to build a robot.” How could I possibly deny that dream? I had picked up an Arduino Uno board a few months prior and had set up some basic projects, but nothing quite like a robot. This was going to give me a chance to work with the Arduino controller more, and incorporate a Raspberry Pi, which was another device I wanted to get some experience with. Not to mention the greater opportunity of having a daddy-daughter tech project.

The first thing we did was go through requirements gathering and design. Heavy stuff for a six year old, I know, but I tried to keep it light. I asked her to grab a piece of paper and something to draw/write with. We started by talking about what she would want the robot to do. Should it talk? Should it move? Were there specific “look and feel” items she wanted (i.e. different colored buttons, number of wheels)? I let her go through her wish list of features and once complete, we ran back through it to see what was going to make the cut. A few things got knocked out simply due to complexity, as I was planning on coding this in the Arduino IDE initially. Plus, I wasn’t sure exactly what type of parts I would be able to get and I wanted to keep the requirements in a place where they were realistic. I also asked her to draw what she thought the robot would look like once it was all done.

![Hand-drawn requirements list and robot sketch](/images/blog/beebot-makes-his-debut/requirements.png)

_Figure 1 – Requirements and Design_

Next I set out to find anything I could that would help achieve the goals set forth on the list. I ended up getting:

- A Raspberry Pi B+ (I would later swap this out for my Raspberry Pi 2 for reasons I’ll include in my technical follow-up to this post)
- A SainSmart L293D motor control shield
- Several micro servos
- A ton of solderless wires (male/male, male/female and female/female)
- A 3.5″ LCD screen that ended up being a dud – later replaced by an Adafruit compatible screen intended for an Esplora device
- Four colored pushbuttons that were special ordered from China
- A four-wheel motorized car base that came with a clear acrylic frame and four DC motors
- A yellow bucket for the body

…and other assorted parts. Again, more to follow in the technical follow-up post. We worked together on deciding how to make things works, from how the arms moved to what the buttons would do, how the eyes would work, etc. We recorded distorted voiceovers for the robot to correspond with each of the buttons. She drew up pictures that would serve as the mouth for the robot depending on what button was pressed. Then, some dad magic ensued, and today’s presentation seemed to keep everyone interested.

![Josh and his daughter with BeeBot](/images/blog/beebot-makes-his-debut/20150615_181858000_ios.jpg)

_A closeup of Team Garverick._

![The finished BeeBot robot next to a Surface Pro](/images/blog/beebot-makes-his-debut/20150615_110734908_ios.jpg)

_The finished product (along with my Surface Pro)._
