// Sendmail log parser utility

export interface LogEntry {
  id: string;
  timestamp: Date;
  hostname: string;
  process: string;
  pid: string;
  queueId: string;
  type: 'from' | 'to' | 'stat' | 'warning' | 'error' | 'reject' | 'ruleset' | 'connect' | 'disconnect' | 'dkim' | 'other';
  from?: string;
  to?: string;
  status?: string;
  statusCode?: string;
  delay?: number;
  xdelay?: number;
  mailer?: string;
  relay?: string;
  size?: number;
  msgId?: string;
  raw: string;
  // IP fields
  sourceIp?: string;
  sourceHost?: string;
  destIp?: string;
  destHost?: string;
  // DKIM fields
  dkimResult?: 'pass' | 'fail' | 'neutral' | 'temperror' | 'permerror' | 'none';
  dkimDomain?: string;
  dkimSelector?: string;
  dkimDetail?: string;
}

export interface AnalysisResult {
  entries: LogEntry[];
  totalMessages: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  deferredDeliveries: number;
  bouncedMessages: number;
  rejectedMessages: number;
  totalSize: number;
  avgDelay: number;
  hourlyDistribution: { hour: string; count: number }[];
  dailyDistribution: { date: string; count: number }[];
  topSenders: { address: string; count: number; success: number; fail: number }[];
  topRecipients: { domain: string; count: number; success: number; fail: number }[];
  errorTypes: { type: string; count: number; percentage: number }[];
  statusCodeDistribution: { code: string; count: number }[];
  relayDistribution: { relay: string; count: number }[];
  mailerDistribution: { mailer: string; count: number }[];
  delayDistribution: { range: string; count: number }[];
  sizeDistribution: { range: string; count: number }[];
  queueStats: { pending: number; delivered: number; bounced: number; deferred: number };
  messageFlow: { time: string; sent: number; delivered: number; bounced: number }[];
  // DKIM analysis
  dkimStats: {
    total: number;
    pass: number;
    fail: number;
    neutral: number;
    temperror: number;
    permerror: number;
    none: number;
    passRate: number;
  };
  dkimByDomain: { domain: string; pass: number; fail: number; total: number; passRate: number }[];
  dkimFailures: LogEntry[];
  // IP analysis
  sourceIpStats: { ip: string; count: number; success: number; fail: number; host?: string }[];
  destIpStats: { ip: string; count: number; success: number; fail: number; host?: string }[];
  sourceIpGeo: { ip: string; count: number; type: string }[];
  suspiciousIps: { ip: string; count: number; reasons: string[] }[];
}

export function parseSendmailLog(logText: string): AnalysisResult {
  const lines = logText.split('\n').filter(line => line.trim());
  const entries: LogEntry[] = [];
  
  // Parse each line
  lines.forEach((line, index) => {
    const entry = parseLine(line, index);
    if (entry) entries.push(entry);
  });

  return analyzeEntries(entries);
}

