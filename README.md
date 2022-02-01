# Yoshimitsu

## Description

I found an exploit in the german forum software WoltLab respectively in WoltLab Core and WoltLab Suite Core which allows to execute a stored XSS attack on any board in almost any form. This includes all functions which allow custom tags.

This repository contains all code used to simulate the attack.

## Bot

The bot simulates the attack by infecting the initiator's posts with an XSS. This XSS is executed as soon as a victim opens the corresponding thread/post. Until the process restarts.

Conversations, posts, IP addresses (account data, e-mails, user name and password) and browser data are read by the bot.

## More

For more information, see the following links:

- WoltLab/WCF: https://github.com/WoltLab/WCF
- WoltLab/WCF Issue "Fix stored XSS exploit": https://github.com/WoltLab/WCF/issues/4653
- Update: WoltLab Suite 5.4.13 / 5.3.19 / 5.2.19 / 3.1.27: https://www.woltlab.com/community/thread/294290-update-woltlab-suite-5-4-13-5-3-19-5-2-19-3-1-27/
- Update: WoltLab Suite 5.4.13 / 5.3.19 / 5.2.19 / 3.1.27: https://www.woltlab.com/community/thread/294291-update-woltlab-suite-5-4-13-5-3-19-5-2-19-3-1-27/
