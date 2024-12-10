    import arcjet, { tokenBucket } from "@arcjet/node";
    import http from "node:http";

    const aj = arcjet({
    key: process.env.ARCJET_KEY, 
    characteristics: ["userId"], 
    rules: [
        tokenBucket({
        mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
        refillRate: 5, // refill 5 tokens per interval
        interval: 20, // refill every 10 seconds
        capacity: 7, // bucket maximum capacity of 10 tokens
        }),
    ],
    });

    const server = http.createServer(async function (req, res) {
    const userId = req?.user?.id; // Replace with your authenticated user ID
    const decision = await aj.protect(req, { userId, requested: 5 }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(
        JSON.stringify({ error: "Too Many Requests", reason: decision.reason }),
        );
    } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Hello world" }));
    }
    });

    server.listen(8000);