function parseLine(line: string, index: number): LogEntry | null {
  // Sendmail log format:
  // Mon DD HH:MM:SS hostname sendmail[PID]: QUEUEID: field=value, field=value, ...
  // or: Mon DD HH:MM:SS hostname sm-mta[PID]: QUEUEID: field=value, ...
  
  const syslogPattern = /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+(\S+?)\[(\d+)\]:\s+(.*)$/;
  const match = line.match(syslogPattern);
  
  if (!match) return null;
  
  const [, timestampStr, hostname, process, pid, message] = match;
  const timestamp = parseTimestamp(timestampStr);
  
  // Extract queue ID
  const queueIdMatch = message.match(/^([A-Za-z0-9]+):\s*(.*)$/);
  const queueId = queueIdMatch ? queueIdMatch[1] : '';
  const content = queueIdMatch ? queueIdMatch[2] : message;
  
  const entry: LogEntry = {
    id: `${index}`,
    timestamp,
    hostname,
    process,
    pid,
    queueId,
    type: 'other',
    raw: line,
  };

  // Extract IP addresses from various patterns
  extractIPs(entry, content, message);

  // Parse DKIM related entries
  parseDKIM(entry, content, message);

  // Parse from
  const fromMatch = content.match(/^from=<([^>]*)>/i);
  if (fromMatch || content.match(/^from=/i)) {
    entry.type = 'from';
    entry.from = fromMatch ? fromMatch[1] : content.replace(/^from=<?>?\s*/i, '').split(',')[0].trim();
    
    // Parse size
    const sizeMatch = content.match(/size=(\d+)/);
    if (sizeMatch) entry.size = parseInt(sizeMatch[1]);
    
    // Parse msgid
    const msgIdMatch = content.match(/msgid=<([^>]*)>/i);
    if (msgIdMatch) entry.msgId = msgIdMatch[1];
  }

  // Parse to
  const toMatch = content.match(/^to=<([^>]*)>/i);
  if (toMatch || content.match(/^to=/i)) {
    entry.type = 'to';
    entry.to = toMatch ? toMatch[1] : content.replace(/^to=<?>?\s*/i, '').split(',')[0].trim();
    
    // Parse delay
    const delayMatch = content.match(/delay=(\d+(?:\.\d+)?)/);
    if (delayMatch) entry.delay = parseFloat(delayMatch[1]);
    
    // Parse xdelay
    const xdelayMatch = content.match(/xdelay=(\d+(?:\.\d+)?)/);
    if (xdelayMatch) entry.xdelay = parseFloat(xdelayMatch[1]);
    
    // Parse mailer
    const mailerMatch = content.match(/mailer=([a-zA-Z]+)/);
    if (mailerMatch) entry.mailer = mailerMatch[1];
    
    // Parse relay
    const relayMatch = content.match(/relay=([^,]+)/);
    if (relayMatch) {
      entry.relay = relayMatch[1].trim();
      // Extract destination IP from relay field
      const relayIpMatch = entry.relay.match(/\[([0-9.]+)\]/);
      if (relayIpMatch) {
        entry.destIp = relayIpMatch[1];
        entry.destHost = entry.relay.split('[')[0].trim();
      }
    }
    
    // Parse stat
    const statMatch = content.match(/stat=([^\s,]+)/);
    if (statMatch) {
      entry.status = statMatch[1];
      entry.statusCode = extractStatusCode(statMatch[1]);
    }
  }

  // Parse stat line
  if (content.match(/^stat=/i)) {
    entry.type = 'stat';
    const statMatch = content.match(/stat=([^\s,]+)/);
    if (statMatch) {
      entry.status = statMatch[1];
      entry.statusCode = extractStatusCode(statMatch[1]);
    }
  }

  // Parse warning
  if (content.match(/^warning/i)) {
    entry.type = 'warning';
    entry.status = content;
  }

  // Parse reject
  if (content.match(/^reject/i) || content.match(/rejecting/i)) {
    entry.type = 'reject';
    entry.status = content;
  }

  // Parse connect - extract source IP
  if (content.match(/^connect from/i)) {
    entry.type = 'connect';
    entry.relay = content.replace(/^connect from\s*/i, '');
    // Extract source IP from connect line
    const connectIpMatch = content.match(/\[([0-9.]+)\]/);
    if (connectIpMatch) {
      entry.sourceIp = connectIpMatch[1];
      entry.sourceHost = content.replace(/^connect from\s*/i, '').split('[')[0].trim();
    }
  }

  // Parse disconnect
  if (content.match(/^disconnect from/i)) {
    entry.type = 'disconnect';
    entry.relay = content.replace(/^disconnect from\s*/i, '');
    const disconnectIpMatch = content.match(/\[([0-9.]+)\]/);
    if (disconnectIpMatch) {
      entry.sourceIp = disconnectIpMatch[1];
      entry.sourceHost = content.replace(/^disconnect from\s*/i, '').split('[')[0].trim();
    }
  }

  // Parse ruleset
  if (content.match(/^ruleset=/i)) {
    entry.type = 'ruleset';
    entry.status = content;
  }

  // Determine error type for to entries
  if (entry.type === 'to' && entry.status) {
    if (entry.status.match(/Sent|sent|delivered|Delivered/i)) {
      // success
    } else if (entry.status.match(/Deferred|deferred|tempfail/i)) {
      entry.type = 'warning';
    } else if (entry.status.match(/Bounced|bounced/i)) {
      entry.type = 'error';
    }
  }

  return entry;
}

