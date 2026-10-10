// Sample sendmail log data for demonstration

export const sampleLogData = `Jan 15 08:01:23 mailserver sendmail[12345]: ABC12345: from=<admin@example.com>, size=4521, class=0, nrcpts=1, msgid=<202401150801.abc@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 08:01:24 mailserver sendmail[12346]: ABC12345: to=<user1@gmail.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=124521, relay=gmail-smtp-in.l.google.com. [142.250.27.26], dsn=2.0.0, stat=Sent (OK 1705305684)
Jan 15 08:05:12 mailserver sendmail[12347]: DEF23456: from=<newsletter@example.com>, size=15234, class=0, nrcpts=3, msgid=<202401150805.def@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 08:05:13 mailserver sendmail[12348]: DEF23456: to=<subscriber1@yahoo.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=135234, relay=mta5.am0.yahoodns.net [98.137.54.12], dsn=2.0.0, stat=Sent (ok dir delivery)
Jan 15 08:05:14 mailserver sendmail[12349]: DEF23456: to=<subscriber2@hotmail.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=135234, relay=hotmail-com.olc.protection.outlook.com [104.47.42.33], dsn=2.0.0, stat=Sent
Jan 15 08:05:15 mailserver sendmail[12350]: DEF23456: to=<subscriber3@outlook.com>, delay=00:00:03, xdelay=00:00:03, mailer=esmtp, pri=135234, relay=outlook-com.olc.protection.outlook.com [104.47.44.33], dsn=2.0.0, stat=Sent
Jan 15 08:15:30 mailserver sendmail[12351]: GHI34567: from=<noreply@shop.example.com>, size=8923, class=0, nrcpts=1, msgid=<202401150815.ghi@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 08:15:32 mailserver sendmail[12352]: GHI34567: to=<customer1@qq.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=128923, relay=mx2.qq.com [43.129.34.56], dsn=5.1.1, stat=Bounced (user unknown)
Jan 15 09:01:45 mailserver sendmail[12353]: JKL45678: from=<admin@example.com>, size=3200, class=0, nrcpts=1, msgid=<202401150901.jkl@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 09:01:46 mailserver sendmail[12354]: JKL45678: to=<partner@company.org>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=123200, relay=mail.company.org [203.0.113.50], dsn=2.0.0, stat=Sent (Message accepted)
Jan 15 09:30:22 mailserver sendmail[12355]: MNO56789: from=<support@example.com>, size=6543, class=0, nrcpts=2, msgid=<202401150930.mno@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 09:30:24 mailserver sendmail[12356]: MNO56789: to=<client1@enterprise.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=126543, relay=mail.enterprise.com [198.51.100.25], dsn=4.4.1, stat=Deferred (Connection timed out)
Jan 15 09:30:25 mailserver sendmail[12357]: MNO56789: to=<client2@enterprise.com>, delay=00:00:03, xdelay=00:00:03, mailer=esmtp, pri=126543, relay=mail.enterprise.com [198.51.100.25], dsn=2.0.0, stat=Sent (Message accepted)
Jan 15 10:00:11 mailserver sendmail[12358]: PQR67890: from=<alerts@monitoring.example.com>, size=1024, class=0, nrcpts=1, msgid=<202401151000.pqr@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 10:00:12 mailserver sendmail[12359]: PQR67890: to=<ops-team@gmail.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=121024, relay=gmail-smtp-in.l.google.com. [142.250.27.26], dsn=2.0.0, stat=Sent (OK)
Jan 15 10:15:33 mailserver sendmail[12360]: STU78901: from=<marketing@example.com>, size=25600, class=0, nrcpts=5, msgid=<202401151015.stu@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 10:15:34 mailserver sendmail[12361]: STU78901: to=<lead1@prospect.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=145600, relay=mail.prospect.com [203.0.113.100], dsn=2.0.0, stat=Sent
Jan 15 10:15:35 mailserver sendmail[12362]: STU78901: to=<lead2@startup.io>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=145600, relay=mx.startup.io [198.51.100.80], dsn=2.0.0, stat=Sent
Jan 15 10:15:36 mailserver sendmail[12363]: STU78901: to=<lead3@bigcorp.net>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=145600, relay=mx.bigcorp.net [192.0.2.50], dsn=5.2.1, stat=Bounced (mailbox full)
Jan 15 10:15:37 mailserver sendmail[12364]: STU78901: to=<lead4@medium.biz>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=145600, relay=mail.medium.biz [203.0.113.200], dsn=2.0.0, stat=Sent
Jan 15 10:15:38 mailserver sendmail[12365]: STU78901: to=<lead5@small.org>, delay=00:00:03, xdelay=00:00:03, mailer=esmtp, pri=145600, relay=mx.small.org [198.51.100.150], dsn=4.4.1, stat=Deferred (Connection refused)
Jan 15 11:00:05 mailserver sendmail[12366]: VWX89012: from=<admin@example.com>, size=2048, class=0, nrcpts=1, msgid=<202401151100.vwx@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 11:00:06 mailserver sendmail[12367]: VWX89012: to=<developer@github.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=122048, relay=aspmx.l.google.com [142.250.27.26], dsn=2.0.0, stat=Sent
Jan 15 11:30:18 mailserver sendmail[12368]: YZA90123: from=<noreply@shop.example.com>, size=12800, class=0, nrcpts=1, msgid=<202401151130.yza@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 11:30:20 mailserver sendmail[12369]: YZA90123: to=<customer2@163.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=132800, relay=163.com [220.181.12.50], dsn=5.0.0, stat=Bounced (spam rejected)
Jan 15 12:00:45 mailserver sendmail[12370]: BCD01234: from=<hr@example.com>, size=5120, class=0, nrcpts=1, msgid=<202401151200.bcd@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 12:00:47 mailserver sendmail[12371]: BCD01234: to=<candidate@jobseeker.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=125120, relay=mail.jobseeker.com [203.0.113.75], dsn=2.0.0, stat=Sent
Jan 15 12:45:10 mailserver sendmail[12372]: EFG12345: from=<admin@example.com>, size=3072, class=0, nrcpts=1, msgid=<202401151245.efg@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 12:45:12 mailserver sendmail[12373]: EFG12345: to=<vendor@supplier.cn>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=123072, relay=mx.supplier.cn [120.24.56.78], dsn=4.4.1, stat=Deferred (Connection timed out with mx.supplier.cn)
Jan 15 13:00:30 mailserver sendmail[12374]: HIJ23456: from=<security@example.com>, size=1536, class=0, nrcpts=1, msgid=<202401151300.hij@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 13:00:31 mailserver sendmail[12375]: HIJ23456: to=<all-staff@example.com>, delay=00:00:01, xdelay=00:00:01, mailer=local, pri=121536, relay=local, dsn=2.0.0, stat=Sent (Message delivered to local mailbox)
Jan 15 13:30:15 mailserver sendmail[12376]: KLM34567: from=<newsletter@example.com>, size=18432, class=0, nrcpts=4, msgid=<202401151330.klm@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 13:30:16 mailserver sendmail[12377]: KLM34567: to=<reader1@gmail.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=138432, relay=gmail-smtp-in.l.google.com. [142.250.27.26], dsn=2.0.0, stat=Sent
Jan 15 13:30:17 mailserver sendmail[12378]: KLM34567: to=<reader2@icloud.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=138432, relay=mx01.mail.icloud.com [17.57.154.26], dsn=2.0.0, stat=Sent
Jan 15 13:30:18 mailserver sendmail[12379]: KLM34567: to=<reader3@protonmail.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=138432, relay=mail.protonmail.ch [185.70.42.25], dsn=2.0.0, stat=Sent
Jan 15 13:30:19 mailserver sendmail[12380]: KLM34567: to=<reader4@aol.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=138432, relay=mx-aol.mail.gm0.yahoodns.net [98.137.54.12], dsn=5.1.1, stat=Bounced (user unknown)
Jan 15 14:00:22 mailserver sendmail[12381]: NOP45678: from=<billing@example.com>, size=7680, class=0, nrcpts=1, msgid=<202401151400.nop@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 14:00:24 mailserver sendmail[12382]: NOP45678: to=<client@bigclient.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=127680, relay=mail.bigclient.com [203.0.113.250], dsn=2.0.0, stat=Sent
Jan 15 14:30:55 mailserver sendmail[12383]: QRS56789: from=<admin@example.com>, size=4096, class=0, nrcpts=2, msgid=<202401151430.qrs@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 14:30:57 mailserver sendmail[12384]: QRS56789: to=<partner1@alliance.net>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=124096, relay=mx.alliance.net [198.51.100.200], dsn=2.0.0, stat=Sent
Jan 15 14:30:58 mailserver sendmail[12385]: QRS56789: to=<partner2@alliance.net>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=124096, relay=mx.alliance.net [198.51.100.200], dsn=4.0.0, stat=Deferred (temporary failure)
Jan 15 15:00:10 mailserver sendmail[12386]: TUV67890: from=<noreply@shop.example.com>, size=9216, class=0, nrcpts=1, msgid=<202401151500.tuv@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 15:00:12 mailserver sendmail[12387]: TUV67890: to=<customer3@gmail.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=129216, relay=gmail-smtp-in.l.google.com. [142.250.27.26], dsn=2.0.0, stat=Sent
Jan 15 15:30:40 mailserver sendmail[12388]: WXY78901: from=<devops@example.com>, size=2560, class=0, nrcpts=1, msgid=<202401151530.wxy@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 15:30:42 mailserver sendmail[12389]: WXY78901: to=<pager@pagerduty.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=122560, relay=mx.pagerduty.com [198.51.100.100], dsn=2.0.0, stat=Sent
Jan 15 16:00:05 mailserver sendmail[12390]: ZAB89012: from=<admin@example.com>, size=5632, class=0, nrcpts=1, msgid=<202401151600.zab@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 16:00:07 mailserver sendmail[12391]: ZAB89012: to=<external@remote-server.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=125632, relay=mx.remote-server.com [203.0.113.150], dsn=5.4.4, stat=Bounced (DNS lookup failed: no route to host)
Jan 15 16:30:18 mailserver sendmail[12392]: CDE90123: from=<marketing@example.com>, size=20480, class=0, nrcpts=3, msgid=<202401151630.cde@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 16:30:19 mailserver sendmail[12393]: CDE90123: to=<prospect1@target.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=140480, relay=mail.target.com [198.51.100.50], dsn=2.0.0, stat=Sent
Jan 15 16:30:20 mailserver sendmail[12394]: CDE90123: to=<prospect2@target.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=140480, relay=mail.target.com [198.51.100.50], dsn=2.0.0, stat=Sent
Jan 15 16:30:21 mailserver sendmail[12395]: CDE90123: to=<prospect3@target.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=140480, relay=mail.target.com [198.51.100.50], dsn=2.0.0, stat=Sent
Jan 15 17:00:33 mailserver sendmail[12396]: FGH01234: from=<admin@example.com>, size=3584, class=0, nrcpts=1, msgid=<202401151700.fgh@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 17:00:35 mailserver sendmail[12397]: FGH01234: to=<backup@cloudstorage.io>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=123584, relay=mx.cloudstorage.io [203.0.113.175], dsn=2.0.0, stat=Sent
Jan 15 17:30:12 mailserver sendmail[12398]: IJK12345: from=<newsletter@example.com>, size=16384, class=0, nrcpts=2, msgid=<202401151730.ijk@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 17:30:14 mailserver sendmail[12399]: IJK12345: to=<sub1@gmail.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=136384, relay=gmail-smtp-in.l.google.com. [142.250.27.26], dsn=2.0.0, stat=Sent
Jan 15 17:30:15 mailserver sendmail[12400]: IJK12345: to=<sub2@gmail.com>, delay=00:00:03, xdelay=00:00:03, mailer=esmtp, pri=136384, relay=gmail-smtp-in.l.google.com. [142.250.27.26], dsn=2.0.0, stat=Sent
Jan 15 18:00:45 mailserver sendmail[12401]: LMN23456: from=<noreply@shop.example.com>, size=11264, class=0, nrcpts=1, msgid=<202401151800.lmn@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 18:00:47 mailserver sendmail[12402]: LMN23456: to=<customer4@126.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=131264, relay=126.com [220.181.12.60], dsn=5.7.1, stat=Bounced (relay denied)
Jan 15 18:30:22 mailserver sendmail[12403]: OPQ34567: from=<admin@example.com>, size=4608, class=0, nrcpts=1, msgid=<202401151830.opq@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 18:30:24 mailserver sendmail[12404]: OPQ34567: to=<contact@business.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=124608, relay=mail.business.com [198.51.100.125], dsn=2.0.0, stat=Sent
Jan 15 19:00:15 mailserver sendmail[12405]: RST45678: from=<security@example.com>, size=2048, class=0, nrcpts=1, msgid=<202401151900.rst@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 19:00:17 mailserver sendmail[12406]: RST45678: to=<admin@client-corp.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=122048, relay=mx.client-corp.com [203.0.113.225], dsn=2.0.0, stat=Sent
Jan 15 19:30:40 mailserver sendmail[12407]: UVW56789: from=<admin@example.com>, size=6144, class=0, nrcpts=1, msgid=<202401151930.uvw@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 19:30:42 mailserver sendmail[12408]: UVW56789: to=<user@slow-server.net>, delay=00:00:35, xdelay=00:00:35, mailer=esmtp, pri=126144, relay=mx.slow-server.net [198.51.100.175], dsn=4.4.1, stat=Deferred (Connection timed out)
Jan 15 20:00:10 mailserver sendmail[12409]: XYZ67890: from=<hr@example.com>, size=8192, class=0, nrcpts=2, msgid=<202401152000.xyz@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 20:00:12 mailserver sendmail[12410]: XYZ67890: to=<applicant1@jobsite.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=128192, relay=mail.jobsite.com [203.0.113.90], dsn=2.0.0, stat=Sent
Jan 15 20:00:13 mailserver sendmail[12411]: XYZ67890: to=<applicant2@jobsite.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=128192, relay=mail.jobsite.com [203.0.113.90], dsn=2.0.0, stat=Sent
Jan 15 20:30:55 mailserver sendmail[12412]: ABC78901: from=<billing@example.com>, size=4096, class=0, nrcpts=1, msgid=<202401152030.abc2@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 20:30:57 mailserver sendmail[12413]: ABC78901: to=<finance@client-b.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=124096, relay=mail.client-b.com [198.51.100.60], dsn=2.0.0, stat=Sent
Jan 15 21:00:22 mailserver sendmail[12414]: DEF89012: from=<admin@example.com>, size=3072, class=0, nrcpts=1, msgid=<202401152100.def2@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 21:00:24 mailserver sendmail[12415]: DEF89012: to=<nightshift@gmail.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=123072, relay=gmail-smtp-in.l.google.com. [142.250.27.26], dsn=2.0.0, stat=Sent
Jan 15 21:30:18 mailserver sendmail[12416]: GHI90123: from=<noreply@shop.example.com>, size=14336, class=0, nrcpts=1, msgid=<202401152130.ghi2@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 21:30:20 mailserver sendmail[12417]: GHI90123: to=<customer5@yeah.net>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=134336, relay=yeah.net [220.181.12.70], dsn=5.1.1, stat=Bounced (user unknown)
Jan 15 22:00:45 mailserver sendmail[12418]: JKL01234: from=<admin@example.com>, size=2560, class=0, nrcpts=1, msgid=<202401152200.jkl2@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 22:00:47 mailserver sendmail[12419]: JKL01234: to=<syslog@logserver.internal>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=122560, relay=mail.logserver.internal [10.0.0.50], dsn=2.0.0, stat=Sent
Jan 15 22:30:10 mailserver sendmail[12420]: MNO12345: from=<marketing@example.com>, size=22528, class=0, nrcpts=3, msgid=<202401152230.mno2@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 22:30:12 mailserver sendmail[12421]: MNO12345: to=<vip1@premium.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=142528, relay=mx.premium.com [203.0.113.180], dsn=2.0.0, stat=Sent
Jan 15 22:30:13 mailserver sendmail[12422]: MNO12345: to=<vip2@premium.com>, delay=00:00:01, xdelay=00:00:01, mailer=esmtp, pri=142528, relay=mx.premium.com [203.0.113.180], dsn=2.0.0, stat=Sent
Jan 15 22:30:14 mailserver sendmail[12423]: MNO12345: to=<vip3@premium.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=142528, relay=mx.premium.com [203.0.113.180], dsn=2.0.0, stat=Sent
Jan 15 23:00:33 mailserver sendmail[12424]: PQR23456: from=<devops@example.com>, size=1792, class=0, nrcpts=1, msgid=<202401152300.pqr2@example.com>, proto=ESMTP, daemon=MTA, relay=localhost [127.0.0.1]
Jan 15 23:00:35 mailserver sendmail[12425]: PQR23456: to=<oncall@pagerduty.com>, delay=00:00:02, xdelay=00:00:02, mailer=esmtp, pri=121792, relay=mx.pagerduty.com [198.51.100.100], dsn=2.0.0, stat=Sent
Jan 15 08:01:20 mailserver sm-mta[12300]: ABC12345: DKIM: PASS d=example.com s=mail
Jan 15 08:05:10 mailserver sm-mta[12301]: DEF23456: DKIM: PASS d=example.com s=mail
Jan 15 08:15:30 mailserver sm-mta[12302]: GHI34567: DKIM: FAIL d=shop.example.com s=selector1
Jan 15 09:01:43 mailserver sm-mta[12303]: JKL45678: DKIM: PASS d=example.com s=mail
Jan 15 09:30:20 mailserver sm-mta[12304]: MNO56789: DKIM: PASS d=example.com s=mail
Jan 15 10:00:10 mailserver sm-mta[12305]: PQR67890: DKIM: PASS d=monitoring.example.com s=alert
Jan 15 10:15:32 mailserver sm-mta[12306]: STU78901: DKIM: PASS d=example.com s=marketing
Jan 15 10:15:35 mailserver sm-mta[12307]: STU78901: DKIM verification fail for domain bigcorp.net
Jan 15 11:00:04 mailserver sm-mta[12308]: VWX89012: DKIM: PASS d=example.com s=mail
Jan 15 11:30:18 mailserver sm-mta[12309]: YZA90123: DKIM: FAIL d=shop.example.com s=selector1
Jan 15 12:00:44 mailserver sm-mta[12310]: BCD01234: DKIM: PASS d=example.com s=mail
Jan 15 12:45:10 mailserver sm-mta[12311]: EFG12345: DKIM: NEUTRAL d=supplier.cn s=default
Jan 15 13:00:29 mailserver sm-mta[12312]: HIJ23456: DKIM: PASS d=example.com s=internal
Jan 15 13:30:14 mailserver sm-mta[12313]: KLM34567: DKIM: PASS d=example.com s=newsletter
Jan 15 14:00:21 mailserver sm-mta[12314]: NOP45678: DKIM: PASS d=example.com s=billing
Jan 15 14:30:54 mailserver sm-mta[12315]: QRS56789: DKIM: PASS d=example.com s=mail
Jan 15 15:00:10 mailserver sm-mta[12316]: TUV67890: DKIM: PASS d=shop.example.com s=selector1
Jan 15 15:30:39 mailserver sm-mta[12317]: WXY78901: DKIM: PASS d=example.com s=devops
Jan 15 16:00:04 mailserver sm-mta[12318]: ZAB89012: DKIM: PERMERROR d=remote-server.com s=default
Jan 15 16:30:17 mailserver sm-mta[12319]: CDE90123: DKIM: PASS d=example.com s=marketing
Jan 15 17:00:32 mailserver sm-mta[12320]: FGH01234: DKIM: PASS d=example.com s=mail
Jan 15 17:30:11 mailserver sm-mta[12321]: IJK12345: DKIM: PASS d=example.com s=newsletter
Jan 15 18:00:44 mailserver sm-mta[12322]: LMN23456: DKIM: FAIL d=shop.example.com s=selector1
Jan 15 18:30:21 mailserver sm-mta[12323]: OPQ34567: DKIM: PASS d=example.com s=mail
Jan 15 19:00:14 mailserver sm-mta[12324]: RST45678: DKIM: PASS d=example.com s=security
Jan 15 19:30:39 mailserver sm-mta[12325]: UVW56789: DKIM: TEMPERROR d=slow-server.net s=default
Jan 15 20:00:09 mailserver sm-mta[12326]: XYZ67890: DKIM: PASS d=example.com s=hr
Jan 15 20:30:54 mailserver sm-mta[12327]: ABC78901: DKIM: PASS d=example.com s=billing
Jan 15 21:00:21 mailserver sm-mta[12328]: DEF89012: DKIM: PASS d=example.com s=mail
Jan 15 21:30:17 mailserver sm-mta[12329]: GHI90123: DKIM: FAIL d=shop.example.com s=selector1
Jan 15 22:00:44 mailserver sm-mta[12330]: JKL01234: DKIM: PASS d=example.com s=internal
Jan 15 22:30:09 mailserver sm-mta[12331]: MNO12345: DKIM: PASS d=example.com s=marketing
Jan 15 23:00:32 mailserver sm-mta[12332]: PQR23456: DKIM: PASS d=example.com s=devops
Jan 15 08:01:22 mailserver sm-mta[12340]: connect from unknown.external.com [203.0.113.55]
Jan 15 08:05:11 mailserver sm-mta[12341]: connect from relay.partner.com [198.51.100.30]
Jan 15 08:15:29 mailserver sm-mta[12342]: connect from suspicious.spammer.net [45.33.32.156]
Jan 15 09:01:44 mailserver sm-mta[12343]: connect from localhost [127.0.0.1]
Jan 15 09:30:21 mailserver sm-mta[12344]: connect from internal.app.local [10.0.0.15]
Jan 15 10:00:09 mailserver sm-mta[12345]: connect from monitor.internal [10.0.0.20]
Jan 15 10:15:31 mailserver sm-mta[12346]: connect from bulk.sender.com [104.18.32.7]
Jan 15 11:00:03 mailserver sm-mta[12347]: connect from localhost [127.0.0.1]
Jan 15 11:30:17 mailserver sm-mta[12348]: connect from suspicious.spammer.net [45.33.32.156]
Jan 15 12:00:43 mailserver sm-mta[12349]: connect from hr-client.corp.local [192.168.1.50]
Jan 15 12:45:09 mailserver sm-mta[12350]: connect from vendor.external.net [185.220.101.33]
Jan 15 13:00:28 mailserver sm-mta[12351]: connect from localhost [127.0.0.1]
Jan 15 13:30:13 mailserver sm-mta[12352]: connect from newsletter.service.com [151.101.1.140]
Jan 15 14:00:20 mailserver sm-mta[12353]: connect from billing.internal [192.168.1.100]
Jan 15 14:30:53 mailserver sm-mta[12354]: connect from partner.api.com [198.51.100.200]
Jan 15 15:00:09 mailserver sm-mta[12355]: connect from shop.internal [10.0.0.25]
Jan 15 15:30:38 mailserver sm-mta[12356]: connect from devops.internal [10.0.0.30]
Jan 15 16:00:03 mailserver sm-mta[12357]: connect from unknown.external.com [203.0.113.55]
Jan 15 16:30:16 mailserver sm-mta[12358]: connect from marketing.service.com [104.18.32.7]
Jan 15 17:00:31 mailserver sm-mta[12359]: connect from localhost [127.0.0.1]
Jan 15 17:30:10 mailserver sm-mta[12360]: connect from newsletter.service.com [151.101.1.140]
Jan 15 18:00:43 mailserver sm-mta[12361]: connect from suspicious.spammer.net [45.33.32.156]
Jan 15 18:30:20 mailserver sm-mta[12362]: connect from localhost [127.0.0.1]
Jan 15 19:00:13 mailserver sm-mta[12363]: connect from security.internal [10.0.0.35]
Jan 15 19:30:38 mailserver sm-mta[12364]: connect from slow-server.net [198.51.100.175]
Jan 15 20:00:08 mailserver sm-mta[12365]: connect from hr-client.corp.local [192.168.1.50]
Jan 15 20:30:53 mailserver sm-mta[12366]: connect from billing.internal [192.168.1.100]
Jan 15 21:00:20 mailserver sm-mta[12367]: connect from localhost [127.0.0.1]
Jan 15 21:30:16 mailserver sm-mta[12368]: connect from suspicious.spammer.net [45.33.32.156]
Jan 15 22:00:43 mailserver sm-mta[12369]: connect from localhost [127.0.0.1]
Jan 15 22:30:08 mailserver sm-mta[12370]: connect from marketing.service.com [104.18.32.7]
Jan 15 23:00:31 mailserver sm-mta[12371]: connect from devops.internal [10.0.0.30]`;
