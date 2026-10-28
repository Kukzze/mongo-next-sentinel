# Architecture Overview

Mongo Next Sentinel instruments the native MongoDB Node.js driver's Connection Monitoring and Pooling (CMAP) events.

```
[Next.js App Router / Server Action]
        | (Checkout Connection)
        v
[MongoDB Driver CMAP Event: connectionCheckedOut]
        |
        +--> [Sentinel Timer Created (unref'd)]
        |          | (Exceeds leakThresholdMs)
        |          v
        |    [onLeakDetected Alert Dispatched]
        |
        v (Checkin Connection)
[MongoDB Driver CMAP Event: connectionCheckedIn]
        |
        +--> [Sentinel Clears Active Timer]
```