function extractIPs(entry: LogEntry, content: string, fullMessage: string) {
  // Extract source IP from "relay=" in from lines (incoming mail)
  const fromRelayMatch = content.match(/relay=([^\s,\[]+)\s*\[([0-9.]+)\]/);
  if (fromRelayMatch && entry.type === 'from') {
    entry.sourceIp = fromRelayMatch[2];
    entry.sourceHost = fromRelayMatch[1];
  }

  // Extract from "connect from" pattern
  const connectMatch = fullMessage.match(/connect from\s+(\S+)\s*\[([0-9.]+)\]/);
  if (connectMatch) {
    entry.sourceIp = connectMatch[2];
    entry.sourceHost = connectMatch[1];
  }

  // Extract destination IP from relay in to lines
  const toRelayMatch = content.match(/relay=([^\s,\[]+)\s*\[([0-9.]+)\]/);
  if (toRelayMatch && (entry.type === 'to' || entry.type === 'warning' || entry.type === 'error')) {
    entry.destIp = toRelayMatch[2];
    entry.destHost = toRelayMatch[1];
  }
}

function parseDKIM(entry: LogEntry, content: string, fullMessage: string) {
  // Various DKIM log patterns from different sendmail/OpenDKIM configurations
  
  // Pattern 1: OpenDKIM style
  // "DKIM-Signature field added" or "DKIM verification"
  const dkimVerifyMatch = content.match(/DKIM.*?verification.*?(pass|fail|neutral|temperror|permerror|none)/i);
  if (dkimVerifyMatch) {
    entry.type = 'dkim';
    entry.dkimResult = dkimVerifyMatch[1].toLowerCase() as LogEntry['dkimResult'];
  }

  // Pattern 2: opendkim log format
  // "s=selector d=domain ..."
  const dkimSelectorMatch = content.match(/[Dd]kim.*?s(?:elector)?=(\S+)/i);
  if (dkimSelectorMatch) {
    entry.dkimSelector = dkimSelectorMatch[1];
  }

  const dkimDomainMatch = content.match(/[Dd]kim.*?d(?:omain)?=(\S+)/i);
  if (dkimDomainMatch) {
    entry.dkimDomain = dkimDomainMatch[1].replace(/[;,]$/, '');
  }

  // Pattern 3: sendmail milter DKIM result
  // "DKIM-Signature: ... result=pass"
  const dkimResultMatch = content.match(/DKIM.*?(?:result|status)\s*[=:]\s*(pass|fail|neutral|temperror|permerror|none)/i);
  if (dkimResultMatch) {
    entry.type = 'dkim';
    entry.dkimResult = dkimResultMatch[1].toLowerCase() as LogEntry['dkimResult'];
  }

  // Pattern 4: "DKIM: PASS" or "DKIM: FAIL"
  const dkimSimpleMatch = content.match(/DKIM[:\s]+(PASS|FAIL|NEUTRAL|TEMPERROR|PERMERROR|NONE)/i);
  if (dkimSimpleMatch) {
    entry.type = 'dkim';
    entry.dkimResult = dkimSimpleMatch[1].toLowerCase() as LogEntry['dkimResult'];
  }

  // Pattern 5: OpenDKIM specific log lines
  // "message not signed" or "signature verified"
  if (content.match(/DKIM.*signature verified/i)) {
    entry.type = 'dkim';
    entry.dkimResult = 'pass';
  }
  if (content.match(/DKIM.*signature.*(?:failed|error|bad)/i)) {
    entry.type = 'dkim';
    entry.dkimResult = 'fail';
  }

  // Pattern 6: "added DKIM-Signature" (outgoing signing)
  if (content.match(/added DKIM-Signature/i) || content.match(/DKIM-Signature field added/i)) {
    entry.type = 'dkim';
    entry.dkimResult = 'pass';
    entry.dkimDetail = '签名已添加 (出站签名)';
  }

  // Extract domain from DKIM entries
  if (entry.type === 'dkim' && !entry.dkimDomain) {
    const domainInDkim = content.match(/d=([a-zA-Z0-9.-]+)/i);
    if (domainInDkim) {
      entry.dkimDomain = domainInDkim[1];
    }
  }

  // Extract detail
  if (entry.type === 'dkim') {
    entry.dkimDetail = content.substring(0, 200);
  }
}

function parseTimestamp(str: string): Date {
  const currentYear = new Date().getFullYear();
  const dateStr = `${currentYear} ${str}`;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
}

function extractStatusCode(status: string): string {
  const dsnMatch = status.match(/(\d\.\d+\.\d+)/);
  if (dsnMatch) return dsnMatch[1];
  
  if (status.match(/Sent/i)) return '2.0.0';
  if (status.match(/Deferred/i)) return '4.0.0';
  if (status.match(/Bounced/i)) return '5.0.0';
  return '';
}

function analyzeEntries(entries: LogEntry[]): AnalysisResult {
  const fromEntries = entries.filter(e => e.type === 'from');
  const toEntries = entries.filter(e => e.type === 'to' || e.type === 'warning' || e.type === 'error');
  
  // Count deliveries
  const successful = toEntries.filter(e => 
    e.status && (e.status.match(/Sent/i) || e.status.match(/2\.\d+\.\d+/))
  ).length;
  
  const deferred = toEntries.filter(e => 
    e.status && (e.status.match(/Deferred/i) || e.status.match(/4\.\d+\.\d+/))
  ).length;
  
  const bounced = toEntries.filter(e => 
    e.status && (e.status.match(/Bounced/i) || e.status.match(/5\.\d+\.\d+/))
  ).length;
  
  const rejected = entries.filter(e => e.type === 'reject').length;

  // Hourly distribution
  const hourlyMap = new Map<string, number>();
  for (let i = 0; i < 24; i++) {
    hourlyMap.set(`${i.toString().padStart(2, '0')}:00`, 0);
  }
  fromEntries.forEach(e => {
    const hour = e.timestamp.getHours().toString().padStart(2, '0') + ':00';
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
  });
  const hourlyDistribution = Array.from(hourlyMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  // Daily distribution
  const dailyMap = new Map<string, number>();
  fromEntries.forEach(e => {
    const date = e.timestamp.toISOString().split('T')[0];
    dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
  });
  const dailyDistribution = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top senders
  const senderMap = new Map<string, { count: number; success: number; fail: number }>();
  fromEntries.forEach(fromEntry => {
    const addr = fromEntry.from || 'unknown';
    if (!senderMap.has(addr)) {
      senderMap.set(addr, { count: 0, success: 0, fail: 0 });
    }
    senderMap.get(addr)!.count++;
    
    const relatedTo = toEntries.filter(t => t.queueId === fromEntry.queueId);
    relatedTo.forEach(t => {
      if (t.status && (t.status.match(/Sent/i) || t.status.match(/2\.\d+\.\d+/))) {
        senderMap.get(addr)!.success++;
      } else if (t.status && (t.status.match(/Bounced/i) || t.status.match(/5\.\d+\.\d+/))) {
        senderMap.get(addr)!.fail++;
      }
    });
  });
  const topSenders = Array.from(senderMap.entries())
    .map(([address, data]) => ({ address, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Top recipient domains
  const domainMap = new Map<string, { count: number; success: number; fail: number }>();
  toEntries.forEach(e => {
    if (e.to) {
      const domain = e.to.includes('@') ? e.to.split('@')[1] : e.to;
      if (!domainMap.has(domain)) {
        domainMap.set(domain, { count: 0, success: 0, fail: 0 });
      }
      domainMap.get(domain)!.count++;
      if (e.status && (e.status.match(/Sent/i) || e.status.match(/2\.\d+\.\d+/))) {
        domainMap.get(domain)!.success++;
      } else if (e.status && (e.status.match(/Bounced/i) || e.status.match(/5\.\d+\.\d+/))) {
        domainMap.get(domain)!.fail++;
      }
    }
  });
  const topRecipients = Array.from(domainMap.entries())
    .map(([domain, data]) => ({ domain, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Error types
  const errorMap = new Map<string, number>();
  toEntries.forEach(e => {
    if (e.status && !e.status.match(/Sent/i) && !e.status.match(/2\.\d+\.\d+/)) {
      const errorType = categorizeError(e.status);
      errorMap.set(errorType, (errorMap.get(errorType) || 0) + 1);
    }
  });
  const totalErrors = Array.from(errorMap.values()).reduce((a, b) => a + b, 0);
  const errorTypes = Array.from(errorMap.entries())
    .map(([type, count]) => ({ type, count, percentage: totalErrors > 0 ? (count / totalErrors) * 100 : 0 }))
    .sort((a, b) => b.count - a.count);

  // Status code distribution
  const statusCodeMap = new Map<string, number>();
  toEntries.forEach(e => {
    if (e.statusCode) {
      statusCodeMap.set(e.statusCode, (statusCodeMap.get(e.statusCode) || 0) + 1);
    }
  });
  const statusCodeDistribution = Array.from(statusCodeMap.entries())
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);

  // Relay distribution
  const relayMap = new Map<string, number>();
  toEntries.forEach(e => {
    if (e.relay) {
      const relayHost = e.relay.split(',')[0].split('[')[0].trim();
      relayMap.set(relayHost, (relayMap.get(relayHost) || 0) + 1);
    }
  });
  const relayDistribution = Array.from(relayMap.entries())
    .map(([relay, count]) => ({ relay, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Mailer distribution
  const mailerMap = new Map<string, number>();
  toEntries.forEach(e => {
    if (e.mailer) {
      mailerMap.set(e.mailer, (mailerMap.get(e.mailer) || 0) + 1);
    }
  });
  const mailerDistribution = Array.from(mailerMap.entries())
    .map(([mailer, count]) => ({ mailer, count }))
    .sort((a, b) => b.count - a.count);

  // Delay distribution
  const delayRanges = ['0-1s', '1-5s', '5-30s', '30s-1m', '1-5m', '5-30m', '30m-1h', '>1h'];
  const delayMap = new Map<string, number>();
  delayRanges.forEach(r => delayMap.set(r, 0));
  toEntries.forEach(e => {
    if (e.delay !== undefined) {
      const range = getDelayRange(e.delay);
      delayMap.set(range, (delayMap.get(range) || 0) + 1);
    }
  });
  const delayDistribution = Array.from(delayMap.entries())
    .map(([range, count]) => ({ range, count }));

  // Size distribution
  const sizeRanges = ['<1KB', '1-10KB', '10-100KB', '100KB-1MB', '1-10MB', '>10MB'];
  const sizeMap = new Map<string, number>();
  sizeRanges.forEach(r => sizeMap.set(r, 0));
  fromEntries.forEach(e => {
    if (e.size !== undefined) {
      const range = getSizeRange(e.size);
      sizeMap.set(range, (sizeMap.get(range) || 0) + 1);
    }
  });
  const sizeDistribution = Array.from(sizeMap.entries())
    .map(([range, count]) => ({ range, count }));

  // Average delay
  const delays = toEntries.filter(e => e.delay !== undefined).map(e => e.delay!);
  const avgDelay = delays.length > 0 ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;

  // Total size
  const totalSize = fromEntries.reduce((sum, e) => sum + (e.size || 0), 0);

  // Message flow
  const flowMap = new Map<string, { sent: number; delivered: number; bounced: number }>();
  fromEntries.forEach(e => {
    const time = e.timestamp.toISOString().split('T')[0] + ' ' + 
                 e.timestamp.getHours().toString().padStart(2, '0') + ':00';
    if (!flowMap.has(time)) flowMap.set(time, { sent: 0, delivered: 0, bounced: 0 });
    flowMap.get(time)!.sent++;
  });
  toEntries.forEach(e => {
    const time = e.timestamp.toISOString().split('T')[0] + ' ' + 
                 e.timestamp.getHours().toString().padStart(2, '0') + ':00';
    if (!flowMap.has(time)) flowMap.set(time, { sent: 0, delivered: 0, bounced: 0 });
    if (e.status && (e.status.match(/Sent/i) || e.status.match(/2\.\d+\.\d+/))) {
      flowMap.get(time)!.delivered++;
    } else if (e.status && (e.status.match(/Bounced/i) || e.status.match(/5\.\d+\.\d+/))) {
      flowMap.get(time)!.bounced++;
    }
  });
  const messageFlow = Array.from(flowMap.entries())
    .map(([time, data]) => ({ time, ...data }))
    .sort((a, b) => a.time.localeCompare(b.time));

  // === DKIM Analysis ===
  const dkimEntries = entries.filter(e => e.type === 'dkim');
  const dkimStats = {
    total: dkimEntries.length,
    pass: dkimEntries.filter(e => e.dkimResult === 'pass').length,
    fail: dkimEntries.filter(e => e.dkimResult === 'fail').length,
    neutral: dkimEntries.filter(e => e.dkimResult === 'neutral').length,
    temperror: dkimEntries.filter(e => e.dkimResult === 'temperror').length,
    permerror: dkimEntries.filter(e => e.dkimResult === 'permerror').length,
    none: dkimEntries.filter(e => e.dkimResult === 'none').length,
    passRate: dkimEntries.length > 0 ? (dkimEntries.filter(e => e.dkimResult === 'pass').length / dkimEntries.length) * 100 : 0,
  };

  // DKIM by domain
  const dkimDomainMap = new Map<string, { pass: number; fail: number; total: number }>();
  dkimEntries.forEach(e => {
    const domain = e.dkimDomain || 'unknown';
    if (!dkimDomainMap.has(domain)) {
      dkimDomainMap.set(domain, { pass: 0, fail: 0, total: 0 });
    }
    dkimDomainMap.get(domain)!.total++;
    if (e.dkimResult === 'pass') dkimDomainMap.get(domain)!.pass++;
    if (e.dkimResult === 'fail') dkimDomainMap.get(domain)!.fail++;
  });
  const dkimByDomain = Array.from(dkimDomainMap.entries())
    .map(([domain, data]) => ({ domain, ...data, passRate: data.total > 0 ? (data.pass / data.total) * 100 : 0 }))
    .sort((a, b) => b.total - a.total);

  const dkimFailures = dkimEntries.filter(e => e.dkimResult === 'fail' || e.dkimResult === 'permerror');

  // === IP Analysis ===
  // Source IP stats (incoming connections)
  const sourceIpMap = new Map<string, { count: number; success: number; fail: number; host?: string }>();
  entries.forEach(e => {
    if (e.sourceIp) {
      if (!sourceIpMap.has(e.sourceIp)) {
        sourceIpMap.set(e.sourceIp, { count: 0, success: 0, fail: 0, host: e.sourceHost });
      }
      sourceIpMap.get(e.sourceIp)!.count++;
      if (e.sourceHost) sourceIpMap.get(e.sourceIp)!.host = e.sourceHost;
    }
  });
  // Also count success/fail per source IP from related entries
  fromEntries.forEach(fromEntry => {
    if (fromEntry.sourceIp) {
      const relatedTo = toEntries.filter(t => t.queueId === fromEntry.queueId);
      relatedTo.forEach(t => {
        const ipData = sourceIpMap.get(fromEntry.sourceIp!);
        if (ipData) {
          if (t.status && (t.status.match(/Sent/i) || t.status.match(/2\.\d+\.\d+/))) {
            ipData.success++;
          } else if (t.status && (t.status.match(/Bounced/i) || t.status.match(/5\.\d+\.\d+/))) {
            ipData.fail++;
          }
        }
      });
    }
  });
  const sourceIpStats = Array.from(sourceIpMap.entries())
    .map(([ip, data]) => ({ ip, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // Destination IP stats (outgoing deliveries)
  const destIpMap = new Map<string, { count: number; success: number; fail: number; host?: string }>();
  toEntries.forEach(e => {
    if (e.destIp) {
      if (!destIpMap.has(e.destIp)) {
        destIpMap.set(e.destIp, { count: 0, success: 0, fail: 0, host: e.destHost });
      }
      destIpMap.get(e.destIp)!.count++;
      if (e.destHost) destIpMap.get(e.destIp)!.host = e.destHost;
      if (e.status && (e.status.match(/Sent/i) || e.status.match(/2\.\d+\.\d+/))) {
        destIpMap.get(e.destIp)!.success++;
      } else if (e.status && (e.status.match(/Bounced/i) || e.status.match(/5\.\d+\.\d+/))) {
        destIpMap.get(e.destIp)!.fail++;
      }
    }
  });
  const destIpStats = Array.from(destIpMap.entries())
    .map(([ip, data]) => ({ ip, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // Source IP classification (internal vs external)
  const sourceIpGeo = Array.from(sourceIpMap.entries())
    .map(([ip, data]) => ({
      ip,
      count: data.count,
      type: isPrivateIP(ip) ? '内网' : '外网',
    }))
    .sort((a, b) => b.count - a.count);

  // Suspicious IPs (high failure rate or high volume)
  const suspiciousIps: { ip: string; count: number; reasons: string[] }[] = [];
  sourceIpStats.forEach(ip => {
    const reasons: string[] = [];
    const total = ip.success + ip.fail;
    if (total > 0 && (ip.fail / total) > 0.5 && ip.fail >= 3) {
      reasons.push(`高失败率 (${((ip.fail / total) * 100).toFixed(0)}%)`);
    }
    if (ip.count > 20) {
      reasons.push(`高频连接 (${ip.count}次)`);
    }
    if (reasons.length > 0) {
      suspiciousIps.push({ ip: ip.ip, count: ip.count, reasons });
    }
  });

  return {
    entries,
    totalMessages: fromEntries.length,
    successfulDeliveries: successful,
    failedDeliveries: bounced,
    deferredDeliveries: deferred,
    bouncedMessages: bounced,
    rejectedMessages: rejected,
    totalSize,
    avgDelay,
    hourlyDistribution,
    dailyDistribution,
    topSenders,
    topRecipients,
    errorTypes,
    statusCodeDistribution,
    relayDistribution,
    mailerDistribution,
    delayDistribution,
    sizeDistribution,
    queueStats: {
      pending: fromEntries.length - successful - bounced,
      delivered: successful,
      bounced,
      deferred,
    },
    messageFlow,
    dkimStats,
    dkimByDomain,
    dkimFailures,
    sourceIpStats,
    destIpStats,
    sourceIpGeo,
    suspiciousIps,
  };
}

function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;
  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 127.0.0.0/8
  if (parts[0] === 127) return true;
  return false;
}

function categorizeError(status: string): string {
  if (status.match(/user unknown|unknown user|no such user/i)) return '用户不存在';
  if (status.match(/mailbox full|quota|over quota/i)) return '邮箱已满';
  if (status.match(/connection refused|connection reset/i)) return '连接被拒绝';
  if (status.match(/timeout|timed out/i)) return '连接超时';
  if (status.match(/dns|name server|host not found|no route/i)) return 'DNS解析失败';
  if (status.match(/relay denied|relay not permitted|access denied/i)) return '中继被拒绝';
  if (status.match(/deferred|tempfail|try again/i)) return '延迟投递';
  if (status.match(/spam|rejected|blocked|blacklist/i)) return '被标记为垃圾邮件';
  if (status.match(/certificate|tls|ssl|encryption/i)) return 'TLS/SSL错误';
  if (status.match(/authentication|auth failed/i)) return '认证失败';
  if (status.match(/message too large|size limit/i)) return '邮件过大';
  if (status.match(/550|551|552|553|554/)) return '收件人拒绝(5xx)';
  if (status.match(/421|450|451|452/)) return '临时失败(4xx)';
  return '其他错误';
}

function getDelayRange(delay: number): string {
  if (delay < 1) return '0-1s';
  if (delay < 5) return '1-5s';
  if (delay < 30) return '5-30s';
  if (delay < 60) return '30s-1m';
  if (delay < 300) return '1-5m';
  if (delay < 1800) return '5-30m';
  if (delay < 3600) return '30m-1h';
  return '>1h';
}

function getSizeRange(size: number): string {
  if (size < 1024) return '<1KB';
  if (size < 10240) return '1-10KB';
  if (size < 102400) return '10-100KB';
  if (size < 1048576) return '100KB-1MB';
  if (size < 10485760) return '1-10MB';
  return '>10MB';
}
