import { createClient as client } from "@/utils/supabase/server";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

export async function POST(req: NextRequest) {
  try {
    // Ensure cookies are available for authentication
    const cookieStore = await cookies();
    const supabase = await client(cookieStore);

    // Authenticate user
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error("Authentication error:", error?.message || error);
      return NextResponse.json({ message: "Authentication error" }, { status: 401 });
    }

    const { message } = await req.json();
    
    // Forward message to another API
    await axios.post("http://localhost:3000/api/message", { message }, {
        headers: { Cookie: req.headers.get("cookie") || "" }
    });
      

    const userEmail = data.user.email;
    if (!userEmail) {
      return NextResponse.json({ message: "User email not found" }, { status: 400 });
    }

    // Connect to Redis properly
    const redisClient = createClient({ url: process.env.REDIS_URL });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await redisClient.connect();

    // Retrieve data from Redis
    const redisData = await redisClient.get(userEmail);

    // Close Redis connection
    await redisClient.disconnect();

    if (!redisData) {
      return NextResponse.json({ error: "No data found for this user" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(redisData));

  } catch (error) {
    console.error("Redis Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

